import re

effects = [
    "Text Scramble Effect", "Glitch Effect", "Typewriter Effect", "Matrix Rain Effect", "Split Text Animation", 
    "Kinetic Typography", "Letter Shuffle Animation", "Character Morphing", "Decode Animation", "Hacker Text Reveal", 
    "Text Decryption Effect", "Random Character Reveal", "Liquid Distortion", "RGB Split Effect", "Parallax Scrolling", 
    "Mouse Trail Effect", "Magnetic Cursor", "Gooey Effect", "Particle Explosion", "Particle Network", 
    "Morphing Blob", "Glassmorphism Hover", "Neumorphic Interaction", "3D Tilt Effect", "Card Flip Animation", 
    "Perspective Hover", "Scroll Reveal", "Staggered Fade-In", "Infinite Marquee", "Smooth Page Transition", 
    "SVG Path Drawing", "SVG Morphing", "Noise Distortion", "Wave Distortion", "Ripple Effect", 
    "Spotlight Cursor Effect", "Shimmer Effect", "Skeleton Loading Animation", "Gradient Mesh Animation", "Aurora Background", 
    "Floating Elements", "Orbit Animation", "Pixel Dissolve", "Image Fragmentation", "Blur-to-Focus Reveal", 
    "Clip-Path Reveal", "Mask Reveal Animation", "Cyberpunk Scanline Effect", "Neon Flicker Effect", "VHS Effect", 
    "Holographic Effect", "Liquid Button Effect", "Elastic Hover Effect", "Physics-Based Spring Animation", "Infinite Zoom Effect", 
    "Bento Grid Hover Effect", "Cinematic Scroll Animation", "WebGL Displacement Effect", "Lenis Smooth Scroll Effect", "Framer Motion Layout Transition", 
    "Cursor Spotlight Effect", "Canvas Particle Field", "Infinite Grid Animation", "Isometric Hover Effect", "Mesh Gradient Animation", 
    "Noise Grain Overlay", "Text Trail Effect", "Magnetic Button Effect", "Scroll Progress Indicator", "Fold/Unfold Animation", 
    "Morphing Navigation Menu", "Radial Reveal Effect", "Infinite Rotating Ring Effect", "Starfield Animation", "Dot Matrix Reveal", 
    "Dynamic Island Expansion Effect", "Terminal Command Animation", "Cyber Decrypt Reveal", "Data Stream Animation", "Liquid Metal Effect", 
    "Frosted Glass Distortion", "Elastic Text Stretch Effect", "Variable Font Morphing", "Smoke Reveal Effect", "Ink Spread Animation", 
    "Pixel Sort Effect", "Chromatic Aberration Effect", "Warp Speed Transition", "Infinite Particle Flow", "AI Data Visualization Animation", 
    "Constellation Background Effect", "Energy Pulse Animation", "Scanline Sweep Effect", "DNA Helix Animation", "Orbital Particle System", 
    "Noise-Based Flow Field Animation", "Volumetric Light Sweep Effect", "Mesh Warp Animation", "Interactive Fluid Simulation", "Silk Background Animation", 
    "Ribbon Trail Animation", "Lava Lamp Blob Animation", "Magnetic Grid Distortion Effect"
]

# Categorize them
categories = {
    "Typography & Reveal": [],
    "Shaders & Distortion": [],
    "Physics & Particles": [],
    "Scroll & Layout": []
}

for e in effects:
    l = e.lower()
    if any(x in l for x in ["text", "type", "letter", "character", "decode", "decrypt", "font", "command"]):
        categories["Typography & Reveal"].append("✨ " + e)
    elif any(x in l for x in ["glitch", "distortion", "vhs", "aberration", "rgb", "holographic", "glass", "liquid", "blur", "noise", "mesh", "blob", "warp"]):
        categories["Shaders & Distortion"].append("🌌 " + e)
    elif any(x in l for x in ["particle", "physics", "spring", "orbit", "fluid", "magnetic", "gooey", "explosion", "network"]):
        categories["Physics & Particles"].append("⚛️ " + e)
    else:
        categories["Scroll & Layout"].append("🚀 " + e)

max_len = max(len(c) for c in categories.values())

table_md = """### ✨ Comprehensive UI/UX Animation Engine
To achieve the immersive cinematic feel and rich interactive feedback, the platform leverages over 100 distinct front-end micro-interactions, WebGL shaders, and physics-based animations:

<details>
<summary><b><kbd>CLICK TO EXPAND: View All 100+ UI/UX Effects & Animations</kbd></b></summary>
<br>

| Typography & Reveal | Shaders & Distortion | Physics & Particles | Scroll & Layout |
| :--- | :--- | :--- | :--- |
"""

for i in range(max_len):
    col1 = categories["Typography & Reveal"][i] if i < len(categories["Typography & Reveal"]) else ""
    col2 = categories["Shaders & Distortion"][i] if i < len(categories["Shaders & Distortion"]) else ""
    col3 = categories["Physics & Particles"][i] if i < len(categories["Physics & Particles"]) else ""
    col4 = categories["Scroll & Layout"][i] if i < len(categories["Scroll & Layout"]) else ""
    table_md += f"| {col1} | {col2} | {col3} | {col4} |\n"

table_md += "\n</details>\n\n---"

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Insert before Directory Structure Overview
target = "## 📁 Directory Structure Overview"
if target in content:
    content = content.replace(target, table_md + "\n\n" + target)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
