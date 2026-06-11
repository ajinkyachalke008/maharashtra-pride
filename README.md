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
  <img src="https://img.shields.io/badge/OpenAI_LLM-412991?style=for-the-badge&logo=openai&logoColor=white" />
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

### 🎭 Cinematic Modules
1. **The Grand Entry**: Framer Motion powered hero sections with dynamic typography and glassmorphism layered over deep dark themes (`#0d0d0d`).
2. **The 36 Districts & 185,000 Officers**: A narrative scrollytelling experience. As the user scrolls, dynamic counters and historical timelines fade into view, explaining the scale of the force defending 11.42 crore citizens.
3. **Interactive Commissionerates Cloth**: A physics-simulated, interactive WebGL grid showcasing the 12 primary Police Commissionerates across the state. Users can interact with the cloth simulation via cursor tracking.

---

## 🛡️ Part II: FraudLens Portal (The Intelligence Application)

Hidden behind the "Portal Gate" is **FraudLens**, a production-ready, AI-driven financial intelligence platform. It is engineered specifically for law enforcement to transform unstructured cybercrime data into actionable insights.

### 🧩 1. The 13 Specialized Modules (React Frontend)
The frontend is built on `TanStack Router` and offers 13 distinct investigative dashboards:
- **`ingest.tsx` (Dropzone)**: Drag-and-drop file ingestion and LLM parsing interface.
- **`graph.tsx` (3D Network)**: The 3D webGL visualization of the criminal syndicate graph.
- **`intelligence.tsx` (Legal Intelligence)**: BNS 2023 cross-jurisdictional threat mapper.
- **`ml.tsx` (Latent Space)**: Visual clustering of anomalies using Isolation Forests logic.
- **`cases.tsx` (Kanban Board)**: Drag-and-drop case management board.
- **`reports.tsx` (Section 65B)**: One-click court-admissible PDF generation.
- **`alerts.tsx` (Live Triggers)**: Real-time WebSocket event feed for flagged transactions.
- **`entities.tsx` (Account Registry)**: Tabular view of all tracked bank accounts and risk scores.
- **`map.tsx` (Geospatial Analysis)**: MapLibre integration to track IP/transaction geolocations.
- **`osint.tsx` (Open Source Intel)**: Dark web and public registry scraping interfaces.
- **`patterns.tsx` (Typology Detection)**: Identifies smurfing, layering, and round-tripping patterns.
- **`watchlist.tsx` (Hotlist)**: Manually flagged high-risk accounts and UPI IDs.
- **`index.tsx` (Command Center)**: The global executive dashboard summarizing all active metrics.

### 🧠 2. Deep-Dive: Core Architecture & Capabilities

#### 🏢 Dual Graph Engine Architecture (Neo4j & NetworkX)
The platform operates on a robust dual-engine architecture:
*   **Production Engine**: Native `neo4j` integration. Uses Cypher queries (`MATCH path = (a)-[*1..3]-(b)`) for highly scalable, multi-hop subgraph traversals.
*   **Portable Zero-Mock Engine**: A fully functional Python-native `networkx` engine. It commits accounts as nodes and transactions as edges directly to a persisted `graph_store.json`. This allows the application to run anywhere completely standalone, without requiring heavy Dockerized database containers.
*   **Dynamic Risk Scoring**: Accounts exceeding ₹100,000 in total transaction volume are automatically flagged with critical risk thresholds (Risk Score: 0.9).

#### 🤖 Multimodal AI Ingestion Pipeline
The `llm_extractor.py` service handles the heavy lifting of raw police evidence:
*   **Universal File Parsing**: Accepts unstructured text from PDFs (`pdfplumber`), Excel/CSVs (`pandas`), and Word Documents (`python-docx`).
*   **Vision-Language Model (Gemini 2.5 Pro)**: The backend utilizes `google/gemini-2.5-pro` via the OpenRouter API. It leverages zero-shot prompting and multimodal vision capabilities to read screenshots of bank statements or WhatsApp chat logs, extracting structured JSON arrays (Sender, Receiver, Amount, Narration, Type).
*   **Confidence Scoring**: Transactions extracted by the LLM are given a confidence score. Anything `<0.8` is visually flagged in red on the investigator's UI for manual human verification before committing to the graph.

#### 🕸️ 3D Threat Network Explorer
*   **ForceGraph3D Engine**: Uses `react-force-graph-3d` and `three.js` to render the extracted financial data natively in the browser as an interactive physics-based node-link graph.
*   **Sub-Graph Traversal**: Uses `nx.ego_graph` (in portable mode) to isolate suspected money mules up to 3 degrees of separation from a central suspect. High-risk entities glow neon red, while safe nodes remain blue. Investigators can right-click nodes or smoothly orbit suspected actors in a 3D physical space.

#### ⚖️ Legal Enforcement Intelligence (BNS 2023)
The `intelligence.tsx` dashboard polls the backend (`/api/v1/intelligence/syndicates`) every 5 seconds for live syndicate detection:
*   **Cross-Jurisdictional Mapping**: Automatically detects "Shared Mules"—accounts with critical risk scores (>0.8) that appear across multiple independent, unconnected FIR case files.
*   **Automated Charge Targeting**: Automatically tags detected syndicates with the new **Bharatiya Nyaya Sanhita (BNS) 2023** mandates. For example, linking them to BNS 318 (Cheating), BNS 336 (Forgery), and IT Act 66D for cyber fraud.

#### 📡 Machine Learning Latent Space (Anomaly Detection)
*   The `/ml/latent-space` endpoint projects the high-dimensional node data into a 2D geometric latent space using the `spring_layout` algorithm. 
*   This effectively clusters accounts into Low, Medium, High, and Critical risk zones based on interaction weights and transaction volumes, mimicking Isolation Forest anomaly detection models for investigators.

#### 🗄️ Automated Case Management (Kanban)
*   **Trigger Logic**: When the ML pipeline flags multiple high-risk nodes in a single upload, the system automatically opens a new Case envelope.
*   **Investigator Board**: Features a drag-and-drop Kanban UI allowing officers to move cases across statuses (*New Alert*, *Investigating*, *Closed*), hitting live API endpoints to sync state automatically.

#### 📜 Section 65B Compliance Reporting
*   **Automated Court-Ready Reports**: The `/cases/{case_id}/export` API generates formal PDF reports (via `fpdf2`). These reports document the digital trail, timestamped transaction references, and chain of custody. This ensures evidence collected through the platform is formatted to be admissible in Indian courts under Section 65B of the Indian Evidence Act.

---

## 🛠️ Complete Technology Stack

### Frontend Client
- **Framework**: React 19, Vite, TypeScript
- **Routing**: TanStack Router (`@tanstack/react-router`)
- **State & Data**: Zustand, TanStack Query (`@tanstack/react-query`), Axios
- **Styling & UI**: Tailwind CSS v4, Radix UI Primitives, Lucide React
- **Animations**: Framer Motion, GSAP, Tw-animate-css
- **Visualizations**: `react-force-graph-3d`, `three.js`, `@deck.gl`, `recharts`

### Backend API
- **Framework**: Python FastAPI, Uvicorn Server
- **Graph Engines**: NetworkX (Portable), Neo4j (Production)
- **AI Integration**: OpenAI SDK, OpenRouter API (`google/gemini-2.5-pro`)
- **Data Parsing**: `pdfplumber`, `pandas`, `python-docx`
- **PDF Generation**: `fpdf2`

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
