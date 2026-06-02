from PIL import Image, ImageDraw

# Create 192x192 icon (for favicon.png use 32x32, for icons use 192x192)
for size, name in [(32, "favicon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Blue circle
    margin = size * 0.05
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        fill=(74, 144, 226, 255)  # #4A90E2
    )
    
    # White checkmark - draw as thick lines
    # Scale based on size
    s = size / 64
    
    # Checkmark points
    p1 = (18 * s, 34 * s)
    p2 = (28 * s, 44 * s)
    p3 = (46 * s, 22 * s)
    
    # Draw the two lines of the checkmark
    line_width = max(3, int(5 * s))
    
    # Line 1: bottom-left to middle
    draw.line([p1, p2], fill=(255, 255, 255, 255), width=line_width)
    # Line 2: middle to top-right
    draw.line([p2, p3], fill=(255, 255, 255, 255), width=line_width)
    
    img.save(f"C:/Users/jsanz/Desktop/alcanza-limpiar/public/{name}")
    print(f"Created {name}: {size}x{size}")

# Also create favicon.ico (just use the 32x32 PNG as a simple ICO)
img32 = Image.open("C:/Users/jsanz/Desktop/alcanza-limpiar/public/favicon.png")
img32.save("C:/Users/jsanz/Desktop/alcanza-limpiar/public/favicon.ico", format="ICO", sizes=[(32, 32)])
print("Created favicon.ico")
