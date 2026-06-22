import os
import paramiko
import sys

host = '62.84.100.97'
user = 'root'
password = os.environ.get('SERVER_PASSWORD')
if not password:
    sys.exit("Error: SERVER_PASSWORD environment variable is not set.")

def ssh(client, cmd, desc="", timeout=60):
    sys.stdout.buffer.write(f"\n>>> {desc or cmd[:60]}\n".encode())
    sys.stdout.flush()
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: sys.stdout.buffer.write((out+"\n").encode('utf-8','replace'))
    if err: sys.stdout.buffer.write(("STDERR: "+err+"\n").encode('utf-8','replace'))
    sys.stdout.flush()
    return out, err

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname=host, username=user, password=password, timeout=10)
sys.stdout.buffer.write(b"Connected.\n")

# Create backup script
backup_script = """#!/bin/bash
BACKUP_DIR="/opt/backups/clinic"
DB_FILE="/opt/clinic_admin/clinic.db"
DATE=$(date +%Y-%m-%d_%H-%M)

mkdir -p "$BACKUP_DIR"
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_DIR/clinic_${DATE}.db"
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
