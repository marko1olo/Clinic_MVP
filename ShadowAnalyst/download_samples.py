import os
import requests

output_dir = r'C:\Clinic_MVP\Sample_Images'
os.makedirs(output_dir, exist_ok=True)

url = 'https://openi.nlm.nih.gov/api/search?query=periapical+radiograph&m=1&n=20'
res = requests.get(url, timeout=30).json()
items = res.get('list', [])

downloaded = 0
for item in items:
    img_url = item.get('imgLarge')
    if img_url:
        full_url = 'https://openi.nlm.nih.gov' + img_url
        try:
            img_data = requests.get(full_url, timeout=15).content
            fname = f'xray_{downloaded+1}.jpg'
            with open(os.path.join(output_dir, fname), 'wb') as f:
                f.write(img_data)
            downloaded += 1
            print(f'Downloaded {fname}')
        except Exception as e:
            print(f"Error downloading {full_url}: {e}")
        if downloaded >= 10:
            break

print(f'Done. Downloaded {downloaded} medical images.')
