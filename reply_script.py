import urllib.request
import json

data = json.dumps({
    "replies": [
        {
            "comment_id": "5056796723",
            "reply": "Understood. Acknowledging that this work is now obsolete and stopping work on this task."
        }
    ]
}).encode('utf-8')

req = urllib.request.Request('http://127.0.0.1:8000/tools/reply_to_pr_comments', data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
