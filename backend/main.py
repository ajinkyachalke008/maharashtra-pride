from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from datetime import datetime, timezone, timedelta

from database import db, init_schema
from api import router as api_router

app = FastAPI(title="FraudLens API v4.0", version="4.0.0")

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
            except Exception:
                pass

manager = ConnectionManager()

# Background task for exactly 1.0s telemetry tick
async def telemetry_streamer():
    IST = timezone(timedelta(hours=5, minutes=30))
    while True:
        await asyncio.sleep(1.0)
        
        # Only query if there are listeners to save resources
        if not manager.active_connections:
            continue
            
        try:
            now_ist = datetime.now(IST)
            start_of_day = now_ist.replace(hour=0, minute=0, second=0, microsecond=0)
            
            txns_scanned_today = 0
            active_threat_flags = 0
            
            # Fetch real live data from active engine
            if db.engine_type == "neo4j":
                with db.get_session() as session:
                    res_txns = session.run("MATCH (t)-[r:TRANSFERRED_TO]->(m) WHERE r.created_at >= $sod RETURN count(r) as c", {"sod": start_of_day.isoformat()})
                    if res_txns.peek(): txns_scanned_today = res_txns.single()["c"]
                    
                    res_threats = session.run("MATCH (a:Account) WHERE a.risk_score > 0.8 RETURN count(a) as c")
                    if res_threats.peek(): active_threat_flags = res_threats.single()["c"]
            else:
                # PORTABLE NETWORKX ENGINE
                txns_scanned_today = sum(1 for u, v, k, d in db.nx_graph.edges(data=True, keys=True) if d.get('created_at', '') >= start_of_day.isoformat())
                active_threat_flags = sum(1 for n, d in db.nx_graph.nodes(data=True) if d.get('risk_score', 0) > 0.8)

            payload = {
                "timestamp_ist": now_ist.strftime("%d/%m/%Y %H:%M:%S IST"),
                "txns_scanned_today": txns_scanned_today,
                "active_threat_flags": active_threat_flags,
                "fraud_threshold": 0.85,
                "neo4j_status": f"CONNECTED ({db.engine_type.upper()})"
            }
            
            await manager.broadcast(json.dumps(payload))
            
        except Exception as e:
            # Fallback for DB failure
            now_ist = datetime.now(IST)
            payload = {
                "timestamp_ist": now_ist.strftime("%d/%m/%Y %H:%M:%S IST"),
                "txns_scanned_today": 0,
                "active_threat_flags": 0,
                "fraud_threshold": 0.85,
                "neo4j_status": "DISCONNECTED",
                "error": str(e)
            }
            await manager.broadcast(json.dumps(payload))


@app.on_event("startup")
async def startup_event():
    # Connect DB and Init Schema
    try:
        db.connect()
        init_schema()
    except Exception as e:
        print(f"Warning: Could not initialize database on startup: {e}")
        
    # Start telemetry loop
    asyncio.create_task(telemetry_streamer())

@app.on_event("shutdown")
async def shutdown_event():
    db.close()

@app.get("/api/v1/health")
async def health_check():
    return {"status": "online", "database": "connected" if db.driver else "disconnected"}

@app.get("/api/v1/ws/metrics")
async def get_stream_metrics():
    try:
        IST = timezone(timedelta(hours=5, minutes=30))
        now_ist = datetime.now(IST)
        start_of_day = now_ist.replace(hour=0, minute=0, second=0, microsecond=0)
        
        txns_scanned_today = 0
        active_threat_flags = 0
        
        if db.engine_type == "neo4j":
            with db.get_session() as session:
                res_txns = session.run("MATCH (t)-[r:TRANSFERRED_TO]->(m) WHERE r.created_at >= $sod RETURN count(r) as c", {"sod": start_of_day.isoformat()})
                if res_txns.peek(): txns_scanned_today = res_txns.single()["c"]
                
                res_threats = session.run("MATCH (a:Account) WHERE a.risk_score > 0.8 RETURN count(a) as c")
                if res_threats.peek(): active_threat_flags = res_threats.single()["c"]
        else:
            txns_scanned_today = sum(1 for u, v, k, d in db.nx_graph.edges(data=True, keys=True) if d.get('created_at', '') >= start_of_day.isoformat())
            active_threat_flags = sum(1 for n, d in db.nx_graph.nodes(data=True) if d.get('risk_score', 0) > 0.8)

        return {
            "active_websocket_clients": len(manager.active_connections),
            "messages_processed": txns_scanned_today,
            "high_risk_flags": active_threat_flags,
            "last_processed_time": now_ist.isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.websocket("/api/v1/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
