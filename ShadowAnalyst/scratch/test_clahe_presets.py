import cv2
import numpy as np
import os

src_image_path = r"C:\Clinic_MVP\Dropzone_XRay\demo_test_xray.jpg"
output_dir = r"C:\Users\Admin\.gemini\antigravity\brain\a1a1403d-94dd-4985-a845-15fef21d0c41"
os.makedirs(output_dir, exist_ok=True)

img = cv2.imread(src_image_path, cv2.IMREAD_GRAYSCALE)
if img is None:
    print("Failed to read image")
    exit(1)

# Let's resize it to a manageable size for comparison if it is very large
max_size = 600
h, w = img.shape
if max(h, w) > max_size:
    scale = max_size / max(h, w)
    img = cv2.resize(img, (int(w * scale), int(h * scale)))

def enhance(image, clip_limit, grid_size, sharp_weight):
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=grid_size)
    enhanced = clahe.apply(image)
    if sharp_weight > 0:
        gaussian = cv2.GaussianBlur(enhanced, (0, 0), 3.0)
        # unsharp mask: (1 + weight) * enhanced - weight * gaussian
        sharpened = cv2.addWeighted(enhanced, 1.0 + sharp_weight, gaussian, -sharp_weight, 0)
        return sharpened
    return enhanced

# Generate 5 options
opts = [
    ("Original (clip=3.5, grid=8, sharp=1.0)", enhance(img, 3.5, (8,8), 1.0)),
    ("Milder (clip=2.0, grid=8, sharp=0.4)", enhance(img, 2.0, (8,8), 0.4)),
    ("Medium (clip=2.5, grid=8, sharp=0.6)", enhance(img, 2.5, (8,8), 0.6)),
    ("Fine grid (clip=2.0, grid=16, sharp=0.4)", enhance(img, 2.0, (16,16), 0.4)),
    ("Milder No Sharp (clip=2.0, grid=8, sharp=0.0)", enhance(img, 2.0, (8,8), 0.0))
]

# Create a grid image to compare them side-by-side or stacked
# Let's write text on each image
font = cv2.FONT_HERSHEY_SIMPLEX
for name, output in opts:
    # Add border and label
    cv2.putText(output, name, (10, 30), font, 0.6, (255, 255, 255), 2, cv2.LINE_AA)

# Stack them vertically or horizontally or side-by-side
# We can save them individually for easy visual analysis
for i, (name, output) in enumerate(opts):
    safe_name = name.replace(" ", "_").replace("(", "").replace(")", "").replace("=", "").replace(",", "")
    cv2.imwrite(os.path.join(output_dir, f"clahe_opt_{i}_{safe_name}.jpg"), output)

print("Finished generating comparison images in artifacts dir.")
