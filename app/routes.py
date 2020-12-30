from app import app
from flask import render_template, jsonify
import redis

@app.route('/')
def index_page():

    return render_template('ipcheck.html')

@app.route('/dnsleak/<dns>')
def dnsleak(dns):
    r = redis.Redis(host='10.64.6.62', port=6379, db=4)
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
                if src_ip.encode() not in r.lrange(check_domain, 0, 99):
                    b.append(src_ip)
                    r.lpush(check_domain, src_ip)
                    r.expire(check_domain, 15)

    new_list = []
    for _x in r.lrange(dns, 0, 99):
        new_list.append(_x.decode())

    return jsonify({"dns": dns, "resolvers": new_list})
