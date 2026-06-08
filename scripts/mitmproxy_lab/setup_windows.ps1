<#
.SYNOPSIS
  Installation et configuration d'un lab d'observation Claude Opus 4.7
  via mitmproxy sur Windows 11.

.DESCRIPTION
  Le script verifie ou installe Python 3, installe mitmproxy via pip,
  genere la CA mitmproxy au premier lancement, puis l'importe dans le
  Certificate Store Windows (CurrentUser\Root par defaut, parametrable
  pour LocalMachine si lance en administrateur). Configure les variables
  d'environnement utilisateur pour l'interception.

.PARAMETER UseMachineStore
  Si fourni, importe la CA dans Cert:\LocalMachine\Root (necessite
  PowerShell en administrateur). Par defaut, importe dans
  Cert:\CurrentUser\Root.

.EXAMPLE
  .\setup_windows.ps1
  Installation en mode utilisateur.

.EXAMPLE
  Start-Process powershell -Verb runAs -ArgumentList "-File .\setup_windows.ps1 -UseMachineStore"
  Installation en mode administrateur avec import machine-wide.

.NOTES
  Variables d'environnement utiles a definir manuellement apres :
    $env:ANTHROPIC_API_KEY = "sk-ant-..."
    $env:HTTPS_PROXY = "http://localhost:8888"
    $env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.pem"
#>
[CmdletBinding()]
param(
    [switch]$UseMachineStore
)

$ErrorActionPreference = 'Stop'

function Write-Log    { param($Message) Write-Host "[setup] $Message" -ForegroundColor Cyan }
function Write-Warning2 { param($Message) Write-Host "[warn]  $Message" -ForegroundColor Yellow }
function Write-Err    { param($Message) Write-Host "[error] $Message" -ForegroundColor Red; throw $Message }

# ---------------------------------------------------------------------
# 1. Verification de Python
# ---------------------------------------------------------------------
Write-Log "Verification de Python 3.10 ou superieur..."

$pythonCmd = $null
foreach ($candidate in @('py', 'python', 'python3')) {
    if (Get-Command $candidate -ErrorAction SilentlyContinue) {
        $version = & $candidate -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')" 2>$null
        if ($version -match '^(\d+)\.(\d+)$') {
            $maj = [int]$Matches[1]; $min = [int]$Matches[2]
            if ($maj -ge 3 -and $min -ge 10) {
                $pythonCmd = $candidate
                Write-Log "Python $version detecte via '$candidate'"
                break
            }
        }
    }
}

if (-not $pythonCmd) {
    Write-Log "Installation de Python via winget..."
    winget install --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' +
                [System.Environment]::GetEnvironmentVariable('PATH', 'User')
    $pythonCmd = 'python'
}

# ---------------------------------------------------------------------
# 2. Installation de mitmproxy
# ---------------------------------------------------------------------
Write-Log "Installation de mitmproxy via pip..."
$oldErrorAction = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
& $pythonCmd -m pip install --upgrade pip 2>&1 | Out-Null
& $pythonCmd -m pip install --upgrade mitmproxy 2>&1 | Out-Null
$ErrorActionPreference = $oldErrorAction

$mitmdumpPath = (& $pythonCmd -c "import shutil; print(shutil.which('mitmdump') or '')").Trim()
if (-not $mitmdumpPath) {
    $pyVer = (& $pythonCmd -c "import sys; print(f'{sys.version_info.major}{sys.version_info.minor}')").Trim()
    $userScripts = "$env:APPDATA\Python\Python$pyVer\Scripts"
    if (Test-Path "$userScripts\mitmdump.exe") {
        $mitmdumpPath = "$userScripts\mitmdump.exe"
        Write-Warning2 "mitmdump installe dans $userScripts, pensez a l'ajouter au PATH."
    } else {
        Write-Err "mitmdump introuvable apres installation."
    }
}
Write-Log "mitmdump : $mitmdumpPath"

# ---------------------------------------------------------------------
# 3. Generation de la CA mitmproxy
# ---------------------------------------------------------------------
$caDir = Join-Path $env:USERPROFILE '.mitmproxy'
$caPem = Join-Path $caDir 'mitmproxy-ca-cert.pem'
$caCer = Join-Path $caDir 'mitmproxy-ca-cert.cer'

if (-not (Test-Path $caPem)) {
    Write-Log "Generation de la CA mitmproxy..."
    $proc = Start-Process -FilePath $mitmdumpPath -ArgumentList '--listen-port', '18888' -PassThru -NoNewWindow
    Start-Sleep -Seconds 3
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}

if (-not (Test-Path $caPem)) {
    Write-Err "CA mitmproxy introuvable a $caPem"
}
Write-Log "CA mitmproxy disponible : $caPem"

# ---------------------------------------------------------------------
# 4. Import dans le Certificate Store Windows
# ---------------------------------------------------------------------
$storeLocation = if ($UseMachineStore) { 'Cert:\LocalMachine\Root' } else { 'Cert:\CurrentUser\Root' }
Write-Log "Import de la CA dans $storeLocation"

if (Test-Path $caCer) {
    $certFile = $caCer
} else {
    $certFile = $caPem
}

try {
    Import-Certificate -FilePath $certFile -CertStoreLocation $storeLocation | Out-Null
    Write-Log "Import reussi dans $storeLocation"
} catch {
    Write-Warning2 "Echec Import-Certificate, tentative certutil..."
    $certutilStore = if ($UseMachineStore) { 'Root' } else { '-user Root' }
    if ($UseMachineStore) {
        & certutil -addstore -f Root $certFile
    } else {
        & certutil -user -addstore -f Root $certFile
    }
}

# ---------------------------------------------------------------------
# 5. Variables d'environnement persistantes (User scope)
# ---------------------------------------------------------------------
Write-Log "Configuration des variables d'environnement utilisateur..."

$envScope = 'User'

function Set-UserEnv {
    param([string]$Name, [string]$Value)
    [Environment]::SetEnvironmentVariable($Name, $Value, $envScope)
    Set-Item -Path "env:$Name" -Value $Value
}

# Variables fournies en placeholder, decommenter dans le shell pour activer
Write-Log "Les variables suivantes sont preparees mais non activees par defaut."
Write-Log "Pour activer l'interception dans une nouvelle session PowerShell :"
Write-Host ""
Write-Host '  $env:HTTPS_PROXY        = "http://localhost:8888"' -ForegroundColor Gray
Write-Host '  $env:HTTP_PROXY         = "http://localhost:8888"' -ForegroundColor Gray
Write-Host '  $env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.pem"' -ForegroundColor Gray
Write-Host '  $env:SSL_CERT_FILE      = "$env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.pem"' -ForegroundColor Gray
Write-Host '  $env:ANTHROPIC_API_KEY  = "sk-ant-..."' -ForegroundColor Gray
Write-Host ""

# Persistance de la cle CA (lecture par les apps Node.js, Bun, Python requests)
Set-UserEnv 'NODE_EXTRA_CA_CERTS' "$env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.pem"
Set-UserEnv 'SSL_CERT_FILE'       "$env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.pem"

# ---------------------------------------------------------------------
# 6. Test de connectivite
# ---------------------------------------------------------------------
Write-Log "Test de connectivite api.anthropic.com (sans proxy)..."
try {
    $resp = Invoke-WebRequest -Uri 'https://api.anthropic.com/' -Method Head -TimeoutSec 8 -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Log "Statut HTTP : $($resp.StatusCode)"
} catch {
    Write-Warning2 "Echec connectivite api.anthropic.com - verifier le reseau ou le pare-feu"
}

Write-Host ""
Write-Host "----------------------------------------------------------------------"
Write-Host "Installation terminee. Prochaines etapes :"
Write-Host ""
Write-Host "1. Ouvrir un nouveau terminal PowerShell pour recharger les variables."
Write-Host ""
Write-Host "2. Lancer mitmproxy en mode regular :"
Write-Host "     mitmdump -p 8888 -s llm_traffic_logger.py --set llm_log_path=./traffic.jsonl"
Write-Host ""
Write-Host "3. Dans une autre session, activer l'interception et tester :"
Write-Host '     $env:HTTPS_PROXY = "http://localhost:8888"'
Write-Host '     $env:ANTHROPIC_API_KEY = "sk-ant-..."'
Write-Host "     curl.exe -sS https://api.anthropic.com/v1/messages ``"
Write-Host '       -H "x-api-key: $env:ANTHROPIC_API_KEY" ``'
Write-Host '       -H "anthropic-version: 2023-06-01" ``'
Write-Host '       -H "content-type: application/json" ``'
Write-Host "       -d '{\`"model\`":\`"claude-opus-4-7\`",\`"max_tokens\`":64,\`"messages\`":[{\`"role\`":\`"user\`",\`"content\`":\`"ping\`"}]}'"
Write-Host ""
Write-Host "Pour desinstaller la CA :"
Write-Host "     Get-ChildItem $storeLocation | Where-Object Subject -match 'mitmproxy' | Remove-Item"
Write-Host "----------------------------------------------------------------------"
