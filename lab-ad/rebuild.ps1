$VMName = "DC01-LAB"
$SwitchName = "LabSwitch"
$ISOPath = "C:\Users\pizzif\Desktop\20348.169.210806-2348.fe_release_svc_refresh_Server_EVAL_x64FRE_en-us.iso"
$vmBasePath = "C:\HyperV"

Write-Host "=== REBUILD COMPLET ===" -ForegroundColor Cyan

# 1. Supprimer l'ancienne VM
Write-Host "[1] Suppression ancienne VM..." -ForegroundColor Yellow
$existing = Get-VM -Name $VMName -ErrorAction SilentlyContinue
if ($existing) {
    if ($existing.State -ne "Off") { Stop-VM -Name $VMName -TurnOff -Force; Start-Sleep 2 }
    Remove-VM -Name $VMName -Force
    Write-Host "  -> VM supprimee." -ForegroundColor Green
}
if (Test-Path "$vmBasePath\$VMName") {
    Remove-Item "$vmBasePath\$VMName" -Recurse -Force
    Write-Host "  -> Fichiers supprimes." -ForegroundColor Green
}

# 2. Vérifier ISO
Write-Host "`n[2] Verification ISO..." -ForegroundColor Yellow
if (-not (Test-Path $ISOPath)) {
    Write-Host "  ERREUR: ISO introuvable!" -ForegroundColor Red
    Write-Host "  Fichiers .iso sur le bureau:" -ForegroundColor Yellow
    Get-ChildItem "C:\Users\pizzif\Desktop\*.iso" | ForEach-Object {
        Write-Host "    $($_.Name) - $([math]::Round($_.Length/1GB,2)) GB"
    }
    pause; exit
}
$isoSize = [math]::Round((Get-Item $ISOPath).Length / 1GB, 2)
Write-Host "  -> ISO OK: $isoSize GB" -ForegroundColor Green

# 3. Vérifier/créer le switch
Write-Host "`n[3] Switch reseau..." -ForegroundColor Yellow
if (-not (Get-VMSwitch -Name $SwitchName -ErrorAction SilentlyContinue)) {
    New-VMSwitch -Name $SwitchName -SwitchType Internal
    $adapter = Get-NetAdapter | Where-Object { $_.Name -like "*$SwitchName*" }
    if ($adapter) { New-NetIPAddress -InterfaceIndex $adapter.ifIndex -IPAddress 10.0.0.1 -PrefixLength 24 -ErrorAction SilentlyContinue }
    Write-Host "  -> Switch cree." -ForegroundColor Green
} else {
    Write-Host "  -> Switch existe." -ForegroundColor Green
}

# 4. Créer la VM en GENERATION 1
Write-Host "`n[4] Creation VM Generation 1..." -ForegroundColor Yellow
$vhdPath = "$vmBasePath\$VMName\$VMName.vhdx"

New-VM -Name $VMName `
    -MemoryStartupBytes 4GB `
    -Generation 1 `
    -NewVHDPath $vhdPath `
    -NewVHDSizeBytes 80GB `
    -SwitchName $SwitchName `
    -Path "$vmBasePath\$VMName"

Write-Host "  -> VM creee (Gen 1)." -ForegroundColor Green

# 5. Configurer
Write-Host "`n[5] Configuration..." -ForegroundColor Yellow
Set-VMProcessor -VMName $VMName -Count 4
Set-VMMemory -VMName $VMName -DynamicMemoryEnabled $true -MinimumBytes 2GB -MaximumBytes 4GB -StartupBytes 4GB
Set-VMDvdDrive -VMName $VMName -Path $ISOPath

# Boot order Gen1 : CD en premier
Set-VMBios -VMName $VMName -StartupOrder @("CD","IDE","LegacyNetworkAdapter","Floppy")

Write-Host "  -> 4 vCPU, 4GB RAM, Boot: CD first" -ForegroundColor Green

# 6. Vérification finale
Write-Host "`n[6] Verification finale..." -ForegroundColor Yellow
$vm = Get-VM -Name $VMName
$dvd = Get-VMDvdDrive -VMName $VMName
Write-Host "  VM     : $($vm.Name) | Gen $($vm.Generation) | $($vm.State)" -ForegroundColor Cyan
Write-Host "  DVD    : $($dvd.Path)" -ForegroundColor Cyan
Write-Host "  RAM    : $($vm.MemoryStartup/1GB) GB" -ForegroundColor Cyan
Write-Host "  CPU    : $($vm.ProcessorCount)" -ForegroundColor Cyan

# 7. Démarrer
Write-Host "`n[7] Demarrage..." -ForegroundColor Yellow
Start-VM -Name $VMName
Write-Host "  -> VM demarree!" -ForegroundColor Green

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Console VM en cours d'ouverture..." -ForegroundColor Cyan
Write-Host "  APPUYEZ SUR UNE TOUCHE pour booter sur CD!" -ForegroundColor Red
Write-Host "============================================" -ForegroundColor Cyan

vmconnect localhost $VMName
pause
