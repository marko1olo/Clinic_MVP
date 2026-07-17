import paramiko
import os

def main():
    host = os.environ.get('VPS_HOST', '62.84.100.97')
    user = os.environ.get('VPS_USER', 'root')
    password = os.environ.get('VPS_PASSWORD')

    if not password:
        print("Error: VPS_PASSWORD environment variable is not set.")
        return

    try:
        client = paramiko.SSHClient()
        client.load_system_host_keys()
        client.set_missing_host_key_policy(paramiko.RejectPolicy())
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
            stdin, stdout, stderr = None, None, None
            try:
                stdin, stdout, stderr = client.exec_command(cmd)
                print(stdout.read().decode('utf-8', errors='replace').strip())
                err = stderr.read().decode('utf-8', errors='replace').strip()
                if err:
                    print(f"Stderr: {err}")
            finally:
                if stdin:
                    stdin.close()
                if stdout:
                    stdout.close()
                if stderr:
                    stderr.close()

        client.close()
        print("\nConnection closed.")
    except Exception as e:
        print(f"Failed to connect or execute: {e}")

if __name__ == '__main__':
    main()
