import sys
import os

# Add backend directory to python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from database import db

def seed_case_study():
    session = db.get_session()
    print("Starting database seed for 'Golden Profit Investment Scam' Case Study...")

    transactions = [
        {"source": "ACC-VICTIM-01", "target": "ACC-MULE-101", "amount": 50000, "timestamp": "2026-06-01T09:15:00Z", "type": "IMPS", "ref": "TXN-001", "narration": "Initial investment deposit - Golden Profit", "risk_flag": "low"},
        {"source": "ACC-VICTIM-01", "target": "ACC-MULE-101", "amount": 150000, "timestamp": "2026-06-02T11:30:00Z", "type": "IMPS", "ref": "TXN-002", "narration": "VIP tier upgrade fee", "risk_flag": "medium"},
        {"source": "ACC-MULE-101", "target": "ACC-MULE-102", "amount": 190000, "timestamp": "2026-06-02T14:45:00Z", "type": "RTGS", "ref": "TXN-003", "narration": "Fund consolidation", "risk_flag": "high"},
        {"source": "ACC-MULE-101", "target": "ACC-BINANCE-99", "amount": 10000, "timestamp": "2026-06-02T15:00:00Z", "type": "UPI", "ref": "TXN-004", "narration": "Crypto purchase P2P", "risk_flag": "high"},
        {"source": "ACC-VICTIM-02", "target": "ACC-MULE-102", "amount": 85000, "timestamp": "2026-06-03T10:10:00Z", "type": "NEFT", "ref": "TXN-005", "narration": "Golden Profit onboarding", "risk_flag": "medium"},
        {"source": "ACC-MULE-102", "target": "ACC-MULE-103", "amount": 270000, "timestamp": "2026-06-03T16:20:00Z", "type": "RTGS", "ref": "TXN-006", "narration": "Layering transfer", "risk_flag": "high"},
        {"source": "ACC-MULE-103", "target": "ACC-BINANCE-99", "amount": 265000, "timestamp": "2026-06-04T09:05:00Z", "type": "IMPS", "ref": "TXN-007", "narration": "USDT Exchange settlement", "risk_flag": "high"},
        {"source": "ACC-VICTIM-03", "target": "ACC-MULE-101", "amount": 200000, "timestamp": "2026-06-05T12:00:00Z", "type": "RTGS", "ref": "TXN-008", "narration": "High yield return deposit", "risk_flag": "medium"},
        {"source": "ACC-MULE-101", "target": "ACC-MULE-103", "amount": 195000, "timestamp": "2026-06-05T14:30:00Z", "type": "IMPS", "ref": "TXN-009", "narration": "Internal pooling", "risk_flag": "high"},
        {"source": "ACC-MULE-103", "target": "ACC-BINANCE-99", "amount": 190000, "timestamp": "2026-06-06T11:15:00Z", "type": "RTGS", "ref": "TXN-010", "narration": "Crypto purchase P2P", "risk_flag": "high"}
    ]

    try:
        # Define node characteristics
        for tx in transactions:
            # Upsert Source
            is_victim = 'VICTIM' in tx['source']
            is_exchange = 'BINANCE' in tx['source']
            source_type = 'victim' if is_victim else 'relay' if not is_exchange else 'exchange'
            source_risk = 0.1 if is_victim else 0.9 if not is_exchange else 0.5
            
            # Upsert Target
            is_victim_t = 'VICTIM' in tx['target']
            is_exchange_t = 'BINANCE' in tx['target']
            target_type = 'suspect' if is_exchange_t else 'relay' if not is_victim_t else 'victim'
            target_risk = 0.1 if is_victim_t else 0.9 if not is_exchange_t else 0.8

            query = """
            MERGE (a:Account {id: $source})
            SET a.type = $source_type, a.risk_score = $source_risk
            MERGE (b:Account {id: $target})
            SET b.type = $target_type, b.risk_score = $target_risk
            MERGE (a)-[r:TRANSACTED_WITH {tx_id: $tx_ref}]->(b)
            SET r.amount = $amount, r.timestamp = $timestamp, r.type = $type, 
                r.narration = $narration, r.riskFlag = $risk_flag
            """
            session.run(query, 
                source=tx['source'], source_type=source_type, source_risk=source_risk,
                target=tx['target'], target_type=target_type, target_risk=target_risk,
                tx_ref=tx['ref'], amount=tx['amount'], timestamp=tx['timestamp'],
                type=tx['type'], narration=tx['narration'], risk_flag=tx['risk_flag']
            )
            print(f"Inserted: {tx['source']} -> {tx['amount']} -> {tx['target']}")
            
        print("✅ Case Study Data Successfully Seeded into Neo4j!")
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed_case_study()
