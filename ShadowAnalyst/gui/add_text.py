from __future__ import annotations

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
try:
    img = Image.open('splash.png').convert('RGBA')
    width, height = img.size
    font_path = 'C:\\Windows\\Fonts\\segoeui.ttf'
    try:
        font = ImageFont.truetype(font_path, 48)
        font_sub = ImageFont.truetype(font_path, 20)
    except Exception:
        font = ImageFont.load_default()
        font_sub = ImageFont.load_default()
    txt = Image.new('RGBA', img.size, (255, 255, 255, 0))
    d = ImageDraw.Draw(txt)
    text = 'ShadowAnalyst'
    sub_text = 'AI Dental Assistant'
    bbox = d.textbbox((0, 0), text, font=font)
    t_w = bbox[2] - bbox[0]
    t_h = bbox[3] - bbox[1]
    bbox_sub = d.textbbox((0, 0), sub_text, font=font_sub)
    ts_w = bbox_sub[2] - bbox_sub[0]
    ts_h = bbox_sub[3] - bbox_sub[1]
    x = (width - t_w) // 2
    y = (height - t_h) // 2 - 20
    xs = (width - ts_w) // 2
    ys = y + t_h + 10
    d.text((x+2, y+2), text, font=font, fill=(0, 0, 0, 200))
    d.text((xs+1, ys+1), sub_text, font=font_sub, fill=(0, 0, 0, 200))
    d.text((x, y), text, font=font, fill=(255, 255, 255, 255))
    d.text((xs, ys), sub_text, font=font_sub, fill=(180, 210, 255, 255))
    out = Image.alpha_composite(img, txt)
    out.convert('RGB').save('splash.png')  # overwrite
    print('Added text to splash.png')
except Exception as e:
    print('Error:', e)
