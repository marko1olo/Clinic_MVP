import requests
import json

key = "AQ.Ab8RN6I0rdGYG0hCAGheByDr_2X-QEHVHq3Xx5wAdi9lOo2qbw"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"

try:
    r = requests.get(url, timeout=10)
    if r.status_code == 200:
        models = r.json().get("models", [])
        print(f"Supported models for key {key[:10]}...:")
        for m in models:
            print(f"  - {m['name']} (displayName: {m['displayName']})")
    else:
        print(f"Failed: {r.status_code} - {r.text}")
except Exception as e:
    print(f"Error: {e}")
