from fastapi import APIRouter, HTTPException, UploadFile, File, Response
from pydantic import BaseModel, Field, constr, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
import networkx as nx
import uuid

from database import db
from llm_extractor import process_file_with_llm
from report_generator import generate_case_report

router = APIRouter()

class ParsedTransactionModel(BaseModel):
    transaction_ref: str = Field(..., description="Unique transaction ID")
    timestamp: str = Field(..., description="Timestamp in DD/MM/YYYY HH:MM:SS IST or ISO format")
    amount: float = Field(..., gt=0, description="Transaction amount must be > 0")
    currency: str = Field("INR", description="Currency must be INR")
    direction: str
    from_account: constr(pattern=r'^[0-9]{9,18}$') = Field(..., description="Account number must be 9-18 digits")
    to_account: constr(pattern=r'^[0-9]{9,18}$') = Field(..., description="Account number must be 9-18 digits")
    transaction_type: Optional[str] = None
    upi_id: Optional[constr(pattern=r'^[\w.-]+@[\w.-]+$')] = None
    ifsc_code: Optional[constr(pattern=r'^[A-Z]{4}0[A-Z0-9]{6}$')] = None
    narration: Optional[str] = None
    source_file: str
    confidence: float

    @field_validator('currency')
    @classmethod
    def validate_currency(cls, v: str) -> str:
        if v.upper() != "INR":
            raise ValueError("Currency must be INR")
        return v.upper()

class CommitPayload(BaseModel):
    transactions: List[ParsedTransactionModel]

@router.post("/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        parsed_data = process_file_with_llm(content, file.filename)
        
        transactions = parsed_data.get("transactions", [])
        for tx in transactions:
            tx["source_file"] = file.filename
            
        return {"transactions": transactions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest/commit")
def commit_ingested_data(payload: CommitPayload):
    try:
        txns_created = 0
        total_amount = 0
        accounts_involved = set()
        
        # Calculate case aggregates
        source_file = "Unknown Source"
        for tx in payload.transactions:
            total_amount += tx.amount
            accounts_involved.add(tx.from_account)
            accounts_involved.add(tx.to_account)
            if tx.source_file:
                source_file = tx.source_file
                
        # Phase 3 Case Auto-Generation logic
        case_id = f"CASE-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        priority = "high" if total_amount > 500000 else "medium"
        case_payload = {
            "id": case_id,
            "case_number": f"INV-{len(db.cases) + 1:03d}",
            "title": f"Investigation: {source_file}",
            "status": "investigating",
            "priority": priority,
            "created_at": datetime.now().isoformat() + "Z",
            "total_amount": total_amount,
            "victim_count": len(accounts_involved)
        }
        
        if db.engine_type == "neo4j":
            with db.get_session() as session:
                # 1. Create Case Envelope
                session.run("""
                CREATE (c:Case {
                    case_id: $case_id, case_number: $case_number, title: $title,
                    status: $status, priority: $priority, created_at: $created_at,
                    total_amount: $total_amount, victim_count: $victim_count
                })
                """, case_payload)
                
                # 2. Ingest nodes and edges
                for tx in payload.transactions:
                    query = """
                    MERGE (from:Account {account_number: $from_account})
                    ON CREATE SET from.created_at = datetime(), from.risk_score = 0.1, from.total_volume = 0
                    WITH from
                    MERGE (to:Account {account_number: $to_account})
                    ON CREATE SET to.created_at = datetime(), to.risk_score = 0.1, to.total_volume = 0
                    WITH from, to
                    MERGE (from)-[r:TRANSFERRED_TO {txn_id: $txn_id}]->(to)
                    ON CREATE SET 
                        r.amount = $amount, r.timestamp = $timestamp, r.type = $type,
                        r.narration = $narration, r.confidence = $confidence,
                        r.source_file = $source_file, r.created_at = datetime()
                    """
                    update_query = """
                    MATCH (a:Account {account_number: $acc})
                    SET a.total_volume = a.total_volume + $amount
                    WITH a WHERE a.total_volume > 100000 SET a.risk_score = 0.9
                    """
                    # Link account to case
                    link_case_query = """
                    MATCH (c:Case {case_id: $case_id})
                    MATCH (a:Account {account_number: $acc})
                    MERGE (a)-[:INVOLVED_IN]->(c)
                    """
                    session.run(query, {
                        "from_account": tx.from_account, "to_account": tx.to_account, "txn_id": tx.transaction_ref,
                        "amount": tx.amount, "timestamp": tx.timestamp, "type": tx.transaction_type or "UNKNOWN",
                        "narration": tx.narration or "", "confidence": tx.confidence, "source_file": tx.source_file
                    })
                    for acc in [tx.from_account, tx.to_account]:
                        session.run(update_query, {"acc": acc, "amount": tx.amount})
                        session.run(link_case_query, {"case_id": case_id, "acc": acc})
                        
                    txns_created += 1
        else:
            # PORTABLE NETWORKX ENGINE
            db.cases.insert(0, case_payload) # Auto-generate Case Envelope in local memory
            for tx in payload.transactions:
                for acc in [tx.from_account, tx.to_account]:
                    if not db.nx_graph.has_node(acc):
                        db.nx_graph.add_node(acc, type='account', risk_score=0.1, total_volume=0, cases=[])
                    db.nx_graph.nodes[acc]['total_volume'] += tx.amount
                    if case_id not in db.nx_graph.nodes[acc].get('cases', []):
                        db.nx_graph.nodes[acc].setdefault('cases', []).append(case_id)
                    if db.nx_graph.nodes[acc]['total_volume'] > 100000:
                        db.nx_graph.nodes[acc]['risk_score'] = 0.9
                        
                db.nx_graph.add_edge(
                    tx.from_account, tx.to_account, 
                    txn_id=tx.transaction_ref, amount=tx.amount, timestamp=tx.timestamp,
                    type=tx.transaction_type or "UNKNOWN", source_file=tx.source_file, created_at=datetime.now().isoformat()
                )
                txns_created += 1
            db.save_portable()

        return {"status": "success", "transactions_committed": txns_created, "engine": db.engine_type, "case_id": case_id}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.get("/graph/subgraph")
def get_subgraph(account_id: str = "", hops: int = 2):
    try:
        nodes = {}
        edges = []
        
        if db.engine_type == "neo4j":
            with db.get_session() as session:
                if not account_id:
                    result = session.run("MATCH (n:Account)-[r:TRANSFERRED_TO]->(m:Account) RETURN n, r, m LIMIT 100")
                else:
                    query = """
                    MATCH path = (a:Account {account_number: $account_id})-[*1..$hops]-(b)
                    UNWIND relationships(path) AS r
                    WITH DISTINCT r
                    MATCH (n)-[r]->(m)
                    RETURN n, r, m LIMIT 500
                    """
                    result = session.run(query, {"account_id": account_id, "hops": hops})
                    
                for record in result:
                    n, m, r = record["n"], record["m"], record["r"]
                    n_id, m_id = n["account_number"], m["account_number"]
                    for node, nid in [(n, n_id), (m, m_id)]:
                        if nid not in nodes:
                            nodes[nid] = {"id": nid, "accountNumber": nid, "type": "account", "riskScore": node.get("risk_score", 0.1), "totalVolume": node.get("total_volume", 0)}
                    edges.append({
                        "id": r["txn_id"], "source": n_id, "target": m_id, "amount": r.get("amount", 0),
                        "timestamp": r.get("timestamp", ""), "transactionType": r.get("type", "UNKNOWN"),
                        "riskFlag": "high" if r.get("amount", 0) > 100000 else "low"
                    })
        else:
            # PORTABLE NETWORKX ENGINE
            if not account_id or not db.nx_graph.has_node(account_id):
                sub_graph = db.nx_graph
            else:
                sub_graph = nx.ego_graph(db.nx_graph, account_id, radius=hops, undirected=True)

            for node_id, data in sub_graph.nodes(data=True):
                nodes[str(node_id)] = {
                    "id": str(node_id), "accountNumber": str(node_id), "type": "account",
                    "riskScore": data.get('risk_score', 0.1), "totalVolume": data.get('total_volume', 0)
                }

            for u, v, k, data in sub_graph.edges(data=True, keys=True):
                edges.append({
                    "id": data.get('txn_id', f"rel_{u}_{v}_{k}"), "source": str(u), "target": str(v),
                    "amount": data.get('amount', 0), "timestamp": data.get('timestamp', ''),
                    "transactionType": data.get('type', 'TRANSFER'), "riskFlag": "high" if data.get('amount', 0) > 100000 else "low"
                })

        return {
            "nodes": list(nodes.values()), "edges": edges,
            "stats": {"node_count": len(nodes), "edge_count": len(edges), "engine": db.engine_type}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/intelligence/syndicates")
def get_intelligence():
    """ Phase 2 Legal Intelligence & Syndicates """
    try:
        shared_mules = []
        syndicates_count = 0
        
        if db.engine_type == "neo4j":
            with db.get_session() as session:
                res = session.run("""
                MATCH (a:Account)-[r:TRANSFERRED_TO]-()
                WITH a, collect(DISTINCT r.source_file) as cases
                WHERE size(cases) > 1 AND a.risk_score > 0.8
                RETURN a.account_number as account, a.total_volume as volume, cases
                LIMIT 50
                """)
                for rec in res:
                    shared_mules.append({"account": rec["account"], "volume": rec["volume"], "cases": rec["cases"]})
                    syndicates_count += 1
        else:
            # PORTABLE NETWORKX ENGINE
            for node, data in db.nx_graph.nodes(data=True):
                if data.get('risk_score', 0) > 0.8:
                    edges = list(db.nx_graph.edges(node, data=True)) + list(db.nx_graph.in_edges(node, data=True))
                    cases = set()
                    for u, v, edata in edges:
                        if 'source_file' in edata:
                            cases.add(edata['source_file'])
                    if len(cases) > 1:
                        shared_mules.append({"account": str(node), "volume": data.get('total_volume', 0), "cases": list(cases)})
                        syndicates_count += 1
                        
        for mule in shared_mules:
            mule["legal_sections"] = ["BNS 318 (Cheating)", "BNS 336 (Forgery)", "IT Act 66D"]
            
        return {
            "total_syndicates_detected": syndicates_count,
            "mules": shared_mules,
            "engine": db.engine_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CaseUpdate(BaseModel):
    status: str

@router.get("/cases/")
def get_cases(status: Optional[str] = None, priority: Optional[str] = None):
    try:
        records = []
        if db.engine_type == "neo4j":
            with db.get_session() as session:
                res = session.run("MATCH (c:Case) RETURN c")
                for rec in res:
                    c = dict(rec["c"])
                    if status and c.get("status") != status: continue
                    if priority and c.get("priority") != priority: continue
                    records.append(c)
        else:
            records = db.cases
            if status:
                records = [r for r in records if r.get("status") == status]
            if priority:
                records = [r for r in records if r.get("priority") == priority]
                
        return {"cases": records, "total": len(records), "engine": db.engine_type}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/cases/{case_id}")
def update_case(case_id: str, update: CaseUpdate):
    try:
        if db.engine_type == "neo4j":
            with db.get_session() as session:
                res = session.run("""
                MATCH (c:Case {case_id: $case_id})
                SET c.status = $status
                RETURN c
                """, {"case_id": case_id, "status": update.status})
                if not res.peek():
                    raise HTTPException(status_code=404, detail="Case not found")
                return {"status": "success", "case": dict(res.single()["c"])}
        else:
            for c in db.cases:
                if c.get("id") == case_id:
                    c["status"] = update.status
                    db.save_portable()
                    return {"status": "success", "case": c}
            raise HTTPException(status_code=404, detail="Case not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cases/{case_id}/export")
def export_case_report(case_id: str):
    try:
        case_data = None
        transactions = []
        
        if db.engine_type == "neo4j":
            with db.get_session() as session:
                # Get case
                res = session.run("MATCH (c:Case {case_id: $case_id}) RETURN c", {"case_id": case_id})
                if not res.peek():
                    raise HTTPException(status_code=404, detail="Case not found")
                case_data = dict(res.single()["c"])
                
                # Get transactions for case
                res = session.run("""
                MATCH (c:Case {case_id: $case_id})<-[:INVOLVED_IN]-(a:Account)
                MATCH (a)-[r:TRANSFERRED_TO]->(b:Account)
                RETURN r.timestamp as timestamp, a.account_number as from_account, 
                       b.account_number as to_account, r.amount as amount, 
                       r.type as type, r.confidence as confidence
                """, {"case_id": case_id})
                for rec in res:
                    transactions.append(dict(rec))
        else:
            # Portable Engine
            for c in db.cases:
                if c.get("id") == case_id:
                    case_data = c
                    break
            if not case_data:
                raise HTTPException(status_code=404, detail="Case not found")
                
            # Find associated transactions
            for u, v, data in db.nx_graph.edges(data=True):
                # We simplified case linkage in portable: nodes have 'cases' list
                if (case_id in db.nx_graph.nodes[u].get('cases', []) or 
                    case_id in db.nx_graph.nodes[v].get('cases', [])):
                    transactions.append({
                        "timestamp": data.get("timestamp", ""),
                        "from_account": u,
                        "to_account": v,
                        "amount": data.get("amount", 0),
                        "type": data.get("type", "UNKNOWN"),
                        "confidence": data.get("confidence", 1.0)
                    })
                    
        # Sort transactions by timestamp roughly
        transactions.sort(key=lambda x: str(x.get("timestamp", "")))
        
        # Generate PDF bytes
        pdf_bytes = generate_case_report(case_data, transactions)
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Case_Report_{case_id}.pdf"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ml/latent-space")
def get_latent_space():
    try:
        nodes_data = []
        G = nx.Graph()
        
        if db.engine_type == "neo4j":
            with db.get_session() as session:
                res = session.run("MATCH (n:Account)-[r:TRANSFERRED_TO]->(m:Account) RETURN n, r, m LIMIT 500")
                for record in res:
                    n, m, r = record["n"], record["m"], record["r"]
                    G.add_node(n["account_number"], risk_score=n.get("risk_score", 0.1), total_volume=n.get("total_volume", 0))
                    G.add_node(m["account_number"], risk_score=m.get("risk_score", 0.1), total_volume=m.get("total_volume", 0))
                    G.add_edge(n["account_number"], m["account_number"], weight=r.get("amount", 1))
        else:
            # For portable, just use the in-memory graph
            G = db.nx_graph
            
        if len(G.nodes) == 0:
            return {"nodes": []}
            
        # If graph is too large, taking a subgraph for the latent space projection
        if len(G.nodes) > 500:
            # take nodes sorted by risk score
            sorted_nodes = sorted(G.nodes(data=True), key=lambda x: x[1].get('risk_score', 0), reverse=True)
            top_nodes = [n[0] for n in sorted_nodes[:500]]
            G = G.subgraph(top_nodes)
            
        # compute layout
        pos = nx.spring_layout(G, seed=42)
        
        for node_id, coords in pos.items():
            data = G.nodes[node_id]
            risk = data.get('risk_score', 0.1)
            vol = data.get('total_volume', 0)
            
            cluster = "Low Risk"
            if risk > 0.8: 
                cluster = "Critical Risk"
            elif risk > 0.5: 
                cluster = "High Risk"
            elif risk > 0.3:
                cluster = "Medium Risk"
            
            nodes_data.append({
                "id": str(node_id),
                "x": float(coords[0]),
                "y": float(coords[1]),
                "cluster": cluster,
                "risk_score": float(risk),
                "volume": float(vol)
            })
            
        return {"nodes": nodes_data, "engine": db.engine_type}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

