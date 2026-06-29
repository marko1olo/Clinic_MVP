import os
import sys
import paramiko

host = os.environ.get('VPS_HOST')
user = os.environ.get('VPS_USER', 'root')
password = os.environ.get('VPS_PASSWORD')

if not host or not password:
    print("Error: VPS_HOST and VPS_PASSWORD environment variables must be set.", file=sys.stderr)
    sys.exit(1)

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
