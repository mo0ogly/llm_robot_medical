#Requires -Version 5.1
<#
.SYNOPSIS
    AEGIS Lab — Process Manager (v3)
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
    .\aegis.ps1 push               # git add + commit + push (interactive message)
    .\aegis.ps1 push "mon message" # git push avec message direct
    .\aegis.ps1 env                # affiche le statut backend/.env (cle Groq, modele)
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
$PagesUrl     = "https://mo0ogly.github.io/llm_robot_medical/"

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

# ── Helpers ──────────────────────────────────────────────────────────────────
function Write-C($msg, $color = "White") { Write-Host $msg -ForegroundColor $color }
function OK($msg)   { Write-Host "  [OK] " -ForegroundColor Green  -NoNewline; Write-Host $msg }
function ERR($msg)  { Write-Host "  [!!] " -ForegroundColor Red    -NoNewline; Write-Host $msg }
function INF($msg)  { Write-Host "  [--] " -ForegroundColor Cyan   -NoNewline; Write-Host $msg }
function WARN($msg) { Write-Host "  [>>] " -ForegroundColor Yellow -NoNewline; Write-Host $msg }

function Get-GroqStatus {
    $envFile = Join-Path $BackendDir ".env"
    if (-not (Test-Path $envFile)) { return "NO .env" }
    $line = Get-Content $envFile | Where-Object { $_ -match "^GROQ_API_KEY=gsk_" } | Select-Object -First 1
    if ($line) {
        $key = ($line -split "=", 2)[1].Trim()
        return "gsk_$($key.Substring(4,4))...$($key.Substring($key.Length - 4))"
    }
    return "NOT SET"
}

function Get-ActiveModel {
    $envFile = Join-Path $BackendDir ".env"
    if (-not (Test-Path $envFile)) { return "?" }
    $line = Get-Content $envFile | Where-Object { $_ -match "^MEDICAL_MODEL=" } | Select-Object -First 1
    if ($line) { return ($line -split "=", 2)[1].Trim() }
    return "llama-3.3-70b-versatile (default)"
}

function Write-Banner {
    $groq  = Get-GroqStatus
    $model = Get-ActiveModel
    Write-Host ""
    Write-C "  +====================================================+" Cyan
    Write-C "  |   AEGIS Lab -- Process Manager  (v3)               |" Cyan
    Write-C "  |   Backend :$BackendPort | Frontend :$FrontendPort | Wiki :$WikiPort      |" DarkCyan
    Write-C "  |   Groq : $groq" DarkCyan
    Write-C "  |   Model: $model" DarkCyan
    Write-C "  +====================================================+" Cyan
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
    if ($allPids.Count -eq 0) { INF "Port $port already free."; return }
    foreach ($p in $allPids) { INF "Killing PID $p on :$port..."; Kill-ProcessTree $p }
    $timeout = 6
    while ($timeout -gt 0) {
        Start-Sleep -Milliseconds 500
        if (-not (Get-AllPidsOnPort $port)) { OK "Port $port freed."; return }
        $timeout--
    }
    $remaining = Get-AllPidsOnPort $port
    if ($remaining.Count -gt 0) {
        foreach ($p in $remaining) { Kill-ProcessTree $p; Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
        Start-Sleep -Milliseconds 800
        if (-not (Get-AllPidsOnPort $port)) { OK "Port $port freed (second pass)."; return }
        ERR "Port $port still bound (PIDs: $($remaining -join ', '))"
    }
}

function Get-PortStatus([int]$port) {
    $FoundPid = Get-PidOnPort $port
    if ($FoundPid) {
        $proc = Get-Process -Id $FoundPid -ErrorAction SilentlyContinue
        return @{ Running = $true; Pid = $FoundPid; Name = if ($proc) { $proc.Name } else { "?" } }
    }
    return @{ Running = $false; Pid = $null; Name = "" }
}

# ── HTTP health ──────────────────────────────────────────────────────────────
function Test-Http([string]$url, [int]$timeout = 4) {
    try {
        $r = Invoke-WebRequest -Uri $url -TimeoutSec $timeout -UseBasicParsing -ErrorAction Stop
        return $r.StatusCode -lt 500
    } catch { return $false }
}

# ── Env check ────────────────────────────────────────────────────────────────
function Show-Env {
    $envFile = Join-Path $BackendDir ".env"
    Write-C "`n  ENV STATUS — backend/.env" DarkCyan
    Write-C "  -----------------------------------------------------------" DarkGray
    if (-not (Test-Path $envFile)) {
        ERR "backend/.env introuvable — copie backend/.env.example et remplis les valeurs"
        return
    }
    $lines = Get-Content $envFile | Where-Object { $_ -notmatch "^\s*#" -and $_ -match "=" }
    foreach ($line in $lines) {
        $parts = $line -split "=", 2
        $k = $parts[0].Trim(); $v = $parts[1].Trim()
        if ($k -match "KEY|SECRET|PASSWORD|TOKEN") {
            if ($v.Length -gt 12) {
                $masked = "$($v.Substring(0,6))...$($v.Substring($v.Length-4))"
            } else { $masked = "****" }
            Write-Host ("  {0,-25} = {1}" -f $k, $masked) -ForegroundColor DarkYellow
        } else {
            Write-Host ("  {0,-25} = {1}" -f $k, $v) -ForegroundColor Gray
        }
    }
    Write-Host ""
    # Validation Groq
    $groqLine = Get-Content $envFile | Where-Object { $_ -match "^GROQ_API_KEY=gsk_" }
    if ($groqLine) { OK "GROQ_API_KEY valide (prefixe gsk_)" }
    else { WARN "GROQ_API_KEY manquante ou invalide — le backend tombera sur Ollama (fallback)" }
}

# ── Git Push / Deploy ────────────────────────────────────────────────────────
function Invoke-Push {
    param([string]$message = "")
    Push-Location $ProjectRoot

    # Supprimer le verrou git si present
    $lockFile = Join-Path $ProjectRoot ".git\index.lock"
    if (Test-Path $lockFile) {
        INF "Suppression de .git/index.lock..."
        Remove-Item $lockFile -Force
    }

    # Message de commit
    if (-not $message) {
        $message = Read-Host "  Message de commit"
        if (-not $message) { $message = "chore(aegis): update" }
    }

    INF "git add..."
    git add -u 2>&1 | Out-Null
    git add .  2>&1 | Out-Null

    $staged = git diff --cached --name-only 2>&1
    if (-not $staged) {
        WARN "Rien a committer (working tree propre)."
        Pop-Location
        return
    }

    INF "Commit: $message"
    git commit --no-verify -m $message 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { ERR "Echec du commit."; Pop-Location; return }

    INF "Push vers origin/main..."
    $pushOut = git push origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        OK "Push OK. GitHub Actions va deployer automatiquement."
        OK "Site : $PagesUrl"
    } else {
        ERR "Push echoue. Utilise GitHub Desktop si les credentials manquent."
        Write-C "  $pushOut" DarkRed
    }
    Pop-Location
}

# ── Start ────────────────────────────────────────────────────────────────────
function Start-Backend {
    # Verifier la cle Groq avant de demarrer
    $groq = Get-GroqStatus
    if ($groq -eq "NOT SET" -or $groq -eq "NO .env") {
        WARN "GROQ_API_KEY absente — le backend utilisera Ollama (fallback local)"
    }
    $status = Get-PortStatus $BackendPort
    if ($status.Running) { WARN "Backend deja sur :$BackendPort (PID $($status.Pid))"; return }
    INF "Demarrage backend :$BackendPort ..."
    $logFile = Join-Path $LogDir "backend.log"
    $tmpScript = Join-Path $env:TEMP "aegis_backend.ps1"
    "Set-Location '$BackendDir'; python -m uvicorn server:app --host 0.0.0.0 --port $BackendPort --reload 2>&1 | Tee-Object -FilePath '$logFile'" | Out-File -FilePath $tmpScript -Encoding utf8
    $proc = Start-Process powershell -ArgumentList "-NoProfile", "-NonInteractive", "-File", $tmpScript -WindowStyle Hidden -PassThru
    Start-Sleep -Seconds 3
    $FoundPid = Get-PidOnPort $BackendPort
    if ($FoundPid) { OK "Backend demarre (PID $FoundPid)" }
    else { WARN "Backend lance (PID $($proc.Id)) — binding en cours..." }
}

function Start-Frontend {
    $status = Get-PortStatus $FrontendPort
    if ($status.Running) { WARN "Frontend deja sur :$FrontendPort (PID $($status.Pid))"; return }
    INF "Demarrage frontend :$FrontendPort ..."
    $logFile = Join-Path $LogDir "frontend.log"
    $tmpScript = Join-Path $env:TEMP "aegis_frontend.ps1"
    "Set-Location '$FrontendDir'; npm run dev 2>&1 | Tee-Object -FilePath '$logFile'" | Out-File -FilePath $tmpScript -Encoding utf8
    $proc = Start-Process powershell -ArgumentList "-NoProfile", "-NonInteractive", "-File", $tmpScript -WindowStyle Hidden -PassThru
    Start-Sleep -Seconds 6
    $FoundPid = Get-PidOnPort $FrontendPort
    if ($FoundPid) { OK "Frontend demarre (PID $FoundPid)" }
    else { WARN "Frontend lance (PID $($proc.Id)) — binding en cours..." }
}

function Start-Wiki {
    $status = Get-PortStatus $WikiPort
    if ($status.Running) { WARN "Wiki deja sur :$WikiPort (PID $($status.Pid))"; return }
    INF "Build wiki (build_wiki.py)..."
    Push-Location $WikiDir; python build_wiki.py 2>&1 | Out-Null; Pop-Location
    INF "Demarrage wiki :$WikiPort ..."
    $logFile = Join-Path $LogDir "wiki.log"
    $tmpScript = Join-Path $env:TEMP "aegis_wiki.ps1"
    $pyScripts = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'Python\Python313\Scripts'
    "if (Test-Path '$pyScripts') { `$env:PATH += ';$pyScripts' }`nSet-Location '$WikiDir'`npython -m mkdocs serve --dev-addr 127.0.0.1:$WikiPort --no-livereload 2>&1 | Tee-Object -FilePath '$logFile'" | Out-File -FilePath $tmpScript -Encoding utf8
    $proc = Start-Process powershell -ArgumentList "-NoProfile", "-NonInteractive", "-File", $tmpScript -WindowStyle Hidden -PassThru
    Start-Sleep -Seconds 4
    $FoundPid = Get-PidOnPort $WikiPort
    if ($FoundPid) { OK "Wiki demarre (PID $FoundPid) -> http://localhost:$WikiPort" }
    else { WARN "Wiki lance (PID $($proc.Id)) — binding en cours..." }
}

# ── Stop ─────────────────────────────────────────────────────────────────────
function Stop-Backend  { INF "Arret backend  (:$BackendPort)...";  Kill-Port $BackendPort }
function Stop-Frontend { INF "Arret frontend (:$FrontendPort)..."; Kill-Port $FrontendPort }
function Stop-Wiki     { INF "Arret wiki     (:$WikiPort)...";     Kill-Port $WikiPort }

# ── Restart ──────────────────────────────────────────────────────────────────
function Restart-Backend  { Stop-Backend;  Start-Sleep -Milliseconds 800; Start-Backend }
function Restart-Frontend { Stop-Frontend; Start-Sleep -Milliseconds 800; Start-Frontend }
function Restart-Wiki     { Stop-Wiki;     Start-Sleep -Milliseconds 800; Start-Wiki }

# ── Build ────────────────────────────────────────────────────────────────────
function Build-Backend {
    INF "Verification backend (py_compile)..."
    Push-Location $BackendDir
    $errors = @()
    Get-ChildItem -Filter "*.py" -Recurse -Depth 1 | ForEach-Object {
        $out = python -m py_compile $_.FullName 2>&1
        if ($LASTEXITCODE -ne 0) { $errors += "$($_.Name): $out" }
    }
    Pop-Location
    if ($errors.Count -eq 0) { OK "Backend syntax OK" }
    else { ERR "Erreurs compilation:"; $errors | ForEach-Object { Write-C "    $_" Red } }
}

function Build-Frontend {
    INF "Build frontend (Vite)..."
    Push-Location $FrontendDir
    $result = npm run build 2>&1
    $exit = $LASTEXITCODE
    Pop-Location
    if ($exit -eq 0) {
        $built = $result | Select-String "built in"
        OK ("Frontend OK: " + ($built -join " ").Trim())
    } else {
        ERR "Build frontend FAILED"
        $result | Select-String "error" | ForEach-Object { Write-C "    $_" Red }
    }
}

function Build-Wiki {
    INF "Step 1/2: build_wiki.py..."
    $pyScripts = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'Python\Python313\Scripts'
    if (Test-Path $pyScripts) { $env:PATH += ";$pyScripts" }
    Push-Location $WikiDir
    $syncOut = python build_wiki.py 2>&1
    if ($LASTEXITCODE -ne 0) {
        ERR "build_wiki.py FAILED"; $syncOut | Select-String "Error|Exception" | ForEach-Object { Write-C "    $_" Red }
        Pop-Location; return
    }
    OK "build_wiki.py OK"
    INF "Step 2/2: mkdocs build --clean..."
    $mkdocsOut = python -m mkdocs build --clean 2>&1
    $mkdocsExit = $LASTEXITCODE
    Pop-Location
    if ($mkdocsExit -eq 0) {
        $duration = $mkdocsOut | Select-String "built in"
        $warns = ($mkdocsOut | Select-String "^WARNING" | Measure-Object).Count
        OK "MkDocs OK ($duration) | $warns warnings"
    } else {
        ERR "MkDocs FAILED"
        $mkdocsOut | Select-String "ERROR" | ForEach-Object { Write-C "    $_" Red }
    }
}

# ── Forge ────────────────────────────────────────────────────────────────────
function Start-Forge {
    $bs = Get-PortStatus $BackendPort
    if (-not $bs.Running) { ERR "Backend requis sur :$BackendPort — lance: .\aegis.ps1 start backend"; return }
    INF "Lancement Forge (genetic prompt optimizer SSE)..."
    Write-C "  Endpoint: POST /api/redteam/genetic/stream" DarkCyan
    $intention = Read-Host "  Intention (defaut: tool_hijack)"
    if (-not $intention) { $intention = "tool_hijack" }
    $maxIter = Read-Host "  Max iterations (defaut: 20)"
    if (-not $maxIter) { $maxIter = "20" }
    $popSize = Read-Host "  Population size (defaut: 10)"
    if (-not $popSize) { $popSize = "10" }
    $logFile = Join-Path $LogDir "forge.log"
    INF "Stream vers $logFile..."
    $body = @{
        intention       = $intention
        max_iterations  = [int]$maxIter
        population_size = [int]$popSize
        mutation_rate   = 0.5; crossover_rate = 0.1; aegis_shield = $false
    } | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$BackendPort/api/redteam/genetic/stream" `
            -Method Post -ContentType "application/json" -Body $body -TimeoutSec 600 -UseBasicParsing -ErrorAction Stop
        $response.Content | Out-File -FilePath $logFile -Encoding utf8
        $response.Content -split "`n" | Select-String "best_fitness|generation|COMPLETE" | ForEach-Object { Write-C "    $_" Green }
        OK "Forge termine. Log: $logFile"
    } catch { ERR "Forge failed: $_" }
}

# ── Demo ─────────────────────────────────────────────────────────────────────
function Start-Demo {
    param([string]$mode = "convergence")
    switch ($mode) {
        "redteam" {
            INF "Red Team autonome..."
            $logFile = Join-Path $LogDir "demo_redteam.log"
            $rounds = Read-Host "  Rounds (defaut: 5)"; if (-not $rounds) { $rounds = "5" }
            $type = Read-Host "  Type [injection|prompt_leak|rule_bypass|all] (defaut: injection)"
            if (-not $type) { $type = "injection" }
            Push-Location $BackendDir
            python run_redteam.py --type $type --rounds $rounds 2>&1 | Tee-Object -FilePath $logFile
            $exit = $LASTEXITCODE; Pop-Location
            if ($exit -eq 0) { OK "Red Team termine. Log: $logFile" } else { ERR "Red Team failed (exit $exit)." }
        }
        default {
            INF "Triple Convergence (210 runs)..."
            $logFile = Join-Path $LogDir "demo_convergence.log"
            Push-Location $BackendDir
            python run_triple_convergence.py 2>&1 | Tee-Object -FilePath $logFile
            $exit = $LASTEXITCODE; Pop-Location
            if ($exit -eq 0) { OK "Demo termine. Log: $logFile" } else { ERR "Demo failed (exit $exit)." }
        }
    }
}

# ── Tests ────────────────────────────────────────────────────────────────────
function Run-Tests {
    INF "pytest backend/tests/..."
    Push-Location $BackendDir
    $logFile = Join-Path $LogDir "test.log"
    python -m pytest tests/ -v 2>&1 | Tee-Object -FilePath $logFile
    $exit = $LASTEXITCODE; Pop-Location
    if ($exit -eq 0) { OK "Tests OK." } else { ERR "Tests KO (exit $exit). Log: $logFile" }
}

# ── Health ───────────────────────────────────────────────────────────────────
function Show-Health {
    Write-Host ""
    Write-C "  HEALTH STATUS" DarkCyan
    Write-C "  ---------------------------------------------------------------" DarkGray
    Write-Host "  Service       | Port  | Status   | PID   | HTTP" -ForegroundColor DarkGray
    Write-C "  ---------------------------------------------------------------" DarkGray

    foreach ($svc in @(
        @{ Name="Backend";  Port=$BackendPort;  Url="http://localhost:$BackendPort/api/redteam/scenarios" },
        @{ Name="Frontend"; Port=$FrontendPort; Url="http://localhost:$FrontendPort" },
        @{ Name="Wiki";     Port=$WikiPort;     Url="http://localhost:$WikiPort" }
    )) {
        $ps = Get-PortStatus $svc.Port
        $st = if ($ps.Running) { "RUNNING " } else { "STOPPED " }
        $cl = if ($ps.Running) { "Green" } else { "Red" }
        $pid_ = if ($ps.Pid) { "$($ps.Pid)" } else { "-    " }
        $http = if ($ps.Running) { if (Test-Http $svc.Url) { "OK" } else { "Unreachable" } } else { "-" }
        Write-Host ("  {0,-13} | {1,-5} | {2} | {3,-5} | {4}" -f $svc.Name, $svc.Port, $st, $pid_, $http) -ForegroundColor $cl
    }

    # Ollama
    $olOk = Test-Http "http://localhost:11434"
    $olSt = if ($olOk) { "RUNNING " } else { "STOPPED " }
    $olCl = if ($olOk) { "Green" } else { "DarkGray" }
    Write-Host ("  {0,-13} | {1,-5} | {2} | -     | {3}" -f "Ollama (fallback)", 11434, $olSt, "-") -ForegroundColor $olCl

    # Groq API key
    $groq = Get-GroqStatus
    $groqCl = if ($groq -notmatch "NOT SET|NO .env") { "Green" } else { "Yellow" }
    Write-Host ("  {0,-13} | -     | {1,-8} | -     | {2}" -f "Groq key", "CONFIG", $groq) -ForegroundColor $groqCl

    # GitHub Pages
    INF "Verification GitHub Pages (peut prendre 2s)..."
    $pagesOk = Test-Http $PagesUrl 5
    $pSt = if ($pagesOk) { "LIVE    " } else { "DOWN/404" }
    $pCl = if ($pagesOk) { "Green" } else { "Red" }
    Write-Host ("  {0,-13} | -     | {1} | -     | {2}" -f "GitHub Pages", $pSt, $PagesUrl) -ForegroundColor $pCl

    Write-C "  ---------------------------------------------------------------" DarkGray
    Write-Host ""
}

# ── Logs ─────────────────────────────────────────────────────────────────────
function Show-Logs([string]$target = "all") {
    $logMap = @{
        backend="backend.log"; frontend="frontend.log"; wiki="wiki.log"
        forge="forge.log"; demo="demo_convergence.log"; redteam="demo_redteam.log"; test="test.log"
    }
    if ($target -ne "all" -and $logMap.ContainsKey($target)) {
        $f = Join-Path $LogDir $logMap[$target]
        if (Test-Path $f) { Write-C "`n  === $($logMap[$target]) (last 40 lines) ===" Cyan; Get-Content $f -Tail 40 }
        else { INF "Pas encore de log: $($logMap[$target])" }
    } else {
        foreach ($k in @("backend","frontend","wiki","forge","demo","redteam")) {
            $f = Join-Path $LogDir $logMap[$k]
            if (Test-Path $f) { Write-C "`n  === $($logMap[$k]) (last 10 lines) ===" Cyan; Get-Content $f -Tail 10 }
        }
    }
    Write-Host ""
}

# ── Dispatch helpers ─────────────────────────────────────────────────────────
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
    switch ($t) {
        "backend"  { Restart-Backend }
        "frontend" { Restart-Frontend }
        "wiki"     { Restart-Wiki }
        default    { Stop-Backend; Stop-Frontend; Stop-Wiki; Start-Sleep -Seconds 2; Start-Backend; Start-Frontend; Start-Wiki }
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

        Write-C "  +-------------------------------------------------------------+" DarkGray
        Write-C "  | [SERVICES]                    [BUILD & TOOLS]               |" White
        Write-C "  |  1: Start All                  5: Build Frontend             |" White
        Write-C "  |  2: Stop All                   6: Build Backend              |" White
        Write-C "  |  3: Restart All                7: Build Wiki (full)          |" White
        Write-C "  |  4: Refresh Health             8: Run Tests (pytest)         |" White
        Write-C "  |                                                             |" DarkGray
        Write-C "  | [TARGETED]                    [RESEARCH & DEPLOY]           |" White
        Write-C "  |  b: Start Backend              g: Forge (genetic engine)     |" White
        Write-C "  |  f: Start Frontend             d: Demo (triple convergence)  |" White
        Write-C "  |  w: Start Wiki                 r: Demo (red team session)    |" White
        Write-C "  |  B: Stop Backend               p: Push / Deploy (git)        |" White
        Write-C "  |  F: Stop Frontend              9: View Logs                  |" White
        Write-C "  |  W: Stop Wiki                  e: Env (.env status)          |" White
        Write-C "  |  rb: Restart Backend           o: Open Frontend browser      |" White
        Write-C "  |  rf: Restart Frontend          ow: Open Wiki browser         |" White
        Write-C "  |  rw: Restart Wiki              ok: Open GitHub Pages         |" Yellow
        Write-C "  |                                0: Exit                       |" Yellow
        Write-C "  +-------------------------------------------------------------+" DarkGray
        Write-Host ""

        $raw = Read-Host "  Action"
        Write-Host ""

        # Gestion case-sensitive AVANT ToLower (B/F/W = Stop)
        switch ($raw.Trim()) {
            "B"  { Stop-Backend;  $null = Read-Host "  Done. Enter pour continuer"; continue }
            "F"  { Stop-Frontend; $null = Read-Host "  Done. Enter pour continuer"; continue }
            "W"  { Stop-Wiki;     $null = Read-Host "  Done. Enter pour continuer"; continue }
        }

        switch ($raw.Trim().ToLower()) {
            "1"   { Invoke-Start "all" }
            "2"   { Invoke-Stop "all" }
            "3"   { Invoke-Restart "all" }
            "4"   { Show-Health; continue }
            "5"   { Build-Frontend }
            "6"   { Build-Backend }
            "7"   { Build-Wiki }
            "8"   { Run-Tests }
            "9"   { Show-Logs "all" }
            "b"   { Start-Backend }
            "f"   { Start-Frontend }
            "w"   { Start-Wiki }
            "rb"  { Restart-Backend }
            "rf"  { Restart-Frontend }
            "rw"  { Restart-Wiki }
            "g"   { Start-Forge }
            "d"   { Start-Demo "convergence" }
            "r"   { Start-Demo "redteam" }
            "p"   { Invoke-Push }
            "e"   { Show-Env }
            "o"   { Start-Process "http://localhost:$FrontendPort" }
            "ow"  { Start-Process "http://localhost:$WikiPort" }
            "ok"  { Start-Process $PagesUrl }
            "0"   { Write-C "`n  Bye.`n" Cyan; return }
            default { WARN "Action inconnue: $raw" }
        }

        Write-Host ""
        $null = Read-Host "  Done. Enter pour rafraichir"
    }
}

# ── Entry point ──────────────────────────────────────────────────────────────
if ($Command -eq "") { Show-Menu; exit 0 }

Write-Banner
switch ($Command.ToLower()) {
    "start"     { Invoke-Start   $Target }
    "stop"      { Invoke-Stop    $Target }
    "restart"   { Invoke-Restart $Target }
    "health"    { Show-Health }
    "build"     { Invoke-Build   $Target }
    "test"      { Run-Tests }
    "forge"     { Start-Forge }
    "demo"      { if ($Target -eq "redteam") { Start-Demo "redteam" } else { Start-Demo "convergence" } }
    "push"      { Invoke-Push $Target }
    "env"       { Show-Env }
    "kill-port" { if ($Target -match "^\d+$") { Kill-Port ([int]$Target) } else { ERR "Usage: aegis.ps1 kill-port <port>" } }
    "logs"      { Show-Logs $Target }
    "open"      { Start-Process "http://localhost:$FrontendPort" }
    "wiki"      { Start-Process "http://localhost:$WikiPort" }
    "pages"     { Start-Process $PagesUrl }
    default {
        Write-C "`n  Commands: start | stop | restart | health | build | test | push | env | forge | demo | kill-port | logs | open | wiki | pages" Yellow
        Write-C "  Targets : all | backend | frontend | wiki" DarkGray
        Write-C "  Push    : .\aegis.ps1 push                    # interactif" DarkGray
        Write-C "            .\aegis.ps1 push `"mon message`"     # direct" DarkGray
        Write-C "  Demo    : .\aegis.ps1 demo | demo redteam" DarkGray
        Write-C "  Forge   : .\aegis.ps1 forge`n" DarkGray
    }
}
