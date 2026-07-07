import os
import sys
import requests

new_keys = [
    "AQ.Ab8RN6I0rdGYG0hCAGheByDr_2X-QEHVHq3Xx5wAdi9lOo2qbw",
    "AQ.Ab8RN6IzvkaJlttBQbkNVnYjPVbWt1PqJca7gXjHCgLWKix4bA",
    "AQ.Ab8RN6LBgRdHOyiWdFGfs9OA9BWg8dWJE--D2yu2Urjp38CkMw",
    "AQ.Ab8RN6Jj6m3j5aJJwexuarqu6UxdGveXzieWtsjr5TSDUTyR8A"
]

# Let's call the native Gemini API using requests to see the exact raw error/response!
for idx, key in enumerate(new_keys):
    print(f"\nTesting key {idx+1}: {key[:15]}...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": "Hello"}]}]
    }
    try:
        r = requests.post(url, json=data, headers=headers, timeout=10)
        print(f"  Status Code: {r.status_code}")
        print(f"  Response: {r.text[:500]}")
    except Exception as e:
        print(f"  Error: {e}")
