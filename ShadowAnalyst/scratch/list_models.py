import requests

key = "AQ.Ab8RN6I0rdGYG0hCAGheByDr_2X-QEHVHq3Xx5wAdi9lOo2qbw"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"

try:
    r = requests.get(url, timeout=10)
    print(f"Status Code: {r.status_code}")
    print(f"Response: {r.text[:1000]}")
except Exception as e:
    print(f"Error: {e}")
