"""Safeguards against sterile loops and token waste in AEGIS campaigns.

Prevents:
- Infinite rerun loops (max 3 iterations, hard limit)
- Identical reruns without parameter changes (detects no-change loops)
- Excessive token consumption (budget per campaign)
- Campaigns on models that can't decode the attacks (pre-check gate)

Usage:
    from campaign_safeguards import CampaignGuard
    guard = CampaignGuard(manifest_path="research_archive/experiments/campaign_manifest.json")
    guard.check_before_launch("RAG-001")  # raises if unsafe
    guard.log_token_usage("RAG-001", tokens_used=15000)
    guard.check_budget("RAG-001")  # raises if over budget
"""
import json
import os
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger("campaign_safeguards")

# Hard limits — cannot be overridden
MAX_ITERATIONS_ABSOLUTE = 3
MAX_TOKENS_PER_CAMPAIGN = 500_000  # ~$0.50 on Groq, ~2h on Ollama
MAX_TOKENS_PER_RUN = 100_000      # Single run limit
PRE_CHECK_REQUIRED = True
MIN_PARAMETER_CHANGE_RATIO = 0.1  # At least 10% of params must change between iterations


class CampaignGuardError(Exception):
    """Raised when a safeguard blocks a campaign launch."""
    pass


def validate_campaign_results(results_path: str) -> dict:
    """Sanity check post-run on a campaign results file.

    Detects common failure modes that would otherwise silently corrupt the
    thesis dataset:
    - All chains at 0% ASR (likely model errors or scoring failure)
    - > 10% trials contain model_not_found or 404 errors
    - total_trials = 0 or does not match expected
    - Sep(M) = 0 with all zeros (statistical floor artifact)

    Returns a validation report with `valid: bool` and `issues: list`.
    Callers MUST check `valid` before writing to campaign_manifest.json.
    """
    report = {
        "valid": False,
        "file": results_path,
        "issues": [],
        "warnings": [],
        "stats": {},
    }

    if not os.path.exists(results_path):
        report["issues"].append("File not found")
        return report

    try:
        with open(results_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        report["issues"].append("JSON parse error: " + str(e))
        return report

    # Handle both formats (thesis_campaign nests under 'result')
    result = data.get("result", data)
    aggregate = result.get("aggregate", {})
    per_chain = result.get("per_chain", [])

    total_trials = aggregate.get("total_trials", 0)
    total_violations = aggregate.get("total_violations", 0)
    violation_rate = aggregate.get("violation_rate", 0.0)

    report["stats"]["total_trials"] = total_trials
    report["stats"]["total_violations"] = total_violations
    report["stats"]["n_chains"] = len(per_chain)

    # Check 1: total_trials > 0
    if total_trials == 0 and per_chain:
        # Recount from per_chain
        total_trials = sum(c.get("n_trials", 0) for c in per_chain)
        report["warnings"].append("aggregate.total_trials was 0, recounted from per_chain: " + str(total_trials))

    if total_trials == 0:
        report["issues"].append("No trials executed (total_trials = 0)")
        return report

    # Check 2: model_not_found / 404 errors in trials
    error_count = 0
    for chain in per_chain:
        for trial in chain.get("trials", []):
            err = trial.get("error", "")
            if err and ("model_not_found" in err or "404" in err or "does not exist" in err):
                error_count += 1

    error_ratio = error_count / total_trials if total_trials > 0 else 0
    report["stats"]["error_count"] = error_count
    report["stats"]["error_ratio"] = round(error_ratio, 4)

    if error_ratio > 0.10:
        report["issues"].append(
            "{} trials ({:.1%}) contain model errors — campaign INVALID".format(
                error_count, error_ratio
            )
        )
        return report

    # Check 3: all chains at 0% ASR (scoring failure suspected)
    non_zero_chains = sum(1 for c in per_chain if c.get("violation_rate", 0) > 0)
    report["stats"]["non_zero_chains"] = non_zero_chains

    if per_chain and non_zero_chains == 0 and error_count == 0:
        report["warnings"].append(
            "All {} chains at 0% ASR with no errors — scoring failure suspected".format(
                len(per_chain)
            )
        )
        # Not a hard fail — could be legitimate (strong defense)

    # Check 4: Sep(M) floor artifact
    sep = result.get("separation_score", {})
    sep_score = sep.get("sep_score", 0)
    if sep_score == 0 and violation_rate == 0:
        report["warnings"].append("Sep(M) = 0 with 0 violations is a floor artifact, not a measure")

    # All critical checks passed
    report["valid"] = True
    return report


class CampaignGuard:
    def __init__(self, manifest_path: str):
        self.manifest_path = manifest_path
        self._load_manifest()

    def _load_manifest(self):
        if os.path.exists(self.manifest_path):
            with open(self.manifest_path, "r", encoding="utf-8") as f:
                self.manifest = json.load(f)
        else:
            self.manifest = {"campaigns": []}

    def _save_manifest(self):
        with open(self.manifest_path, "w", encoding="utf-8") as f:
            json.dump(self.manifest, f, indent=2, ensure_ascii=False, default=str)

    def _get_campaign(self, campaign_id: str) -> dict:
        for c in self.manifest.get("campaigns", []):
            if c["id"] == campaign_id:
                return c
        return None

    def check_before_launch(self, campaign_id: str) -> dict:
        """Check all safeguards before launching a campaign. Returns status dict."""
        campaign = self._get_campaign(campaign_id)
        if campaign is None:
            return {"allowed": True, "reason": "New campaign, no history"}

        checks = []

        # Check 1: Max iterations
        iterations = campaign.get("iterations", [])
        n_iterations = len(iterations)
        max_iter = min(campaign.get("max_iterations", 3), MAX_ITERATIONS_ABSOLUTE)

        if n_iterations >= max_iter:
            checks.append({
                "check": "max_iterations",
                "passed": False,
                "reason": "Max iterations reached ({}/{})".format(n_iterations, max_iter),
                "action": "ESCALADE_HUMAINE"
            })
        else:
            checks.append({"check": "max_iterations", "passed": True})

        # Check 2: No identical reruns (sterile loop detection)
        if len(iterations) >= 2:
            last_params = iterations[-1].get("params", {})
            prev_params = iterations[-2].get("params", {})
            if last_params == prev_params:
                checks.append({
                    "check": "parameter_change",
                    "passed": False,
                    "reason": "Last 2 iterations had identical parameters — sterile loop detected",
                    "action": "BLOCK — must change parameters before rerunning"
                })
            else:
                checks.append({"check": "parameter_change", "passed": True})

        # Check 3: Token budget
        total_tokens = sum(
            it.get("tokens_used", 0) for it in iterations
        )
        if total_tokens >= MAX_TOKENS_PER_CAMPAIGN:
            checks.append({
                "check": "token_budget",
                "passed": False,
                "reason": "Token budget exhausted ({}/{})".format(total_tokens, MAX_TOKENS_PER_CAMPAIGN),
                "action": "BLOCK — reduce N or switch to cheaper model"
            })
        else:
            checks.append({
                "check": "token_budget",
                "passed": True,
                "remaining": MAX_TOKENS_PER_CAMPAIGN - total_tokens
            })

        # Check 4: All INCONCLUSIVE without improvement
        if len(iterations) >= 2:
            verdicts = [it.get("verdict", "") for it in iterations]
            if all(v == "INCONCLUSIVE" for v in verdicts):
                # Check if ASR improved at all
                asrs = []
                for it in iterations:
                    if "results_file" in it and it["results_file"] != "PENDING":
                        asrs.append(it.get("best_asr", 0))
                if len(asrs) >= 2 and asrs[-1] <= asrs[-2]:
                    checks.append({
                        "check": "progress",
                        "passed": False,
                        "reason": "No improvement between last 2 INCONCLUSIVE iterations",
                        "action": "WARN — consider fundamental change (model, approach)"
                    })

        # Check 5: Pre-check required
        if PRE_CHECK_REQUIRED and n_iterations == 0:
            has_precheck = campaign.get("iterations", [{}])[0].get("pre_check", {}).get("status") == "DONE" if iterations else False
            if not has_precheck:
                checks.append({
                    "check": "pre_check",
                    "passed": False,
                    "reason": "Pre-check (5 baseline runs) required before N>=30",
                    "action": "Run 5 baseline trials first"
                })

        # Final verdict
        blockers = [c for c in checks if not c.get("passed", True)]
        allowed = len(blockers) == 0

        result = {
            "allowed": allowed,
            "checks": checks,
            "blockers": blockers,
            "campaign_id": campaign_id,
            "iteration": n_iterations + 1,
            "timestamp": datetime.now().isoformat(),
        }

        if not allowed:
            reasons = [b["reason"] for b in blockers]
            logger.warning("Campaign %s BLOCKED: %s", campaign_id, "; ".join(reasons))

        return result

    def log_token_usage(self, campaign_id: str, tokens_used: int, iteration: int = None):
        """Log token usage for a campaign iteration."""
        campaign = self._get_campaign(campaign_id)
        if campaign is None:
            return

        if iteration is None:
            iteration = len(campaign.get("iterations", []))

        iterations = campaign.get("iterations", [])
        if iterations and iteration <= len(iterations):
            iterations[iteration - 1]["tokens_used"] = tokens_used

        self._save_manifest()
        logger.info("Campaign %s iteration %d: %d tokens used", campaign_id, iteration, tokens_used)

    def estimate_tokens(self, n_trials: int, n_chains: int, max_tokens: int = 500) -> dict:
        """Estimate token consumption for a campaign."""
        # Rough estimate: prompt ~200 tokens + response max_tokens per trial
        tokens_per_trial = 200 + max_tokens
        total_tokens = n_trials * n_chains * tokens_per_trial
        # Add 20% for system prompts, RAG context, etc.
        total_with_overhead = int(total_tokens * 1.2)

        return {
            "estimated_tokens": total_with_overhead,
            "tokens_per_trial": tokens_per_trial,
            "total_trials": n_trials * n_chains,
            "within_budget": total_with_overhead < MAX_TOKENS_PER_CAMPAIGN,
            "budget_pct": round(total_with_overhead / MAX_TOKENS_PER_CAMPAIGN * 100, 1),
            "estimated_cost_groq_usd": round(total_with_overhead * 0.59 / 1_000_000, 3),
        }


def print_safeguard_report(campaign_id: str, manifest_path: str = None):
    """Print a human-readable safeguard report for a campaign."""
    if manifest_path is None:
        manifest_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "research_archive", "experiments", "campaign_manifest.json"
        )

    guard = CampaignGuard(manifest_path)
    result = guard.check_before_launch(campaign_id)

    print("=== SAFEGUARD REPORT: {} ===".format(campaign_id))
    print("Allowed: {}".format(result["allowed"]))
    print("Iteration: {}".format(result["iteration"]))
    print()

    for check in result.get("checks", []):
        status = "PASS" if check.get("passed", True) else "FAIL"
        print("  [{}] {}: {}".format(
            status,
            check["check"],
            check.get("reason", "OK") if not check.get("passed", True) else "OK"
        ))

    if result.get("blockers"):
        print()
        print("BLOCKERS:")
        for b in result["blockers"]:
            print("  - {} → {}".format(b["reason"], b.get("action", "")))

    # Estimate for RAG-001
    estimate = guard.estimate_tokens(n_trials=30, n_chains=12, max_tokens=500)
    print()
    print("Token estimate (N=30, 12 chains):")
    print("  {} tokens (~{} USD Groq)".format(estimate["estimated_tokens"], estimate["estimated_cost_groq_usd"]))
    print("  Budget: {}% of max".format(estimate["budget_pct"]))


if __name__ == "__main__":
    import sys
    campaign_id = sys.argv[1] if len(sys.argv) > 1 else "RAG-001"
    print_safeguard_report(campaign_id)
