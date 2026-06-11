"""
FraudLens Test Suite — Shared Fixtures (Layer 10)
=================================================
Central conftest.py providing fixtures for ALL test layers.
Adapted to the REAL codebase: FastAPI + NetworkX portable engine + dual-DB architecture.
"""

import os
import sys
import json
import asyncio
from datetime import datetime, timedelta
from typing import AsyncGenerator, Generator

import pytest
import httpx

# ---------------------------------------------------------------------------
# Ensure backend package is importable
# ---------------------------------------------------------------------------
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from main import app  # noqa: E402  — FastAPI app instance
from database import GraphDatabase  # noqa: E402


# ═══════════════════════════════════════════════════════════════════════════
# CORE FIXTURES
# ═══════════════════════════════════════════════════════════════════════════


@pytest.fixture(scope="session")
def event_loop():
    """Create a shared event loop for the entire test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """
    httpx AsyncClient wired to the real FastAPI app.
    Scope: session — reused across all tests for speed.
    """
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
        timeout=30.0,
    ) as ac:
        yield ac


@pytest.fixture(scope="function")
async def fresh_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """
    Per-test client for tests that need isolation (e.g., auth tests).
    """
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
        timeout=30.0,
    ) as ac:
        yield ac


# ═══════════════════════════════════════════════════════════════════════════
# DATABASE FIXTURES
# ═══════════════════════════════════════════════════════════════════════════


@pytest.fixture(scope="session")
def test_db() -> Generator[GraphDatabase, None, None]:
    """
    Provides a clean GraphDatabase instance using the NetworkX portable engine.
    Forces portable mode regardless of Neo4j availability.
    """
    db = GraphDatabase()
    # Force portable mode for test isolation
    db.engine = "networkx_portable"
    db.graph_file = os.path.join(BACKEND_DIR, "tests", "fixtures", "test_graph_store.json")
    import networkx as nx
    db.G = nx.MultiDiGraph()
    yield db
    # Cleanup: remove test graph store
    if os.path.exists(db.graph_file):
        os.remove(db.graph_file)


@pytest.fixture(scope="function")
def clean_db(test_db: GraphDatabase) -> Generator[GraphDatabase, None, None]:
    """
    Per-test clean database — clears all nodes/edges before each test.
    """
    import networkx as nx
    test_db.G = nx.MultiDiGraph()
    yield test_db


# ═══════════════════════════════════════════════════════════════════════════
# SAMPLE DATA FIXTURES — Real Indian Financial Data
# ═══════════════════════════════════════════════════════════════════════════


@pytest.fixture
def sample_transaction() -> dict:
    """
    A single realistic Indian UPI transaction.
    Matches the schema expected by POST /api/v1/ingest/commit.
    """
    return {
        "transaction_ref": "TXN-20250615-001",
        "timestamp": "15/06/2025 14:32:00",
        "amount": 45000.00,
        "currency": "INR",
        "direction": "debit",
        "from_account": "ACCT-HDFC-9876543210",
        "to_account": "ACCT-SBI-1234567890",
        "transaction_type": "UPI",
        "upi_id": "rajesh.kumar@ybl",
        "narration": "Payment for services",
        "confidence": 0.92,
    }


@pytest.fixture
def sample_high_risk_transaction() -> dict:
    """
    A high-risk transaction: large amount, late night, round number.
    Should trigger risk_score >= 0.7.
    """
    return {
        "transaction_ref": "TXN-20250615-RISK-001",
        "timestamp": "15/06/2025 02:15:00",
        "amount": 500000.00,  # ₹5,00,000 — exceeds ₹1L threshold
        "currency": "INR",
        "direction": "debit",
        "from_account": "ACCT-AXIS-5555555555",
        "to_account": "ACCT-PNB-6666666666",
        "transaction_type": "NEFT",
        "upi_id": "suspect.user@paytm",
        "narration": "Investment return",
        "confidence": 0.45,
    }


@pytest.fixture
def sample_case() -> dict:
    """
    A realistic case record matching the schema in api.py.
    """
    return {
        "case_number": "PCCC-2025-0042",
        "title": "Multi-layered UPI fraud ring — Pune district",
        "status": "open",
        "priority": "critical",
        "total_amount": 1250000.00,  # ₹12.5L
        "victim_count": 7,
        "created_at": datetime.utcnow().isoformat(),
        "fir_number": "FIR/2025/PC/00342",
        "complainant": "Suresh Patil",
        "accused": "Unknown",
        "sections": ["IT Act 66D", "BNS 318(4)", "PMLA 3"],
    }


@pytest.fixture
def sample_transactions_batch() -> list:
    """
    Batch of 5 transactions for commit testing.
    Includes both low-risk and high-risk patterns.
    """
    return [
        {
            "transaction_ref": f"TXN-BATCH-{i:03d}",
            "timestamp": f"10/06/2025 {10+i}:00:00",
            "amount": amount,
            "currency": "INR",
            "direction": "debit",
            "from_account": f"{1000000000+i}",
            "to_account": f"{2000000000+i}",
            "transaction_type": "UPI",
            "upi_id": f"user{i}@sbi",
            "narration": f"Test transaction {i}",
            "confidence": 0.85,
            "source_file": "test_batch.csv",
        }
        for i, amount in enumerate([5000, 15000, 150000, 500000, 2500], start=1)
    ]


@pytest.fixture
def sample_upi_ids() -> list:
    """Valid and invalid UPI IDs for format validation testing."""
    return {
        "valid": [
            "rajesh.kumar@ybl",
            "priya123@oksbi",
            "merchant.pune@ibl",
            "9876543210@paytm",
            "shop.owner@upi",
        ],
        "invalid": [
            "nope",
            "@ybl",
            "user@",
            "user@invalid_bank_code_too_long",
            "",
            "user with spaces@sbi",
        ],
    }


@pytest.fixture
def sample_ifsc_codes() -> list:
    """Valid and invalid IFSC codes for validation testing."""
    return {
        "valid": ["SBIN0001234", "HDFC0002345", "ICIC0003456", "UTIB0004567", "PUNB0005678"],
        "invalid": ["SBI1234", "1234SBIN0", "HDFC000", "", "SBIN00012345"],  # wrong format
    }


# ═══════════════════════════════════════════════════════════════════════════
# GRAPH SEEDING FIXTURES
# ═══════════════════════════════════════════════════════════════════════════


@pytest.fixture
def seeded_graph(clean_db: GraphDatabase) -> GraphDatabase:
    """
    Seeds a graph with 10 accounts and 15 transactions forming a known
    fraud syndicate pattern for graph intelligence testing.

    Topology:
        A1 → A2 → A3 → A4 → A1  (hawala ring)
        A5 → A6, A5 → A7, A5 → A8, A5 → A9, A5 → A10  (mule hub)
        A2 → A5  (bridge between ring and mule network)
        A6 → A3  (cross-link)
        A7 → A4  (cross-link)
        A8 → A1  (cross-link)
        A9 → A10  (chain)
        A10 → A6  (cycle in mule network)
    """
    G = clean_db.G
    accounts = [f"ACCT-TEST-{i:04d}" for i in range(1, 11)]

    # Add account nodes
    for i, acct in enumerate(accounts):
        risk = 0.9 if i < 5 else 0.4  # Ring members are high-risk
        G.add_node(acct, **{
            "type": "Account",
            "account_number": acct,
            "bank": ["SBI", "HDFC", "ICICI", "Axis", "PNB", "Kotak", "Yes Bank", "IDFC", "SBI", "HDFC"][i],
            "risk_score": risk,
            "total_volume": [500000, 300000, 250000, 400000, 800000, 50000, 60000, 70000, 80000, 90000][i],
            "transaction_count": [8, 6, 5, 7, 12, 3, 3, 3, 3, 3][i],
        })

    # Add transaction edges
    edges = [
        (0, 1, 200000), (1, 2, 180000), (2, 3, 170000), (3, 0, 160000),  # Hawala ring
        (4, 5, 100000), (4, 6, 110000), (4, 7, 120000), (4, 8, 130000), (4, 9, 140000),  # Mule hub
        (1, 4, 250000),  # Bridge
        (5, 2, 50000), (6, 3, 60000), (7, 0, 70000),  # Cross-links
        (8, 9, 40000), (9, 5, 45000),  # Chain + cycle
    ]

    for src_idx, tgt_idx, amount in edges:
        G.add_edge(
            accounts[src_idx],
            accounts[tgt_idx],
            key=f"TXN-SEED-{src_idx:02d}-{tgt_idx:02d}",
            amount=amount,
            currency="INR",
            timestamp=datetime.utcnow().isoformat(),
            transaction_type="UPI",
            case_id="CASE-TEST-001",
        )

    # Add case node
    G.add_node("CASE-TEST-001", **{
        "type": "Case",
        "case_number": "PCCC-2025-TEST-001",
        "title": "Test Syndicate Ring",
        "status": "open",
        "priority": "critical",
        "total_amount": sum(e[2] for e in edges),
        "created_at": datetime.utcnow().isoformat(),
    })

    # Link accounts to case
    for acct in accounts[:5]:
        G.add_edge(acct, "CASE-TEST-001", key=f"PART_OF-{acct}", relationship="PART_OF")

    return clean_db


@pytest.fixture
def seeded_multi_case_graph(seeded_graph: GraphDatabase) -> GraphDatabase:
    """
    Extends seeded_graph with a SECOND case sharing accounts A2 and A5.
    Used to test cross-case syndicate detection.
    """
    G = seeded_graph.G

    G.add_node("CASE-TEST-002", **{
        "type": "Case",
        "case_number": "PCCC-2025-TEST-002",
        "title": "Secondary UPI Ring",
        "status": "investigating",
        "priority": "high",
        "total_amount": 350000,
        "created_at": datetime.utcnow().isoformat(),
    })

    # Shared accounts linked to second case
    for acct in ["ACCT-TEST-0002", "ACCT-TEST-0005"]:
        G.add_edge(acct, "CASE-TEST-002", key=f"PART_OF-{acct}-C2", relationship="PART_OF")
        # Add a new transaction to the second case
        G.add_edge(
            acct, f"ACCT-TEST-NEW-{acct[-4:]}",
            key=f"TXN-CASE2-{acct[-4:]}",
            amount=75000,
            currency="INR",
            timestamp=datetime.utcnow().isoformat(),
            transaction_type="UPI",
            case_id="CASE-TEST-002",
        )

    return seeded_graph


# ═══════════════════════════════════════════════════════════════════════════
# FILE FIXTURES
# ═══════════════════════════════════════════════════════════════════════════


@pytest.fixture
def fixtures_dir() -> str:
    """Path to the test fixtures directory."""
    d = os.path.join(os.path.dirname(__file__), "fixtures")
    os.makedirs(d, exist_ok=True)
    return d
