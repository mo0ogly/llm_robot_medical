#Requires -Version 5.1
<#
.SYNOPSIS
    AEGIS Lab — Process Manager
.DESCRIPTION
    Manage backend (FastAPI :8042) and frontend (Vite :5173).
    CLI  : .\aegis.ps1 <command> [target]
    Menu : .\aegis.ps1
.EXAMPLE
    .\aegis.ps1 start
    .\aegis.ps1 start backend
    .\aegis.ps1 stop frontend
    .\aegis.ps1 restart
    .\aegis.ps1 health
    .\aegis.ps1 build
    .\aegis.ps1 build frontend
    .\aegis.ps1 logs
#>

param(
    [string]$Command = "",
    [string]$Target  = "all"
)

Set-StrictMode -Off
$ErrorActionPreference = "SilentlyContinue"

# ── Config ───────────────────────────────────────────────────────────────────
$ProjectRoot  = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir   = Join-Path $ProjectRoot "backend"
$FrontendDir  = Join-Path $ProjectRoot "frontend"
$LogDir       = Join-Path $ProjectRoot "logs"
$BackendPort  = 8042
$FrontendPort = 5173
$BackendPidFile  = Join-Path $LogDir "backend.pid"
$FrontendPidFile = Join-Path $LogDir "frontend.pid"

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

# ── Colors ───────────────────────────────────────────────────────────────────
function Write-C($msg, $color = "White") { Write-Host $msg -ForegroundColor $color }
function OK($msg)   { Write-Host "  [OK] " -ForegroundColor Green  -NoNewline; Write-Host $msg }
function ERR($msg)  { Write-Host "  [!!] " -ForegroundColor Red    -NoNewline; Write-Host $msg }
function INF($msg)  { Write-Host "  [--] " -ForegroundColor Cyan   -NoNewline; Write-Host $msg }
function WARN($msg) { Write-Host "  [>>] " -ForegroundColor Yellow -NoNewline; Write-Host $msg }

function Write-Banner {
    Write-Host ""
    Write-C "  ╔══════════════════════════════════════════════╗" Cyan
    Write-C "  ║   AEGIS Lab — Process Manager                ║" Cyan
    Write-C "  ║   Backend :$BackendPort  |  Frontend :$FrontendPort        ║" DarkCyan
    Write-C "  ╚══════════════════════════════════════════════╝" Cyan
    Write-Host ""
}

# ── Port utils ───────────────────────────────────────────────────────────────
function Get-PidOnPort([int]$port) {
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conn) { return $conn.OwningProcess | Select-Object -First 1 }
    return $null
}

function Kill-Port([int]$port) {
    $pid = Get-PidOnPort $port
    if ($pid) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
        $check = Get-PidOnPort $port
        if (-not $check) { OK "Port $port freed (was PID $pid)" }
        else { ERR "Port $port still bound after kill attempt" }
    } else {
        INF "Port $port already free"
    }
}

function Get-PortStatus([int]$port) {
    $pid = Get-PidOnPort $port
    if ($pid) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        $name = if ($proc) { $proc.Name } else { "unknown" }
        return @{ Running = $true; Pid = $pid; Name = $name }
    }
    return @{ Running = $false; Pid = $null; Name = "" }
}

# ── HTTP Health ───────────────────────────────────────────────────────────────
function Test-BackendHttp {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$BackendPort/api/redteam/scenarios" -TimeoutSec 4 -UseBasicParsing -ErrorAction Stop
        return $r.StatusCode -eq 200
    } catch { return $false }
}

function Test-FrontendHttp {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$FrontendPort" -TimeoutSec 4 -UseBasicParsing -ErrorAction Stop
        return $r.StatusCode -lt 500
    } catch { return $false }
}

# ── Start ─────────────────────────────────────────────────────────────────────
function Start-Backend {
    $status = Get-PortStatus $BackendPort
    if ($status.Running) {
        WARN "Backend already running on :$BackendPort (PID $($status.Pid))"
        return
    }
    INF "Starting backend on :$BackendPort ..."
    $logFile = Join-Path $LogDir "backend.log"
    $proc = Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "Set-Location '$BackendDir'; Write-Host 'AEGIS Backend :$BackendPort' -ForegroundColor Cyan; python -m uvicorn server:app --host 0.0.0.0 --port $BackendPort --reload 2>&1 | Tee-Object -FilePath '$logFile'"
    ) -PassThru
    Start-Sleep -Seconds 2
    $pid = Get-PidOnPort $BackendPort
    if ($pid) {
        OK "Backend started (window PID $($proc.Id), port PID $pid)"
    } else {
        WARN "Backend window opened — waiting for port binding..."
    }
}

function Start-Frontend {
    $status = Get-PortStatus $FrontendPort
    if ($status.Running) {
        WARN "Frontend already running on :$FrontendPort (PID $($status.Pid))"
        return
    }
    INF "Starting frontend on :$FrontendPort ..."
    $logFile = Join-Path $LogDir "frontend.log"
    $proc = Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "Set-Location '$FrontendDir'; Write-Host 'AEGIS Frontend :$FrontendPort' -ForegroundColor Green; npm run dev 2>&1 | Tee-Object -FilePath '$logFile'"
    ) -PassThru
    Start-Sleep -Seconds 3
    $pid = Get-PidOnPort $FrontendPort
    if ($pid) {
        OK "Frontend started (window PID $($proc.Id), port PID $pid)"
    } else {
        WARN "Frontend window opened — waiting for port binding..."
    }
}

# ── Stop ──────────────────────────────────────────────────────────────────────
function Stop-Backend {
    INF "Stopping backend (:$BackendPort)..."
    Kill-Port $BackendPort
}

function Stop-Frontend {
    INF "Stopping frontend (:$FrontendPort)..."
    Kill-Port $FrontendPort
}

# ── Restart ───────────────────────────────────────────────────────────────────
function Restart-Backend {
    Stop-Backend
    Start-Sleep -Milliseconds 800
    Start-Backend
}

function Restart-Frontend {
    Stop-Frontend
    Start-Sleep -Milliseconds 800
    Start-Frontend
}

# ── Build ─────────────────────────────────────────────────────────────────────
function Build-Frontend {
    INF "Building frontend (Vite)..."
    Push-Location $FrontendDir
    $result = npm run build 2>&1
    $exit = $LASTEXITCODE
    Pop-Location
    if ($exit -eq 0) {
        $built = $result | Select-String "built in"
        OK ("Frontend built: " + ($built -join " ").Trim())
    } else {
        ERR "Frontend build FAILED"
        $result | Select-String "error" | ForEach-Object { Write-C "    $_" Red }
    }
}

function Build-Backend {
    INF "Checking backend (py_compile)..."
    Push-Location $BackendDir
    $errors = @()
    Get-ChildItem -Filter "*.py" -Recurse -Depth 1 | ForEach-Object {
        $out = python -m py_compile $_.FullName 2>&1
        if ($LASTEXITCODE -ne 0) { $errors += "$($_.Name): $out" }
    }
    Pop-Location
    if ($errors.Count -eq 0) {
        OK "Backend syntax OK (all .py files compile)"
    } else {
        ERR "Backend compile errors:"
        $errors | ForEach-Object { Write-C "    $_" Red }
    }
}

# ── Health ────────────────────────────────────────────────────────────────────
function Show-Health {
    Write-Host ""
    Write-C "  HEALTH CHECK" DarkCyan
    Write-C "  ──────────────────────────────────────────────" DarkGray

    # Backend
    $bs = Get-PortStatus $BackendPort
    if ($bs.Running) {
        $http = Test-BackendHttp
        $httpStr = if ($http) { "HTTP 200" } else { "HTTP unreachable" }
        $httpColor = if ($http) { "Green" } else { "Yellow" }
        Write-Host "  Backend  :$BackendPort  " -NoNewline
        Write-Host "RUNNING " -ForegroundColor Green -NoNewline
        Write-Host "(PID $($bs.Pid) / $($bs.Name))  " -ForegroundColor DarkGray -NoNewline
        Write-Host $httpStr -ForegroundColor $httpColor
    } else {
        Write-Host "  Backend  :$BackendPort  " -NoNewline
        Write-Host "STOPPED" -ForegroundColor Red
    }

    # Frontend
    $fs = Get-PortStatus $FrontendPort
    if ($fs.Running) {
        $http = Test-FrontendHttp
        $httpStr = if ($http) { "HTTP 200" } else { "HTTP unreachable" }
        $httpColor = if ($http) { "Green" } else { "Yellow" }
        Write-Host "  Frontend :$FrontendPort  " -NoNewline
        Write-Host "RUNNING " -ForegroundColor Green -NoNewline
        Write-Host "(PID $($fs.Pid) / $($fs.Name))  " -ForegroundColor DarkGray -NoNewline
        Write-Host $httpStr -ForegroundColor $httpColor
    } else {
        Write-Host "  Frontend :$FrontendPort  " -NoNewline
        Write-Host "STOPPED" -ForegroundColor Red
    }

    # Ollama
    try {
        $ol = Invoke-WebRequest -Uri "http://localhost:11434" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        Write-Host "  Ollama   :11434  " -NoNewline
        Write-Host "RUNNING" -ForegroundColor Green
    } catch {
        Write-Host "  Ollama   :11434  " -NoNewline
        Write-Host "STOPPED" -ForegroundColor DarkGray
    }

    Write-Host ""
}

# ── Logs ──────────────────────────────────────────────────────────────────────
function Show-Logs([string]$target = "all") {
    $backLog  = Join-Path $LogDir "backend.log"
    $frontLog = Join-Path $LogDir "frontend.log"

    if ($target -eq "backend" -and (Test-Path $backLog)) {
        Write-C "`n  === backend.log (last 30 lines) ===" Cyan
        Get-Content $backLog -Tail 30
    } elseif ($target -eq "frontend" -and (Test-Path $frontLog)) {
        Write-C "`n  === frontend.log (last 30 lines) ===" Green
        Get-Content $frontLog -Tail 30
    } else {
        if (Test-Path $backLog) {
            Write-C "`n  === backend.log (last 15 lines) ===" Cyan
            Get-Content $backLog -Tail 15
        }
        if (Test-Path $frontLog) {
            Write-C "`n  === frontend.log (last 15 lines) ===" Green
            Get-Content $frontLog -Tail 15
        }
        if (-not (Test-Path $backLog) -and -not (Test-Path $frontLog)) {
            INF "No log files yet in $LogDir"
        }
    }
    Write-Host ""
}

# ── Dispatch target ───────────────────────────────────────────────────────────
function Invoke-Start([string]$t) {
    switch ($t) {
        "backend"  { Start-Backend }
        "frontend" { Start-Frontend }
        default    { Start-Backend; Start-Frontend }
    }
}
function Invoke-Stop([string]$t) {
    switch ($t) {
        "backend"  { Stop-Backend }
        "frontend" { Stop-Frontend }
        default    { Stop-Backend; Stop-Frontend }
    }
}
function Invoke-Restart([string]$t) {
    switch ($t) {
        "backend"  { Restart-Backend }
        "frontend" { Restart-Frontend }
        default    { Stop-Backend; Stop-Frontend; Start-Sleep -Seconds 1; Start-Backend; Start-Frontend }
    }
}
function Invoke-Build([string]$t) {
    switch ($t) {
        "backend"  { Build-Backend }
        "frontend" { Build-Frontend }
        default    { Build-Backend; Build-Frontend }
    }
}

# ── Interactive menu ──────────────────────────────────────────────────────────
function Show-Menu {
    while ($true) {
        Clear-Host
        Write-Banner
        Show-Health

        Write-C "  ┌──────────────────────────────────────────┐" DarkGray
        Write-C "  │  1  Start all          5  Build frontend  │" White
        Write-C "  │  2  Stop all           6  Build backend   │" White
        Write-C "  │  3  Restart all        7  Kill :$BackendPort        │" White
        Write-C "  │  4  Health check       8  Kill :$FrontendPort       │" White
        Write-C "  │                        9  View logs        │" White
        Write-C "  │  b  Start backend     fb  Start frontend   │" DarkGray
        Write-C "  │  B  Stop backend      fB  Stop frontend    │" DarkGray
        Write-C "  │                        0  Exit              │" Yellow
        Write-C "  └──────────────────────────────────────────┘" DarkGray
        Write-Host ""

        $choice = Read-Host "  Choice"
        Write-Host ""

        switch ($choice.Trim().ToLower()) {
            "1"  { Invoke-Start "all" }
            "2"  { Invoke-Stop "all" }
            "3"  { Invoke-Restart "all" }
            "4"  { Show-Health }
            "5"  { Build-Frontend }
            "6"  { Build-Backend }
            "7"  { Kill-Port $BackendPort }
            "8"  { Kill-Port $FrontendPort }
            "9"  { Show-Logs "all" }
            "b"  { Start-Backend }
            "fb" { Start-Frontend }
            "big_b" { Stop-Backend }    # B
            "fb" { Start-Frontend }
            "fb2" { Stop-Frontend }
            "0"  { Write-C "`n  Bye.`n" Cyan; return }
            default { WARN "Unknown option: $choice" }
        }

        # Handle uppercase B / fB
        if ($choice -ceq "B")  { Stop-Backend }
        if ($choice -ceq "fB") { Stop-Frontend }

        Write-Host ""
        Read-Host "  Press Enter to continue"
    }
}

# ── Entry point ───────────────────────────────────────────────────────────────
if ($Command -eq "") {
    Show-Menu
    exit 0
}

Write-Banner
switch ($Command.ToLower()) {
    "start"      { Invoke-Start   $Target }
    "stop"       { Invoke-Stop    $Target }
    "restart"    { Invoke-Restart $Target }
    "health"     { Show-Health }
    "build"      { Invoke-Build   $Target }
    "kill-port"  { if ($Target -match '^\d+$') { Kill-Port [int]$Target } else { ERR "Usage: aegis.ps1 kill-port <port>" } }
    "logs"       { Show-Logs      $Target }
    "open"       { Start-Process "http://localhost:$FrontendPort" }
    default {
        Write-C "`n  Commands: start | stop | restart | health | build | kill-port | logs | open" Yellow
        Write-C "  Targets : all | backend | frontend`n" DarkGray
    }
}
