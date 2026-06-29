import json

account = "marko1olo"
project = "Clinic_MVP"
hash = "a32b910d74b519a7f22083210384edfb78ec706e"

def make_link(filepath, lineno):
    return f"https://github.com/{account}/{project}/blob/{hash}/{filepath}#L{lineno}"

with open('find_issues3.py', 'r') as f:
    pass
