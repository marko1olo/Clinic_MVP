🎯 **What:** The vulnerability fixed
Resolved an insecure SSH host key policy (`AutoAddPolicy`) in the `Scripts/` directory that was present in merge conflicts.

⚠️ **Risk:** The potential impact if left unfixed
`AutoAddPolicy` automatically accepts any unknown SSH host key. This behavior allows for Man-In-The-Middle (MITM) attacks, meaning an attacker could intercept the connection, steal credentials, and execute arbitrary commands on what the system thought was a trusted server.

🛡️ **Solution:** How the fix addresses the vulnerability
Replaced `paramiko.AutoAddPolicy()` with `paramiko.RejectPolicy()`. Used `client.load_system_host_keys()` to use the known hosts file instead of automatically accepting whatever key is presented. Resolved the Git merge conflict markers in favor of securely fetching credentials from environment variables (`HEAD`) instead of storing plaintext credentials in code.
