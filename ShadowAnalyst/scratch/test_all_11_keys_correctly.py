import os
import requests

new_keys = [
    "AQ.Ab8RN6I0rdGYG0hCAGheByDr_2X-QEHVHq3Xx5wAdi9lOo2qbw",
    "AQ.Ab8RN6IzvkaJlttBQbkNVnYjPVbWt1PqJca7gXjHCgLWKix4bA",
    "AQ.Ab8RN6LBgRdHOyiWdFGfs9OA9BWg8dWJE--D2yu2Urjp38CkMw",
    "AQ.Ab8RN6Jj6m3j5aJJwexuarqu6UxdGveXzieWtsjr5TSDUTyR8A",
    "AQ.Ab8RN6L_oUwVuTuDfOGNAITJ8IQkzBFTp2Smdlm9yNPxaKV8hw",
    "AQ.Ab8RN6LwQ9BMpXrpZIlOEYGBMSDEEJN9WRPSxFkVNgzY1z_eNA",
    "AQ.Ab8RN6KF0WZb565xYvQFxne0wk42agC2ikWkITNBFSTZOvbktQ",
    "AQ.Ab8RN6JaRgY11HgxvelKuQaNlWVG8WkfWGJ5o3wY_9FDyCA49Q",
    "AQ.Ab8RN6Ju7Ghue4RJStU_g3ClnEPr5LlWRk1PBA9k9YmgPNXrQA",
    "AQ.Ab8RN6Jv1CSQOoBbOaxpUAe1wERm-bk7i4SoIZYDNE-HlLWOEA",
    "AQ.Ab8RN6K-N-WwexDy7LArdCPV80zuUNVK61b7tV88H6jR9m-8DQ"
]

print("Testing all 11 keys with direct HTTP calls...")

working = []
banned = []

for idx, key in enumerate(new_keys):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": "Respond with OK"}]}],
        "generationConfig": {"maxOutputTokens": 100}
    }
    try:
        r = requests.post(url, json=data, headers=headers, timeout=10)
        if r.status_code == 200:
            print(f"Key {idx+1} ({key[:12]}...): WORKING! Response status 200")
            working.append(key)
        else:
            print(f"Key {idx+1} ({key[:12]}...): FAILED (Status {r.status_code})")
            print(f"  Error: {r.text[:200]}")
            banned.append(key)
    except Exception as e:
        print(f"Key {idx+1} ({key[:12]}...): EXCEPTION - {e}")
        banned.append(key)

print("\n========================================")
print(f"SUMMARY: {len(working)} working, {len(banned)} failed.")
print("========================================")
for k in working:
    print(f"Working Key: {k}")
