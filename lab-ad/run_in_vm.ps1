# Ce script copie et execute les scripts dans la VM DC01-LAB
$VMName = "DC01-LAB"
$Password = "Cim22091956!!??"
$ScriptsPath = "C:\Users\pizzif\Documents\GitHub\poc_medical\lab-ad"

Write-Host "=== Deploiement dans la VM ===" -ForegroundColor Cyan

# Credentials
$secPass = ConvertTo-SecureString $Password -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential("Administrator", $secPass)

# Activer le Guest Service pour copier des fichiers
Write-Host "[1] Activation Guest Service Integration..." -ForegroundColor Yellow
Enable-VMIntegrationService -VMName $VMName -Name "Guest Service Interface" -ErrorAction SilentlyContinue

# Copier les scripts dans la VM
Write-Host "[2] Copie des scripts dans la VM..." -ForegroundColor Yellow
$scripts = @("02_Install-ADDS.ps1", "03_Install-Services.ps1", "04_Populate-AD.ps1")
foreach ($s in $scripts) {
    $src = Join-Path $ScriptsPath $s
    Copy-VMFile -VMName $VMName -SourcePath $src -DestinationPath "C:\LabScripts\$s" -CreateFullPath -FileSource Host -Force -ErrorAction SilentlyContinue
    if ($?) {
        Write-Host "  -> $s copie." -ForegroundColor Green
    } else {
        Write-Host "  -> Echec copie $s (Guest Services peut-etre pas pret)" -ForegroundColor Red
    }
}

# Executer le script 02 via PowerShell Direct
Write-Host "`n[3] Execution de 02_Install-ADDS.ps1 dans la VM..." -ForegroundColor Yellow
Write-Host "    (Installation AD DS + DNS + DHCP + promotion DC)" -ForegroundColor Gray
Write-Host "    Cela peut prendre 5-10 minutes..." -ForegroundColor Gray

Invoke-Command -VMName $VMName -Credential $cred -ScriptBlock {
    Set-ExecutionPolicy Bypass -Force
    if (Test-Path "C:\LabScripts\02_Install-ADDS.ps1") {
        & "C:\LabScripts\02_Install-ADDS.ps1"
    } else {
        Write-Host "ERREUR: Script non trouve dans la VM!" -ForegroundColor Red
    }
} -ErrorAction Continue

Write-Host "`n=== Script 02 termine ===" -ForegroundColor Cyan
Write-Host "La VM va probablement redemarrer pour finaliser AD DS." -ForegroundColor Yellow
Write-Host "Attendez le redemarrage complet (~3 min) puis appuyez sur Entree." -ForegroundColor Yellow
Read-Host "Appuyez sur Entree quand la VM a redemarré"

# Après reboot, re-exécuter 02 pour finir (DNS inversé + DHCP)
Write-Host "`n[4] Finalisation post-reboot (DNS + DHCP)..." -ForegroundColor Yellow
$domCred = New-Object System.Management.Automation.PSCredential("LAB\Administrator", $secPass)

Invoke-Command -VMName $VMName -Credential $domCred -ScriptBlock {
    & "C:\LabScripts\02_Install-ADDS.ps1"
} -ErrorAction Continue

# Exécuter script 03
Write-Host "`n[5] Execution de 03_Install-Services.ps1..." -ForegroundColor Yellow
Write-Host "    (15+ services: PKI, IIS, DFS, RDS, NPS...)" -ForegroundColor Gray
Write-Host "    Cela peut prendre 15-30 minutes..." -ForegroundColor Gray

Invoke-Command -VMName $VMName -Credential $domCred -ScriptBlock {
    & "C:\LabScripts\03_Install-Services.ps1"
} -ErrorAction Continue

# Exécuter script 04
Write-Host "`n[6] Execution de 04_Populate-AD.ps1..." -ForegroundColor Yellow
Write-Host "    (Users, groupes, OUs, GPOs...)" -ForegroundColor Gray

Invoke-Command -VMName $VMName -Credential $domCred -ScriptBlock {
    & "C:\LabScripts\04_Populate-AD.ps1"
} -ErrorAction Continue

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  DEPLOIEMENT COMPLET!" -ForegroundColor Green
Write-Host "  Votre lab AD est pret sur DC01-LAB" -ForegroundColor Green
Write-Host "  Domaine: lab.local" -ForegroundColor Green
Write-Host "  IP: 10.0.0.10" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

pause
