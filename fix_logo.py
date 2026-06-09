from PIL import Image

# Open the downloaded logo
img = Image.open('public/maharashtra_police_logo.png')

# Convert to RGBA if not already
img = img.convert("RGBA")

# Create a new white background image of the same size
background = Image.new('RGBA', img.size, (255, 255, 255, 255))

# Paste the image on the background using its alpha channel as mask
background.paste(img, (0, 0), img)

# Save the final image (can save as PNG to keep the format, even though it's opaque now)
background.save('public/maharashtra_police_logo.png', 'PNG')
print("White background added successfully.")
