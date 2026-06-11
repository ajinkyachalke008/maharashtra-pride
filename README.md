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
  <img src="https://img.shields.io/badge/Neo4j-018bff?style=for-the-badge&logo=neo4j&logoColor=white" />
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

Hidden behind the "Portal Gate" is **FraudLens**, a production-ready, AI-driven financial intelligence platform. It is engineered specifically for law enforcement to transform unstructured cybercrime data (like FIRs, Bank Statements, and Images) into interactive 3D threat graphs.

### 🧠 Deep-Dive: Core Architecture & Capabilities

#### 1. Zero-Mock Graph Engine (Neo4j & NetworkX)
The platform operates on a dual-engine architecture:
*   **Production**: Native `neo4j` integration via Cypher queries for highly scalable subgraph traversals.
*   **Portable Mode**: A fully functional Python-native `networkx` engine that commits accounts as nodes and transactions as edges directly to a persisted `graph_store.json`, allowing the app to run anywhere without heavy Dockerized database containers.
*   **Dynamic Risk Scoring**: Accounts exceeding ₹100,000 in transaction volume are automatically flagged with critical risk thresholds (Risk Score: 0.9).

#### 2. Multimodal LLM Ingestion (The Dropzone)
The frontend features a drag-and-drop React component (`ingest.tsx`) that streams files to the FastAPI backend, where the `llm_extractor.py` pipeline takes over:
*   **Universal File Parsing**: Accepts PDFs (`pdfplumber`), Excel/CSV (`pandas`), Word (`python-docx`), and even Images (`png/jpg`).
*   **Vision-Language Model (Gemini 2.5 Pro)**: The backend utilizes `google/gemini-2.5-pro` via the OpenRouter API. It leverages zero-shot prompting and multimodal vision capabilities to read thousands of words of unstructured text or scan raw screenshots of bank statements to extract structured JSON arrays (Sender, Receiver, Amount, Type).
*   **Confidence Scoring**: Transactions extracted with low confidence (<0.8) are visually flagged in red on the investigator's UI for manual review.

#### 3. 3D Network Explorer & Syndication
*   **ForceGraph3D Engine**: Uses `react-force-graph-3d` and `three.js` to render extracted data natively in the browser. 
*   **Sub-Graph Traversal**: Uses `nx.ego_graph` to isolate suspected money mules up to 3 degrees of separation. High-risk entities glow red, safe nodes remain blue. Investigators can smoothly orbit suspected central actors in a 3D physical space.

#### 4. Legal Enforcement Intelligence (BNS 2023 Mapped)
The `intelligence.tsx` dashboard polls the backend every 5 seconds for live syndicate detection:
*   **Cross-Jurisdictional Mapping**: Detects "Shared Mules"—accounts with critical risk scores (>0.8) that appear across multiple independent FIR case files.
*   **Automated Charge Targeting**: Automatically tags detected syndicates with the new **Bharatiya Nyaya Sanhita (BNS) 2023** mandates, including BNS 318 (Cheating), BNS 336 (Forgery), and IT Act 66D.

#### 5. Machine Learning Latent Space (Anomaly Detection)
*   The `/ml/latent-space` endpoint projects high-risk nodes into a 2D geometric latent space using the `spring_layout` algorithm, effectively clustering accounts into Low, Medium, High, and Critical risk zones based on interaction weights and volumes. This mimics isolation forest anomaly detection for investigators.

#### 6. Section 65B Compliance Reporting
*   **Automated Court-Ready Reports**: Generates formal PDF reports (via `fpdf2`) that document the digital trail, transaction references, and chain of custody, ensuring evidence collected through the platform is admissible in Indian courts under Section 65B of the Indian Evidence Act.

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
