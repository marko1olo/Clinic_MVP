import os

root_dir = r"C:\Clinic_MVP"
print("Scanning for config.json files...")

found_configs = []
for root, dirs, files in os.walk(root_dir):
    # Skip build, dist, venv, and hidden folders
    if any(x in root for x in ["build", "dist", "venv", ".venv", ".git", "node_modules"]):
        continue
    if "config.json" in files:
        path = os.path.join(root, "config.json")
        found_configs.append(path)

print(f"Found {len(found_configs)} config.json files:")
for path in found_configs:
    print(f"\nPath: {path}")
    import json
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            print(f"  groq_keys count: {len(data.get('groq_api_keys', []))}")
            print(f"  google_keys count: {len(data.get('google_api_keys', []))}")
            print(f"  elevenlabs_keys count: {len(data.get('elevenlabs_api_keys', []))}")
    except Exception as e:
        print(f"  Error reading: {e}")

# If there are configs other than C:\Clinic_MVP\config.json, let's clean them up to avoid any confusion!
for path in found_configs:
    if path != r"C:\Clinic_MVP\config.json":
        print(f"\nDeleting stale/duplicate config to avoid conflicts: {path}")
        try:
            os.remove(path)
            print("  Deleted successfully!")
        except Exception as e:
            print(f"  Error deleting: {e}")
