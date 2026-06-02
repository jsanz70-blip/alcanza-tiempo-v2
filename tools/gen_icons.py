from PIL import Image
import os

public = "C:/Users/jsanz/Desktop/alcanza-limpiar/public"
logo_path = os.path.join(public, "logo-original.png")

# Open the original logo
img = Image.open(logo_path)
print(f"Original size: {img.size}, mode: {img.mode}")

# Convert to RGBA if needed
if img.mode != "RGBA":
    img = img.convert("RGBA")

# Generate all sizes
ico_sizes_list = [(16, 16), (32, 32)]
png_sizes = {
    "favicon.png": 32,
    "icon-192.png": 192,
    "icon-512.png": 512,
}

# For favicon.ico, create a multi-resolution ICO
ico_imgs = []
for size in ico_sizes_list:
    resized = img.resize(size, Image.LANCZOS)
    ico_imgs.append(resized)

ico_path = os.path.join(public, "favicon.ico")
ico_imgs[0].save(ico_path, format="ICO", sizes=ico_sizes_list)
print(f"Created favicon.ico: {os.path.getsize(ico_path)} bytes")

# For PNG sizes
for name, size in png_sizes.items():
    resized = img.resize((size, size), Image.LANCZOS)
    path = os.path.join(public, name)
    resized.save(path, format="PNG")
    print(f"Created {name}: {size}x{size} = {os.path.getsize(path)} bytes")

print("Done!")
