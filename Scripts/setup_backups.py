import os
import paramiko
import sys

def ssh(client, cmd, desc="", timeout=60):
    sys.stdout.buffer.write(f"\n>>> {desc or cmd[:60]}\n".encode())
    sys.stdout.flush()
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    try:
        out = stdout.read().decode('utf-8', errors='replace').strip()
        err = stderr.read().decode('utf-8', errors='replace').strip()
        if out: sys.stdout.buffer.write((out+"\n").encode('utf-8','replace'))
        if err: sys.stdout.buffer.write(("STDERR: "+err+"\n").encode('utf-8','replace'))
        sys.stdout.flush()
        return out, err
    finally:
        stdin.close()
        stdout.close()
        stderr.close()

def main():
    host = os.environ.get('VPS_HOST')
    if not host:
        sys.exit('ERROR: VPS_HOST environment variable is not set.')
    user = os.environ.get('VPS_USER', 'root')
    password = os.environ.get('VPS_PASSWORD')
    key_path = os.environ.get('VPS_KEY_PATH')

    if not password and not key_path:
        sys.exit('ERROR: VPS_PASSWORD or VPS_KEY_PATH environment variable is required.')

    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.RejectPolicy())
    client.connect(
        hostname=host,
        username=user,
        password=password,
        key_filename=key_path,
        timeout=10
    )
    sys.stdout.buffer.write(b"Connected.\n")

    # Create backup script
    backup_script = """#!/bin/bash
umask 077
BACKUP_DIR="/opt/backups/clinic"
DB_FILE="/opt/clinic_admin/clinic.db"
DATE=$(date +%Y-%m-%d_%H-%M)

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_DIR/clinic_${DATE}.db"
    chmod 600 "$BACKUP_DIR/clinic_${DATE}.db"
    # Keep only last 30 backups
    find "$BACKUP_DIR" -name "clinic_*.db" -type f -mtime +30 -delete
fi
"""

    ssh(client, f"cat << 'EOF' > /etc/cron.daily/clinic_backup\n{backup_script}EOF", "Write backup cron")
    ssh(client, "chmod +x /etc/cron.daily/clinic_backup", "Make executable")
    ssh(client, "/etc/cron.daily/clinic_backup", "Run backup immediately to test")
    ssh(client, "ls -lh /opt/backups/clinic/", "Check backup files")

    client.close()
    sys.stdout.buffer.write(b"\nDone.\n")

if __name__ == "__main__":
    main()
