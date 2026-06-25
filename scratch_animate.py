import os
import urllib.parse
import re

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

# First, strip out the `[Effect]` tags I added previously.
content = re.sub(r' `\[.*?\]`', '', content)

def get_svg_url(text, size=24, color="00E5FF"):
    encoded_text = urllib.parse.quote_plus(text.strip())
    # Herokuapp typing SVG with some cool styling
    return f"https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size={size}&duration=2000&pause=1000&color={color}&center=false&vCenter=true&width=800&lines={encoded_text}"

headers_to_animate = [
    ("# 🌌", "Behind The Portal Gate", 28, "00FFB3"),
    ("# ⚡", "13 Specialized Intelligence Modules", 28, "00E5FF"),
    ("# 🏢", "Dual Graph Intelligence Architecture", 28, "7C3AED"),
    ("## 🌐", "Neo4j Production Engine", 22, "018bff"),
    ("## 🐍", "Portable NetworkX Engine", 22, "FFD62E"),
    ("## 🚨", "Dynamic Risk Intelligence", 22, "FF5252"),
    ("# 🤖", "Multimodal AI Evidence Pipeline", 28, "00E5FF"),
    ("# 🌌", "3D Threat Network Explorer", 28, "FFB300"),
    ("# ⚖️", "BNS 2023 Legal Intelligence Engine", 28, "10B981"),
    ("# 📡", "Machine Learning Intelligence Layer", 28, "00FFB3"),
    ("# 📂", "Automated Case Management", 28, "38B2AC"),
    ("# 📜", "Section 65B Compliance Engine", 28, "7C3AED"),
    ("# 🛠️", "Technology Stack", 28, "00E5FF"),
    ("# 🚀", "MISSION", 32, "FFB300")
]

for prefix, text, size, color in headers_to_animate:
    # Look for the exact line to replace
    old_line = f"{prefix} {text}"
    img_url = get_svg_url(text, size, color)
    new_line = f"{prefix} <img src=\"{img_url}\"/>"
    content = content.replace(old_line, new_line)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
