from PIL import Image, ImageDraw
import os

public = "C:/Users/jsanz/Desktop/alcanza-limpiar/public"

# Create simple "A" letter icons as PNG fallbacks
for size, name in [(32, "favicon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Blue circle background
    margin = size * 0.08
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        fill=(27, 58, 92, 255)  # #1B3A5C
    )
    
    # "A" letter in white
    # Scale based on size
    cx, cy = size // 2, size // 2
    s = size / 64
    
    # Draw the letter A as two angled lines and one horizontal
    # Left leg (angled)
    lw = max(3, int(5 * s))
    draw.line([(cx - 12*s, cy + 15*s), (cx, cy - 14*s)], fill=(255, 255, 255, 255), width=lw)
    # Right leg (angled)
    draw.line([(cx + 12*s, cy + 15*s), (cx, cy - 14*s)], fill=(255, 255, 255, 255), width=lw)
    # Crossbar
    draw.line([(cx - 8*s, cy + 2*s), (cx + 8*s, cy + 2*s)], fill=(255, 255, 255, 255), width=max(2, int(3*s)))
    
    path = os.path.join(public, name)
    img.save(path, format="PNG")
    print(f"{name}: {size}x{size} = {os.path.getsize(path)} bytes")

# ICO from 32px version
img32 = Image.open(os.path.join(public, "favicon.png"))
ico_path = os.path.join(public, "favicon.ico")
img32.save(ico_path, format="ICO", sizes=[(32, 32)])
print(f"favicon.ico: {os.path.getsize(ico_path)} bytes")

print("Done!")
