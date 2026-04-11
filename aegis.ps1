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

#  
$ProjectRoot  = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir   = Join-Path $ProjectRoot "backend"
$FrontendDir  = Join-Path $ProjectRoot "frontend"
$WikiDir      = Join-Path $ProjectRoot "wiki"
$LogDir       = Join-Path $ProjectRoot "logs"
$BackendPort  = 8042
$FrontendPort = 5173
$WikiPort     = 8001

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

# 
function Write-C($msg, $color = "White") { Write-Host $msg -ForegroundColor $color }
function OK($msg)   { Write-Host "  [OK] " -ForegroundColor Green  -NoNewline; Write-Host $msg }
function ERR($msg)  { Write-Host "  [!!] " -ForegroundColor Red    -NoNewline; Write-Host $msg }
function INF($msg)  { Write-Host "  [--] " -ForegroundColor Cyan   -NoNewline; Write-Host $msg }
function WARN($msg) { Write-Host "  [>>] " -ForegroundColor Yellow -NoNewline; Write-Host $msg }

function Write-Banner {
    Write-Host ""
    Write-C "  +================================================+" Cyan
    Write-C "  |   AEGIS Lab -- Process Manager                 |" Cyan
    Write-C "  |   Backend :$BackendPort | Frontend :$FrontendPort | Wiki :$WikiPort |" DarkCyan
    Write-C "  +================================================+" Cyan
    Write-Host ""
}

# 
function Get-PidOnPort([int]$port) {
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conn) { return $conn.OwningProcess | Select-Object -First 1 }
    return $null
}

function Get-AllPidsOnPort([int]$port) {
    # Returns ALL PIDs bound to the port (LISTENING + ESTABLISHED), including
    # forked worker children (uvicorn reload, multiprocessing spawn, etc.).
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if (-not $conns) { return @() }
    return ($conns.OwningProcess | Select-Object -Unique)
}

function Kill-ProcessTree([int]$processPid) {
    # Walk + kill the full process tree via taskkill /T.
    # Fix for PDCA cycle 3 / RETEX 2026-04-11:
    # uvicorn reload workers and multiprocessing spawn children inherit the
    # listening socket handle. Stop-Process only kills the parent — the child
    # keeps the port alive. taskkill /T walks the tree and kills all descendants.
    if (-not $processPid) { return }
    & taskkill.exe /F /T /PID $processPid 2>&1 | Out-Null
}

function Kill-Port([int]$port) {
    $allPids = Get-AllPidsOnPort $port
    if ($allPids.Count -eq 0) {
        INF "Port $port already free."
        return
    }

    # First pass: kill process trees of all PIDs currently bound to the port
    foreach ($p in $allPids) {
        INF "Killing process tree $p on port $port..."
        Kill-ProcessTree $p
    }

    # Wait up to 3 seconds for the port to be released
    $timeout = 6
    while ($timeout -gt 0) {
        Start-Sleep -Milliseconds 500
        if (-not (Get-AllPidsOnPort $port)) {
            OK "Port $port freed."
            return
        }
        $timeout--
    }

    # Second pass: some ghost PIDs may have been replaced by forked workers
    # that inherited the socket. Re-scan and kill any remaining holder.
    $remaining = Get-AllPidsOnPort $port
    if ($remaining.Count -gt 0) {
        WARN "Port $port still held by orphan PID(s) after first pass: $($remaining -join ', ')"
        foreach ($p in $remaining) {
            INF "Killing orphan PID $p..."
            Kill-ProcessTree $p
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Milliseconds 800
        if (-not (Get-AllPidsOnPort $port)) {
            OK "Port $port freed after orphan cleanup."
            return
        }
    }

    ERR "Port $port still bound after kill attempt (PIDs: $((Get-AllPidsOnPort $port) -join ', '))."
}

function Get-PortStatus([int]$port) {
    $FoundPid = Get-PidOnPort $port
    if ($FoundPid) {
        $proc = Get-Process -Id $FoundPid -ErrorAction SilentlyContinue
        $name = if ($proc) { $proc.Name } else { "unknown" }
        return @{ Running = $true; Pid = $FoundPid; Name = $name }
    }
    return @{ Running = $false; Pid = $null; Name = "" }
}

# 
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

# 
function Start-Backend {
    $status = Get-PortStatus $BackendPort
    if ($status.Running) {
        WARN "Backend already running on :$BackendPort (PID $($status.Pid))"
        return
    }
    INF "Starting backend on :$BackendPort ..."
    $logFile = Join-Path $LogDir "backend.log"
    $tmpScript = Join-Path $env:TEMP "aegis_backend.ps1"
    "Set-Location '$BackendDir'; python -m uvicorn server:app --host 0.0.0.0 --port $BackendPort --reload 2>&1 | Tee-Object -FilePath '$logFile'" | Out-File -FilePath $tmpScript -Encoding utf8
    $proc = Start-Process powershell -ArgumentList "-NoProfile", "-NonInteractive", "-File", $tmpScript -WindowStyle Hidden -PassThru
    Start-Sleep -Seconds 3
    $FoundPid = Get-PidOnPort $BackendPort
    if ($FoundPid) {
        OK "Backend started (PID $FoundPid)"
    } else {
        WARN "Backend process launched (PID $($proc.Id)) - port binding pending..."
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
    $tmpScript = Join-Path $env:TEMP "aegis_frontend.ps1"
    "Set-Location '$FrontendDir'; npm run dev 2>&1 | Tee-Object -FilePath '$logFile'" | Out-File -FilePath $tmpScript -Encoding utf8
    $proc = Start-Process powershell -ArgumentList "-NoProfile", "-NonInteractive", "-File", $tmpScript -WindowStyle Hidden -PassThru
    Start-Sleep -Seconds 6
    $FoundPid = Get-PidOnPort $FrontendPort
    if ($FoundPid) {
        OK "Frontend started (PID $FoundPid)"
    } else {
        WARN "Frontend process launched (PID $($proc.Id)) - port binding pending..."
    }
}

#  
function Stop-Backend {
    INF "Stopping backend (:$BackendPort)..."
    Kill-Port $BackendPort
}

function Stop-Frontend {
    INF "Stopping frontend (:$FrontendPort)..."
    Kill-Port $FrontendPort
}

# 
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

# ── Wiki ──────────────────────────────────────────────────────────────────────
function Start-Wiki {
    $status = Get-PortStatus $WikiPort
    if ($status.Running) {
        WARN "Wiki already running on :$WikiPort (PID $($status.Pid))"
        return
    }
    INF "Building wiki docs..."
    Push-Location $WikiDir
    python build_wiki.py 2>&1 | Out-Null
    Pop-Location
    INF "Starting wiki on :$WikiPort ..."
    $logFile = Join-Path $LogDir "wiki.log"
    $tmpScript = Join-Path $env:TEMP "aegis_wiki.ps1"
    $pyScripts = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'Python\Python313\Scripts'
    "if (Test-Path '$pyScripts') { `$env:PATH += ';$pyScripts' }`nSet-Location '$WikiDir'`npython -m mkdocs serve --dev-addr 127.0.0.1:$WikiPort --no-livereload 2>&1 | Tee-Object -FilePath '$logFile'" | Out-File -FilePath $tmpScript -Encoding utf8
    $proc = Start-Process powershell -ArgumentList "-NoProfile", "-NonInteractive", "-File", $tmpScript -WindowStyle Hidden -PassThru
    Start-Sleep -Seconds 4
    $FoundPid = Get-PidOnPort $WikiPort
    if ($FoundPid) {
        OK "Wiki started (PID $FoundPid) -> http://localhost:$WikiPort"
    } else {
        WARN "Wiki process launched (PID $($proc.Id)) - port binding pending..."
    }
}

function Stop-Wiki {
    INF "Stopping wiki (:$WikiPort)..."
    Kill-Port $WikiPort
}

function Restart-Wiki {
    Stop-Wiki
    Start-Sleep -Milliseconds 800
    Start-Wiki
}

function Test-WikiHttp {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$WikiPort" -TimeoutSec 4 -UseBasicParsing -ErrorAction Stop
        return $r.StatusCode -lt 500
    } catch { return $false }
}

function Build-Wiki {
    INF "Building wiki docs..."
    $pyScripts = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'Python\Python313\Scripts'
    if (Test-Path $pyScripts) { $env:PATH += ";$pyScripts" }
    Push-Location $WikiDir
    $buildOut = python build_wiki.py 2>&1
    $mkdocsOut = python -m mkdocs build 2>&1
    $exit = $LASTEXITCODE
    Pop-Location
    if ($exit -eq 0) {
        $pages = ($buildOut | Select-String "Pages:").ToString().Trim()
        OK "Wiki built: $pages"
    } else {
        ERR "Wiki build FAILED"
        $mkdocsOut | Select-String "ERROR" | ForEach-Object { Write-C "    $_" Red }
    }
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
    Write-C "  HEALTH STATUS" DarkCyan
    Write-C "  -----------------------------------------------------------" DarkGray

    # Table Header
    Write-Host "  Component   | Port | Status   | PID        | HTTP Check" -ForegroundColor DarkGray

    # Backend
    $bs = Get-PortStatus $BackendPort
    $bStatus = if ($bs.Running) { "RUNNING" } else { "STOPPED" }
    $bColor = if ($bs.Running) { "Green" } else { "Red" }
    $bPid = if ($bs.Pid) { [string]$bs.Pid } else { "-" }
    $bHttp = if ($bs.Running) { if (Test-BackendHttp) { "OK (200)" } else { "Unreachable" } } else { "-" }

    Write-Host ("  Backend     | 8042 | " + $bStatus + " | " + $bPid + " | " + $bHttp) -ForegroundColor $bColor

    # Frontend
    $fs = Get-PortStatus $FrontendPort
    $fStatus = if ($fs.Running) { "RUNNING" } else { "STOPPED" }
    $fColor = if ($fs.Running) { "Green" } else { "Red" }
    $fPid = if ($fs.Pid) { [string]$fs.Pid } else { "-" }
    $fHttp = if ($fs.Running) { if (Test-FrontendHttp) { "OK (200)" } else { "Unreachable" } } else { "-" }

    Write-Host ("  Frontend    | 5173 | " + $fStatus + " | " + $fPid + " | " + $fHttp) -ForegroundColor $fColor

    # Ollama
    $olRunning = $false
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:11434" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        $olRunning = $true
    } catch { }

    $status = if ($olRunning) { "RUNNING" } else { "STOPPED" }
    $sColor = if ($olRunning) { "Green" } else { "Red" }
    Write-Host "  {0,-12} | {1,-6} | " -f "Ollama", 11434 -NoNewline -ForegroundColor White
    Write-Host $status -ForegroundColor $sColor

    # Wiki
    $ws = Get-PortStatus $WikiPort
    $wStatus = if ($ws.Running) { "RUNNING" } else { "STOPPED" }
    $wColor = if ($ws.Running) { "Green" } else { "Red" }
    $wPid = if ($ws.Pid) { [string]$ws.Pid } else { "-" }
    $wHttp = if ($ws.Running) { if (Test-WikiHttp) { "OK (200)" } else { "Unreachable" } } else { "-" }

    Write-Host ("  Wiki        | $WikiPort | " + $wStatus + " | " + $wPid + " | " + $wHttp) -ForegroundColor $wColor

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
        "wiki"     { Start-Wiki }
        default    { Start-Backend; Start-Frontend; Start-Wiki }
    }
}
function Invoke-Stop([string]$t) {
    switch ($t) {
        "backend"  { Stop-Backend }
        "frontend" { Stop-Frontend }
        "wiki"     { Stop-Wiki }
        default    { Stop-Backend; Stop-Frontend; Stop-Wiki }
    }
}
function Invoke-Restart([string]$t) {
    INF "Restarting services ($t)..."
    switch ($t) {
        "backend"  { Restart-Backend }
        "frontend" { Restart-Frontend }
        "wiki"     { Restart-Wiki }
        default    {
            Stop-Backend
            Stop-Frontend
            Stop-Wiki
            Start-Sleep -Seconds 2
            Start-Backend
            Start-Frontend
            Start-Wiki
        }
    }
}
function Invoke-Build([string]$t) {
    switch ($t) {
        "backend"  { Build-Backend }
        "frontend" { Build-Frontend }
        "wiki"     { Build-Wiki }
        default    { Build-Backend; Build-Frontend; Build-Wiki }
    }
}

# ── Interactive menu ──────────────────────────────────────────────────────────
function Show-Menu {
    while ($true) {
        Clear-Host
        Write-Banner
        Show-Health

        Write-C "  +-----------------------------------------------------------+" DarkGray
        Write-C "  | [GLOBAL COMMANDS]           [BUILD & TOOLS]               |" White
        Write-C ("  |  1: Start All               5: Build Frontend             |" -f "") White
        Write-C ("  |  2: Stop All                6: Build Backend              |" -f "") White
        Write-C ("  |  3: Restart All             7: View Logs                  |" -f "") White
        Write-C ("  |  4: Refresh Health          8: Open UI in Browser         |" -f "") White
        Write-C ("  |                             9: Build Wiki                 |" -f "") White
        Write-C "  |                                                           |" DarkGray
        Write-C "  | [TARGETED COMMANDS]                                       |" White
        Write-C ("  |  b: Start Backend           B: Stop Backend               |" -f "") White
        Write-C ("  |  f: Start Frontend          F: Stop Frontend              |" -f "") White
        Write-C ("  |  w: Start Wiki              W: Stop Wiki                  |" -f "") White
        Write-C ("  |  rb: Restart Backend        rf: Restart Frontend          |" -f "") White
        Write-C ("  |  rw: Restart Wiki           ow: Open Wiki in Browser      |" -f "") White
        Write-C "  |                                                           |" DarkGray
        Write-C ("  |                           0: Exit                         |" -f "") Yellow
        Write-C "  +-----------------------------------------------------------+" DarkGray
        Write-Host ""

        $choice = Read-Host "  Action ID"
        Write-Host ""

        switch ($choice.Trim().ToLower()) {
            "1"  { Invoke-Start "all" }
            "2"  { Invoke-Stop "all" }
            "3"  { Invoke-Restart "all" }
            "4"  { Show-Health }
            "5"  { Build-Frontend }
            "6"  { Build-Backend }
            "7"  { Show-Logs "all" }
            "8"  { Start-Process "http://localhost:$FrontendPort" }
            "9"  { Build-Wiki }
            "b"  { Start-Backend }
            "f"  { Start-Frontend }
            "w"  { Start-Wiki }
            "rb" { Restart-Backend }
            "rf" { Restart-Frontend }
            "rw" { Restart-Wiki }
            "ow" { Start-Process "http://localhost:$WikiPort" }
            "0"  { Write-C "`n  Exiting AEGIS Process Manager.`n" Cyan; return }
            default {
                # Handle Uppercase targets if not caught by tolower()
                if ($choice -ceq "B")  { Stop-Backend }
                elseif ($choice -ceq "F") { Stop-Frontend }
                elseif ($choice -ceq "W") { Stop-Wiki }
                else { WARN "Unknown action: $choice" }
            }
        }

        Write-Host ""
        Read-Host "  Done. Press Enter to refresh menu"
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
    "kill-port"  {
        if ($Target -match "^\d+`$") {
            Kill-Port ([int]$Target)
        } else {
            ERR "Usage: aegis.ps1 kill-port <port>"
        }
    }
    "logs"       { Show-Logs      $Target }
    "open"       { Start-Process "http://localhost:$FrontendPort" }
    "wiki"       { Start-Process "http://localhost:$WikiPort" }
    default {
        Write-C "`n  Commands: start | stop | restart | health | build | kill-port | logs | open | wiki" Yellow
        Write-C "  Targets : all | backend | frontend | wiki`n" DarkGray
    }
}
