import os

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "# 🌌 Behind The Portal Gate": "# 🌌 Behind The Portal Gate `[Cinematic Scroll Animation]`",
    "# ⚡ 13 Specialized Intelligence Modules": "# ⚡ 13 Specialized Intelligence Modules `[Bento Grid Hover Effect]`",
    "# 🏢 Dual Graph Intelligence Architecture": "# 🏢 Dual Graph Intelligence Architecture `[Infinite Grid Animation]`",
    "## 🌐 Neo4j Production Engine": "## 🌐 Neo4j Production Engine `[Data Stream Animation]`",
    "## 🐍 Portable NetworkX Engine": "## 🐍 Portable NetworkX Engine `[Terminal Command Animation]`",
    "## 🚨 Dynamic Risk Intelligence": "## 🚨 Dynamic Risk Intelligence `[Neon Flicker Effect]`",
    "# 🤖 Multimodal AI Evidence Pipeline": "# 🤖 Multimodal AI Evidence Pipeline `[Cyber Decrypt Reveal]`",
    "### Supported Evidence Sources": "### Supported Evidence Sources `[Staggered Fade-In]`",
    "### AI Processing Engine": "### AI Processing Engine `[Matrix Rain Effect]`",
    "## 🎯 Human Verification Layer": "## 🎯 Human Verification Layer `[Glassmorphism Hover]`",
    "# 🌌 3D Threat Network Explorer": "# 🌌 3D Threat Network Explorer `[WebGL Displacement Effect]`",
    "### Visual Threat Classification": "### Visual Threat Classification `[Chromatic Aberration Effect]`",
    "### Investigator Capabilities": "### Investigator Capabilities `[Orbit Animation]`",
    "# ⚖️ BNS 2023 Legal Intelligence Engine": "# ⚖️ BNS 2023 Legal Intelligence Engine `[Holographic Effect]`",
    "### Shared Mule Detection": "### Shared Mule Detection `[Noise Distortion]`",
    "### Automated Charge Recommendations": "### Automated Charge Recommendations `[Split Text Animation]`",
    "# 📡 Machine Learning Intelligence Layer": "# 📡 Machine Learning Intelligence Layer `[AI Data Visualization Animation]`",
    "### Detection Capabilities": "### Detection Capabilities `[Blur-to-Focus Reveal]`",
    "# 📂 Automated Case Management": "# 📂 Automated Case Management `[Smooth Page Transition]`",
    "# 📜 Section 65B Compliance Engine": "# 📜 Section 65B Compliance Engine `[Scroll Reveal]`",
    "### Generated Evidence Packages": "### Generated Evidence Packages `[Fold/Unfold Animation]`",
    "# 🛠️ Technology Stack": "# 🛠️ Technology Stack `[Neumorphic Interaction]`",
    "## 📁 Directory Structure Overview": "## 📁 Directory Structure Overview `[Text Trail Effect]`",
    "## ⚙️ Local Setup Instructions": "## ⚙️ Local Setup Instructions `[Typewriter Effect]`",
    "# 🚀 MISSION": "# 🚀 MISSION `[Infinite Zoom Effect]`"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
