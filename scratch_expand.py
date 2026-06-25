import os

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will just replace the whole `<details>...` block with the newly formatted lists
start_marker = "<details>"
end_marker = "</details>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    details_block = content[start_idx:end_idx]
    
    # I already have the lists categorized from previous script.
    # Let me just recreate the categorized lists here:
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

    cat_typography = []
    cat_shaders = []
    cat_physics = []
    cat_scroll = []

    for e in effects:
        l = e.lower()
        if any(x in l for x in ["text", "type", "letter", "character", "decode", "decrypt", "font", "command"]):
            cat_typography.append(f"- ✨ {e}")
        elif any(x in l for x in ["glitch", "distortion", "vhs", "aberration", "rgb", "holographic", "glass", "liquid", "blur", "noise", "mesh", "blob", "warp"]):
            cat_shaders.append(f"- 🌌 {e}")
        elif any(x in l for x in ["particle", "physics", "spring", "orbit", "fluid", "magnetic", "gooey", "explosion", "network"]):
            cat_physics.append(f"- ⚛️ {e}")
        else:
            cat_scroll.append(f"- 🚀 {e}")

    expanded_content = ""
    
    expanded_content += "#### ✨ Typography & Reveal\n"
    expanded_content += "\n".join(cat_typography) + "\n\n"
    
    expanded_content += "#### 🌌 Shaders & Distortion\n"
    expanded_content += "\n".join(cat_shaders) + "\n\n"

    expanded_content += "#### ⚛️ Physics & Particles\n"
    expanded_content += "\n".join(cat_physics) + "\n\n"

    expanded_content += "#### 🚀 Scroll & Layout\n"
    expanded_content += "\n".join(cat_scroll) + "\n"

    new_content = content[:start_idx] + expanded_content + content[end_idx:]
    
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("done")
