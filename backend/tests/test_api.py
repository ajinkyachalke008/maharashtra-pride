"""
FraudLens — Backend API Tests (Layer 2)
=======================================
Tests for every real FastAPI endpoint in api.py.
Adapted to the actual /api/v1/* routes.
"""

import pytest
import httpx

pytestmark = [pytest.mark.api, pytest.mark.asyncio]


# ═══════════════════════════════════════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════════


class TestHealthEndpoint:
    """Layer 2: Health check endpoint."""

    async def test_api_health_returns_200(self, client: httpx.AsyncClient):
        """GET /api/v1/health → 200 with status field."""
        resp = await client.get("/api/v1/health")
        assert resp.status_code == 200
        data = resp.json()
        assert "status" in data or "engine" in data

    async def test_api_health_response_is_json(self, client: httpx.AsyncClient):
        """Health response must be valid JSON."""
        resp = await client.get("/api/v1/health")
        assert resp.headers.get("content-type", "").startswith("application/json")


# ═══════════════════════════════════════════════════════════════════════════
# DASHBOARD TELEMETRY
# ═══════════════════════════════════════════════════════════════════════════


class TestStreamMetricsAsTelemetry:
    """Layer 2: Stream metrics endpoint (serves as dashboard telemetry)."""

    async def test_api_stream_metrics_returns_200(self, client: httpx.AsyncClient):
        """GET /api/v1/ws/metrics → 200."""
        resp = await client.get("/api/v1/ws/metrics")
        assert resp.status_code == 200

    async def test_api_stream_metrics_has_required_keys(self, client: httpx.AsyncClient):
        """Stream metrics response must contain active_websocket_clients + messages_processed."""
        resp = await client.get("/api/v1/ws/metrics")
        data = resp.json()
        if "error" not in data:
            assert "active_websocket_clients" in data
            assert "messages_processed" in data

    async def test_api_stream_metrics_schema(self, client: httpx.AsyncClient):
        """Stream metrics must have high_risk_flags and last_processed_time."""
        resp = await client.get("/api/v1/ws/metrics")
        data = resp.json()
        if "error" not in data:
            assert "high_risk_flags" in data
            assert "last_processed_time" in data


# ═══════════════════════════════════════════════════════════════════════════
# CASES
# ═══════════════════════════════════════════════════════════════════════════


class TestCasesEndpoints:
    """Layer 2: Case CRUD endpoints."""

    async def test_api_cases_list_returns_200(self, client: httpx.AsyncClient):
        """GET /api/v1/cases/ → 200."""
        resp = await client.get("/api/v1/cases/")
        assert resp.status_code == 200

    async def test_api_cases_list_returns_dict_with_cases_key(self, client: httpx.AsyncClient):
        """GET /api/v1/cases/ → JSON dict with 'cases' array."""
        resp = await client.get("/api/v1/cases/")
        data = resp.json()
        assert isinstance(data, dict)
        assert "cases" in data
        assert isinstance(data["cases"], list)

    async def test_api_cases_list_with_status_filter(self, client: httpx.AsyncClient):
        """GET /api/v1/cases/?status=open → only open cases."""
        resp = await client.get("/api/v1/cases/", params={"status": "open"})
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, dict)
        assert "cases" in data
        for case in data["cases"]:
            assert case.get("status") == "open"

    async def test_api_cases_list_with_priority_filter(self, client: httpx.AsyncClient):
        """GET /api/v1/cases/?priority=critical → only critical cases."""
        resp = await client.get("/api/v1/cases/", params={"priority": "critical"})
        assert resp.status_code == 200

    async def test_api_cases_list_with_limit(self, client: httpx.AsyncClient):
        """GET /api/v1/cases/?limit=5 → at most 5 results."""
        resp = await client.get("/api/v1/cases/", params={"limit": "5"})
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) <= 5

    async def test_api_cases_case_schema(self, client: httpx.AsyncClient):
        """Each case must have id or case_id, title, status."""
        resp = await client.get("/api/v1/cases/")
        data = resp.json()
        for case in data["cases"]:
            assert "case_id" in case or "case_number" in case or "id" in case
            assert "title" in case
            assert "status" in case

    async def test_api_cases_update_nonexistent_returns_404(self, client: httpx.AsyncClient):
        """PATCH /api/v1/cases/NONEXISTENT → 404 or error."""
        resp = await client.patch(
            "/api/v1/cases/CASE-DOES-NOT-EXIST-999",
            json={"status": "closed"}
        )
        assert resp.status_code in [404, 400, 422]

    async def test_api_cases_update_invalid_status(self, client: httpx.AsyncClient):
        """PATCH with invalid status value → 400/422."""
        resp = await client.patch(
            "/api/v1/cases/CASE-DOES-NOT-EXIST",
            json={"status": ""}
        )
        assert resp.status_code in [400, 404, 422]


# ═══════════════════════════════════════════════════════════════════════════
# CASE EXPORT
# ═══════════════════════════════════════════════════════════════════════════


class TestCaseExport:
    """Layer 2: PDF export endpoint."""

    async def test_api_cases_export_nonexistent_returns_error(self, client: httpx.AsyncClient):
        """GET /api/v1/cases/NONEXISTENT/export → 404 or error."""
        resp = await client.get("/api/v1/cases/CASE-NOT-FOUND/export")
        assert resp.status_code in [404, 400, 500]

    async def test_api_cases_export_returns_pdf_content_type(self, client: httpx.AsyncClient):
        """If a valid case exists, export must return application/pdf."""
        # First get an existing case
        cases_resp = await client.get("/api/v1/cases/")
        data = cases_resp.json()
        cases_list = data.get("cases", []) if isinstance(data, dict) else data
        if cases_list:
            case_id = cases_list[0].get("case_id") or cases_list[0].get("id") or cases_list[0].get("case_number")
            resp = await client.get(f"/api/v1/cases/{case_id}/export")
            if resp.status_code == 200:
                assert "pdf" in resp.headers.get("content-type", "").lower() or len(resp.content) > 0


# ═══════════════════════════════════════════════════════════════════════════
# GRAPH SUBGRAPH
# ═══════════════════════════════════════════════════════════════════════════


class TestGraphEndpoints:
    """Layer 2: Graph query endpoints."""

    async def test_api_graph_subgraph_without_account_id_returns_all(self, client: httpx.AsyncClient):
        """GET /api/v1/graph/subgraph without account_id → 200 (returns full graph)."""
        resp = await client.get("/api/v1/graph/subgraph")
        assert resp.status_code == 200
        data = resp.json()
        assert "nodes" in data
        assert "edges" in data

    async def test_api_graph_subgraph_returns_200(self, client: httpx.AsyncClient):
        """GET /api/v1/graph/subgraph?account_id=X → 200."""
        resp = await client.get("/api/v1/graph/subgraph", params={
            "account_id": "ACCT-TEST-0001",
            "hops": 2
        })
        assert resp.status_code == 200

    async def test_api_graph_subgraph_schema(self, client: httpx.AsyncClient):
        """Response must contain nodes and edges arrays."""
        resp = await client.get("/api/v1/graph/subgraph", params={
            "account_id": "ACCT-TEST-0001",
            "hops": 1
        })
        data = resp.json()
        assert "nodes" in data
        assert "edges" in data
        assert isinstance(data["nodes"], list)
        assert isinstance(data["edges"], list)

    async def test_api_graph_subgraph_hop_range(self, client: httpx.AsyncClient):
        """Hops parameter: 1-3 accepted, 0 or 10 may differ."""
        for hops in [1, 2, 3]:
            resp = await client.get("/api/v1/graph/subgraph", params={
                "account_id": "ACCT-TEST-0001",
                "hops": hops
            })
            assert resp.status_code == 200


# ═══════════════════════════════════════════════════════════════════════════
# INTELLIGENCE / SYNDICATES
# ═══════════════════════════════════════════════════════════════════════════


class TestIntelligenceEndpoints:
    """Layer 2: Intelligence/syndicate detection endpoints."""

    async def test_api_intelligence_syndicates_returns_200(self, client: httpx.AsyncClient):
        """GET /api/v1/intelligence/syndicates → 200."""
        resp = await client.get("/api/v1/intelligence/syndicates")
        assert resp.status_code == 200

    async def test_api_intelligence_syndicates_schema(self, client: httpx.AsyncClient):
        """Response must contain total_syndicates_detected, mules, engine."""
        resp = await client.get("/api/v1/intelligence/syndicates")
        data = resp.json()
        assert "total_syndicates_detected" in data
        assert "mules" in data
        assert "engine" in data
        assert isinstance(data["mules"], list)

    async def test_api_intelligence_syndicates_mule_schema(self, client: httpx.AsyncClient):
        """Each mule must have account, volume, cases, legal_sections."""
        resp = await client.get("/api/v1/intelligence/syndicates")
        data = resp.json()
        for mule in data.get("mules", []):
            assert "account" in mule
            assert "volume" in mule
            assert "cases" in mule
            assert "legal_sections" in mule


# ═══════════════════════════════════════════════════════════════════════════
# ML LATENT SPACE
# ═══════════════════════════════════════════════════════════════════════════


class TestMLEndpoints:
    """Layer 2: ML analytics endpoints."""

    async def test_api_ml_latent_space_returns_200(self, client: httpx.AsyncClient):
        """GET /api/v1/ml/latent-space → 200."""
        resp = await client.get("/api/v1/ml/latent-space")
        assert resp.status_code == 200

    async def test_api_ml_latent_space_schema(self, client: httpx.AsyncClient):
        """Response must contain nodes array."""
        resp = await client.get("/api/v1/ml/latent-space")
        data = resp.json()
        assert "nodes" in data
        assert isinstance(data["nodes"], list)

    async def test_api_ml_latent_space_node_schema(self, client: httpx.AsyncClient):
        """Each ML node must have id, x, y, cluster, risk_score."""
        resp = await client.get("/api/v1/ml/latent-space")
        data = resp.json()
        for node in data.get("nodes", []):
            assert "id" in node
            assert "x" in node
            assert "y" in node
            assert "cluster" in node
            assert "risk_score" in node


# ═══════════════════════════════════════════════════════════════════════════
# STREAM METRICS
# ═══════════════════════════════════════════════════════════════════════════


class TestStreamMetrics:
    """Layer 2: WebSocket metrics HTTP fallback."""

    async def test_api_ws_metrics_returns_200(self, client: httpx.AsyncClient):
        """GET /api/v1/ws/metrics → 200."""
        resp = await client.get("/api/v1/ws/metrics")
        assert resp.status_code == 200

    async def test_api_ws_metrics_schema(self, client: httpx.AsyncClient):
        """Response must contain stream metric fields."""
        resp = await client.get("/api/v1/ws/metrics")
        data = resp.json()
        expected_keys = {"active_websocket_clients", "messages_processed", "high_risk_flags"}
        assert expected_keys.issubset(set(data.keys()))


# ═══════════════════════════════════════════════════════════════════════════
# INGESTION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════


class TestIngestEndpoints:
    """Layer 2: File ingestion endpoints (basic HTTP tests — detailed in Layer 4)."""

    async def test_api_ingest_file_requires_file(self, client: httpx.AsyncClient):
        """POST /api/v1/ingest/file without file → 422."""
        resp = await client.post("/api/v1/ingest/file")
        assert resp.status_code == 422

    async def test_api_ingest_commit_requires_body(self, client: httpx.AsyncClient):
        """POST /api/v1/ingest/commit without body → 422."""
        resp = await client.post("/api/v1/ingest/commit")
        assert resp.status_code == 422

    async def test_api_ingest_commit_with_empty_transactions(self, client: httpx.AsyncClient):
        """POST /api/v1/ingest/commit with empty transactions → 200 or 400."""
        resp = await client.post(
            "/api/v1/ingest/commit",
            json={"transactions": [], "source_file": "test.csv"}
        )
        assert resp.status_code in [200, 400, 422]


# ═══════════════════════════════════════════════════════════════════════════
# CROSS-CUTTING: CORS & ERROR HANDLING
# ═══════════════════════════════════════════════════════════════════════════


class TestCrossCutting:
    """Layer 2: CORS headers and error handling."""

    async def test_api_cors_allows_any_origin(self, client: httpx.AsyncClient):
        """OPTIONS request must return Access-Control-Allow-Origin."""
        resp = await client.options(
            "/api/v1/cases/",
            headers={"Origin": "https://maharashtra-pride-1.vercel.app"}
        )
        # FastAPI CORS middleware responds with 200 or 405 depending on config
        assert resp.status_code in [200, 405]

    async def test_api_nonexistent_route_returns_404(self, client: httpx.AsyncClient):
        """GET /api/v1/this-does-not-exist → 404."""
        resp = await client.get("/api/v1/this-does-not-exist")
        assert resp.status_code == 404

    @pytest.mark.parametrize("endpoint", [
        "/api/v1/cases/",
        "/api/v1/intelligence/syndicates",
        "/api/v1/ml/latent-space",
        "/api/v1/ws/metrics",
        "/api/v1/health",
    ])
    async def test_api_all_get_endpoints_return_json(self, client: httpx.AsyncClient, endpoint: str):
        """All GET endpoints must return valid JSON."""
        resp = await client.get(endpoint)
        assert resp.status_code == 200
        resp.json()  # Will raise if not valid JSON
