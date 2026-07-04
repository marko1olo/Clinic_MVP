import os
import sys
from openai import OpenAI

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

base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
model_name = "gemini-3.5-flash"  # Use gemini-3.5-flash

print(f"Testing {len(new_keys)} new Gemini keys with model {model_name}...")

working_keys = []
failed_keys = []

for idx, key in enumerate(new_keys):
    print(f"\n[{idx+1}/{len(new_keys)}] Testing key: {key[:15]}...")
    try:
        client = OpenAI(api_key=key, base_url=base_url, timeout=15.0)
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "user", "content": "Hello. Respond with exactly 'OK' if you can read this."}
            ],
            max_tokens=10
        )
        if response.choices and len(response.choices) > 0:
            content = response.choices[0].message.content.strip()
            print(f"  SUCCESS! Response: {content}")
            working_keys.append(key)
        else:
            print("  FAILED: Empty response")
            failed_keys.append((key, "Empty response"))
    except Exception as e:
        err_msg = str(e)
        print(f"  FAILED: {err_msg[:120]}")
        failed_keys.append((key, err_msg))

print("\n========================================")
print("TEST RESULTS:")
print(f"Working keys: {len(working_keys)}/{len(new_keys)}")
print(f"Failed keys: {len(failed_keys)}/{len(new_keys)}")
print("========================================")

if working_keys:
    print("\nWorking keys list:")
    for k in working_keys:
        print(f"  - {k}")
else:
    print("\nNo working keys found.")
