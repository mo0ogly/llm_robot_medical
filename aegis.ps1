#Requires -Version 5.1
<#
.SYNOPSIS
    AEGIS Lab — Process Manager (v2)
.DESCRIPTION
    Manage all AEGIS services:
      - Backend  (FastAPI :8042)
      - Frontend (Vite   :5173)
      - Wiki     (MkDocs :8001) — build_wiki.py + mkdocs serve
      - Forge    (Genetic engine, no persistent process — on-demand)
      - Demo     (Triple convergence / red team runner)
    CLI  : .\aegis.ps1 <command> [target]
    Menu : .\aegis.ps1
.EXAMPLE
    .\aegis.ps1 start              # backend + frontend + wiki
    .\aegis.ps1 start backend
    .\aegis.ps1 stop frontend
    .\aegis.ps1 restart
    .\aegis.ps1 health
    .\aegis.ps1 build              # backend check + frontend vite + wiki mkdocs
    .\aegis.ps1 build wiki         # build_wiki.py + mkdocs build --clean
    .\aegis.ps1 build frontend
    .\aegis.ps1 forge              # launch genetic prompt optimizer (SSE)
    .\aegis.ps1 demo               # run triple-convergence demo (210 runs)
    .\aegis.ps1 demo redteam       # run autonomous red-team session
    .\aegis.ps1 logs
    .\aegis.ps1 logs wiki
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
$WikiDir      = Join-Path $ProjectRoot "wiki"
$LogDir       = Join-Path $ProjectRoot "logs"
$BackendPort  = 8042
$FrontendPort = 5173
$WikiPort     = 8001

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

# ── Helpers ──────────────────────────────────────────────────────────────────
function Write-C($msg, $color = "White") { Write-Host $msg -ForegroundColor $color }
function OK($msg)   { Write-Host "  [OK] " -ForegroundColor Green  -NoNewline; Write-Host $msg }
function ERR($msg)  { Write-Host "  [!!] " -ForegroundColor Red    -NoNewline; Write-Host $msg }
function INF($msg)  { Write-Host "  [--] " -ForegroundColor Cyan   -NoNewline; Write-Host $msg }
function WARN($msg) { Write-Host "  [>>] " -ForegroundColor Yellow -NoNewline; Write-Host $msg }

function Write-Banner {
    Write-Host ""
    Write-C "  +================================================+" Cyan
    Write-C "  |   AEGIS Lab -- Process Manager  (v2)           |" Cyan
    Write-C "  |   Backend :$BackendPort | Frontend :$FrontendPort | Wiki :$WikiPort |" DarkCyan
    Write-C "  |   Forge: on-demand | Demo: on-demand           |" DarkCyan
    Write-C "  +================================================+" Cyan
    Write-Host ""
}

# ── Port utils ───────────────────────────────────────────────────────────────
function Get-PidOnPort([int]$port) {
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conn) { return $conn.OwningProcess | Select-Object -First 1 }
    return $null
}

function Get-AllPidsOnPort([int]$port) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if (-not $conns) { return @() }
    return ($conns.OwningProcess | Select-Object -Unique)
}

function Kill-ProcessTree([int]$processPid) {
    if (-not $processPid) { return }
    & taskkill.exe /F /T /PID $processPid 2>&1 | Out-Null
}

function Kill-Port([int]$port) {
    $allPids = Get-AllPidsOnPort $port
    if ($allPids.Count -eq 0) {
        INF "Port $port already free."
        return
    }

    foreach ($p in $allPids) {
        INF "Killing process tree $p on port $port..."
        Kill-ProcessTree $p
    }

    $timeout = 6
    while ($timeout -gt 0) {
        Start-Sleep -Milliseconds 500
        if (-not (Get-AllPidsOnPort $port)) {
            OK "Port $port freed."
            return
        }
        $timeout--
    }

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

# ── HTTP health ──────────────────────────────────────────────────────────────
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

function Test-WikiHttp {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$WikiPort" -TimeoutSec 4 -UseBasicParsing -ErrorAction Stop
        return $r.StatusCode -lt 500
    } catch { return $false }
}

# ── Start ────────────────────────────────────────────────────────────────────
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

function Start-Wiki {
    $status = Get-PortStatus $WikiPort
    if ($status.Running) {
        WARN "Wiki already running on :$WikiPort (PID $($status.Pid))"
        return
    }
    INF "Building wiki docs (build_wiki.py)..."
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

# ── Stop ─────────────────────────────────────────────────────────────────────
function Stop-Backend {
    INF "Stopping backend (:$BackendPort)..."
    Kill-Port $BackendPort
}

function Stop-Frontend {
    INF "Stopping frontend (:$FrontendPort)..."
    Kill-Port $FrontendPort
}

function Stop-Wiki {
    INF "Stopping wiki (:$WikiPort)..."
    Kill-Port $WikiPort
}

# ── Restart ──────────────────────────────────────────────────────────────────
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

function Restart-Wiki {
    Stop-Wiki
    Start-Sleep -Milliseconds 800
    Start-Wiki
}

# ── Build ────────────────────────────────────────────────────────────────────
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

function Build-Wiki {
    INF "Step 1/2: Syncing wiki sources (build_wiki.py)..."
    $pyScripts = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'Python\Python313\Scripts'
    if (Test-Path $pyScripts) { $env:PATH += ";$pyScripts" }
    Push-Location $WikiDir
    $syncOut = python build_wiki.py 2>&1
    $syncExit = $LASTEXITCODE
    if ($syncExit -ne 0) {
        ERR "build_wiki.py FAILED"
        $syncOut | Select-String "Error|Exception" | ForEach-Object { Write-C "    $_" Red }
        Pop-Location
        return
    }
    OK "build_wiki.py sync done"

    INF "Step 2/2: Building MkDocs site (mkdocs build --clean)..."
    $mkdocsOut = python -m mkdocs build --clean 2>&1
    $mkdocsExit = $LASTEXITCODE
    Pop-Location
    if ($mkdocsExit -eq 0) {
        $duration = $mkdocsOut | Select-String "built in"
        $warns    = ($mkdocsOut | Select-String "^WARNING" | Measure-Object).Count
        $errs     = ($mkdocsOut | Select-String "^ERROR" | Measure-Object).Count
        OK "MkDocs built ($duration) | $warns warnings, $errs errors"
    } else {
        ERR "MkDocs build FAILED"
        $mkdocsOut | Select-String "ERROR" | ForEach-Object { Write-C "    $_" Red }
    }
}

# ── Forge (genetic prompt optimizer) ─────────────────────────────────────────
function Start-Forge {
    INF "Launching Genetic Prompt Optimizer (Forge)..."
    $bs = Get-PortStatus $BackendPort
    if (-not $bs.Running) {
        ERR "Backend must be running on :$BackendPort for the Forge to work."
        INF "Run: .\aegis.ps1 start backend"
        return
    }
    Write-C "" White
    Write-C "  The Forge uses the SSE endpoint POST /api/redteam/genetic/stream" DarkCyan
    Write-C "  It requires a running backend and an Ollama model." DarkCyan
    Write-C "" White

    $intention = Read-Host "  Attack intention (default: tool_hijack)"
    if (-not $intention) { $intention = "tool_hijack" }
    $maxIter = Read-Host "  Max iterations  (default: 20)"
    if (-not $maxIter) { $maxIter = "20" }
    $popSize = Read-Host "  Population size (default: 10)"
    if (-not $popSize) { $popSize = "10" }

    $logFile = Join-Path $LogDir "forge.log"
    INF "Streaming forge to $logFile (and console)..."
    Write-Host ""

    $body = @{
        intention       = $intention
        max_iterations  = [int]$maxIter
        population_size = [int]$popSize
        mutation_rate   = 0.5
        crossover_rate  = 0.1
        aegis_shield    = $false
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest `
            -Uri "http://localhost:$BackendPort/api/redteam/genetic/stream" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -TimeoutSec 600 `
            -UseBasicParsing `
            -ErrorAction Stop
        $response.Content | Out-File -FilePath $logFile -Encoding utf8
        $response.Content -split "`n" | Select-String "best_fitness|generation|COMPLETE" | ForEach-Object { Write-C "    $_" Green }
        OK "Forge completed. Full output in $logFile"
    } catch {
        ERR "Forge request failed: $_"
    }
}

# ── Demo (triple convergence / red team) ─────────────────────────────────────
function Start-Demo {
    param([string]$mode = "convergence")

    switch ($mode) {
        "redteam" {
            INF "Launching autonomous Red Team session..."
            $logFile = Join-Path $LogDir "demo_redteam.log"
            $rounds = Read-Host "  Rounds (default: 5)"
            if (-not $rounds) { $rounds = "5" }
            $type = Read-Host "  Type [injection|prompt_leak|rule_bypass|all] (default: all)"
            if (-not $type) { $type = "injection" }

            Push-Location $BackendDir
            INF "Running: python run_redteam.py --type $type --rounds $rounds"
            Write-Host ""
            python run_redteam.py --type $type --rounds $rounds 2>&1 | Tee-Object -FilePath $logFile
            $exit = $LASTEXITCODE
            Pop-Location
            if ($exit -eq 0) {
                OK "Red Team demo completed. Log: $logFile"
            } else {
                ERR "Red Team demo failed (exit $exit). Log: $logFile"
            }
        }
        default {
            INF "Launching Triple Convergence demo (210 runs: 7 conditions x 30 prompts)..."
            $logFile = Join-Path $LogDir "demo_convergence.log"

            Push-Location $BackendDir
            INF "Running: python run_triple_convergence.py"
            Write-Host ""
            python run_triple_convergence.py 2>&1 | Tee-Object -FilePath $logFile
            $exit = $LASTEXITCODE
            Pop-Location
            if ($exit -eq 0) {
                OK "Triple Convergence demo completed. Log: $logFile"
            } else {
                ERR "Demo failed (exit $exit). Log: $logFile"
            }
        }
    }
}

# ── Test ─────────────────────────────────────────────────────────────────────
function Run-Tests {
    INF "Running backend tests (pytest)..."
    Push-Location $BackendDir
    $logFile = Join-Path $LogDir "test.log"
    python -m pytest tests/ -v 2>&1 | Tee-Object -FilePath $logFile
    $exit = $LASTEXITCODE
    Pop-Location
    if ($exit -eq 0) {
        OK "All tests passed."
    } else {
        ERR "Some tests failed (exit $exit). Log: $logFile"
    }
}

# ── Health ───────────────────────────────────────────────────────────────────
function Show-Health {
    Write-Host ""
    Write-C "  HEALTH STATUS" DarkCyan
    Write-C "  -----------------------------------------------------------" DarkGray
    Write-Host "  Component   | Port  | Status   | PID        | HTTP Check" -ForegroundColor DarkGray

    # Backend
    $bs = Get-PortStatus $BackendPort
    $bStatus = if ($bs.Running) { "RUNNING" } else { "STOPPED" }
    $bColor = if ($bs.Running) { "Green" } else { "Red" }
    $bPid = if ($bs.Pid) { [string]$bs.Pid } else { "-" }
    $bHttp = if ($bs.Running) { if (Test-BackendHttp) { "OK (200)" } else { "Unreachable" } } else { "-" }
    Write-Host ("  Backend     | $BackendPort | " + $bStatus + " | " + $bPid + " | " + $bHttp) -ForegroundColor $bColor

    # Frontend
    $fs = Get-PortStatus $FrontendPort
    $fStatus = if ($fs.Running) { "RUNNING" } else { "STOPPED" }
    $fColor = if ($fs.Running) { "Green" } else { "Red" }
    $fPid = if ($fs.Pid) { [string]$fs.Pid } else { "-" }
    $fHttp = if ($fs.Running) { if (Test-FrontendHttp) { "OK (200)" } else { "Unreachable" } } else { "-" }
    Write-Host ("  Frontend    | $FrontendPort | " + $fStatus + " | " + $fPid + " | " + $fHttp) -ForegroundColor $fColor

    # Wiki
    $ws = Get-PortStatus $WikiPort
    $wStatus = if ($ws.Running) { "RUNNING" } else { "STOPPED" }
    $wColor = if ($ws.Running) { "Green" } else { "Red" }
    $wPid = if ($ws.Pid) { [string]$ws.Pid } else { "-" }
    $wHttp = if ($ws.Running) { if (Test-WikiHttp) { "OK (200)" } else { "Unreachable" } } else { "-" }
    Write-Host ("  Wiki        | $WikiPort | " + $wStatus + " | " + $wPid + " | " + $wHttp) -ForegroundColor $wColor

    # Ollama
    $olRunning = $false
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:11434" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        $olRunning = $true
    } catch { }
    $status = if ($olRunning) { "RUNNING" } else { "STOPPED" }
    $sColor = if ($olRunning) { "Green" } else { "Red" }
    Write-Host "  {0,-12} | {1,-5} | " -f "Ollama", 11434 -NoNewline -ForegroundColor White
    Write-Host $status -ForegroundColor $sColor

    Write-Host ""
}

# ── Logs ─────────────────────────────────────────────────────────────────────
function Show-Logs([string]$target = "all") {
    $logMap = @{
        "backend"  = "backend.log"
        "frontend" = "frontend.log"
        "wiki"     = "wiki.log"
        "forge"    = "forge.log"
        "demo"     = "demo_convergence.log"
        "redteam"  = "demo_redteam.log"
        "test"     = "test.log"
    }

    if ($target -ne "all" -and $logMap.ContainsKey($target)) {
        $f = Join-Path $LogDir $logMap[$target]
        if (Test-Path $f) {
            Write-C "`n  === $($logMap[$target]) (last 40 lines) ===" Cyan
            Get-Content $f -Tail 40
        } else {
            INF "No log file yet: $($logMap[$target])"
        }
    } else {
        foreach ($k in @("backend","frontend","wiki","forge","demo","redteam")) {
            $f = Join-Path $LogDir $logMap[$k]
            if (Test-Path $f) {
                Write-C "`n  === $($logMap[$k]) (last 10 lines) ===" Cyan
                Get-Content $f -Tail 10
            }
        }
        $anyLog = Get-ChildItem $LogDir -Filter "*.log" -ErrorAction SilentlyContinue
        if (-not $anyLog) { INF "No log files yet in $LogDir" }
    }
    Write-Host ""
}

# ── Dispatch target ──────────────────────────────────────────────────────────
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

# ── Interactive menu ─────────────────────────────────────────────────────────
function Show-Menu {
    while ($true) {
        Clear-Host
        Write-Banner
        Show-Health

        Write-C "  +-----------------------------------------------------------+" DarkGray
        Write-C "  | [SERVICES]                  [BUILD & TOOLS]               |" White
        Write-C "  |  1: Start All                5: Build Frontend             |" White
        Write-C "  |  2: Stop All                 6: Build Backend              |" White
        Write-C "  |  3: Restart All              7: Build Wiki (full)          |" White
        Write-C "  |  4: Refresh Health           8: Run Tests (pytest)         |" White
        Write-C "  |                                                           |" DarkGray
        Write-C "  | [TARGETED]                   [RESEARCH]                   |" White
        Write-C "  |  b: Start Backend            g: Forge (genetic engine)     |" White
        Write-C "  |  f: Start Frontend           d: Demo (triple convergence)  |" White
        Write-C "  |  w: Start Wiki               r: Demo (red team session)    |" White
        Write-C "  |  B: Stop Backend             9: View Logs                  |" White
        Write-C "  |  F: Stop Frontend            o: Open Frontend in browser   |" White
        Write-C "  |  W: Stop Wiki                ow: Open Wiki in browser      |" White
        Write-C "  |  rb: Restart Backend                                      |" White
        Write-C "  |  rf: Restart Frontend        0: Exit                      |" Yellow
        Write-C "  |  rw: Restart Wiki                                         |" White
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
            "7"  { Build-Wiki }
            "8"  { Run-Tests }
            "9"  { Show-Logs "all" }
            "b"  { Start-Backend }
            "f"  { Start-Frontend }
            "w"  { Start-Wiki }
            "rb" { Restart-Backend }
            "rf" { Restart-Frontend }
            "rw" { Restart-Wiki }
            "g"  { Start-Forge }
            "d"  { Start-Demo "convergence" }
            "r"  { Start-Demo "redteam" }
            "o"  { Start-Process "http://localhost:$FrontendPort" }
            "ow" { Start-Process "http://localhost:$WikiPort" }
            "0"  { Write-C "`n  Exiting AEGIS Process Manager.`n" Cyan; return }
            default {
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

# ── Entry point ──────────────────────────────────────────────────────────────
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
    "test"       { Run-Tests }
    "forge"      { Start-Forge }
    "demo"       {
        if ($Target -eq "redteam") { Start-Demo "redteam" }
        else { Start-Demo "convergence" }
    }
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
        Write-C "`n  Commands: start | stop | restart | health | build | test | forge | demo | kill-port | logs | open | wiki" Yellow
        Write-C "  Targets : all | backend | frontend | wiki" DarkGray
        Write-C "  Demo    : .\aegis.ps1 demo          (triple convergence, 210 runs)" DarkGray
        Write-C "           .\aegis.ps1 demo redteam   (autonomous red team session)" DarkGray
        Write-C "  Forge   : .\aegis.ps1 forge          (genetic prompt optimizer, SSE)" DarkGray
        Write-C "  Build   : .\aegis.ps1 build wiki     (build_wiki.py + mkdocs build --clean)`n" DarkGray
    }
}
