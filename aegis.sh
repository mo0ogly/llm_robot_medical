#!/usr/bin/env bash
# ============================================================
#  AEGIS Lab — Process Manager
#  CLI  : ./aegis.sh <command> [target]
#  Menu : ./aegis.sh
#
#  Commands : start | stop | restart | health | build | logs | open
#  Targets  : all | backend | frontend
# ============================================================

set -euo pipefail

# ── Config ───────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
LOG_DIR="$SCRIPT_DIR/logs"
BACKEND_PORT=8042
FRONTEND_PORT=5173

mkdir -p "$LOG_DIR"

# ── Colors ───────────────────────────────────────────────────
RED='\033[0;31m';  GREEN='\033[0;32m'; YELLOW='\033[0;33m'
CYAN='\033[0;36m'; GRAY='\033[0;90m';  BOLD='\033[1m';  NC='\033[0m'

ok()   { printf "  ${GREEN}[OK]${NC} %s\n" "$*"; }
err()  { printf "  ${RED}[!!]${NC} %s\n" "$*"; }
inf()  { printf "  ${CYAN}[--]${NC} %s\n" "$*"; }
warn() { printf "  ${YELLOW}[>>]${NC} %s\n" "$*"; }

banner() {
    echo ""
    printf "${CYAN}  ╔══════════════════════════════════════════════╗${NC}\n"
    printf "${CYAN}  ║   AEGIS Lab — Process Manager                ║${NC}\n"
    printf "${CYAN}  ║   Backend :%-5s  |  Frontend :%-5s          ║${NC}\n" "$BACKEND_PORT" "$FRONTEND_PORT"
    printf "${CYAN}  ╚══════════════════════════════════════════════╝${NC}\n"
    echo ""
}

# ── Port utils ───────────────────────────────────────────────
get_pid_on_port() {
    local port="$1"
    # Try lsof first (macOS/Linux), fall back to netstat (Windows/WSL)
    local pid=""
    if command -v lsof &>/dev/null; then
        pid=$(lsof -ti :"$port" 2>/dev/null | head -1)
    elif command -v netstat &>/dev/null; then
        pid=$(netstat -ano 2>/dev/null | grep ":${port}.*LISTEN" | awk '{print $NF}' | head -1)
    fi
    echo "$pid"
}

kill_port() {
    local port="$1"
    local pid
    pid=$(get_pid_on_port "$port")
    if [[ -n "$pid" ]]; then
        if kill -9 "$pid" 2>/dev/null; then
            sleep 0.5
            local check
            check=$(get_pid_on_port "$port")
            if [[ -z "$check" ]]; then
                ok "Port $port freed (was PID $pid)"
            else
                # Windows via WSL: try taskkill
                if command -v taskkill.exe &>/dev/null; then
                    taskkill.exe //F //PID "$pid" &>/dev/null && ok "Port $port freed via taskkill (PID $pid)" || err "Could not free port $port"
                else
                    err "Port $port still bound after kill"
                fi
            fi
        else
            # Fallback: taskkill on Windows/WSL
            if command -v taskkill.exe &>/dev/null; then
                taskkill.exe //F //PID "$pid" &>/dev/null && ok "Port $port freed (PID $pid)" || err "Failed to kill PID $pid"
            else
                err "Could not kill PID $pid on port $port"
            fi
        fi
    else
        inf "Port $port already free"
    fi
}

port_status() {
    local port="$1"
    local pid
    pid=$(get_pid_on_port "$port")
    echo "$pid"
}

# ── HTTP health ───────────────────────────────────────────────
check_http() {
    local url="$1"
    if command -v curl &>/dev/null; then
        local code
        code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "$url" 2>/dev/null)
        echo "$code"
    else
        echo "000"
    fi
}

# ── Start ─────────────────────────────────────────────────────
start_backend() {
    local pid
    pid=$(port_status "$BACKEND_PORT")
    if [[ -n "$pid" ]]; then
        warn "Backend already running on :$BACKEND_PORT (PID $pid)"
        return
    fi
    inf "Starting backend on :$BACKEND_PORT ..."
    pushd "$BACKEND_DIR" > /dev/null
    nohup python -m uvicorn server:app --host 0.0.0.0 --port "$BACKEND_PORT" --reload \
        > "$LOG_DIR/backend.log" 2>&1 &
    echo $! > "$LOG_DIR/backend.pid"
    popd > /dev/null
    sleep 2
    pid=$(port_status "$BACKEND_PORT")
    if [[ -n "$pid" ]]; then
        ok "Backend running on :$BACKEND_PORT (PID $pid) — logs: logs/backend.log"
    else
        warn "Backend process launched — port may take a few seconds to bind"
        inf "  tail -f logs/backend.log"
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
        ok "Frontend running on :$FRONTEND_PORT (PID $pid) — logs: logs/frontend.log"
    else
        warn "Frontend process launched — port may take a few seconds to bind"
        inf "  tail -f logs/frontend.log"
    fi
}

# ── Stop ──────────────────────────────────────────────────────
stop_backend() {
    inf "Stopping backend (:$BACKEND_PORT)..."
    kill_port "$BACKEND_PORT"
    # Also kill via pid file if exists
    if [[ -f "$LOG_DIR/backend.pid" ]]; then
        local saved_pid
        saved_pid=$(cat "$LOG_DIR/backend.pid")
        kill -9 "$saved_pid" 2>/dev/null || true
        rm -f "$LOG_DIR/backend.pid"
    fi
}

stop_frontend() {
    inf "Stopping frontend (:$FRONTEND_PORT)..."
    kill_port "$FRONTEND_PORT"
    if [[ -f "$LOG_DIR/frontend.pid" ]]; then
        local saved_pid
        saved_pid=$(cat "$LOG_DIR/frontend.pid")
        kill -9 "$saved_pid" 2>/dev/null || true
        rm -f "$LOG_DIR/frontend.pid"
    fi
}

# ── Build ─────────────────────────────────────────────────────
build_frontend() {
    inf "Building frontend (Vite)..."
    pushd "$FRONTEND_DIR" > /dev/null
    if npm run build 2>&1 | tee "$LOG_DIR/build_frontend.log" | grep -E "built in|error"; then
        grep -q "built in" "$LOG_DIR/build_frontend.log" && ok "Frontend built successfully" || err "Frontend build FAILED — see logs/build_frontend.log"
    fi
    popd > /dev/null
}

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

# ── Health ────────────────────────────────────────────────────
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

    # Ollama
    code=$(check_http "http://localhost:11434")
    if [[ "$code" != "000" ]]; then
        printf "  Ollama   :11434  ${GREEN}RUNNING${NC}  HTTP %s\n" "$code"
    else
        printf "  Ollama   :11434  ${GRAY}STOPPED${NC}\n"
    fi

    echo ""
}

# ── Logs ──────────────────────────────────────────────────────
show_logs() {
    local target="${1:-all}"
    local backlog="$LOG_DIR/backend.log"
    local frontlog="$LOG_DIR/frontend.log"

    if [[ "$target" == "backend" && -f "$backlog" ]]; then
        printf "\n${CYAN}  === backend.log (last 30) ===${NC}\n"
        tail -30 "$backlog"
    elif [[ "$target" == "frontend" && -f "$frontlog" ]]; then
        printf "\n${GREEN}  === frontend.log (last 30) ===${NC}\n"
        tail -30 "$frontlog"
    else
        [[ -f "$backlog"  ]] && { printf "\n${CYAN}  === backend.log (last 15) ===${NC}\n";  tail -15 "$backlog";  }
        [[ -f "$frontlog" ]] && { printf "\n${GREEN}  === frontend.log (last 15) ===${NC}\n"; tail -15 "$frontlog"; }
        [[ ! -f "$backlog" && ! -f "$frontlog" ]] && inf "No log files yet in $LOG_DIR"
    fi
    echo ""
}

# ── Dispatch ──────────────────────────────────────────────────
do_start() {
    case "${1:-all}" in
        backend)  start_backend ;;
        frontend) start_frontend ;;
        *)        start_backend; start_frontend ;;
    esac
}
do_stop() {
    case "${1:-all}" in
        backend)  stop_backend ;;
        frontend) stop_frontend ;;
        *)        stop_backend; stop_frontend ;;
    esac
}
do_restart() {
    case "${1:-all}" in
        backend)  stop_backend;  sleep 1; start_backend ;;
        frontend) stop_frontend; sleep 1; start_frontend ;;
        *)        stop_backend; stop_frontend; sleep 1; start_backend; start_frontend ;;
    esac
}
do_build() {
    case "${1:-all}" in
        backend)  build_backend ;;
        frontend) build_frontend ;;
        *)        build_backend; build_frontend ;;
    esac
}

# ── Interactive menu ──────────────────────────────────────────
interactive_menu() {
    while true; do
        clear
        banner
        show_health

        printf "${GRAY}  ┌──────────────────────────────────────────┐${NC}\n"
        printf "  │  ${BOLD}1${NC}  Start all          ${BOLD}5${NC}  Build frontend  │\n"
        printf "  │  ${BOLD}2${NC}  Stop all           ${BOLD}6${NC}  Build backend   │\n"
        printf "  │  ${BOLD}3${NC}  Restart all        ${BOLD}7${NC}  Kill :$BACKEND_PORT        │\n"
        printf "  │  ${BOLD}4${NC}  Health check       ${BOLD}8${NC}  Kill :$FRONTEND_PORT       │\n"
        printf "  │  ${BOLD}b${NC}  Start backend      ${BOLD}f${NC}  Start frontend  │\n"
        printf "  │  ${BOLD}B${NC}  Stop backend       ${BOLD}F${NC}  Stop frontend   │\n"
        printf "  │  ${BOLD}9${NC}  View logs          ${BOLD}o${NC}  Open browser    │\n"
        printf "  │                        ${YELLOW}${BOLD}0${NC}  Exit             │\n"
        printf "${GRAY}  └──────────────────────────────────────────┘${NC}\n\n"

        read -rp "  Choice: " choice
        echo ""

        case "$choice" in
            1)   do_start all ;;
            2)   do_stop all ;;
            3)   do_restart all ;;
            4)   show_health; continue ;;
            5)   build_frontend ;;
            6)   build_backend ;;
            7)   kill_port "$BACKEND_PORT" ;;
            8)   kill_port "$FRONTEND_PORT" ;;
            9)   show_logs all ;;
            b)   start_backend ;;
            B)   stop_backend ;;
            f)   start_frontend ;;
            F)   stop_frontend ;;
            o)   command -v xdg-open &>/dev/null && xdg-open "http://localhost:$FRONTEND_PORT" || \
                 command -v open &>/dev/null && open "http://localhost:$FRONTEND_PORT" || \
                 inf "Open http://localhost:$FRONTEND_PORT manually" ;;
            0|q) printf "\n  ${CYAN}Bye.${NC}\n\n"; exit 0 ;;
            *)   warn "Unknown option: $choice" ;;
        esac

        echo ""
        read -rp "  Press Enter to continue..." _dummy
    done
}

# ── Entry point ───────────────────────────────────────────────
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
    kill-port) kill_port  "$TARGET" ;;
    logs)      show_logs  "$TARGET" ;;
    open)
        command -v xdg-open &>/dev/null && xdg-open "http://localhost:$FRONTEND_PORT" || \
        command -v open &>/dev/null && open "http://localhost:$FRONTEND_PORT" || \
        inf "Open http://localhost:$FRONTEND_PORT manually"
        ;;
    *)
        printf "\n  ${YELLOW}Commands:${NC} start | stop | restart | health | build | kill-port | logs | open\n"
        printf "  ${GRAY}Targets :${NC} all | backend | frontend\n\n"
        ;;
esac
