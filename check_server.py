import os
import sys
import paramiko
import logging

logging.basicConfig(level=logging.INFO, stream=sys.stdout, format='%(message)s')
logger = logging.getLogger(__name__)

def main():
    host = os.environ.get('VPS_HOST')
    if not host:
        sys.exit('ERROR: VPS_HOST environment variable is not set.')

    user = 'root'
    password = os.environ.get('VPS_PASSWORD')
    if not password:
        sys.exit('ERROR: VPS_PASSWORD environment variable is not set.')

    try:
        client = paramiko.SSHClient()
        client.load_system_host_keys()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        logger.info(f"Connecting to {user}@{host}...")
        client.connect(hostname=host, username=user, password=password, timeout=10)

        commands = [
            "lsb_release -a",
            "uptime",
            "free -m",
            "df -h /",
            "top -b -n 1 | head -n 12"
        ]

        for cmd in commands:
            logger.info(f"\n[Run] {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd)
            logger.info(stdout.read().decode('utf-8', errors='replace').strip())
            err = stderr.read().decode('utf-8', errors='replace').strip()
            if err:
                logger.warning(f"Stderr: {err}")

        client.close()
        logger.info("\nConnection closed.")
    except Exception as e:
        logger.error(f"Failed to connect or execute: {e}")

if __name__ == '__main__':
    main()
