import paramiko
import sys
import functools
from utils import ssh as base_ssh

ssh = functools.partial(base_ssh, timeout=90)

host = '62.84.100.97'
user = 'root'
password = 'W15n8zf781%nV25BGZ+2'


client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname=host, username=user, password=password, timeout=10)
sys.stdout.buffer.write(b"Connected.\n")

# ── 1. Save iptables rules without installing iptables-persistent interactively ──
# Just save to file and add cron to restore on boot - simpler and no apt needed
ssh(client, "mkdir -p /etc/iptables && iptables-save > /etc/iptables/rules.v4", "Save iptables rules to file")
# Add restore on boot via rc.local
ssh(client, "grep -q 'iptables-restore' /etc/rc.local 2>/dev/null || echo 'iptables-restore < /etc/iptables/rules.v4' >> /etc/rc.local; chmod +x /etc/rc.local", "Auto-restore iptables on boot via rc.local")
ssh(client, "iptables -L INPUT -n | grep -E '(3000|DROP)'", "Verify iptables rules active")

# ── 2. Nginx config ──
nginx_conf = """server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/clinic;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

server {
    listen 8884;
    server_name _;

    location /mqtt {
        proxy_pass http://10.77.0.1:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
    }
}
"""
ssh(client, f"cat > /etc/nginx/sites-available/clinic << 'NGINXEOF'\n{nginx_conf}\nNGINXEOF", "Write nginx config")
ssh(client, "ln -sf /etc/nginx/sites-available/clinic /etc/nginx/sites-enabled/clinic && rm -f /etc/nginx/sites-enabled/default", "Enable clinic, remove default")

# ── 3. Site placeholder ──
ssh(client, "mkdir -p /var/www/clinic", "Create webroot")
html = """<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Стоматологическая клиника</title>
<style>
body{margin:0;font-family:sans-serif;background:#0a0f1e;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.card{text-align:center;padding:60px;}
h1{font-size:2.5rem;margin-bottom:10px;}
p{color:#8892a4;font-size:1.1rem;}
</style>
</head>
<body>
<div class="card">
<h1>Клиника</h1>
<p>Сайт скоро появится. Мы работаем.</p>
</div>
</body>
</html>"""
ssh(client, f"cat > /var/www/clinic/index.html << 'HTMLEOF'\n{html}\nHTMLEOF", "Write site placeholder")

# ── 4. Test + reload nginx ──
ssh(client, "nginx -t 2>&1", "Nginx config test")
ssh(client, "systemctl reload nginx && echo 'Nginx reloaded OK'", "Reload nginx")

# ── 5. Final summary ──
ssh(client, "ss -tulpn | grep -E ':(80|8884|1883|9001|53|3000) ' | sort", "Active ports")
ssh(client, "docker ps --format 'table {{.Names}}\\t{{.Status}}'", "Containers")
ssh(client, "free -m | head -2", "RAM")
ssh(client, "curl -s http://127.0.0.1/index.html | grep -o '<h1>.*</h1>'", "Site reachable check")

client.close()
sys.stdout.buffer.write(b"\nDone.\n")
