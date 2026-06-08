# Maharashtra Police Pride & FraudLens Platform

Welcome to the **Maharashtra Police Pride & FraudLens Platform**. This project is a dual-purpose application designed for the Pune Police Cybercrime Cell and the broader Maharashtra Police force. 

It serves as both a cinematic tribute to the history and pride of the force, and a highly sophisticated, real-time financial cybercrime intelligence tool.

## 🌟 The Experience

### 1. Maharashtra Police Pride (Landing)
A scroll-driven, cinematic web experience honoring the legacy of India's largest state police force. 
*   **Scale**: Honors 185,000+ officers across 36 districts.
*   **Aesthetics**: Glassmorphism, deep dark themes, and rich typography.
*   **Interactive Cloth**: Features a dynamic, physics-based grid showcasing the 12 Commissionerates.

### 2. FraudLens Portal (Intelligence Platform)
A secure portal gate leads into the core intelligence application, which transforms unstructured financial documents into interactive 3D threat graphs to track money mules and syndicates.

## 🚀 Key Features

*   **Zero-Mock Data Engine**: Powered by an entirely local, Python-native `networkx` graph database. It processes real data instantly without requiring Docker containers.
*   **LLM Ingestion Pipeline**: Drag and drop unstructured PDFs, Word docs, or CSVs. The backend utilizes `OpenRouter` (Gemini 2.5 Pro) to extract structured financial transactions automatically.
*   **3D Network Explorer**: An interactive, node-link ForceGraph3D visualization that maps transactions and highlights high-risk "cash out" nodes automatically.
*   **Automated Kanban Cases**: When high-volume syndicates are detected, the system automatically opens an investigation in the interactive Case Explorer.
*   **Live ML Telemetry**: Dashboards tracking theoretical GNN and Isolation Forest anomaly models via WebSocket streams.

## 🛠️ Technology Stack

*   **Frontend**: React 18, Vite, TailwindCSS, Framer Motion, `@tanstack/react-router`, Lucide Icons.
*   **Backend**: Python 3.11, FastAPI, NetworkX.
*   **AI/ML**: OpenRouter API (`google/gemini-2.5-pro`) for data extraction.
*   **Cloud Ready**: Fully configured for Vercel (Frontend) and Render (Backend) deployments.

## ⚙️ How to Run Locally

### 1. Start the Backend (Graph Engine)
You need Python 3.11+ installed.
```bash
cd backend
pip install -r requirements.txt

# Set your LLM API Key (Required for Data Ingestion)
export OPENROUTER_API_KEY="your_api_key_here"

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend
```bash
# In the root directory
npm install
npm run dev
```

Visit `http://localhost:8080/` (or the port specified by Vite) to view the application!

## 🔐 Deployment
This repository is configured with `render.yaml` and dynamic `VITE_API_URL` variables. 
1. Push the code to GitHub.
2. Deploy the `backend/` folder to Render as a Web Service.
3. Deploy the root folder to Vercel and set `VITE_API_URL` to your Render backend URL.

---
*सद्रक्षणाय खलनिग्रहणाय* (To protect the good and to destroy the evil)
