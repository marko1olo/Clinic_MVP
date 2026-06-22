import os
import re

scripts_dir = "scripts"
files = [f for f in os.listdir(scripts_dir) if f.endswith((".js", ".mjs"))]

files_list_str = '["App.tsx", "useAppLogic.tsx", "AppHelpers.tsx", "ImagingView.tsx", "VisitView.tsx"]'

sync_replacement = f'({files_list_str}.map(f => typeof fs !== "undefined" && fs.readFileSync ? fs.readFileSync("apps/web/src/" + f, "utf8") : readFileSync("apps/web/src/" + f, "utf8")).join("\\\\n"))'
async_replacement = f'(await Promise.all({files_list_str}.map(f => typeof fs !== "undefined" && fs.promises && fs.promises.readFile ? fs.promises.readFile("apps/web/src/" + f, "utf8") : readFile("apps/web/src/" + f, "utf8")))).join("\\n")'

# Regex to match the previous concatenation from patch_tests.js
prev_concat_pattern = re.compile(
    r'\((?:fs\.)?readFileSync\("apps/web/src/App\.tsx",\s*"utf8"\)\s*\+\s*"\\n"\s*\+\s*(?:fs\.)?readFileSync\("apps/web/src/useAppLogic\.tsx",\s*"utf8"\)\s*\+\s*"\\n"\s*\+\s*(?:fs\.)?readFileSync\("apps/web/src/ImagingView\.tsx",\s*"utf8"\)\s*\+\s*"\\n"\s*\+\s*(?:fs\.)?readFileSync\("apps/web/src/VisitView\.tsx",\s*"utf8"\)\)'
)

for file in files:
    filePath = os.path.join(scripts_dir, file)
    with open(filePath, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = False
    
    # 1. Replace the previous concatenation if present
    if prev_concat_pattern.search(content):
        content = prev_concat_pattern.sub(sync_replacement, content)
        modified = True
    
    # 2. Replace sync readFileSync of App.tsx
    sync_patterns = [
        r'fs\.readFileSync\("apps/web/src/App\.tsx",\s*"utf8"\)',
        r'readFileSync\("apps/web/src/App\.tsx",\s*"utf8"\)',
        r"fs\.readFileSync\('apps/web/src/App\.tsx',\s*'utf8'\)",
        r"readFileSync\('apps/web/src/App\.tsx',\s*'utf8'\)"
    ]
    for pattern in sync_patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, sync_replacement, content)
            modified = True
            
    # 3. Replace async readFile of App.tsx
    async_patterns = [
        r'await\s+fs\.readFile\("apps/web/src/App\.tsx",\s*"utf8"\)',
        r'await\s+readFile\("apps/web/src/App\.tsx",\s*"utf8"\)',
        r"await\s+fs\.readFile\('apps/web/src/App\.tsx',\s*'utf8'\)",
        r"await\s+readFile\('apps/web/src/App\.tsx',\s*'utf8'\)"
    ]
    for pattern in async_patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, async_replacement, content)
            modified = True

    if modified:
        print(f"Patching {file}...")
        with open(filePath, "w", encoding="utf-8") as f:
            f.write(content)

print("Finished patching test files.")
