# ═══════════════════════════════════════════════════════════════════════════
# FraudLens Test Suite — Makefile (Layer 10)
# ═══════════════════════════════════════════════════════════════════════════

.PHONY: test test-api test-auth test-ingestion test-graph test-ml test-ws test-legal test-fast test-coverage test-gate generate-data

# ── Run ALL tests ─────────────────────────────────────────────────────────
test:
	cd backend && python -m pytest tests/ -v --tb=short

# ── Layer-specific targets ────────────────────────────────────────────────
test-api:
	cd backend && python -m pytest tests/test_api.py -v -m api --tb=short

test-auth:
	cd backend && python -m pytest tests/test_auth.py -v -m auth --tb=short

test-ingestion:
	cd backend && python -m pytest tests/test_ingestion.py -v -m ingestion --tb=short

test-graph:
	cd backend && python -m pytest tests/test_graph.py -v -m graph --tb=short

test-ml:
	cd backend && python -m pytest tests/test_ml.py -v -m ml --tb=short

test-ws:
	cd backend && python -m pytest tests/test_websocket.py -v -m websocket --tb=short

test-legal:
	cd backend && python -m pytest tests/test_section65b.py -v -m legal --tb=short

# ── Skip slow tests (LLM calls, large file processing) ───────────────────
test-fast:
	cd backend && python -m pytest tests/ -v -m "not slow" --tb=short

# ── Pre-handover gate checks (MUST pass before government deployment) ────
test-gate:
	cd backend && python -m pytest tests/ -v -m gate --tb=long

# ── Coverage ──────────────────────────────────────────────────────────────
test-coverage:
	cd backend && python -m pytest tests/ -v --cov=. --cov-report=html --cov-report=term-missing --tb=short
	@echo "📊 Coverage report: backend/htmlcov/index.html"

# ── Generate synthetic test data ──────────────────────────────────────────
generate-data:
	cd backend && python tests/data_generator.py --transactions 1000 --cases 50 --output tests/fixtures/

# ── Frontend E2E tests ────────────────────────────────────────────────────
test-e2e:
	npx playwright test tests/e2e/ --reporter=html

test-e2e-headed:
	npx playwright test tests/e2e/ --headed --reporter=list

# ── Install test dependencies ─────────────────────────────────────────────
install-test-deps:
	pip install pytest pytest-asyncio httpx openpyxl reportlab pytest-cov websockets
	npx playwright install chromium
