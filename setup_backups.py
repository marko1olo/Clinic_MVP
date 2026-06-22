import paramiko
import sys
from utils import ssh

host = '62.84.100.97'
user = 'root'
password = 'W15n8zf781%nV25BGZ+2'


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
