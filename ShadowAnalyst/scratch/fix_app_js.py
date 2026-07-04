import os

file_path = r"C:\Clinic_MVP\ShadowAnalyst\gui\static\app.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Target block to replace (accounting for possible \r\n or \n)
target_parts = [
    "if (res.ok) {",
    "window.loadData(currentImage, currentReport, currentSummary);",
    "}",
    "}",
    "if (modelTierInput) {"
]

# We will search for a pattern where these lines appear sequentially
# Let's do a robust replacement of the section
replacement = """            }
        } catch (e) {
            window.showToast("Ошибка сохранения настроек: " + e.message, "error");
        }
    });

    const updateModelTierLabel = (value) => {
        const label = document.getElementById('model-tier-label');
        if (!label) return;
        const val = parseInt(value);
        if (val === 4) {
            label.textContent = "Интеллектуальная (Gemini 3.5 Flash)";
        } else if (val === 3) {
            label.textContent = "Умеренная (Gemini 3.1 Flash Lite)";
        } else if (val === 2) {
            label.textContent = "Рекомендованная (Qwen 3.6 + Llama)";
        } else {
            label.textContent = "Тупая модель (Llama 4 Scout)";
        }
    };

    const modelTierInput = document.getElementById('range-model-tier');
    if (modelTierInput) {"""

# Let's find the text between "window.loadData(currentImage, currentReport, currentSummary);" ... "if (modelTierInput) {"
import re
pattern = re.compile(
    r"(window\.loadData\(currentImage,\s*currentReport,\s*currentSummary\);.*?\n\s*\}\s*\n\s*\}\s*\n\s*)(if\s*\(modelTierInput\)\s*\{)",
    re.DOTALL
)

match = pattern.search(content)
if match:
    # Replace the matching part
    matched_text = match.group(0)
    # The part after window.loadData... } } up to if (modelTierInput) {
    new_content = content.replace(matched_text, f"window.loadData(currentImage, currentReport, currentSummary);\n                }}\n            }}\n{replacement}")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("SUCCESS: app.js has been successfully patched!")
else:
    # Try a simpler replace if that didn't match
    print("ERROR: Pattern not found!")
