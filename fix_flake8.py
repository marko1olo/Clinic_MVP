with open("ShadowAnalyst/watcher.py", "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace("\ndef analyze_image", "\n\ndef analyze_image")

with open("ShadowAnalyst/watcher.py", "w", encoding="utf-8") as f:
    f.write(code)
