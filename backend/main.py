from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from datetime import datetime

from database import db, init_schema
from api import router as api_router

app = FastAPI(title="FraudLens API", version="1.0.0")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    # Attempt to connect to DB and init schema, but don't crash if neo4j isn't up yet
    try:
        db.connect()
        init_schema()
    except Exception as e:
        print(f"Warning: Could not initialize database on startup: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    db.close()

@app.get("/api/v1/health")
async def health_check():
    return {"status": "online", "database": "connected" if db.driver else "disconnected"}

@app.websocket("/api/v1/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and wait for client messages if any
            data = await websocket.receive_text()
            print(f"WS received: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# A sample endpoint to broadcast a test event
@app.post("/api/v1/ingest/test")
async def ingest_test_event():
    event = {
        "id": f"evt-{int(datetime.now().timestamp())}",
        "type": "TRANSACTION",
        "amount": 50000,
        "riskScore": 0.85,
        "timestamp": datetime.now().isoformat()
    }
    await manager.broadcast(json.dumps(event))
    return {"status": "success", "event": event}
