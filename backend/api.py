from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import networkx as nx

from database import db
from llm_extractor import parse_financial_text, extract_text_from_file

router = APIRouter()

class NodeCreate(BaseModel):
    node_id: str
    node_type: str
    properties: dict

@router.post("/ingest/node")
def ingest_node(node: NodeCreate):
    try:
        db.graph.add_node(node.node_id, type=node.node_type, **node.properties)
        db.save()
        return {"status": "success", "node": {"id": node.node_id, **node.properties}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = extract_text_from_file(content, file.filename)
        if not text.strip():
            return {"transactions": []}
            
        parsed_data = parse_financial_text(text)
        
        # Add source_file back to each transaction
        transactions = parsed_data.get("transactions", [])
        for tx in transactions:
            tx["source_file"] = file.filename
            
        return {"transactions": transactions}
    except Exception as e:
        print(f"Error in ingest_file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ParsedTransactionModel(BaseModel):
    transaction_ref: str
    timestamp: str
    amount: float
    currency: str
    direction: str
    from_account: str
    to_account: str
    transaction_type: Optional[str] = None
    upi_id: Optional[str] = None
    narration: Optional[str] = None
    source_file: str
    confidence: float

class CommitPayload(BaseModel):
    transactions: List[ParsedTransactionModel]

@router.post("/ingest/commit")
def commit_ingested_data(payload: CommitPayload):
    try:
        accounts_created = set()
        txns_created = 0
        total_amount = 0
        
        for tx in payload.transactions:
            if not tx.from_account or not tx.to_account:
                continue
                
            # Upsert nodes
            if not db.graph.has_node(tx.from_account):
                db.graph.add_node(tx.from_account, type='account', risk_score=0.1, total_volume=0)
                accounts_created.add(tx.from_account)
            if not db.graph.has_node(tx.to_account):
                db.graph.add_node(tx.to_account, type='account', risk_score=0.1, total_volume=0)
                accounts_created.add(tx.to_account)
                
            # Update volumes
            db.graph.nodes[tx.from_account]['total_volume'] = db.graph.nodes[tx.from_account].get('total_volume', 0) + tx.amount
            db.graph.nodes[tx.to_account]['total_volume'] = db.graph.nodes[tx.to_account].get('total_volume', 0) + tx.amount

            # Increase risk if volume gets high
            if db.graph.nodes[tx.from_account]['total_volume'] > 100000:
                db.graph.nodes[tx.from_account]['risk_score'] = 0.9
            if db.graph.nodes[tx.to_account]['total_volume'] > 100000:
                db.graph.nodes[tx.to_account]['risk_score'] = 0.9
                
            # Upsert edge
            db.graph.add_edge(
                tx.from_account, 
                tx.to_account, 
                tx_id=tx.transaction_ref,
                amount=tx.amount,
                timestamp=tx.timestamp,
                type=tx.transaction_type or "UNKNOWN",
                narration=tx.narration or "",
                confidence=tx.confidence,
                source_file=tx.source_file
            )
            txns_created += 1
            total_amount += tx.amount

        # Automatically create a case if multiple high risk nodes are added
        if txns_created > 0:
            new_case = {
                "id": f"CASE-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "case_number": f"INV-{len(db.cases)+1:03d}",
                "title": f"Investigation: {list(accounts_created)[0] if accounts_created else 'Unknown'}",
                "status": "investigating",
                "priority": "high" if total_amount > 500000 else "medium",
                "created_at": datetime.now().isoformat() + "Z",
                "total_amount": total_amount,
                "victim_count": len(accounts_created)
            }
            db.cases.insert(0, new_case)

        db.save()
        return {"status": "success", "accounts_created": len(accounts_created), "transactions_committed": txns_created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/graph/subgraph")
def get_subgraph(account_id: str = "", hops: int = 2):
    try:
        # If no account specified, return the whole graph (or up to a limit)
        if not account_id or not db.graph.has_node(account_id):
            sub_graph = db.graph
        else:
            sub_graph = nx.ego_graph(db.graph, account_id, radius=hops, undirected=True)

        nodes = []
        edges = []

        for node_id, data in sub_graph.nodes(data=True):
            nodes.append({
                "id": str(node_id),
                "accountNumber": str(node_id),
                "type": data.get('type', 'account'),
                "riskScore": data.get('risk_score', 0.1),
                "totalVolume": data.get('total_volume', 0),
                "transactionCount": sub_graph.degree(node_id),
                "isCentralNode": node_id == account_id,
                "centrality": {"pageRank": 0.1, "betweenness": 0.1, "degree": 1},
                "metadata": {"bankName": data.get('bank', 'Unknown')}
            })

        for u, v, k, data in sub_graph.edges(data=True, keys=True):
            edges.append({
                "id": data.get('tx_id', f"rel_{u}_{v}_{k}"),
                "source": str(u),
                "target": str(v),
                "amount": data.get('amount', 0),
                "timestamp": data.get('timestamp', ''),
                "transactionType": data.get('type', 'TRANSFER'),
                "riskFlag": "high" if data.get('amount', 0) > 100000 else "low"
            })

        return {
            "nodes": nodes,
            "edges": edges,
            "stats": {"node_count": len(nodes), "edge_count": len(edges)}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/threats")
def get_threat_telemetry():
    try:
        high_risk_count = sum(1 for _, data in db.graph.nodes(data=True) if data.get('risk_score', 0) > 0.8)
        
        return {
            "telemetry": {
                "threat_level": "CRITICAL" if high_risk_count > 5 else "ELEVATED" if high_risk_count > 0 else "NOMINAL",
                "active_cases": high_risk_count,
                "total_protected_value": sum(data.get('total_volume', 0) for _, data in db.graph.nodes(data=True))
            }
        }
    except Exception as e:
        return {
            "telemetry": {
                "threat_level": "NOMINAL",
                "active_cases": 0,
                "total_protected_value": 0
            }
        }

@router.get("/cases/")
def get_cases(status: Optional[str] = None, priority: Optional[str] = None):
    records = db.cases
    if status:
        records = [r for r in records if r.get("status") == status]
    if priority:
        records = [r for r in records if r.get("priority") == priority]
        
    return {"cases": records, "total": len(records)}

class CaseUpdate(BaseModel):
    status: str

@router.patch("/cases/{case_id}")
def update_case(case_id: str, update: CaseUpdate):
    try:
        for c in db.cases:
            if c.get("id") == case_id:
                c["status"] = update.status
                db.save()
                return {"status": "success", "case": c}
        raise HTTPException(status_code=404, detail="Case not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ws/metrics")
def get_ws_metrics():
    return {
        "active_websocket_clients": None,
        "messages_processed": None,
        "high_risk_flags": None,
        "last_processed_time": None,
        "error": "Real-time metrics stream is currently disconnected or uninitialized."
    }
