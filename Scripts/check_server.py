import paramiko
import os

host = '62.84.100.97'
user = 'root'
key_file = os.environ.get('VPS_KEY_FILE', os.path.expanduser('~/.ssh/id_rsa'))

try:
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.RejectPolicy())
    print(f"Connecting to {user}@{host} using key {key_file}...")
    client.connect(hostname=host, username=user, key_filename=key_file, timeout=10)
    
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
