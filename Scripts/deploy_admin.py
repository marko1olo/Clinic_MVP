import paramiko
import sys
import os

host = '62.84.100.97'
user = 'root'
password = 'W15n8zf781%nV25BGZ+2'

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

def scp_file(client, local_path, remote_path):
    sftp = client.open_sftp()
    sftp.put(local_path, remote_path)
    sftp.close()
    sys.stdout.buffer.write(f"SCP: {local_path} -> {remote_path}\n".encode())
    sys.stdout.flush()

client = paramiko.SSHClient()
client.load_system_host_keys()
client.set_missing_host_key_policy(paramiko.RejectPolicy())
client.connect(hostname=host, username=user, password=password, timeout=10)
sys.stdout.buffer.write(b"Connected.\n")

# 1. Create remote app dir
ssh(client, "mkdir -p /opt/clinic_admin/templates /opt/clinic_admin/static /opt/clinic_admin/data", "Create admin dirs")

# 2. Upload files via SFTP
files_to_upload = [
    (r"C:\Clinic_MVP\clinic_admin\main.py", "/opt/clinic_admin/main.py"),
    (r"C:\Clinic_MVP\clinic_admin\database.py", "/opt/clinic_admin/database.py"),
    (r"C:\Clinic_MVP\clinic_admin\requirements.txt", "/opt/clinic_admin/requirements.txt"),
    (r"C:\Clinic_MVP\clinic_admin\Dockerfile", "/opt/clinic_admin/Dockerfile"),
    (r"C:\Clinic_MVP\clinic_admin\templates\dashboard.html", "/opt/clinic_admin/templates/dashboard.html"),
]
for local, remote in files_to_upload:
    scp_file(client, local, remote)

# 3. Add admin service to docker-compose
admin_service = """
  clinic_admin:
    build: /opt/clinic_admin
    container_name: clinic_admin
    restart: always
    network_mode: host
    volumes:
      - /opt/clinic_admin:/app
    environment:
      - PYTHONUNBUFFERED=1
"""
ssh(client,
    f"grep -q 'clinic_admin' /opt/clinic_infra/docker-compose.yml || "
    f"printf '{admin_service}' >> /opt/clinic_infra/docker-compose.yml",
    "Add admin service to docker-compose")

# 4. Build and start
ssh(client, "cd /opt/clinic_infra && docker-compose build clinic_admin 2>&1 | tail -8", "Build admin image", timeout=180)
ssh(client, "cd /opt/clinic_infra && docker-compose rm -fsv clinic_admin", "Remove old admin container")
ssh(client, "cd /opt/clinic_infra && docker-compose up -d clinic_admin 2>&1", "Start clinic_admin container")
ssh(client, "sleep 4 && docker ps --format 'table {{.Names}}\\t{{.Status}}'", "All containers")
ssh(client, "docker logs clinic_admin 2>&1 | tail -10", "Admin logs")

client.close()
sys.stdout.buffer.write(b"\nDone.\n")
