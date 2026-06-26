import os
import paramiko
import sys

host = '62.84.100.97'
user = 'root'
password = os.environ.get('VPS_PASSWORD')
if not password:
    sys.exit('ERROR: VPS_PASSWORD environment variable is not set.')

try:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=host, username=user, password=password, timeout=10)

    commands = [
        "docker --version",
        "docker compose version",
        "wg show",
        "ip a | grep wg",
        "ss -tulpn | grep -E ':(80|443|53|1883|4222|6379) '"
    ]

    for cmd in commands:
        print(f"\n--- {cmd} ---")
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='replace').strip()
        err = stderr.read().decode('utf-8', errors='replace').strip()
        if out:
            print(out)
        if err:
            print(f"STDERR: {err}")

    client.close()
except Exception as e:
    print(f"Error: {e}")
