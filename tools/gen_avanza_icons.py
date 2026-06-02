from PIL import Image
import os

public = "C:/Users/jsanz/Desktop/alcanza-limpiar/public"
img_path = os.path.join(public, "logo-avanza-real.png")

img = Image.open(img_path)
print(f"Original: {img.size}, mode: {img.mode}")

# Convert to RGBA if needed
if img.mode != "RGBA":
    img = img.convert("RGBA")

# Generate ICO
ico_sizes = [(16, 16), (32, 32)]
ico_imgs = [img.resize(s, Image.LANCZOS) for s in ico_sizes]
ico_path = os.path.join(public, "favicon.ico")
ico_imgs[0].save(ico_path, format="ICO", sizes=ico_sizes)
print(f"favicon.ico: {os.path.getsize(ico_path)} bytes")

# PNG sizes
for name, size in [("favicon.png", 32), ("icon-192.png", 192), ("icon-512.png", 512)]:
    resized = img.resize((size, size), Image.LANCZOS)
    path = os.path.join(public, name)
    resized.save(path, format="PNG")
    print(f"{name}: {size}x{size} = {os.path.getsize(path)} bytes")

print("Done!")
