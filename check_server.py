import os
import paramiko
import sys

host = '62.84.100.97'
user = 'root'
password = os.environ.get('SERVER_PASSWORD')
if not password:
    sys.exit("Error: SERVER_PASSWORD environment variable is not set.")

try:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {user}@{host}...")
    client.connect(hostname=host, username=user, password=password, timeout=10)
    
    commands = [
        "lsb_release -a",
        "uptime",
        "free -m",
        "df -h /",
        "top -b -n 1 | head -n 12"
    ]
    
    for cmd in commands:
        print(f"\n[Run] {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode('utf-8', errors='replace').strip())
        err = stderr.read().decode('utf-8', errors='replace').strip()
        if err:
            print(f"Stderr: {err}")
            
    client.close()
    print("\nConnection closed.")
except Exception as e:
    print(f"Failed to connect or execute: {e}")
