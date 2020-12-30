from app import app
from flask import render_template, jsonify
from operator import itemgetter
import re
import redis
import geoip2.database

@app.route('/')
def index_page():

    return render_template('ipcheck.html')

@app.route('/dnsleak/<dns>')
def dnsleak(dns):
    r = redis.Redis(host='10.64.6.62', port=6379, db=4)
    #b=[]
    with open("/var/log/named/querys.log") as f:
        for line in f:
            v = line.split()
            date, time = itemgetter(0, 1)(v)
            src_ip = v[6].split('#')[0]
            x = re.match("^\((.*)\)", v[7])
            domainname = x.group(1)
            #check_domain = domainname

            #if check_domain == domainname:
            #if domainname.endswith("5july.net"):
            if domainname == dns:
            #if len(b) > 0:
                if src_ip.encode() not in r.lrange(dns, 0, 99):
                    #b.append(src_ip)
                    r.lpush(dns, src_ip)
                    r.expire(dns, 15)

    new_list = []
    reader = geoip2.database.Reader('extra/GeoLite2-ASN_20201229/GeoLite2-ASN.mmdb')
    asn_no = None
    asn_orgname = None
    for _x in r.lrange(dns, 0, 99):
        response = reader.asn(ip)
        asn_no = response.autonomous_system_number
        asn_orgname = response.autonomous_system_organization
        data = {
                "ip": _x.decode(),
                "isp": asn_orgname
                }
        new_list.append(data)

    return jsonify({"dns": dns, "resolvers": new_list})
