## 🔒 Fix hardcoded SSH password vulnerability in deployment scripts

### 🎯 What
Multiple python scripts (`deploy_vps.py`, `setup_backups.py`, `deploy_bot.py`, `research_vps.py`, `deploy_admin.py`, `check_server.py`) were hardcoding sensitive credentials including the SSH root password (`W15n8zf781%nV25BGZ+2`).

### ⚠️ Risk
Hardcoding passwords, especially for the `root` user on an external VPS, is a severe security vulnerability. It exposes full server control to anyone who gains access to the source code repository. If a malicious actor found this, they could completely compromise the server, steal data, install malware, or use the server for malicious activity.

### 🛡️ Solution
The hardcoded credentials have been removed from the source code. Instead, the scripts now securely retrieve these credentials from environment variables:
- `SERVER_HOST` (Defaults to `62.84.100.97`)
- `SERVER_USER` (Defaults to `root`)
- `SERVER_PASSWORD` (Required)

If `SERVER_PASSWORD` is not set in the environment, the script will gracefully exit with an error, preventing silent failures or unintentional connections.
