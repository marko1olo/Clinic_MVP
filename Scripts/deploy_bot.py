import os
import paramiko
import sys

host = os.environ.get('VPS_HOST', '62.84.100.97')
user = os.environ.get('VPS_USER', 'root')
password = os.environ.get('VPS_PASSWORD')

if not password:
    print("Error: VPS_PASSWORD environment variable is not set.")
    sys.exit(1)

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
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname=host, username=user, password=password, timeout=10)
sys.stdout.buffer.write(b"Connected.\n")

# 1. Create remote app dir
ssh(client, "mkdir -p /opt/clinic_bot/config", "Create bot dir")

# 2. Upload files via SFTP
for local, remote in [
    (r"C:\Clinic_MVP\clinic_bot\bot.py",              "/opt/clinic_bot/bot.py"),
    (r"C:\Clinic_MVP\clinic_bot\db.py",               "/opt/clinic_bot/db.py"),
    (r"C:\Clinic_MVP\clinic_bot\requirements.txt",    "/opt/clinic_bot/requirements.txt"),
    (r"C:\Clinic_MVP\clinic_bot\Dockerfile",          "/opt/clinic_bot/Dockerfile"),
    (r"C:\Clinic_MVP\clinic_bot\config\settings.py",  "/opt/clinic_bot/config/settings.py"),
]:
    scp_file(client, local, remote)

# 3. Create __init__.py for config package
ssh(client, "touch /opt/clinic_bot/config/__init__.py", "Create config __init__.py")

# 4. Update MQTT host in settings for production (10.77.0.1 = VPS WireGuard IP)
ssh(client, "sed -i 's/MQTT_HOST = \"62.84.100.97\"/MQTT_HOST = \"10.77.0.1\"/' /opt/clinic_bot/config/settings.py", "Set MQTT host to WireGuard IP")
ssh(client, "grep MQTT_HOST /opt/clinic_bot/config/settings.py", "Verify MQTT host")

# 5. Add bot service to docker-compose
ssh(client, "cat /opt/clinic_infra/docker-compose.yml", "Current docker-compose")

bot_service = """
  clinic_bot:
    build: /opt/clinic_bot
    container_name: clinic_bot
    restart: always
    network_mode: host
    volumes:
      - /opt/clinic_bot:/app
    environment:
      - PYTHONUNBUFFERED=1
"""
ssh(client,
    f"grep -q 'clinic_bot' /opt/clinic_infra/docker-compose.yml || "
    f"printf '{bot_service}' >> /opt/clinic_infra/docker-compose.yml",
    "Add bot service to docker-compose")

# 6. Build and start
ssh(client, "cd /opt/clinic_infra && docker-compose build clinic_bot 2>&1 | tail -8", "Build bot image", timeout=180)
ssh(client, "docker rm -f clinic_bot", "Remove old bot container to avoid ContainerConfig error")
ssh(client, "cd /opt/clinic_infra && docker-compose up -d clinic_bot 2>&1", "Start clinic_bot container")
ssh(client, "sleep 4 && docker ps --format 'table {{.Names}}\\t{{.Status}}'", "All containers")
ssh(client, "docker logs clinic_bot 2>&1 | tail -10", "Bot logs")

client.close()
sys.stdout.buffer.write(b"\nDone.\n")
