from flask import Flask
import argparse
import datetime
import sys
import time
import threading
import traceback
import socketserver
import struct
import redis
try:
    from dnslib import *
except ImportError:
    print("Missing dependency dnslib: <https://pypi.python.org/pypi/dnslib>. Please install it with `pip`.")
    sys.exit(2)

r = redis.Redis(host='10.64.6.62', port=6379, db=4)

class DomainName(str):
    def __getattr__(self, item):
        return DomainName(item + '.' + self)


D = DomainName('dnsleak4.example.com.')
D2 = DomainName('dnsleak6.example.com.')
IP = '127.0.0.1'
TTL = 60 * 5

soa_record = SOA(
    mname=D.ns1,  # primary name server
    rname=D.andrei,  # email of the domain administrator
    times=(
        202101041,  # serial number
        60 * 60 * 1,  # refresh
        60 * 60 * 3,  # retry
        60 * 60 * 24,  # expire
        60 * 60 * 1,  # minimum
    )
)

soa_record2 = SOA(
    mname=D2.ns1,  # primary name server
    rname=D2.andrei,  # email of the domain administrator
    times=(
        202101041,  # serial number
        60 * 60 * 1,  # refresh
        60 * 60 * 3,  # retry
        60 * 60 * 24,  # expire
        60 * 60 * 1,  # minimum
    )   
)


# 2001:9b1:8826:0:82:196:120:72
ns_records = [NS(D.ns1), NS(D.ns2)]
ns_records2 = [NS(D2.ns1), NS(D2.ns2)]
records = {
    D: [A(IP), AAAA((0,) * 16), MX(D.mail), soa_record] + ns_records,
    D.ns1: [A(IP)],  # MX and NS records must never point to a CNAME alias (RFC 2181 section 10.3)
    D.ns2: [A(IP)],
    #D.mail: [A(IP)],
    #D.andrei: [CNAME(D)],
    D2: [A(IP), AAAA((32,1,9,177,136,38,0,0,0,130,1,150,1,32,0,114)), MX(D2.mail), soa_record2] + ns_records2,
    #D2: [A(IP), AAAA((1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)), MX(D2.mail), soa_record2] + ns_records2,
    #D2: [A(IP), AAAA((0,) * 16), MX(D2.mail), soa_record2] + ns_records2,
    D2.ns1: [A(IP)],  # MX and NS records must never point to a CNAME alias (RFC 2181 section 10.3)
    D2.ns2: [A(IP)],
    #D2.mail: [A(IP)],
    #D2.andrei: [CNAME(D2)],

}


def dns_response(data):
    request = DNSRecord.parse(data)

    print(request)

    reply = DNSRecord(DNSHeader(id=request.header.id, qr=1, aa=1, ra=1), q=request.q)

    qname = request.q.qname
    qn = str(qname)
    qtype = request.q.qtype
    qt = QTYPE[qtype]

    #if qn == D or qn.endswith('.' + D):
    if qn in [D,D2] or qn.endswith('.' + D) or qn.endswith('.' + D2): 

        for name, rrs in records.items():
            #print("name: " + name + " qtype: " + str(qtype) + " qt: " + str(qt))
            if name == qn:
                for rdata in rrs:
                    rqt = rdata.__class__.__name__
                    if qt in ['*', rqt]:
                        reply.add_answer(RR(rname=qname, rtype=getattr(QTYPE, rqt), rclass=1, ttl=TTL, rdata=rdata))

        #for rdata in ns_records2:
            #reply.add_ar(RR(rname=D, rtype=QTYPE.NS, rclass=1, ttl=TTL, rdata=rdata))
            #reply.add_ar(RR(rname=qn, rtype=QTYPE.NS, rclass=1, ttl=TTL, rdata=rdata))

        #reply.add_auth(RR(rname=D, rtype=QTYPE.SOA, rclass=1, ttl=TTL, rdata=soa_record))
        if qn == D:
            for rdata in ns_records:
                reply.add_ar(RR(rname=qn, rtype=QTYPE.NS, rclass=1, ttl=TTL, rdata=rdata))
            reply.add_auth(RR(rname=qn, rtype=QTYPE.SOA, rclass=1, ttl=TTL, rdata=soa_record))
        else:
            for rdata in ns_records2:
                reply.add_ar(RR(rname=qn, rtype=QTYPE.NS, rclass=1, ttl=TTL, rdata=rdata))
            reply.add_auth(RR(rname=qn, rtype=QTYPE.SOA, rclass=1, ttl=TTL, rdata=soa_record2))

    #print("---- Reply:\n", reply)

    return reply.pack()


class BaseRequestHandler(socketserver.BaseRequestHandler):

    def get_data(self):
        raise NotImplementedError

    def send_data(self, data):
        raise NotImplementedError

    def handle(self):
        #r = redis.Redis(host='10.64.6.62', port=6379, db=4)
        now = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')
        print("\n\n%s request %s (%s %s):" % (self.__class__.__name__[:3], now, self.client_address[0],
                                               self.client_address[1]))
        try:
            data = self.get_data()
            #print(len(data), data)  # repr(data).replace('\\x', '')[1:-1]
            #print(dns_response(data).decode())
            d = DNSRecord.parse(data)
            qname = str(d.q.qname)
            #print(str(d.q.qname))
            print()
            print("<<<<<<<<<<<<<<<<<<<<<<<OMPPPAA>>>>>>>>>>>>>>>>>>>>>>>>>")
            print(self.client_address[0].encode())
            print(r.lrange(qname, 0, 99))
            print("<<<<<<<<<<<<<<<<<<<<<<<<<PRUUUT>>>>>>>>>>>>>>>>>>>>>>>><")
            print()
            #time.sleep(0.2)
            #if self.client_address[0].encode() not in r.lrange(qname, 0, 99):
            if len(r.lrange(qname, 0, 99)) == 0:    
                print("INSERT: (" + qname + ")" + " with " + self.client_address[0])
                r.lpush(qname, self.client_address[0])

            r.expire(qname, 120)
            self.send_data(dns_response(data))
        except Exception:
            traceback.print_exc(file=sys.stderr)


class TCPRequestHandler(BaseRequestHandler):

    def get_data(self):
        data = self.request.recv(8192).strip()
        sz = struct.unpack('>H', data[:2])[0]
        if sz < len(data) - 2:
            raise Exception("Wrong size of TCP packet")
        elif sz > len(data) - 2:
            raise Exception("Too big TCP packet")
        return data[2:]

    def send_data(self, data):
        sz = struct.pack('>H', len(data))
        return self.request.sendall(sz + data)


class UDPRequestHandler(BaseRequestHandler):

    def get_data(self):
        return self.request[0]
        #return self.request[0].strip()

    def send_data(self, data):
        return self.request[1].sendto(data, self.client_address)


def main_dns():

    print("Starting nameserver...")

    s = socketserver.ThreadingUDPServer(('', 53), UDPRequestHandler)
    thread = threading.Thread(target=s.serve_forever)
    thread.daemon = True
    thread.start()
    print("%s server loop running in thread: %s" % (s.RequestHandlerClass.__name__[:3], thread.name))



def create_app(config_class=None):
    app = Flask(__name__)
    app.config.from_object(config_class)
    main_dns()

    return app

app = create_app()
from app import routes

