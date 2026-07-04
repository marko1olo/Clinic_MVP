import os
import sys
import json
import base64
import time
import random
from io import BytesIO
from PIL import Image
from openai import OpenAI

# Paths
ROOT_DIR = r"C:\Clinic_MVP"
IMAGES_DIR = r"C:\Users\Admin\Downloads\Медиа_Картинки_и_Видео"
PROMPT_FILE = os.path.join(ROOT_DIR, "dentalimage.md")
CONFIG_FILE = os.path.join(ROOT_DIR, "config.json")
REPORT_FILE = os.path.join(ROOT_DIR, "ShadowAnalyst", "model_test_report.md")

# Ensure scratch directory exists
os.makedirs(os.path.dirname(REPORT_FILE), exist_ok=True)

# Selected 5 images
TEST_IMAGES = [
    "1.jpg",
    "XXL.jpg",
    "fotografii-rentgenovskih-snimkov-2.jpg",
    "pricelnyj-snimok-zuba7.jpg",
    "rentgen04.jpg"
]

print("Loading keys and config...")
if not os.path.exists(CONFIG_FILE):
    print(f"ERROR: Config file {CONFIG_FILE} not found!")
    sys.exit(1)

with open(CONFIG_FILE, "r", encoding="utf-8") as f:
    config = json.load(f)

groq_keys = config.get("groq_api_keys", [])
google_keys = config.get("google_api_keys", [])

if not groq_keys or not google_keys:
    print("ERROR: Missing API keys in config!")
    sys.exit(1)

print(f"Loaded {len(groq_keys)} Groq keys and {len(google_keys)} Google keys.")

# Load prompt
if os.path.exists(PROMPT_FILE):
    with open(PROMPT_FILE, "r", encoding="utf-8") as f:
        system_prompt = f.read()
else:
    system_prompt = "Опиши снимок зубов как стоматолог."
    print("WARNING: dentalimage.md not found, using default prompt.")

def prepare_image(file_path):
    try:
        with Image.open(file_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            max_size = 1000
            if max(img.size) > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=80, optimize=True)
            img_bytes = buffer.getvalue()
            return f"data:image/jpeg;base64,{base64.b64encode(img_bytes).decode('utf-8')}"
    except Exception as e:
        print(f"Error preparing image {file_path}: {e}")
        return None

def test_model(model_name, provider, image_b64, keys):
    base_url = "https://api.groq.com/openai/v1" if provider == "groq" else "https://generativelanguage.googleapis.com/v1beta/openai/"
    
    # Shuffle keys to distribute load
    active_keys = keys.copy()
    random.shuffle(active_keys)
    
    last_err = None
    for api_key in active_keys:
        if not api_key:
            continue
        try:
            client = OpenAI(api_key=api_key, base_url=base_url, timeout=60.0)
            start_time = time.time()
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": system_prompt},
                            {"type": "image_url", "image_url": {"url": image_b64}}
                        ]
                    }
                ],
                max_tokens=1200
            )
            elapsed = time.time() - start_time
            if response.choices and len(response.choices) > 0:
                content = response.choices[0].message.content
                # Remove thinking tags if present
                import re
                content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
                return {"status": "success", "time": elapsed, "content": content}
        except Exception as e:
            last_err = str(e)
            print(f"Error with key {api_key[:10]}...: {e}")
            continue
            
    return {"status": "failed", "error": last_err}

# Main testing loop
results = {}

for img_name in TEST_IMAGES:
    img_path = os.path.join(IMAGES_DIR, img_name)
    if not os.path.exists(img_path):
        print(f"Image {img_name} not found, skipping.")
        continue
        
    print(f"\nProcessing image: {img_name}...")
    image_b64 = prepare_image(img_path)
    if not image_b64:
        continue
        
    results[img_name] = {}
    
    # Models to test
    models = [
        {"name": "gemini-3.5-flash", "provider": "gemini", "keys": google_keys},
        {"name": "qwen/qwen3.6-27b", "provider": "groq", "keys": groq_keys},
        {"name": "meta-llama/llama-4-scout-17b-16e-instruct", "provider": "groq", "keys": groq_keys}
    ]
    
    for m in models:
        model_id = m["name"]
        print(f"  Testing model: {model_id} ({m['provider']})...")
        res = test_model(model_id, m["provider"], image_b64, m["keys"])
        results[img_name][model_id] = res
        if res["status"] == "success":
            print(f"    SUCCESS: {res['time']:.2f}s")
        else:
            print(f"    FAILED: {res.get('error')}")

# Write Markdown Report
report_content = []
report_content.append("# ShadowAnalyst - Model Testing Report\n")
report_content.append(f"Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
report_content.append("## Overview Table\n")
report_content.append("| Image | Gemini 3.5 Flash | Qwen 3.6 (Groq) | Llama 4 Scout (Groq) |")
report_content.append("| :--- | :--- | :--- | :--- |")

for img_name in TEST_IMAGES:
    row = f"| **{img_name}** "
    for model_id in ["gemini-3.5-flash", "qwen/qwen3.6-27b", "meta-llama/llama-4-scout-17b-16e-instruct"]:
        res = results.get(img_name, {}).get(model_id, {})
        if res.get("status") == "success":
            row += f"| Success ({res['time']:.1f}s, {len(res['content'])} chars) "
        else:
            row += f"| Failed ({res.get('error', 'unknown')[:20]}...) "
    row += "|"
    report_content.append(row)

report_content.append("\n## Detailed Analysis by Image\n")

for img_name in TEST_IMAGES:
    report_content.append(f"### Image: {img_name}\n")
    for model_id in ["gemini-3.5-flash", "qwen/qwen3.6-27b", "meta-llama/llama-4-scout-17b-16e-instruct"]:
        res = results.get(img_name, {}).get(model_id, {})
        report_content.append(f"#### Model: {model_id}\n")
        if res.get("status") == "success":
            report_content.append(f"**Time taken:** {res['time']:.2f}s\n")
            report_content.append(f"**Response:**\n\n{res['content']}\n")
        else:
            report_content.append(f"**Status:** FAILED\n**Error:** {res.get('error')}\n")
        report_content.append("---\n")

with open(REPORT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(report_content))

print(f"\nReport written to {REPORT_FILE} successfully!")
