🔒 [Security] Fix Hardcoded Absolute Path in `seo_agent.py`

🎯 **What:**
The file `clinic_admin/seo_agent.py` used a hardcoded absolute path (`C:/Clinic_MVP/ShadowAnalyst/gui/config.json`) to load the application configuration. This was replaced with a dynamic, relative path constructed using `os.path.join` and `__file__`, wrapped in `os.environ.get("SEO_CONFIG_PATH")`.

⚠️ **Risk:**
Hardcoded absolute paths, especially those revealing a Windows `C:/` directory structure, pose multiple risks:
1.  **Deployment Failures:** The application would fail to find its configuration when deployed to non-Windows environments (like Linux servers) or different development machines where the directory structure does not exactly match `C:/Clinic_MVP/...`.
2.  **Information Disclosure:** It exposes the internal directory structure of the original developer's workstation, which can be useful reconnaissance information for an attacker.
3.  **Inflexibility:** It prevents administrators from securely injecting or overriding the configuration path via environment variables during deployment or testing.

🛡️ **Solution:**
The path has been refactored to be relative to the location of the `seo_agent.py` file itself. The new implementation dynamically resolves `../ShadowAnalyst/gui/config.json`. Furthermore, this dynamic default path is now wrapped in `os.environ.get("SEO_CONFIG_PATH", DEFAULT_CONFIG_PATH)`, allowing the path to be safely overridden in production environments using standard environment variables.
