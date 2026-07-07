#!/usr/bin/env bash
# ============================================================
#  AEGIS Lab -- Process Manager (v3)
#
#  Manage all AEGIS services:
#    - Backend  (FastAPI  :8042)
#    - Frontend (Vite     :5173)
#    - Wiki     (MkDocs   :8001) -- build_wiki.py + mkdocs serve
#    - Forge    (Genetic engine, on-demand)
#    - Demo     (Triple convergence / red team runner)
#
#  CLI  : ./aegis.sh <command> [target]
#  Menu : ./aegis.sh
#
#  Commands : start | stop | restart | health | build | test
#             forge | demo | kill-port | logs | open
#             push [message] | env | pages
#  Targets  : all | backend | frontend | wiki
#  Demo     : ./aegis.sh demo             (triple convergence)
#             ./aegis.sh demo redteam      (autonomous red team)
#  Build    : ./aegis.sh build wiki        (build_wiki.py + mkdocs)
#  Push     : ./aegis.sh push "feat: ..." (commit + push to main)
# ============================================================

set -euo pipefail

# ── Config ───────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
WIKI_DIR="$SCRIPT_DIR/wiki"
LOG_DIR="$SCRIPT_DIR/logs"
BACKEND_PORT=8042
FRONTEND_PORT=5173
WIKI_PORT=8001
PAGES_URL="https://mo0ogly.github.io/llm_robot_medical/"

mkdir -p "$LOG_DIR"

# ── Colors ───────────────────────────────────────────────────
RED='\033[0;31m';  GREEN='\033[0;32m'; YELLOW='\033[0;33m'
CYAN='\033[0;36m'; GRAY='\033[0;90m';  BOLD='\033[1m'; NC='\033[0m'

ok()   { printf "  ${GREEN}[OK]${NC} %s\n" "$*"; }
err()  { printf "  ${RED}[!!]${NC} %s\n" "$*"; }
inf()  { printf "  ${CYAN}[--]${NC} %s\n" "$*"; }
warn() { printf "  ${YELLOW}[>>]${NC} %s\n" "$*"; }

# ── Groq / env helpers ───────────────────────────────────────
get_groq_status() {
    local env_file="$BACKEND_DIR/.env"
    if [[ ! -f "$env_file" ]]; then
        echo "NOT SET (no .env)"
        return
    fi
    local key
    key=$(grep -E '^GROQ_API_KEY=' "$env_file" | cut -d= -f2- | tr -d '"'"'" | tr -d '[:space:]')
    if [[ -z "$key" ]]; then
        echo "NOT SET"
    elif [[ "${key:0:4}" != "gsk_" ]]; then
        echo "INVALID (expected gsk_ prefix)"
    else
        local masked="${key:0:8}...${key: -4}"
        echo "SET ($masked)"
    fi
}

get_active_model() {
    local env_file="$BACKEND_DIR/.env"
    if [[ ! -f "$env_file" ]]; then
        echo "unknown"
        return
    fi
    local model
    model=$(grep -E '^MEDICAL_MODEL=' "$env_file" | cut -d= -f2- | tr -d '"'"'" | tr -d '[:space:]')
    if [[ -z "$model" ]]; then
        echo "llama-3.3-70b-versatile (default)"
    else
        echo "$model"
    fi
}

# ── Banner ───────────────────────────────────────────────────
banner() {
    local groq_status model_name
    groq_status=$(get_groq_status)
    model_name=$(get_active_model)

    echo ""
    printf "${CYAN}  +================================================+${NC}\n"
    printf "${CYAN}  |   AEGIS Lab -- Process Manager  (v3)           |${NC}\n"
    printf "${CYAN}  |   Backend :%-5s | Frontend :%-5s | Wiki :%-5s|${NC}\n" "$BACKEND_PORT" "$FRONTEND_PORT" "$WIKI_PORT"
    printf "${CYAN}  |   Groq : %-38s |${NC}\n" "$groq_status"
    printf "${CYAN}  |   Model: %-38s |${NC}\n" "$model_name"
    printf "${CYAN}  +================================================+${NC}\n"
    echo ""
}

# ── Port utils ───────────────────────────────────────────────
get_pid_on_port() {
    local port="$1"
    local pid=""
    if command -v lsof &>/dev/null; then
        pid=$(lsof -ti :"$port" 2>/dev/null | head -1)
    elif command -v ss &>/dev/null; then
        pid=$(ss -tlnp "sport = :$port" 2>/dev/null | grep -oP 'pid=\K[0-9]+' | head -1)
    elif command -v netstat &>/dev/null; then
        pid=$(netstat -tlnp 2>/dev/null | grep ":${port}" | awk '{print $NF}' | cut -d/ -f1 | head -1)
    fi
    echo "$pid"
}

kill_port() {
    local port="$1"
    local pid
    pid=$(get_pid_on_port "$port")
    if [[ -z "$pid" ]]; then
        inf "Port $port already free"
        return
    fi

    inf "Killing PID $pid on port $port..."
    if kill -9 "$pid" 2>/dev/null; then
        sleep 0.5
        local check
        check=$(get_pid_on_port "$port")
        if [[ -z "$check" ]]; then
            ok "Port $port freed (was PID $pid)"
        else
            kill -9 "$check" 2>/dev/null || true
            sleep 0.3
            if [[ -z "$(get_pid_on_port "$port")" ]]; then
                ok "Port $port freed (killed orphan $check)"
            else
                err "Port $port still bound after kill"
            fi
        fi
    else
        err "Could not kill PID $pid on port $port"
    fi
}

port_status() {
    local port="$1"
    get_pid_on_port "$port"
}

# ── HTTP health ──────────────────────────────────────────────
check_http() {
    local url="$1"
    local timeout="${2:-3}"
    if command -v curl &>/dev/null; then
        curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" 2>/dev/null
    else
        echo "000"
    fi
}

# ── Start ────────────────────────────────────────────────────
start_backend() {
    local pid
    pid=$(port_status "$BACKEND_PORT")
    if [[ -n "$pid" ]]; then
        warn "Backend already running on :$BACKEND_PORT (PID $pid)"
        return
    fi

    # Warn if GROQ_API_KEY is missing before starting
    local groq_status
    groq_status=$(get_groq_status)
    if [[ "$groq_status" == "NOT SET"* || "$groq_status" == "INVALID"* ]]; then
        warn "GROQ_API_KEY $groq_status -- backend will fall back to Ollama"
        warn "Set key in backend/.env and restart to use Groq"
    fi

    inf "Starting backend on :$BACKEND_PORT ..."
    pushd "$BACKEND_DIR" > /dev/null
    # Load .env so GROQ_API_KEY is available to the uvicorn process
    if [[ -f ".env" ]]; then
        set -a
        # shellcheck disable=SC1091
        source .env
        set +a
    fi
    nohup python -m uvicorn server:app --host 0.0.0.0 --port "$BACKEND_PORT" --reload \
        > "$LOG_DIR/backend.log" 2>&1 &
    echo $! > "$LOG_DIR/backend.pid"
    popd > /dev/null
    sleep 2
    pid=$(port_status "$BACKEND_PORT")
    if [[ -n "$pid" ]]; then
        ok "Backend running on :$BACKEND_PORT (PID $pid)"
    else
        warn "Backend process launched - port may take a few seconds to bind"
        inf "  tail -f $LOG_DIR/backend.log"
    fi
}

start_frontend() {
    local pid
    pid=$(port_status "$FRONTEND_PORT")
    if [[ -n "$pid" ]]; then
        warn "Frontend already running on :$FRONTEND_PORT (PID $pid)"
        return
    fi
    inf "Starting frontend on :$FRONTEND_PORT ..."
    pushd "$FRONTEND_DIR" > /dev/null
    nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
    echo $! > "$LOG_DIR/frontend.pid"
    popd > /dev/null
    sleep 3
    pid=$(port_status "$FRONTEND_PORT")
    if [[ -n "$pid" ]]; then
        ok "Frontend running on :$FRONTEND_PORT (PID $pid)"
    else
        warn "Frontend process launched - port may take a few seconds to bind"
        inf "  tail -f $LOG_DIR/frontend.log"
    fi
}

start_wiki() {
    local pid
    pid=$(port_status "$WIKI_PORT")
    if [[ -n "$pid" ]]; then
        warn "Wiki already running on :$WIKI_PORT (PID $pid)"
        return
    fi
    inf "Building wiki docs (build_wiki.py)..."
    pushd "$WIKI_DIR" > /dev/null
    python build_wiki.py > "$LOG_DIR/wiki_build.log" 2>&1
    popd > /dev/null
    ok "build_wiki.py sync done"

    inf "Starting wiki on :$WIKI_PORT ..."
    pushd "$WIKI_DIR" > /dev/null
    nohup python -m mkdocs serve --dev-addr "127.0.0.1:$WIKI_PORT" --no-livereload \
        > "$LOG_DIR/wiki.log" 2>&1 &
    echo $! > "$LOG_DIR/wiki.pid"
    popd > /dev/null
    sleep 3
    pid=$(port_status "$WIKI_PORT")
    if [[ -n "$pid" ]]; then
        ok "Wiki running on :$WIKI_PORT (PID $pid) -> http://localhost:$WIKI_PORT"
    else
        warn "Wiki process launched - port may take a few seconds to bind"
        inf "  tail -f $LOG_DIR/wiki.log"
    fi
}

start_medicare() {
    local pid
    pid=$(port_status "5000")
    if [[ -n "$pid" ]]; then
        warn "MediCare AI Lab already running on :5000 (PID $pid)"
        return
    fi
    inf "Starting MediCare AI Lab on :5000 ..."
    pushd "$SCRIPT_DIR/pwnzzai_medical" > /dev/null
    if [[ ! -d ".venv" ]]; then
        inf "Creating virtual environment for MediCare AI Lab..."
        python -m venv .venv
    fi
    source .venv/bin/activate
    python -m pip install --upgrade pip > /dev/null 2>&1
    pip install -r requirements.txt > /dev/null 2>&1
    export FLASK_APP=main.py
    export OLLAMA_HOST=http://localhost:11434
    nohup flask run --port 5000 > "$LOG_DIR/medicare.log" 2>&1 &
    echo $! > "$LOG_DIR/medicare.pid"
    popd > /dev/null
    sleep 3
    pid=$(port_status "5000")
    if [[ -n "$pid" ]]; then
        ok "MediCare AI Lab running on :5000 (PID $pid)"
    else
        warn "MediCare AI Lab process launched - port may take a few seconds to bind"
        inf "  tail -f $LOG_DIR/medicare.log"
    fi
}

# ── Stop ─────────────────────────────────────────────────────
stop_backend() {
    inf "Stopping backend (:$BACKEND_PORT)..."
    kill_port "$BACKEND_PORT"
    if [[ -f "$LOG_DIR/backend.pid" ]]; then
        kill -9 "$(cat "$LOG_DIR/backend.pid")" 2>/dev/null || true
        rm -f "$LOG_DIR/backend.pid"
    fi
}

stop_frontend() {
    inf "Stopping frontend (:$FRONTEND_PORT)..."
    kill_port "$FRONTEND_PORT"
    if [[ -f "$LOG_DIR/frontend.pid" ]]; then
        kill -9 "$(cat "$LOG_DIR/frontend.pid")" 2>/dev/null || true
        rm -f "$LOG_DIR/frontend.pid"
    fi
}

stop_wiki() {
    inf "Stopping wiki (:$WIKI_PORT)..."
    kill_port "$WIKI_PORT"
    if [[ -f "$LOG_DIR/wiki.pid" ]]; then
        kill -9 "$(cat "$LOG_DIR/wiki.pid")" 2>/dev/null || true
        rm -f "$LOG_DIR/wiki.pid"
    fi
}

stop_medicare() {
    inf "Stopping MediCare AI Lab (:5000)..."
    kill_port "5000"
    if [[ -f "$LOG_DIR/medicare.pid" ]]; then
        kill -9 "$(cat "$LOG_DIR/medicare.pid")" 2>/dev/null || true
        rm -f "$LOG_DIR/medicare.pid"
    fi
}

# ── Build ────────────────────────────────────────────────────
build_backend() {
    inf "Checking backend syntax (py_compile)..."
    local errors=0
    while IFS= read -r -d '' f; do
        if ! python -m py_compile "$f" 2>/dev/null; then
            err "Syntax error: $f"
            errors=$((errors + 1))
        fi
    done < <(find "$BACKEND_DIR" -maxdepth 2 -name "*.py" -print0)
    if [[ $errors -eq 0 ]]; then
        ok "Backend syntax OK (all .py files compile)"
    else
        err "$errors file(s) with syntax errors"
    fi
}

build_frontend() {
    inf "Building frontend (Vite)..."
    pushd "$FRONTEND_DIR" > /dev/null
    if npm run build 2>&1 | tee "$LOG_DIR/build_frontend.log" | grep -qE "built in"; then
        ok "Frontend built successfully"
    else
        err "Frontend build FAILED - see $LOG_DIR/build_frontend.log"
    fi
    popd > /dev/null
}

build_wiki() {
    inf "Step 1/2: Syncing wiki sources (build_wiki.py)..."
    pushd "$WIKI_DIR" > /dev/null
    if python build_wiki.py > "$LOG_DIR/wiki_sync.log" 2>&1; then
        ok "build_wiki.py sync done"
    else
        err "build_wiki.py FAILED - see $LOG_DIR/wiki_sync.log"
        popd > /dev/null
        return
    fi

    inf "Step 2/2: Building MkDocs site (mkdocs build --clean)..."
    if python -m mkdocs build --clean 2>&1 | tee "$LOG_DIR/wiki_mkdocs.log" | tail -3; then
        local warns errs
        warns=$(grep -c "^WARNING" "$LOG_DIR/wiki_mkdocs.log" 2>/dev/null || echo 0)
        errs=$(grep -c "^ERROR" "$LOG_DIR/wiki_mkdocs.log" 2>/dev/null || echo 0)
        ok "MkDocs built | $warns warnings, $errs errors"
    else
        err "MkDocs build FAILED - see $LOG_DIR/wiki_mkdocs.log"
    fi
    popd > /dev/null
}

# ── Forge ────────────────────────────────────────────────────
run_forge() {
    inf "Launching Genetic Prompt Optimizer (Forge)..."
    local bpid
    bpid=$(port_status "$BACKEND_PORT")
    if [[ -z "$bpid" ]]; then
        err "Backend must be running on :$BACKEND_PORT for the Forge to work."
        inf "Run: ./aegis.sh start backend"
        return
    fi

    printf "\n  ${CYAN}The Forge uses POST /api/redteam/genetic/stream (SSE)${NC}\n"
    printf "  ${CYAN}Provider: Groq ($(get_active_model))${NC}\n\n"

    read -rp "  Attack intention (default: tool_hijack): " intention
    intention="${intention:-tool_hijack}"
    read -rp "  Max iterations  (default: 20): " max_iter
    max_iter="${max_iter:-20}"
    read -rp "  Population size (default: 10): " pop_size
    pop_size="${pop_size:-10}"

    local logfile="$LOG_DIR/forge.log"
    inf "Streaming forge to $logfile ..."
    echo ""

    curl -sN -X POST "http://localhost:$BACKEND_PORT/api/redteam/genetic/stream" \
        -H "Content-Type: application/json" \
        -d "{\"intention\":\"$intention\",\"max_iterations\":$max_iter,\"population_size\":$pop_size,\"mutation_rate\":0.5,\"crossover_rate\":0.1,\"aegis_shield\":false}" \
        2>&1 | tee "$logfile"

    echo ""
    ok "Forge completed. Full output in $logfile"
}

# ── Demo ─────────────────────────────────────────────────────
run_demo() {
    local mode="${1:-convergence}"

    case "$mode" in
        redteam)
            inf "Launching autonomous Red Team session..."
            read -rp "  Rounds (default: 5): " rounds
            rounds="${rounds:-5}"
            read -rp "  Type [injection|prompt_leak|rule_bypass|all] (default: injection): " dtype
            dtype="${dtype:-injection}"

            local logfile="$LOG_DIR/demo_redteam.log"
            pushd "$BACKEND_DIR" > /dev/null
            inf "Running: python run_redteam.py --type $dtype --rounds $rounds"
            echo ""
            python run_redteam.py --type "$dtype" --rounds "$rounds" 2>&1 | tee "$logfile"
            local exit_code=$?
            popd > /dev/null
            if [[ $exit_code -eq 0 ]]; then
                ok "Red Team demo completed. Log: $logfile"
            else
                err "Red Team demo failed (exit $exit_code). Log: $logfile"
            fi
            ;;
        *)
            inf "Launching Triple Convergence demo (210 runs: 7 conditions x 30 prompts)..."
            local logfile="$LOG_DIR/demo_convergence.log"
            pushd "$BACKEND_DIR" > /dev/null
            inf "Running: python run_triple_convergence.py"
            echo ""
            python run_triple_convergence.py 2>&1 | tee "$logfile"
            local exit_code=$?
            popd > /dev/null
            if [[ $exit_code -eq 0 ]]; then
                ok "Triple Convergence demo completed. Log: $logfile"
            else
                err "Demo failed (exit $exit_code). Log: $logfile"
            fi
            ;;
    esac
}

# ── Test ─────────────────────────────────────────────────────
run_tests() {
    inf "Running backend tests (pytest)..."
    pushd "$BACKEND_DIR" > /dev/null
    local logfile="$LOG_DIR/test.log"
    python -m pytest tests/ -v 2>&1 | tee "$logfile"
    local exit_code=$?
    popd > /dev/null
    if [[ $exit_code -eq 0 ]]; then
        ok "All tests passed."
    else
        err "Some tests failed (exit $exit_code). Log: $logfile"
    fi
}

# ── Health ───────────────────────────────────────────────────
show_health() {
    echo ""
    printf "${CYAN}  HEALTH CHECK${NC}\n"
    printf "${GRAY}  ──────────────────────────────────────────────${NC}\n"

    # Backend
    local bpid code
    bpid=$(port_status "$BACKEND_PORT")
    if [[ -n "$bpid" ]]; then
        code=$(check_http "http://localhost:$BACKEND_PORT/api/redteam/scenarios")
        if [[ "$code" == "200" ]]; then
            printf "  Backend  :%-5s  ${GREEN}RUNNING${NC}  PID %-6s  ${GREEN}HTTP %s${NC}\n" "$BACKEND_PORT" "$bpid" "$code"
        else
            printf "  Backend  :%-5s  ${GREEN}RUNNING${NC}  PID %-6s  ${YELLOW}HTTP %s${NC}\n" "$BACKEND_PORT" "$bpid" "$code"
        fi
    else
        printf "  Backend  :%-5s  ${RED}STOPPED${NC}\n" "$BACKEND_PORT"
    fi

    # Frontend
    local fpid
    fpid=$(port_status "$FRONTEND_PORT")
    if [[ -n "$fpid" ]]; then
        code=$(check_http "http://localhost:$FRONTEND_PORT")
        printf "  Frontend :%-5s  ${GREEN}RUNNING${NC}  PID %-6s  ${GREEN}HTTP %s${NC}\n" "$FRONTEND_PORT" "$fpid" "$code"
    else
        printf "  Frontend :%-5s  ${RED}STOPPED${NC}\n" "$FRONTEND_PORT"
    fi

    # Wiki
    local wpid
    wpid=$(port_status "$WIKI_PORT")
    if [[ -n "$wpid" ]]; then
        code=$(check_http "http://localhost:$WIKI_PORT")
        printf "  Wiki     :%-5s  ${GREEN}RUNNING${NC}  PID %-6s  ${GREEN}HTTP %s${NC}\n" "$WIKI_PORT" "$wpid" "$code"
    else
        printf "  Wiki     :%-5s  ${RED}STOPPED${NC}\n" "$WIKI_PORT"
    fi

    # MediCare
    local mpid
    mpid=$(port_status "5000")
    if [[ -n "$mpid" ]]; then
        code=$(check_http "http://localhost:5000")
        printf "  MediCare :%-5s  ${GREEN}RUNNING${NC}  PID %-6s  ${GREEN}HTTP %s${NC}\n" "5000" "$mpid" "$code"
    else
        printf "  MediCare :%-5s  ${RED}STOPPED${NC}\n" "5000"
    fi

    # Groq API key
    local groq_status
    groq_status=$(get_groq_status)
    if [[ "$groq_status" == SET* ]]; then
        printf "  Groq key          ${GREEN}%-35s${NC}\n" "$groq_status"
    else
        printf "  Groq key          ${RED}%-35s${NC}\n" "$groq_status"
    fi

    # Ollama (fallback)
    code=$(check_http "http://localhost:11434")
    if [[ "$code" != "000" ]]; then
        printf "  Ollama   :11434  ${GRAY}RUNNING (fallback)${NC}  HTTP %s\n" "$code"
    else
        printf "  Ollama   :11434  ${GRAY}STOPPED (fallback not available)${NC}\n"
    fi

    # GitHub Pages live check
    printf "  GitHub Pages:     "
    local pages_code
    pages_code=$(check_http "$PAGES_URL" 5)
    if [[ "$pages_code" == "200" ]]; then
        printf "${GREEN}LIVE${NC}  HTTP %s  %s\n" "$pages_code" "$PAGES_URL"
    elif [[ "$pages_code" == "000" ]]; then
        printf "${YELLOW}UNREACHABLE${NC}  (no network or not deployed yet)\n"
    else
        printf "${YELLOW}HTTP %s${NC}  %s\n" "$pages_code" "$PAGES_URL"
    fi

    echo ""
}

# ── Env status ───────────────────────────────────────────────
show_env() {
    local env_file="$BACKEND_DIR/.env"
    echo ""
    printf "${CYAN}  ENV STATUS -- backend/.env${NC}\n"
    printf "${GRAY}  ──────────────────────────────────────────────${NC}\n"

    if [[ ! -f "$env_file" ]]; then
        err "backend/.env not found"
        inf "Create it with: cp backend/.env.example backend/.env"
        echo ""
        return
    fi

    while IFS='=' read -r key value || [[ -n "$key" ]]; do
        # Skip comments and blank lines
        [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
        key=$(echo "$key" | tr -d '[:space:]')
        value=$(echo "$value" | tr -d '"'"'" | tr -d '[:space:]')

        # Mask secrets
        local display_val="$value"
        if [[ "$key" == *"KEY"* || "$key" == *"SECRET"* || "$key" == *"TOKEN"* || "$key" == *"PASSWORD"* ]]; then
            if [[ -n "$value" ]]; then
                local prefix="${value:0:6}"
                local suffix="${value: -4}"
                display_val="${prefix}...${suffix}"
            else
                display_val="(empty)"
            fi
        fi

        if [[ -z "$value" ]]; then
            printf "  ${YELLOW}%-25s${NC} = ${YELLOW}(empty)${NC}\n" "$key"
        else
            printf "  ${GREEN}%-25s${NC} = %s\n" "$key" "$display_val"
        fi
    done < "$env_file"

    echo ""
    local groq_status
    groq_status=$(get_groq_status)
    if [[ "$groq_status" == "NOT SET"* || "$groq_status" == "INVALID"* ]]; then
        warn "GROQ_API_KEY $groq_status"
        warn "Get a new key at: https://console.groq.com/keys"
    else
        ok "Groq key: $groq_status"
    fi
    echo ""
}

# ── Git push ─────────────────────────────────────────────────
invoke_push() {
    local commit_msg="${1:-chore: update AEGIS scripts and research artifacts}"

    echo ""
    printf "${CYAN}  GIT PUSH -- origin/main${NC}\n"
    printf "${GRAY}  ──────────────────────────────────────────────${NC}\n"

    pushd "$SCRIPT_DIR" > /dev/null

    # Remove stale lock if present
    if [[ -f ".git/index.lock" ]]; then
        rm -f ".git/index.lock"
        ok "Removed stale .git/index.lock"
    fi

    # Stage all tracked + new files
    inf "Staging all changes..."
    git add -u
    git add .

    # Check if there is anything to commit
    if git diff --cached --quiet; then
        warn "Nothing staged -- working tree is clean"
        popd > /dev/null
        return
    fi

    # Show what will be committed
    inf "Staged files:"
    git diff --cached --name-status | while IFS= read -r line; do
        printf "    %s\n" "$line"
    done

    echo ""
    inf "Committing: $commit_msg"
    git commit --no-verify -m "$commit_msg" \
        -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

    inf "Pushing to origin/main..."
    git push origin main

    ok "Push complete -> CI/CD triggered"
    inf "Actions: https://github.com/mo0ogly/llm_robot_medical/actions"
    inf "Pages:   $PAGES_URL"

    popd > /dev/null
    echo ""
}

# ── Logs ─────────────────────────────────────────────────────
show_logs() {
    local target="${1:-all}"

    declare -A logmap=(
        [backend]="backend.log"
        [frontend]="frontend.log"
        [wiki]="wiki.log"
        [medicare]="medicare.log"
        [forge]="forge.log"
        [demo]="demo_convergence.log"
        [redteam]="demo_redteam.log"
        [test]="test.log"
    )

    if [[ "$target" != "all" && -n "${logmap[$target]:-}" ]]; then
        local f="$LOG_DIR/${logmap[$target]}"
        if [[ -f "$f" ]]; then
            printf "\n${CYAN}  === ${logmap[$target]} (last 40 lines) ===${NC}\n"
            tail -40 "$f"
        else
            inf "No log file yet: ${logmap[$target]}"
        fi
    else
        for k in backend frontend wiki medicare forge demo redteam; do
            local f="$LOG_DIR/${logmap[$k]}"
            if [[ -f "$f" ]]; then
                printf "\n${CYAN}  === ${logmap[$k]} (last 10 lines) ===${NC}\n"
                tail -10 "$f"
            fi
        done
        local any_log
        any_log=$(find "$LOG_DIR" -name "*.log" -maxdepth 1 2>/dev/null | head -1)
        if [[ -z "$any_log" ]]; then
            inf "No log files yet in $LOG_DIR"
        fi
    fi
    echo ""
}

# ── Open browser ─────────────────────────────────────────────
open_browser() {
    local url="$1"
    if command -v xdg-open &>/dev/null; then
        xdg-open "$url"
    elif command -v open &>/dev/null; then
        open "$url"
    else
        inf "Open manually: $url"
    fi
}

# ── Dispatch ─────────────────────────────────────────────────
do_start() {
    case "${1:-all}" in
        backend)  start_backend ;;
        frontend) start_frontend ;;
        wiki)     start_wiki ;;
        medicare) start_medicare ;;
        *)        start_backend; start_frontend; start_wiki; start_medicare ;;
    esac
}
do_stop() {
    case "${1:-all}" in
        backend)  stop_backend ;;
        frontend) stop_frontend ;;
        wiki)     stop_wiki ;;
        medicare) stop_medicare ;;
        *)        stop_backend; stop_frontend; stop_wiki; stop_medicare ;;
    esac
}
do_restart() {
    case "${1:-all}" in
        backend)  stop_backend;  sleep 1; start_backend ;;
        frontend) stop_frontend; sleep 1; start_frontend ;;
        wiki)     stop_wiki;     sleep 1; start_wiki ;;
        medicare) stop_medicare; sleep 1; start_medicare ;;
        *)        stop_backend; stop_frontend; stop_wiki; stop_medicare; sleep 1; start_backend; start_frontend; start_wiki; start_medicare ;;
    esac
}
do_build() {
    case "${1:-all}" in
        backend)  build_backend ;;
        frontend) build_frontend ;;
        wiki)     build_wiki ;;
        *)        build_backend; build_frontend; build_wiki ;;
    esac
}

# ── Interactive menu ─────────────────────────────────────────
interactive_menu() {
    while true; do
        clear
        banner
        show_health

        printf "${GRAY}  +--------------------------------------------------------------+${NC}\n"
        printf "  | ${BOLD}SERVICES${NC}                      ${BOLD}BUILD & TOOLS${NC}                |\n"
        printf "  |  ${BOLD}1${NC}  Start All                 ${BOLD}5${NC}  Build Frontend              |\n"
        printf "  |  ${BOLD}2${NC}  Stop All                  ${BOLD}6${NC}  Build Backend               |\n"
        printf "  |  ${BOLD}3${NC}  Restart All               ${BOLD}7${NC}  Build Wiki (full)           |\n"
        printf "  |  ${BOLD}4${NC}  Health check              ${BOLD}8${NC}  Run Tests (pytest)          |\n"
        printf "  |                                                              |\n"
        printf "  | ${BOLD}TARGETED${NC}                       ${BOLD}RESEARCH${NC}                     |\n"
        printf "  |  ${BOLD}b${NC}  Start Backend             ${BOLD}g${NC}  Forge (genetic engine)      |\n"
        printf "  |  ${BOLD}f${NC}  Start Frontend            ${BOLD}d${NC}  Demo (triple convergence)   |\n"
        printf "  |  ${BOLD}w${NC}  Start Wiki                ${BOLD}r${NC}  Demo (red team session)     |\n"
        printf "  |  ${BOLD}B${NC}  Stop Backend              ${BOLD}9${NC}  View Logs                   |\n"
        printf "  |  ${BOLD}F${NC}  Stop Frontend             ${BOLD}o${NC}  Open Frontend in browser    |\n"
        printf "  |  ${BOLD}W${NC}  Stop Wiki                 ${BOLD}ow${NC} Open Wiki in browser        |\n"
        printf "  |  ${BOLD}rb${NC} Restart Backend                                          |\n"
        printf "  |  ${BOLD}rf${NC} Restart Frontend          ${BOLD}ok${NC} Open GitHub Pages           |\n"
        printf "  |  ${BOLD}rw${NC} Restart Wiki              ${BOLD}p${NC}  Push / deploy to main       |\n"
        printf "  |                             ${BOLD}e${NC}  Env / Groq key status       |\n"
        printf "  |                             ${YELLOW}${BOLD}0${NC}  Exit                        |\n"
        printf "${GRAY}  +--------------------------------------------------------------+${NC}\n\n"

        read -rp "  Choice: " choice
        echo ""

        case "$choice" in
            1)   do_start all ;;
            2)   do_stop all ;;
            3)   do_restart all ;;
            4)   show_health; continue ;;
            5)   build_frontend ;;
            6)   build_backend ;;
            7)   build_wiki ;;
            8)   run_tests ;;
            9)   show_logs all ;;
            b)   start_backend ;;
            B)   stop_backend ;;
            f)   start_frontend ;;
            F)   stop_frontend ;;
            w)   start_wiki ;;
            W)   stop_wiki ;;
            rb)  stop_backend;  sleep 1; start_backend ;;
            rf)  stop_frontend; sleep 1; start_frontend ;;
            rw)  stop_wiki;     sleep 1; start_wiki ;;
            g)   run_forge ;;
            d)   run_demo convergence ;;
            r)   run_demo redteam ;;
            o)   open_browser "http://localhost:$FRONTEND_PORT" ;;
            ow)  open_browser "http://localhost:$WIKI_PORT" ;;
            ok)  open_browser "$PAGES_URL" ;;
            p)
                read -rp "  Commit message (Enter = default): " _msg
                invoke_push "${_msg:-chore: update AEGIS lab}"
                ;;
            e)   show_env ;;
            0|q) printf "\n  ${CYAN}Bye.${NC}\n\n"; exit 0 ;;
            *)   warn "Unknown option: $choice" ;;
        esac

        echo ""
        read -rp "  Press Enter to continue..." _dummy
    done
}

# ── Entry point ──────────────────────────────────────────────
CMD="${1:-}"
TARGET="${2:-all}"

if [[ -z "$CMD" ]]; then
    interactive_menu
    exit 0
fi

banner
case "$CMD" in
    start)     do_start   "$TARGET" ;;
    stop)      do_stop    "$TARGET" ;;
    restart)   do_restart "$TARGET" ;;
    health)    show_health ;;
    build)     do_build   "$TARGET" ;;
    test)      run_tests ;;
    forge)     run_forge ;;
    demo)      run_demo "$TARGET" ;;
    kill-port) kill_port  "$TARGET" ;;
    logs)      show_logs  "$TARGET" ;;
    open)      open_browser "http://localhost:$FRONTEND_PORT" ;;
    wiki)      open_browser "http://localhost:$WIKI_PORT" ;;
    pages)     open_browser "$PAGES_URL" ;;
    env)       show_env ;;
    push)
        # Allow optional commit message as second arg
        COMMIT_MSG="${2:-chore: update AEGIS lab}"
        invoke_push "$COMMIT_MSG"
        ;;
    push-gitlab)
        # Clean, provenance-scrubbed single-commit snapshot -> internal GitLab.
        # Default is dry-run (build + verify, NO push). Pass 'push' to actually push.
        GL_MODE="--dry-run"; [[ "${2:-}" == "push" ]] && GL_MODE="--push"
        "$SCRIPT_DIR/scripts/gitlab_export.sh" "$GL_MODE" "${3:-}"
        ;;
    *)
        printf "\n  ${YELLOW}Commands:${NC}\n"
        printf "    ${BOLD}start${NC} | ${BOLD}stop${NC} | ${BOLD}restart${NC} | ${BOLD}health${NC} | ${BOLD}build${NC} | ${BOLD}test${NC}\n"
        printf "    ${BOLD}forge${NC} | ${BOLD}demo${NC} [redteam] | ${BOLD}kill-port${NC} | ${BOLD}logs${NC} | ${BOLD}open${NC} | ${BOLD}wiki${NC}\n"
        printf "    ${BOLD}push${NC} [\"commit message\"]   -- stage all, commit, push to main\n"
        printf "    ${BOLD}env${NC}                       -- show backend/.env (secrets masked)\n"
        printf "    ${BOLD}pages${NC}                     -- open GitHub Pages in browser\n"
        printf "\n  ${GRAY}Targets :${NC} all | backend | frontend | wiki\n"
        printf "  ${GRAY}Demo    :${NC} ./aegis.sh demo             (triple convergence, 210 runs)\n"
        printf "           ./aegis.sh demo redteam      (autonomous red team session)\n"
        printf "  ${GRAY}Forge   :${NC} ./aegis.sh forge             (genetic prompt optimizer, SSE)\n"
        printf "  ${GRAY}Build   :${NC} ./aegis.sh build wiki        (build_wiki.py + mkdocs build --clean)\n\n"
        ;;
esac
