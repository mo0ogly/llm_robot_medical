#!/usr/bin/env bash
# ============================================================
#  gitlab_export.sh — Clean snapshot export to internal GitLab
#
#  Builds a provenance-scrubbed, single-commit snapshot of the
#  committed tree of `main` and (optionally) force-pushes it to
#  the (unprotected) GitLab `main`.
#
#  Scrub scope (validated with the maintainer):
#    DROP entirely — Claude Code tooling / internal dev-process:
#       .cursorrules, scripts/build_omc_plugin.py,
#       pdca/, skills/, commands/, docs/omc_fusion/
#       (+ .husky/.agents/.claude/.claude-plugin already gitignored)
#    Tier-1 scrub (ALL kept files) — tooling provenance strings:
#       Co-Authored-By: Claude, .claude/ paths, CLAUDE.md,
#       nostalgic-lamport, "For Claude:", conflict markers
#    Tier-2 scrub (non-protected files) — dev-assistant phrases:
#       "Claude Code", claude.exe, "Anthropic's official CLI"
#    KEEP — Claude as model / provider / research subject:
#       anthropic provider (model IDs bumped to current versions),
#       mitmproxy LLM-traffic lab (research, verbatim), agent model IDs
#    History : fresh single "Initial import" commit (no leak).
#    GitHub  : untouched. Read-only on this repo (git archive).
#    Auth    : token from .env.gitlab (gitignored), never echoed.
#
#  Usage:
#    scripts/gitlab_export.sh --dry-run   # build + verify, NO push
#    scripts/gitlab_export.sh --push      # build + verify + force-push
#    scripts/gitlab_export.sh --push --force-residual
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

MODE="--dry-run"; ALLOW_RESIDUAL=0
for arg in "$@"; do
  [[ -z "$arg" ]] && continue
  case "$arg" in
    --push)           MODE="--push" ;;
    --dry-run)        MODE="--dry-run" ;;
    --force-residual) ALLOW_RESIDUAL=1 ;;
    *) echo "unknown arg: $arg" >&2; exit 2 ;;
  esac
done

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; CYAN='\033[0;36m'; NC='\033[0m'
inf()  { printf "  ${CYAN}[--]${NC} %s\n" "$*"; }
ok()   { printf "  ${GREEN}[OK]${NC} %s\n" "$*"; }
warn() { printf "  ${YELLOW}[>>]${NC} %s\n" "$*"; }
err()  { printf "  ${RED}[!!]${NC} %s\n" "$*"; }

SRC_REF="main"
EXPORT_DIR="$SCRIPT_DIR/.gitlab-export"
REPORT="$SCRIPT_DIR/logs/gitlab_export_report.txt"
mkdir -p "$SCRIPT_DIR/logs"

DROP_FILES=( ".cursorrules" "scripts/gitlab_export.sh" "scripts/build_omc_plugin.py" )
DROP_PREFIXES=( "pdca" "skills" "commands" "docs/omc_fusion" )

# Kept verbatim (Claude appears as research subject) — Tier-2 skipped.
KEEP_INTACT_PREFIXES=( "scripts/mitmproxy_lab" "docs/lab_claude_mitmproxy.md" )
# Provider files: kept (Tier-2 skipped) but model IDs bumped to current versions.
PROVIDER_FILES=(
  "backend/prompts/llm_providers_config.json"
  "backend/prompts/LLM_PROVIDERS_README.md"
  "wiki/docs/providers/setup.md" "wiki/docs/providers/setup.en.md" "wiki/docs/providers/setup.pt.md"
  "backend/tests/test_llm_providers_routes.py"
  "pwnzzai_medical/docs/workshop-cloud-llm-setup.md"
  "pwnzzai_medical/tests/unit/test_provider_config.py"
  "pwnzzai_medical/tests/unit/test_lab_cloud_vuln_models.py"
)

is_protected() {  # protected from Tier-2 (keep-intact OR provider)
  local rel="$1" p
  for p in "${KEEP_INTACT_PREFIXES[@]}" "${PROVIDER_FILES[@]}"; do
    [[ "$rel" == "$p" || "$rel" == "$p"/* ]] && return 0
  done
  return 1
}

# ---- 1. Fresh export tree ----------------------------------------------------
inf "Exporting committed tree of '$SRC_REF' (read-only)..."
rm -rf "$EXPORT_DIR"; mkdir -p "$EXPORT_DIR"
git archive "$SRC_REF" | tar -x -C "$EXPORT_DIR"
ok "Tree materialised ($(find "$EXPORT_DIR" -type f | wc -l) files)"

# ---- 2. Drop tooling / dev-process files -------------------------------------
for f in "${DROP_FILES[@]}"; do
  [[ -e "$EXPORT_DIR/$f" ]] && { rm -f "$EXPORT_DIR/$f"; inf "dropped $f"; }
done
for d in "${DROP_PREFIXES[@]}"; do
  [[ -e "$EXPORT_DIR/$d" ]] && { rm -rf "${EXPORT_DIR:?}/$d"; inf "dropped $d/"; }
done
# Catch-all: remove any directory named 'pdca' wherever it sits (survives repo
# restructures like pdca/ -> docs/plans/pdca/). pdca must never reach GitLab.
find "${EXPORT_DIR:?}" -depth -type d -iname pdca -exec rm -rf {} + 2>/dev/null || true

# ---- 3. Strip tooling entries from .gitignore --------------------------------
if [[ -f "$EXPORT_DIR/.gitignore" ]]; then
  sed -i -E '/\.claude|\.husky|\.agents|AI-assistant config|Local tooling|GitLab (push credentials|clean-export)|\.env\.gitlab|\.gitlab-export|gitlab_export_report/d' \
    "$EXPORT_DIR/.gitignore"
fi

# ---- 4. Scrub ----------------------------------------------------------------
inf "Scrubbing provenance (Tier-1 all files, Tier-2 non-protected)..."
while IFS= read -r f; do
  rel="${f#"$EXPORT_DIR"/}"
  # Tier-1: tooling provenance — applied everywhere
  sed -i -E \
    -e '/Co-Authored-By.*[Cc]laude/d' -e '/Co-Authored-By.*anthropic/d' \
    -e '/nostalgic-lamport/d' -e '/^<<<<<<< /d' -e '/^>>>>>>> /d' \
    -e '/\*\*For Claude:\*\*/d' -e '/> \*\*For Claude/d' \
    -e '/Generated with .*Claude Code/d' \
    "$f"
  sed -i \
    -e 's/CLAUDE\.md/PROJECT_RULES.md/g' \
    -e 's#\.claude-plugin/#tooling-plugin/#g' \
    -e 's#\.claude/skills/#tooling/skills/#g' -e 's#\.claude/hooks/#tooling/hooks/#g' \
    -e 's#\.claude/#tooling/#g' \
    "$f"
  # Tier-2: dev-assistant phrases — skip protected (research/provider) files
  if ! is_protected "$rel"; then
    sed -i \
      -e 's/Claude Code CLI/AI coding assistant/g' \
      -e 's/Claude Code/AI assistant/g' \
      -e 's/claude\.exe/assistant-cli/g' \
      -e "s/Anthropic's official CLI for Claude/internal AI coding assistant/g" \
      -e 's#api\.anthropic\.com#api.internal-ai.local#g' \
      "$f"
  fi
done < <(grep -rIl '' "$EXPORT_DIR" 2>/dev/null || true)
ok "Scrub done"

# ---- 5. Bump provider model IDs to current versions --------------------------
inf "Bumping provider model IDs (opus-4-8 / sonnet-5)..."
for rel in "${PROVIDER_FILES[@]}"; do
  f="$EXPORT_DIR/$rel"; [[ -f "$f" ]] || continue
  sed -i -E \
    -e 's/claude-opus-4-[0-9]+/claude-opus-4-8/g' \
    -e 's/claude-sonnet-4[a-z0-9-]*/claude-sonnet-5/g' \
    -e 's/claude-3-5-sonnet[a-z0-9-]*/claude-sonnet-5/g' \
    -e 's/claude-3-opus[a-z0-9-]*/claude-opus-4-8/g' \
    "$f"
done
ok "Provider model IDs bumped"

# ---- 6. Verification ---------------------------------------------------------
inf "Verifying residual provenance..."
: > "$REPORT"
{ echo "GitLab export verification — $(date -u +%Y-%m-%dT%H:%M:%SZ)"; echo "source: $SRC_REF  mode: $MODE"; echo; } >> "$REPORT"
TIER1='Co-Authored-By.*[Cc]laude|CLAUDE\.md|(^|[^A-Za-z0-9])\.claude|nostalgic-lamport|For Claude:|build_omc_plugin'
TIER2='Claude Code|Generated with .*Claude'
SECRET_PATTERNS='glpat-[A-Za-z0-9._-]{20,}|sk-ant-[A-Za-z0-9._-]{20,}|gsk_[A-Za-z0-9]{20,}'

echo "== Residual TOOLING provenance (Tier-1, any file) ==" >> "$REPORT"
grep -rInE "$TIER1" "$EXPORT_DIR" 2>/dev/null | sed "s#$EXPORT_DIR/##" >> "$REPORT" || true
echo >> "$REPORT"; echo "== Residual dev-assistant phrases (Tier-2, non-protected) ==" >> "$REPORT"
while IFS= read -r f; do
  rel="${f#"$EXPORT_DIR"/}"; is_protected "$rel" && continue
  grep -InE "$TIER2" "$f" 2>/dev/null | sed "s#^#$rel:#" >> "$REPORT" || true
done < <(grep -rIl '' "$EXPORT_DIR" 2>/dev/null || true)

R1=$(grep -cE "$TIER1" <(sed -n '/Residual TOOLING/,/Residual dev-assistant/p' "$REPORT") || true)
R2=$(grep -cE "$TIER2" <(sed -n '/Residual dev-assistant/,$p' "$REPORT") || true)
RESIDUAL_COUNT=$((R1 + R2))

echo >> "$REPORT"; echo "== Potential SECRETS (must be zero) ==" >> "$REPORT"
SECRET_COUNT=$(grep -rInE "$SECRET_PATTERNS" "$EXPORT_DIR" 2>/dev/null | sed -E 's/(glpat-|sk-ant-|gsk_)[A-Za-z0-9._-]+/\1***REDACTED***/g' | tee -a "$REPORT" | wc -l || true)

# Hard guard: no directory named exactly 'pdca' may reach GitLab (the dev PDCA
# cycle dirs). Research content that merely mentions the PDCA method (e.g.
# audit-pdca outputs, *_PDCA3_*.md reports) is legitimate and kept.
PDCA_COUNT=$(find "$EXPORT_DIR" -type d -iname pdca 2>/dev/null | grep -v '/\.git/' | wc -l || true)
inf "pdca dirs in snapshot       : $PDCA_COUNT (must be 0)"

inf "Residual tooling (Tier-1)   : $R1"
inf "Residual phrases (Tier-2)   : $R2"
inf "Potential secret lines      : $SECRET_COUNT"

# ---- 7. Single-commit snapshot ----------------------------------------------
inf "Building fresh single-commit snapshot..."
rm -rf "$EXPORT_DIR/.git"
git -C "$EXPORT_DIR" init -q
git -C "$EXPORT_DIR" symbolic-ref HEAD refs/heads/main
git -C "$EXPORT_DIR" add -A
GIT_AUTHOR_NAME="fabrice" GIT_AUTHOR_EMAIL="fabrice.pizzi@ssi.gouv.fr" \
GIT_COMMITTER_NAME="fabrice" GIT_COMMITTER_EMAIL="fabrice.pizzi@ssi.gouv.fr" \
  git -C "$EXPORT_DIR" commit -q -m "Initial import — AEGIS Medical AI Security Lab"
ok "Snapshot commit: $(git -C "$EXPORT_DIR" rev-parse --short HEAD)"

# ---- 8. Guard + push ---------------------------------------------------------
if [[ "$SECRET_COUNT" -ne 0 ]]; then err "SECRETS detected — refusing to push. Inspect $REPORT"; exit 1; fi
if [[ "$PDCA_COUNT" -ne 0 ]]; then err "pdca paths present in snapshot — refusing to push."; exit 1; fi
if [[ "$RESIDUAL_COUNT" -ne 0 && "$ALLOW_RESIDUAL" -ne 1 ]]; then
  warn "Residual provenance ($RESIDUAL_COUNT lines). Refusing to push. Review $REPORT."
  [[ "$MODE" == "--push" ]] && exit 1
fi
if [[ "$MODE" == "--dry-run" ]]; then
  ok "DRY-RUN complete. Snapshot in .gitlab-export/ , report in $REPORT . Nothing pushed."
  exit 0
fi

[[ -f "$SCRIPT_DIR/.env.gitlab" ]] || { err ".env.gitlab missing"; exit 1; }
# shellcheck disable=SC1091
source "$SCRIPT_DIR/.env.gitlab"
: "${GITLAB_HOST:?}"; : "${GITLAB_PATH:?}"; : "${GITLAB_TOKEN:?}"
AUTH_URL="https://oauth2:${GITLAB_TOKEN}@${GITLAB_HOST}/${GITLAB_PATH}.git"
inf "Force-pushing clean snapshot to GitLab main (token hidden)..."
git -C "$EXPORT_DIR" push --force "$AUTH_URL" main 2>&1 | sed "s/${GITLAB_TOKEN}/***/g"
ok "Pushed clean snapshot to GitLab main."
