import os
import json
import base64
import time
import random
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from openai import OpenAI

try:
    font = ImageFont.truetype("arial.ttf", 40)
except:
    font = ImageFont.load_default()

def draw_text_with_bg(draw, text, x, y, text_color, bg_color=(0, 0, 0, 180)):
    # Draw background box for text
    bbox = draw.textbbox((x, y), text, font=font)
    draw.rectangle([bbox[0]-5, bbox[1]-5, bbox[2]+5, bbox[3]+5], fill=bg_color)
    draw.text((x, y), text, fill=text_color, font=font)


API_KEYS = [key.strip() for key in os.getenv("GROQ_API_KEYS", "").split(",") if key.strip()]
MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
OUTPUT_DIR = r"C:\Clinic_MVP\Prompt_Tests"
IMG_PATH = r"C:\Users\danat\Downloads\оро.webp"

os.makedirs(OUTPUT_DIR, exist_ok=True)

PROMPTS = [
    # 1. Прямой и жесткий
    "Ты ИИ-рентгенолог. Отвечай ТОЛЬКО JSON: {\"objects\": [{\"name\": \"кариес\", \"box\": [x1,y1,x2,y2]}]}. Координаты 0-1000.",
    
    # 2. Ролевая игра, эксперт
    "Ты стоматолог высшей категории с 20-летним стажем. Твоя задача детально изучить снимок на предмет скрытого кариеса и пульпита. Выдай результат в строгом JSON формате: {\"objects\": [{\"name\": \"болезнь\", \"box\": [x1,y1,x2,y2]}]}. Координаты 0-1000.",
    
    # 3. Chain of Thought (Пошаговое размышление)
    "Шаг 1: Изучи коронки зубов. Шаг 2: Изучи корни. Шаг 3: Верни JSON с найденными аномалиями: {\"objects\": [{\"name\": \"описание\", \"box\": [x1,y1,x2,y2]}]}. Координаты 0-1000. Никакого текста кроме JSON.",
    
    # 4. Фокус на координаты
    "Определи патологии зубов. Твоя главная задача - максимальная точность bounding boxes. Формат JSON: {\"objects\": [{\"name\": \"патология\", \"box\": [x1,y1,x2,y2]}]}. X/Y от 0 до 1000.",
    
    # 5. Широкий спектр (Патологии + Анатомия)
    "Найди все: кариес, периодонтит, кисты, некачественные пломбы. Ответь строгим JSON: {\"objects\": [{\"name\": \"сущность\", \"box\": [x1,y1,x2,y2]}]}. Координаты 0-1000.",
    
    # 6. С уверенностью (Confidence)
    "Проанализируй снимок. Для каждой находки укажи уверенность (0-100). JSON: {\"objects\": [{\"name\": \"находка\", \"confidence\": 90, \"box\": [x1,y1,x2,y2]}]}. 0-1000.",
    
    # 7. Негативный промпт (Не придумывать)
    "Выведи патологии в JSON: {\"objects\": [{\"name\": \"находка\", \"box\": [x1,y1,x2,y2]}]}. ВАЖНО: Если ты не уверен на 100%, НЕ добавляй объект. Лучше пропустить, чем соврать.",
    
    # 8. English Native (Иногда английский промпт работает точнее)
    "Act as a dental radiologist. Find pathologies. Return ONLY valid JSON: {\"objects\": [{\"name\": \"russian_translation\", \"box\": [x1,y1,x2,y2]}]}. Coordinates 0-1000.",
    
    # 9. Максимальная детализация
    "Опиши каждую подозрительную тень на снимке. JSON: {\"objects\": [{\"name\": \"детальное описание проблемы\", \"box\": [x1,y1,x2,y2]}]}. Координаты от 0 до 1000.",
    
    # 10. Только критичные вещи
    "Игнорируй мелкие недочеты. Найди только те патологии, которые требуют срочного лечения (глубокий кариес, воспаления корня). JSON: {\"objects\": [{\"name\": \"диагноз\", \"box\": [x1,y1,x2,y2]}]}."
]

def get_base64(path):
    with Image.open(path) as img:
        if img.mode != 'RGB': img = img.convert('RGB')
        # Конвертим webp в jpeg для groq
        import io
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=90)
        return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

def call_groq(prompt, b64):
    keys = API_KEYS.copy()
    while True:
        random.shuffle(keys)
        for key in keys:
            client = OpenAI(api_key=key, base_url="https://api.groq.com/openai/v1", max_retries=0)
            try:
                resp = client.chat.completions.create(
                    model=MODEL,
                    messages=[
                        {"role": "user", "content": [{"type": "text", "text": prompt}, {"type": "image_url", "image_url": {"url": b64}}]}
                    ],
                    response_format={"type": "json_object"},
                    max_tokens=500
                )
                return resp.choices[0].message.content.strip()
            except Exception as e:
                if "429" in str(e):
                    continue
                print(f"Ошибка API: {e}")
                return "{}"
        print("Лимиты на всех ключах, ждем 15 сек...")
        time.sleep(15)

# --- 10 СТИЛЕЙ ОТРИСОВКИ ---
def style_1_neon(draw, img, x1, y1, x2, y2, name):
    """Стиль 1: Киберпанк / Неоновое свечение"""
    for i in range(5, 0, -1):
        draw.rectangle([x1-i, y1-i, x2+i, y2+i], outline=(0, 255, 255, 50), width=1)
    draw.rectangle([x1, y1, x2, y2], outline=(0, 255, 255), width=3)
    draw_text_with_bg(draw, f" 1. Неон: {name} ", x1, max(0, y1-45), (0, 255, 255))

def style_2_sci_fi(draw, img, x1, y1, x2, y2, name):
    """Стиль 2: Научная фантастика (уголки)"""
    length = 15
    color = (255, 50, 50)
    width = 3
    # Верхний левый
    draw.line([(x1, y1), (x1+length, y1)], fill=color, width=width)
    draw.line([(x1, y1), (x1, y1+length)], fill=color, width=width)
    # Верхний правый
    draw.line([(x2-length, y1), (x2, y1)], fill=color, width=width)
    draw.line([(x2, y1), (x2, y1+length)], fill=color, width=width)
    # Нижний левый
    draw.line([(x1, y2), (x1+length, y2)], fill=color, width=width)
    draw.line([(x1, y2), (x1, y2-length)], fill=color, width=width)
    # Нижний правый
    draw.line([(x2-length, y2), (x2, y2)], fill=color, width=width)
    draw.line([(x2, y2), (x2, y2-length)], fill=color, width=width)
    draw_text_with_bg(draw, f"2. Sci-Fi: {name}", x1+5, max(0, y1-45), color)

def style_3_rounded(draw, img, x1, y1, x2, y2, name):
    """Стиль 3: Скругленные углы (Apple style)"""
    draw.rounded_rectangle([x1, y1, x2, y2], radius=15, outline=(255, 165, 0), width=4)
    draw_text_with_bg(draw, f"3. Apple: {name}", x1+10, max(0, y1-45), (255, 165, 0))

def style_4_ellipse(draw, img, x1, y1, x2, y2, name):
    """Стиль 4: Медицинский овал"""
    draw.ellipse([x1, y1, x2, y2], outline=(50, 255, 50), width=4)
    draw_text_with_bg(draw, f"4. Овал: {name}", x1, max(0, y1-45), (50, 255, 50))

def style_5_dashed(draw, img, x1, y1, x2, y2, name):
    """Стиль 5: Пунктирная линия (поиск/подозрение)"""
    step = 15
    color = (255, 255, 0)
    for x in range(x1, x2, step*2): draw.line([(x, y1), (min(x+step, x2), y1)], fill=color, width=4)
    for x in range(x1, x2, step*2): draw.line([(x, y2), (min(x+step, x2), y2)], fill=color, width=4)
    for y in range(y1, y2, step*2): draw.line([(x1, y), (x1, min(y+step, y2))], fill=color, width=4)
    for y in range(y1, y2, step*2): draw.line([(x2, y), (x2, min(y+step, y2))], fill=color, width=4)
    draw_text_with_bg(draw, f"5. Пунктир: {name}", x1, max(0, y1-45), color)

def style_6_overlay(draw, img, x1, y1, x2, y2, name):
    """Стиль 6: Заливка полупрозрачным цветом"""
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rectangle([x1, y1, x2, y2], fill=(255, 0, 0, 60), outline=(255, 0, 0, 200), width=3)
    img.paste(Image.alpha_composite(img.convert('RGBA'), overlay))
    draw = ImageDraw.Draw(img) # Refresh draw
    draw_text_with_bg(draw, f"6. Overlay: {name}", x1, max(0, y1-45), "white")

def style_7_police(draw, img, x1, y1, x2, y2, name):
    """Стиль 7: Двойная рамка (Полицейская лента)"""
    draw.rectangle([x1, y1, x2, y2], outline="black", width=6)
    draw.rectangle([x1+1, y1+1, x2-1, y2-1], outline="yellow", width=4)
    draw_text_with_bg(draw, f"7. Police: {name}", x1+2, max(0, y1-45), "yellow", bg_color=(0,0,0,255))

def style_8_minimal(draw, img, x1, y1, x2, y2, name):
    """Стиль 8: Минимализм (Тонкая белая линия)"""
    draw.rectangle([x1, y1, x2, y2], outline="white", width=2)
    draw_text_with_bg(draw, f"8. Min: {name}", x1, y2+5, "white")

def style_9_target(draw, img, x1, y1, x2, y2, name):
    """Стиль 9: Прицел (Центр и перекрестие)"""
    cx, cy = (x1+x2)//2, (y1+y2)//2
    color = (255, 0, 255)
    draw.line([(cx-30, cy), (cx+30, cy)], fill=color, width=3)
    draw.line([(cx, cy-30), (cx, cy+30)], fill=color, width=3)
    draw.ellipse([cx-15, cy-15, cx+15, cy+15], outline=color, width=3)
    draw_text_with_bg(draw, f"9. Target: {name}", cx+20, cy-20, color)

def style_10_glass(draw, img, x1, y1, x2, y2, name):
    """Стиль 10: Glassmorphism (Блюр внутри)"""
    box = (x1, y1, x2, y2)
    ic = img.crop(box).filter(ImageFilter.GaussianBlur(5))
    img.paste(ic, box)
    draw.rectangle([x1, y1, x2, y2], outline=(255, 255, 255, 200), width=3)
    draw_text_with_bg(draw, f"10. Glass: {name}", x1, max(0, y1-45), "white")

STYLES = [
    style_1_neon, style_2_sci_fi, style_3_rounded, style_4_ellipse, style_5_dashed,
    style_6_overlay, style_7_police, style_8_minimal, style_9_target, style_10_glass
]

def run_tests():
    b64 = get_base64(IMG_PATH)
    
    for i in range(10):
        print(f"\n--- Промпт {i+1}/10 ---")
        prompt = PROMPTS[i]
        print(f"Промпт: {prompt[:80]}...")
        
        json_resp = call_groq(prompt, b64)
        print(f"Ответ ИИ: {json_resp[:100]}...")
        
        try:
            data = json.loads(json_resp)
            objects = data.get("objects", [])
        except:
            objects = []
            
        # Рисуем
        with Image.open(IMG_PATH) as img:
            if img.mode != 'RGBA': img = img.convert('RGBA')
            draw = ImageDraw.Draw(img)
            
            w, h = img.size
            for obj in objects:
                name = obj.get("name", "X")
                box = obj.get("box", [0,0,0,0])
                if len(box) == 4:
                    # Фикс координат если они от 0.0 до 1.0
                    if max(box) <= 1.0:
                        box = [b * 1000 for b in box]

                    bx1 = int((box[0]/1000)*w)
                    by1 = int((box[1]/1000)*h)
                    bx2 = int((box[2]/1000)*w)
                    by2 = int((box[3]/1000)*h)
                    
                    # Фикс координат
                    x1, x2 = min(bx1, bx2), max(bx1, bx2)
                    y1, y2 = min(by1, by2), max(by1, by2)
                    
                    if x2 > x1 and y2 > y1:
                        STYLES[i](draw, img, x1, y1, x2, y2, name)
            
            out_path = os.path.join(OUTPUT_DIR, f"Style_{i+1}.png")
            img.save(out_path, "PNG")
            print(f"Сохранено: {out_path}")

if __name__ == "__main__":
    run_tests()
