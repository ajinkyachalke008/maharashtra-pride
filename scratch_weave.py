import os

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "1. **The Grand Entry**: Framer Motion powered hero sections with dynamic typography and glassmorphism layered over deep dark themes (`#0d0d0d`).": 
    "1. **The Grand Entry**: Framer Motion powered hero sections featuring **Cinematic Scroll Animation** with dynamic typography and **Glassmorphism Hover** panels layered over deep dark themes (`#0d0d0d`).",

    "3. **Interactive Commissionerates Cloth**: A physics-simulated, interactive WebGL grid showcasing the 12 primary Police Commissionerates across the state. Users can interact with the cloth simulation via cursor tracking.":
    "3. **Interactive Commissionerates Cloth**: A physics-simulated **Interactive Fluid Simulation** and WebGL grid showcasing the 12 primary Police Commissionerates. Users interact with the cloth via a **Magnetic Cursor** and **Gooey Effect** tracking.",

    "✨ Transaction Extraction": "✨ Transaction Extraction (with **Text Scramble Effect**)",
    "✨ Contextual Intelligence": "✨ Contextual Intelligence (with **Cyber Decrypt Reveal**)",

    "react-force-graph-3d\nthree.js\nWebGL": "react-force-graph-3d\nthree.js\nWebGL\n✨ WebGL Displacement Effect\n✨ Infinite Particle Flow",
    
    "FraudLens renders criminal ecosystems as living, interactive intelligence networks.":
    "FraudLens renders criminal ecosystems as living, interactive intelligence networks leveraging a **Particle Network** and **Orbit Animation**.",

    "Automatically identifies:": "Automatically identifies (via **Matrix Rain Effect** & **Neon Flicker Effect** processing logs):",

    "The platform projects complex graph relationships into a visual risk space.":
    "The platform projects complex graph relationships into a visual risk space using **AI Data Visualization Animation** and a **Holographic Effect**.",

    "🧠 Isolation Forest Inspired Logic": "🧠 Isolation Forest Inspired Logic (with **Blur-to-Focus Reveal**)",

    "| 🎯 Command Center   | Executive intelligence dashboard                       |": 
    "| 🎯 Command Center   | Executive intelligence dashboard with **Bento Grid Hover Effect** & **Isometric Hover Effect** |",

    "| 🚨 Alerts           | Real-time WebSocket intelligence feed                  |":
    "| 🚨 Alerts           | Real-time WebSocket intelligence feed featuring **Cyberpunk Scanline Effect** & **Terminal Command Animation** |",

    "The Kanban board provides drag-and-drop operational control while maintaining live synchronization across intelligence services.":
    "The Kanban board provides drag-and-drop operational control using **Smooth Page Transition** and **Scroll Reveal** mechanics while maintaining live synchronization."
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
