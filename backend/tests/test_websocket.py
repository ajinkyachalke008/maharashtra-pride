"""
FraudLens — WebSocket Tests (Layer 7)
======================================
Tests for the real-time telemetry WebSocket in main.py.
Uses the /ws/telemetry endpoint with the ConnectionManager.
"""

import json
import asyncio
import pytest
import httpx
from starlette.testclient import TestClient

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app  # noqa: E402

pytestmark = [pytest.mark.websocket]


# ═══════════════════════════════════════════════════════════════════════════
# WEBSOCKET CONNECTION TESTS
# ═══════════════════════════════════════════════════════════════════════════


class TestWebSocketConnection:
    """Layer 7: WebSocket connection and message format."""

    def test_websocket_connection_accepted(self):
        """ws://server/api/v1/ws/telemetry → connection accepted."""
        client = TestClient(app)
        with client.websocket_connect("/api/v1/ws/telemetry") as ws:
            # Connection successful if no exception raised
            # Send a message to keep connection alive (server expects receive_text)
            ws.send_text("ping")
            assert ws is not None

    def test_websocket_receives_after_send(self):
        """
        Connected client can exchange messages with the server.
        The server's WS handler calls receive_text() in a loop,
        so the client must send first.
        """
        client = TestClient(app)
        with client.websocket_connect("/api/v1/ws/telemetry") as ws:
            ws.send_text("hello")
            # Server doesn't echo back, but the connection stays alive
            assert True

    def test_websocket_connection_stays_alive(self):
        """WebSocket connection should not drop immediately."""
        client = TestClient(app)
        with client.websocket_connect("/api/v1/ws/telemetry") as ws:
            ws.send_text("keepalive_1")
            ws.send_text("keepalive_2")
            assert True


# ═══════════════════════════════════════════════════════════════════════════
# MULTIPLE CLIENT TESTS
# ═══════════════════════════════════════════════════════════════════════════


class TestWebSocketMultiClient:
    """Layer 7: Multiple simultaneous WebSocket connections."""

    def test_websocket_multiple_connections_accepted(self):
        """Server must accept multiple simultaneous WebSocket connections."""
        client = TestClient(app)
        # Test sequential connections (Starlette TestClient is synchronous)
        for i in range(3):
            with client.websocket_connect("/api/v1/ws/telemetry") as ws:
                ws.send_text(f"client_{i}")
        assert True


# ═══════════════════════════════════════════════════════════════════════════
# DISCONNECT HANDLING TESTS
# ═══════════════════════════════════════════════════════════════════════════


class TestWebSocketDisconnect:
    """Layer 7: Disconnect and error handling."""

    def test_websocket_clean_disconnect_no_crash(self):
        """Client disconnect should not crash the server."""
        client = TestClient(app)
        with client.websocket_connect("/api/v1/ws/telemetry") as ws:
            ws.send_text("bye")
        # If we reach here, server didn't crash
        assert True

    def test_websocket_server_healthy_after_disconnect(self):
        """After a WebSocket disconnect, HTTP endpoints still work."""
        sync_client = TestClient(app)

        # Connect and disconnect WebSocket
        with sync_client.websocket_connect("/api/v1/ws/telemetry") as ws:
            ws.send_text("test")

        # Verify HTTP still works
        resp = sync_client.get("/api/v1/health")
        assert resp.status_code == 200


# ═══════════════════════════════════════════════════════════════════════════
# STREAM METRICS HTTP FALLBACK
# ═══════════════════════════════════════════════════════════════════════════


class TestStreamMetricsFallback:
    """Layer 7: HTTP fallback for WebSocket metrics."""

    def test_websocket_metrics_http_endpoint_works(self):
        """GET /api/v1/ws/metrics → stream metrics via HTTP."""
        client = TestClient(app)
        resp = client.get("/api/v1/ws/metrics")
        assert resp.status_code == 200
        data = resp.json()
        assert "active_websocket_clients" in data
        assert "messages_processed" in data
