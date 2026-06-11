import os

def create_svg(filename, content, height):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="{height}" style="background-color: #0d1117; font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight: bold; border-radius: 8px;">
  <!-- Window Controls -->
  <rect width="100%" height="35" fill="#161b22" rx="8" />
  <circle cx="20" cy="18" r="6" fill="#ff5f56" />
  <circle cx="40" cy="18" r="6" fill="#ffbd2e" />
  <circle cx="60" cy="18" r="6" fill="#27c93f" />

  {content}
</svg>"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(svg)

# --- Tree SVG ---
tree_content = """
  <!-- Prompt 1 -->
  <!-- Blue background for path -->
  <rect x="20" y="55" width="310" height="24" fill="#1f6feb" rx="3" />
  <text x="30" y="72" fill="#ffffff">🍎 📂 .../maharashtra-pride</text>
  
  <!-- Green background for branch -->
  <rect x="330" y="55" width="210" height="24" fill="#238636" rx="3" />
  <text x="340" y="72" fill="#ffffff">🐙 ⎇ main ✔ v1.0.0</text>

  <!-- Command -->
  <text x="20" y="105" fill="#58a6ff">↳</text>
  <text x="40" y="105" fill="#e3b341">colorls -1</text>

  <!-- Tree -->
  <text x="20" y="145" fill="#3fb950">📂 backend/</text>
  <text x="45" y="170" fill="#3fb950">🐍 api.py</text>
  <text x="45" y="195" fill="#3fb950">🐍 database.py</text>
  <text x="45" y="220" fill="#3fb950">🐍 llm_extractor.py</text>
  <text x="45" y="245" fill="#3fb950">🐍 main.py</text>
  <text x="45" y="270" fill="#58a6ff">📜 requirements.txt</text>

  <text x="20" y="310" fill="#3fb950">📂 src/</text>
  <text x="45" y="335" fill="#3fb950">📂 components/</text>
  <text x="45" y="360" fill="#3fb950">📂 routes/</text>
  <text x="45" y="385" fill="#3fb950">📂 hooks/</text>
  <text x="45" y="410" fill="#58a6ff">🎨 styles.css</text>
  <text x="45" y="435" fill="#58a6ff">⚙️ config.ts</text>

  <text x="20" y="475" fill="#58a6ff">🐳 docker-compose.yml</text>
  <text x="20" y="500" fill="#58a6ff">📦 package.json</text>
  <text x="20" y="525" fill="#58a6ff">📜 render.yaml</text>
"""
create_svg('c:/Users/HP/Desktop/new 1/maharashtra-pride-1/public/terminal_tree.svg', tree_content, 560)


# --- Setup SVG ---
setup_content = """
  <!-- Prompt 1 -->
  <rect x="20" y="55" width="220" height="24" fill="#1f6feb" rx="3" />
  <text x="30" y="72" fill="#ffffff">🍎 📂 .../backend</text>
  
  <rect x="240" y="55" width="210" height="24" fill="#238636" rx="3" />
  <text x="250" y="72" fill="#ffffff">🐙 ⎇ main ✔ v1.0.0</text>

  <!-- Command -->
  <text x="20" y="105" fill="#58a6ff">↳</text>
  <text x="40" y="105" fill="#e3b341">python -m uvicorn main:app --reload</text>

  <!-- Logs -->
  <text x="20" y="145" fill="#3fb950">INFO:</text>
  <text x="75" y="145" fill="#c9d1d9">Will watch for changes in these directories: ['/backend']</text>
  
  <text x="20" y="170" fill="#3fb950">INFO:</text>
  <text x="75" y="170" fill="#c9d1d9">Uvicorn running on </text>
  <text x="250" y="170" fill="#58a6ff">http://127.0.0.0:8000</text>
  
  <text x="20" y="195" fill="#3fb950">INFO:</text>
  <text x="75" y="195" fill="#c9d1d9">Started reloader process [12345] using WatchFiles</text>

  <text x="20" y="220" fill="#3fb950">INFO:</text>
  <text x="75" y="220" fill="#c9d1d9">Application startup complete.</text>
"""
create_svg('c:/Users/HP/Desktop/new 1/maharashtra-pride-1/public/terminal_setup.svg', setup_content, 260)


# --- Update README.md ---
readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace ANSI sections with SVG images
import re

# Remove the ANSI blocks completely
# We will use string replacement or regex
new_readme = """<p align="center">
  <img src="public/maharashtra_police_logo.png" alt="Maharashtra Police Logo" width="150" />
  <br />
  <strong style="color: #3b82f6; font-size: 1.3em;">सद्रक्षणाय खलनिग्रहणाय</strong>
</p>

<h1 align="center">
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Inter&weight=800&size=30&pause=1000&color=000000&center=true&vCenter=true&width=800&lines=Maharashtra+Police+Pride;FraudLens+Intelligence+Platform;AI-Driven+Cybercrime+Investigation" alt="Typing SVG" /></a>
</h1>

<p align="center">
  <em>सद्रक्षणाय खलनिग्रहणाय (To protect the good and to destroy the evil)</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
</p>

<br/>

A comprehensive, dual-purpose digital platform developed as an homage to the **Maharashtra Police** force and as a cutting-edge operational tool for the **Pune Police Cybercrime Cell**. This repository houses both a stunning public-facing cinematic tribute and a secure, highly advanced financial fraud intelligence dashboard.

<div align="center">
  
### 🌍 Live Deployment
[![Live App](https://img.shields.io/badge/Live_Web_Application-maharashtra--pride--1.vercel.app-000000?style=for-the-badge&logo=vercel)](https://maharashtra-pride-1.vercel.app)
[![API Status](https://img.shields.io/badge/Backend_API-Online-10B981?style=for-the-badge&logo=fastapi)](https://backend-wine-zeta-81.vercel.app)

</div>

---

## 🌟 Part I: Maharashtra Police Pride (The Cinematic Landing)

The root application serves as a high-fidelity, scroll-driven interactive web experience honoring the history and scale of India's largest state police force.

### ✨ Key Visual & Interactive Features
- 🎬 **Immersive Scrollytelling**: Powered by Framer Motion, elements fade and slide dynamically.
- 🛡️ **The 36 Districts & 185,000 Officers**: A narrative tribute visually representing the scale of the force.
- 🗺️ **Interactive Commissionerates Cloth**: A physics-simulated, interactive grid showcasing the 12 primary Police Commissionerates.
- 🌌 **Cinematic Aesthetics**: Deep dark themes (`#0d0d0d`), ambient glassmorphism panels, and bespoke cursor trackers.

---

## 🛡️ Part II: FraudLens Portal (The Intelligence Application)

Hidden behind the "Portal Gate" is **FraudLens**, a production-ready, AI-driven financial intelligence platform. It is engineered to transform unstructured cybercrime data into interactive 3D threat graphs.

### 🧠 Core Architecture & Capabilities
*   **Zero-Mock Data Engine**: Python-native `networkx` graph engine committing natively to a local `graph_store.json`.
*   **LLM-Powered Data Ingestion**: Uses OpenRouter API to parse drag-and-dropped PDFs/CSVs into structured transaction arrays.
*   **3D Network Explorer**: `ForceGraph3D` Engine tracking money mules and crypto syndicates via visually glowing high-risk nodes.
*   **Automated Case Management**: Live Kanban board with reactive triggers for suspicious thresholds.

---

## 📁 Directory Structure Overview

<p align="center">
  <img src="public/terminal_tree.svg" alt="Directory Structure" width="100%" />
</p>

---

## ⚙️ Local Setup Instructions

<p align="center">
  <img src="public/terminal_setup.svg" alt="Setup Instructions" width="100%" />
</p>

### 1. Backend Setup
With `python` (v3.11+) installed:

```sh
cd backend
pip install -r requirements.txt
export OPENROUTER_API_KEY="your-api-key-here"
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
With `npm` installed:

```sh
npm install
npm run dev
```

---
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=150&section=footer" />
</p>
"""

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(new_readme)

print("SVGs created and README updated.")
