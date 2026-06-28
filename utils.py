from __future__ import annotations

import sys


def ssh(client, cmd, desc='', timeout=60):
    label = desc or cmd[:60]
    sys.stdout.buffer.write(f"\n>>> {label}\n".encode())
    sys.stdout.flush()
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        sys.stdout.buffer.write((out + '\n').encode('utf-8', errors='replace'))
    if err:
        sys.stdout.buffer.write(
            ('STDERR: ' + err + '\n').encode('utf-8', errors='replace'))
    sys.stdout.flush()
    return out, err


def scp_file(client, local_path, remote_path):
    sftp = client.open_sftp()
    sftp.put(local_path, remote_path)
    sftp.close()
    sys.stdout.buffer.write(f"SCP: {local_path} -> {remote_path}\n".encode())
    sys.stdout.flush()
