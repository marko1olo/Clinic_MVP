🔒 Fix hardcoded credentials in setup_backups.py


🎯 **What:** Removed hardcoded server IP address and root password from Scripts/setup_backups.py.
⚠️ **Risk:** Hardcoded IP address makes configuration management difficult and could expose internal network architecture. Hardcoded root password is a critical security vulnerability that allows unauthorized SSH access to the server.
🛡️ **Solution:** Modified the script to read the IP address from the VPS_HOST environment variable and the password from the VPS_PASSWORD environment variable. Added validation checks to exit with clear error messages if these variables are not set.
