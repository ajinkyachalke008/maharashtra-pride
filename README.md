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
- 🎬 **Immersive Scrollytelling**: Powered by Framer Motion, elements fade and slide dynamically to create a cinematic narrative experience as the user scrolls.
- 🛡️ **The 36 Districts & 185,000 Officers**: A detailed narrative tribute visually representing the scale of the force defending 11.42 crore citizens, complete with dynamic counters and historical timelines.
- 🗺️ **Interactive Commissionerates Cloth**: A stunning WebGL physics-simulated, interactive grid showcasing the 12 primary Police Commissionerates across the state.
- 🌌 **Cinematic Aesthetics**: Deep dark themes (`#0d0d0d`), ambient glassmorphism panels, specialized typography, and bespoke cursor trackers to ensure maximum user engagement.

---

## 🛡️ Part II: FraudLens Portal (The Intelligence Application)

Hidden behind the "Portal Gate" is **FraudLens**, a production-ready, AI-driven financial intelligence platform. It is engineered specifically for law enforcement to transform unstructured cybercrime data (like FIRs and Bank Statements) into interactive 3D threat graphs.

### 🧠 Core Architecture & Capabilities

#### 1. Zero-Mock Data Engine (Local Graph DB)
The platform operates on a functional Python-native `networkx` graph engine. Instead of relying on heavy Dockerized databases, the backend natively commits accounts as nodes and transactions as edges directly to a persisted `graph_store.json`.
*   **Dynamic Risk Scoring**: Accounts exceeding ₹100,000 in transaction volume are automatically flagged with critical risk thresholds.
*   **Sub-Graph Traversal**: The API efficiently queries multi-hop connections (`nx.ego_graph`) to isolate suspected money mules up to 3 degrees of separation.

#### 2. LLM-Powered Data Ingestion (The Dropzone)
Investigators often deal with raw, unstructured evidence. FraudLens solves this with an AI data extraction pipeline:
*   **File Parsing**: Accepts PDFs, Excel sheets, and CSVs (via `pdfplumber` and `pandas`).
*   **OpenRouter & Gemini 2.5 Pro**: The backend utilizes an advanced LLM model to read thousands of words of text (such as FIR complaints) and extract structured JSON arrays of transactions (Sender, Receiver, Amount, Type) using zero-shot prompting.

#### 3. 3D Network Explorer & Syndication
*   **ForceGraph3D Engine**: Uses `react-force-graph-3d` and `three.js` to render extracted data natively in the browser as an interactive physics-based node-link graph.
*   **Visual Threat Mapping**: High-risk entities glow red, safe nodes remain blue. Investigators can right-click nodes to view transaction history or smoothly orbit suspected central actors.

#### 4. Automated Case Management (Kanban)
*   **Trigger Logic**: When the ML pipeline flags multiple high-risk nodes, the system automatically opens a Case.
*   **Investigator Board**: Features a drag-and-drop Kanban UI allowing officers to move cases across statuses (e.g., *New Alert*, *Investigating*, *Closed*), hitting live API endpoints to sync state.

#### 5. Section 65B Compliance Reporting
*   **Automated Court-Ready Reports**: Generates formal PDF reports (via `fpdf2`) that document the digital trail and chain of custody, ensuring evidence collected through the platform is admissible in Indian courts under Section 65B of the Evidence Act.

#### 6. Machine Learning Telemetry
*   **Live WebSockets**: The dashboard monitors telemetry for theoretical models such as **FraudSAGE GNN** (Structural embeddings) and **Isolation Forests** (Anomaly detection), streaming active alerts across the UI in real-time.

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
