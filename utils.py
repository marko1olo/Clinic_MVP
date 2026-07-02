def ssh(client, cmd, desc="", timeout=60):
    label = desc or cmd[:60]
    print(f"\n>>> {label}", flush=True)
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out, flush=True)
    if err: print(f"STDERR: {err}", flush=True)
    return out, err

def scp_file(client, local_path, remote_path):
    sftp = client.open_sftp()
    sftp.put(local_path, remote_path)
    sftp.close()
    print(f"SCP: {local_path} -> {remote_path}", flush=True)
