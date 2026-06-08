# Maharashtra Police Pride & FraudLens Intelligence Platform

![Maharashtra Police & FraudLens](https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Maharashtra_Police_Logo.png/220px-Maharashtra_Police_Logo.png)

A comprehensive, dual-purpose digital platform developed as an homage to the **Maharashtra Police** force and as a cutting-edge operational tool for the **Pune Police Cybercrime Cell**. This repository houses both a stunning public-facing cinematic tribute and a secure, highly advanced financial fraud intelligence dashboard.

### 🌍 Live Deployment
*   **Live Web Application (Frontend)**: [https://maharashtra-pride-1.vercel.app](https://maharashtra-pride-1.vercel.app)
*   **Live AI Engine (Backend)**: `https://backend-wine-zeta-81.vercel.app`
---

## 🌟 Part I: Maharashtra Police Pride (The Cinematic Landing)

The root application serves as a high-fidelity, scroll-driven interactive web experience honoring the history and scale of India's largest state police force.

### Key Visual & Interactive Features
*   **Immersive Scrollytelling**: Powered by Framer Motion, elements fade and slide dynamically as the user navigates the rich history.
*   **The 36 Districts & 185,000 Officers**: A narrative tribute that visually represents the sheer scale of the force defending 11.42 crore citizens.
*   **Interactive Commissionerates Cloth**: A physics-simulated, interactive grid showcasing the 12 primary Police Commissionerates across the state.
*   **Cinematic Aesthetics**: Deep dark themes `#0d0d0d`, ambient glassmorphism panels, and bespoke cursor trackers.

---

## 🛡️ Part II: FraudLens Portal (The Intelligence Application)

Hidden behind the "Portal Gate" is **FraudLens**, a production-ready, AI-driven financial intelligence platform. It is engineered to transform unstructured cybercrime data into interactive 3D threat graphs to track money mules, crypto syndicates, and organized financial fraud.

### Core Architecture & Capabilities

#### 1. Zero-Mock Data Engine (Local Graph DB)
The platform operates on a completely functional Python-native `networkx` graph engine. Instead of relying on heavy Dockerized Neo4j containers, the backend natively commits accounts as nodes and transactions as edges directly to a persisted `graph_store.json`.
*   **Dynamic Risk Scoring**: Accounts exceeding ₹100,000 in transaction volume are automatically flagged with critical risk thresholds.
*   **Sub-Graph Traversal**: The API efficiently queries multi-hop connections (`nx.ego_graph`) to isolate suspected mules.

#### 2. LLM-Powered Data Ingestion
*   **Dropzone Pipeline**: Investigators can drag-and-drop PDFs, Excel sheets, and CSVs containing unstructured bank statements or FIRs.
*   **OpenRouter & Gemini Pro**: The backend utilizes the `google/gemini-2.5-pro` LLM model via OpenRouter API. Guided by a strict `SYSTEM_PROMPT`, the AI parses thousands of words of text into structured JSON arrays of transactions (Sender, Receiver, Amount, Type).

#### 3. 3D Network Explorer
*   **ForceGraph3D Engine**: Renders extracted data natively in the browser as a 3D interactive physics-based node-link graph.
*   **Visual Threat Mapping**: High-risk entities glow red, safe nodes remain blue. The camera smoothly orbits suspected central actors (money mules).

#### 4. Automated Case Management (Kanban)
*   **Trigger Logic**: When the ML pipeline flags multiple high-risk nodes, the system automatically opens a Case.
*   **Investigator Board**: Features an interactive Kanban UI allowing officers to drag cases across statuses (e.g., *New Alert*, *Investigating*, *Closed*), hitting live `PATCH` endpoints to sync state.

#### 5. Machine Learning Telemetry
*   **Live WebSockets**: The dashboard monitors mock telemetry for theoretical models such as **FraudSAGE GNN** (Structural embeddings) and **Isolation Forests** (Anomaly detection), streaming active alerts across the UI.

---

## 🛠️ Comprehensive Technology Stack

### Frontend (React & Vite)
*   **Framework**: React 18 powered by Vite.
*   **Routing**: `@tanstack/react-router` for robust, type-safe navigation.
*   **Styling**: Tailwind CSS combined with Framer Motion for complex animations.
*   **Data Visualization**: `react-force-graph-3d` (Three.js) and `lucide-react` for iconography.
*   **State Management**: `@tanstack/react-query` for API synchronisation and custom WebSocket hooks.

### Backend (Python FastAPI)
*   **Framework**: FastAPI (Async API).
*   **Database**: NetworkX (Graph Engine) + Pydantic (Schema validation).
*   **AI Integration**: `openai` python SDK (configured for OpenRouter).
*   **Parsing Parsers**: `pdfplumber`, `python-docx`, `pandas`.

---

## 📁 Directory Structure Overview

```text
maharashtra-pride-1/
│
├── backend/                        # FastAPI Application
│   ├── api.py                      # REST Endpoints (/ingest, /cases, /graph)
│   ├── database.py                 # NetworkX Graph Logic & JSON Persistence
│   ├── llm_extractor.py            # OpenRouter AI parsing logic
│   ├── main.py                     # App entrypoint & CORS config
│   └── requirements.txt            # Python dependencies
│
├── src/                            # React Frontend
│   ├── components/                 
│   │   ├── fraudlens/              # Intelligence App Components (Kanban, 3D Graph, Sidebar)
│   │   └── ui/                     # Reusable UI primitives (Animations, Modals)
│   ├── routes/                     # TanStack File-Based Routing
│   │   ├── index.tsx               # Maharashtra Police Pride Landing Page
│   │   └── fraudlens/              # Dashboard, Cases, Map, ML, Ingest
│   ├── data/                       # Regulatory frameworks, bank branches, static content
│   ├── hooks/                      # Custom React hooks (useDashboardData, useAuth)
│   ├── styles.css                  # Global Tailwind & Custom Fonts
│   └── config.ts                   # Environment variable mappings
│
├── render.yaml                     # Infrastructure-as-Code for Backend deployment
└── package.json                    # Node dependencies
```

---

## ⚙️ Local Setup Instructions

### 1. Backend Setup
You must have **Python 3.11+** installed.
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Export your OpenRouter API Key (Required for the LLM Ingestion feature)
export OPENROUTER_API_KEY="your-api-key-here"

# Start the FastAPI Server
uvicorn main:app --host 0.0.0.0 --port 8000
```
*The backend API will now be running on `http://localhost:8000`.*

### 2. Frontend Setup
You must have **Node.js** and **npm** installed.
```bash
# Navigate to the project root
cd maharashtra-pride-1

# Install frontend dependencies
npm install

# Start the Vite Development Server
npm run dev
```
*The frontend will now be running on `http://localhost:8080` (or `http://localhost:5173`).*

---

## 🌍 Live Production Deployment

This project is currently fully deployed and hosted globally on **Vercel's Edge Network** and **Serverless Functions**.

*   **Live Web Application (Frontend)**: [https://maharashtra-pride-1.vercel.app](https://maharashtra-pride-1.vercel.app)
*   **Live AI Engine (Backend)**: `https://backend-wine-zeta-81.vercel.app`

*(Note: The backend runs as a stateless Vercel Serverless Function, so the mock graph database resets after periods of inactivity. This makes it perfect for zero-cost demonstrations!)*

---
### *सद्रक्षणाय खलनिग्रहणाय* (To protect the good and to destroy the evil)
