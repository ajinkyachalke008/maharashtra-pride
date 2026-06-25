import os
import urllib.parse
import re

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

effects = [
    "Cinematic Scroll Animation", "Glassmorphism Hover", "Interactive Fluid Simulation",
    "Magnetic Cursor", "Gooey Effect", "Text Scramble Effect", "Cyber Decrypt Reveal",
    "Particle Network", "Orbit Animation", "Matrix Rain Effect", "Neon Flicker Effect",
    "AI Data Visualization Animation", "Holographic Effect", "Blur-to-Focus Reveal",
    "Smooth Page Transition", "Scroll Reveal", "Cyberpunk Scanline Effect",
    "Terminal Command Animation", "Bento Grid Hover Effect", "Isometric Hover Effect",
    "WebGL Displacement Effect", "Infinite Particle Flow"
]

def get_svg_url(text, size=16, color="00FFB3"):
    encoded_text = urllib.parse.quote_plus(text)
    width = max(len(text) * 11, 150) # Approx 11px per char for size 16
    return f"https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size={size}&duration=2000&pause=1000&color={color}&center=false&vCenter=true&width={width}&lines={encoded_text}"

for eff in effects:
    # Replace **Eff**
    # Need to be careful with regex escaping
    bold_pattern = f"\\*\\*{eff}\\*\\*"
    img_tag = f'<img src="{get_svg_url(eff)}" alt="{eff}"/>'
    content = re.sub(bold_pattern, img_tag, content)
    
    # Also replace ✨ Eff if it's a bullet
    bullet_pattern = f"✨ {eff}"
    img_tag2 = f'✨ <img src="{get_svg_url(eff)}" alt="{eff}"/>'
    content = content.replace(bullet_pattern, img_tag2)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
