# Phase 4 — Low Priority — File Size Decomposition

## Context

Two backend files exceed the 800-line rule (programming.md — MANDATORY).

| File | Lines | Overage |
|------|-------|---------|
| `backend/orchestrator.py` | 1275 | +475 lines |
| `backend/server.py` | 1167 | +367 lines |

Both files pre-existed APEX 1-4. APEX added ~80 lines to orchestrator.py (run_delta0_protocol + persistence block).

## Decomposition Plan — orchestrator.py

Extract into 4 modules under `backend/`:

| Module | Content | Estimated lines |
|--------|---------|----------------|
| `audit_models.py` | MultiTurnComplianceTracker, AuditResult, AuditReport | ~230 |
| `orchestrator_metrics.py` | run_separation_score, run_delta0_protocol | ~140 |
| `orchestrator_campaigns.py` | run_formal_campaign, run_genetic_attack, run_context_infer_attack | ~200 |
| `orchestrator.py` (residual) | RedTeamOrchestrator core + run_single_attack + imports | ~700 |

## Decomposition Plan — server.py

Extract remaining inline routes to new route files:

| Route file | Routes | Estimated lines |
|-----------|--------|----------------|
| `routes/content_routes.py` | /api/content, /api/query/stream, /api/query/compare | ~350 |
| `routes/cyber_routes.py` | /api/cyber_query/stream | ~80 |
| `routes/defense_routes.py` | /api/redteam/defense/* (6 routes) | ~90 |
| `server.py` (residual) | App setup, middleware, health, analysis routes | ~650 |

## Blocking status: NOT BLOCKING

Pre-existing violations. APEX 1-4 goals achieved. Decomposition planned for cycle 2.

## Estimated effort: 2-3h (risk: import cycles between modules)
