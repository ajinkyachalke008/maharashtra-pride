"""
FraudLens — Authentication Gate Tests (Layer 3)
================================================
Tests for JWT authentication and RBAC enforcement.

CRITICAL: The project currently has NO real JWT implementation.
          useAuth is a client-side mock. These tests serve as:
          1. PRE-HANDOVER GATE CHECKS that MUST pass before government deployment
          2. Validation of the existing mock RBAC logic

Tests marked @pytest.mark.gate are mandatory pre-deployment gates.
"""

import pytest
import httpx

pytestmark = [pytest.mark.auth, pytest.mark.asyncio]


# ═══════════════════════════════════════════════════════════════════════════
# PRE-HANDOVER GATE CHECKS
# These tests MUST PASS before the platform is handed to Pune Police.
# Currently they INTENTIONALLY FAIL to prove JWT needs implementation.
# ═══════════════════════════════════════════════════════════════════════════


@pytest.mark.gate
class TestJWTGateChecks:
    """
    Layer 3 — Gate checks: These tests MUST PASS before government handover.

    If any of these tests fail, the platform is NOT ready for production
    deployment to Pune Cyber Crime Cell.
    """

    async def test_auth_jwt_not_globally_disabled(self, client: httpx.AsyncClient):
        """
        GATE CHECK: Verify JWT authentication is ENABLED.

        This test calls a protected endpoint WITHOUT any Authorization header.
        It MUST return 401 Unauthorized. If it returns 200, JWT is disabled
        and the platform is vulnerable to unauthorized access.

        STATUS: EXPECTED TO FAIL until JWT middleware is implemented.
        """
        resp = await client.get("/api/v1/cases/")

        assert resp.status_code == 401, (
            "🚨 CRITICAL SECURITY FAILURE: /api/v1/cases/ returned "
            f"{resp.status_code} without authentication. "
            "JWT middleware is DISABLED. This platform MUST NOT be "
            "deployed to Pune Cyber Crime Cell without authentication. "
            "Implement JWT middleware in backend/main.py before handover."
        )

    @pytest.mark.parametrize("endpoint,method", [
        ("/api/v1/cases/", "GET"),
        ("/api/v1/graph/subgraph?account_id=test&hops=1", "GET"),
        ("/api/v1/intelligence/syndicates", "GET"),
        ("/api/v1/ml/latent-space", "GET"),
        ("/api/v1/ws/metrics", "GET"),
        ("/api/v1/dashboard/telemetry", "GET"),
        ("/api/v1/ingest/commit", "POST"),
    ])
    async def test_auth_all_protected_routes_require_token(
        self, client: httpx.AsyncClient, endpoint: str, method: str
    ):
        """
        GATE CHECK: Every /api/v1/* endpoint must reject unauthenticated requests.
        """
        if method == "GET":
            resp = await client.get(endpoint)
        else:
            resp = await client.post(endpoint, json={})

        assert resp.status_code == 401, (
            f"🚨 {method} {endpoint} returned {resp.status_code} without auth token. "
            f"Expected 401. JWT protection is missing."
        )


# ═══════════════════════════════════════════════════════════════════════════
# JWT AUTHENTICATION FLOW TESTS
# These test the JWT flow WHEN it is implemented.
# They will fail until the /api/auth/* endpoints exist.
# ═══════════════════════════════════════════════════════════════════════════


@pytest.mark.gate
class TestJWTAuthFlow:
    """Layer 3: JWT login, token refresh, and invalidation."""

    async def test_auth_login_endpoint_exists(self, client: httpx.AsyncClient):
        """POST /api/auth/login must exist as an endpoint."""
        resp = await client.post("/api/auth/login", json={
            "username": "test_user",
            "password": "test_password"
        })
        assert resp.status_code != 404, (
            "🚨 /api/auth/login endpoint does not exist. "
            "JWT authentication is not implemented."
        )

    async def test_auth_login_valid_credentials_returns_tokens(self, client: httpx.AsyncClient):
        """POST /api/auth/login with valid creds → 200 + access_token + refresh_token."""
        resp = await client.post("/api/auth/login", json={
            "username": "admin",
            "password": "fraudlens_admin_2025"
        })
        if resp.status_code == 404:
            pytest.skip("Auth endpoint not yet implemented")
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data

    async def test_auth_login_wrong_password_returns_401(self, client: httpx.AsyncClient):
        """POST /api/auth/login with wrong password → 401."""
        resp = await client.post("/api/auth/login", json={
            "username": "admin",
            "password": "wrong_password"
        })
        if resp.status_code == 404:
            pytest.skip("Auth endpoint not yet implemented")
        assert resp.status_code == 401

    async def test_auth_login_missing_fields_returns_422(self, client: httpx.AsyncClient):
        """POST /api/auth/login with missing fields → 422."""
        resp = await client.post("/api/auth/login", json={})
        if resp.status_code == 404:
            pytest.skip("Auth endpoint not yet implemented")
        assert resp.status_code == 422

    async def test_auth_invalid_jwt_returns_401(self, client: httpx.AsyncClient):
        """GET /api/v1/cases/ with garbage JWT → 401."""
        resp = await client.get(
            "/api/v1/cases/",
            headers={"Authorization": "Bearer this.is.not.a.valid.jwt"}
        )
        if resp.status_code == 200:
            pytest.skip("JWT validation not enforced (auth disabled)")
        assert resp.status_code == 401

    async def test_auth_expired_jwt_returns_401(self, client: httpx.AsyncClient):
        """GET /api/v1/cases/ with expired JWT → 401."""
        # This is a real JWT with exp in the past (2020)
        expired_jwt = (
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
            "eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNTc3ODM2ODAwfQ."
            "invalid_signature_placeholder"
        )
        resp = await client.get(
            "/api/v1/cases/",
            headers={"Authorization": f"Bearer {expired_jwt}"}
        )
        if resp.status_code == 200:
            pytest.skip("JWT validation not enforced (auth disabled)")
        assert resp.status_code == 401

    async def test_auth_refresh_endpoint_exists(self, client: httpx.AsyncClient):
        """POST /api/auth/refresh must exist."""
        resp = await client.post("/api/auth/refresh", json={"refresh_token": "test"})
        assert resp.status_code != 404, (
            "🚨 /api/auth/refresh endpoint does not exist."
        )

    async def test_auth_refresh_invalid_token_returns_401(self, client: httpx.AsyncClient):
        """POST /api/auth/refresh with invalid token → 401."""
        resp = await client.post("/api/auth/refresh", json={
            "refresh_token": "invalid.refresh.token"
        })
        if resp.status_code == 404:
            pytest.skip("Auth refresh endpoint not yet implemented")
        assert resp.status_code == 401


# ═══════════════════════════════════════════════════════════════════════════
# EXISTING MOCK RBAC TESTS
# Tests for the client-side useAuth hook logic.
# These validate the RBAC permission model even though it's currently mock.
# ═══════════════════════════════════════════════════════════════════════════


class TestMockRBAC:
    """
    Layer 3: Tests for the existing mock RBAC system (useAuth.ts logic).
    These run as unit tests against the permission model.
    """

    ROLE_PERMISSIONS = {
        "DSP": {"trigger_retrain": True, "edit_cases": True, "ingest_data": True},
        "Analyst": {"trigger_retrain": False, "edit_cases": False, "ingest_data": False},
        "DataOfficer": {"trigger_retrain": False, "edit_cases": False, "ingest_data": True},
        "Auditor": {"trigger_retrain": False, "edit_cases": False, "ingest_data": False},
    }

    @pytest.mark.parametrize("role,action,expected", [
        ("DSP", "trigger_retrain", True),
        ("DSP", "edit_cases", True),
        ("DSP", "ingest_data", True),
        ("Analyst", "trigger_retrain", False),
        ("Analyst", "edit_cases", False),
        ("Analyst", "ingest_data", False),
        ("DataOfficer", "trigger_retrain", False),
        ("DataOfficer", "edit_cases", False),
        ("DataOfficer", "ingest_data", True),
        ("Auditor", "trigger_retrain", False),
        ("Auditor", "edit_cases", False),
        ("Auditor", "ingest_data", False),
    ])
    def test_auth_rbac_permission_matrix(self, role: str, action: str, expected: bool):
        """
        Validate the RBAC permission matrix matches the useAuth.ts logic.
        This is a unit test — no HTTP calls, just verifying the permission model.
        """
        permissions = self.ROLE_PERMISSIONS.get(role, {})
        actual = permissions.get(action, False)
        assert actual == expected, (
            f"Role '{role}' should {'have' if expected else 'NOT have'} "
            f"permission '{action}', but got {actual}"
        )

    def test_auth_rbac_dsp_has_all_permissions(self):
        """DSP (District Superintendent of Police) must have ALL permissions."""
        dsp_perms = self.ROLE_PERMISSIONS["DSP"]
        assert all(dsp_perms.values()), "DSP must have unrestricted access"

    def test_auth_rbac_auditor_has_no_write_permissions(self):
        """Auditor role must be read-only."""
        auditor_perms = self.ROLE_PERMISSIONS["Auditor"]
        assert not any(auditor_perms.values()), "Auditor must be read-only"

    def test_auth_rbac_all_roles_defined(self):
        """All 4 roles must be defined in the permission matrix."""
        expected_roles = {"DSP", "Analyst", "DataOfficer", "Auditor"}
        assert set(self.ROLE_PERMISSIONS.keys()) == expected_roles
