<p align="center">
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

*With `-1` (or) `--oneline` : Shows entries one per line*

```ansi
[44;30m  📁 .../ajinkyachalke008/maharashtra-pride [0m[43;30m 🐙 ⎇ main ✔ v1.0.0 [0m
↳ [33mcolorls -1[0m

  [36m📁 backend/[0m
    [32m🐍 api.py[0m
    [32m🐍 database.py[0m
    [32m🐍 llm_extractor.py[0m
    [32m🐍 main.py[0m
    [32m📜 requirements.txt[0m
  
  [36m📁 src/[0m
    [36m📂 components/[0m                  
      [36m📂 fraudlens/[0m
      [36m📂 ui/[0m
    [36m📂 routes/[0m
      [32m⚛️ index.tsx[0m
      [36m📂 fraudlens/[0m
    [36m📂 data/[0m
    [36m📂 hooks/[0m
    [32m🎨 styles.css[0m
    [32m⚙️ config.ts[0m
  
  [32m🐳 docker-compose.yml[0m
  [32m📦 package.json[0m
  [32m📜 render.yaml[0m
```

---

## ⚙️ Local Setup Instructions

*With `-d` (or) `--dirs` : Shows only directories*

```ansi
[44;30m  📁 .../backend [0m[43;30m 🐙 ⎇ main ✔ v1.0.0 [0m
↳ [33mpython -m uvicorn main:app --reload[0m

[32mINFO[0m:     Will watch for changes in these directories: ['/backend']
[32mINFO[0m:     Uvicorn running on [36mhttp://127.0.0.0:8000[0m (Press CTRL+C to quit)
[32mINFO[0m:     Started reloader process [12345] using WatchFiles
[32mINFO[0m:     Started server process [12347]
[32mINFO[0m:     Waiting for application startup.
[32mINFO[0m:     Application startup complete.
```

---
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=150&section=footer" />
</p>
