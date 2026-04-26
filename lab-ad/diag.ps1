$VMName = "DC01-LAB"
$ISOPath = "C:\Users\pizzif\Desktop\20348.169.210806-2348.fe_release_svc_refresh_Server_EVAL_x64FRE_en-us.iso"

Write-Host "=== DIAGNOSTIC VM ===" -ForegroundColor Cyan

# VM existe?
$vm = Get-VM -Name $VMName -ErrorAction SilentlyContinue
if (-not $vm) {
    Write-Host "ERREUR: VM '$VMName' n'existe pas!" -ForegroundColor Red
    Get-VM | Format-Table Name, State, Generation
    pause
    exit
}

Write-Host "VM: $($vm.Name) | Generation: $($vm.Generation) | State: $($vm.State)" -ForegroundColor Green

# ISO existe?
Write-Host "`n=== ISO ===" -ForegroundColor Cyan
if (Test-Path $ISOPath) {
    $size = [math]::Round((Get-Item $ISOPath).Length / 1GB, 2)
    Write-Host "ISO trouvee: $size GB" -ForegroundColor Green
} else {
    Write-Host "ERREUR: ISO introuvable a $ISOPath" -ForegroundColor Red
    Write-Host "Fichiers ISO sur le bureau:" -ForegroundColor Yellow
    Get-ChildItem "C:\Users\pizzif\Desktop\*.iso" | ForEach-Object { Write-Host "  $($_.FullName) ($([math]::Round($_.Length/1GB,2)) GB)" }
}

# DVD Drive
Write-Host "`n=== DVD DRIVE ===" -ForegroundColor Cyan
$dvd = Get-VMDvdDrive -VMName $VMName
if ($dvd) {
    Write-Host "Path: $($dvd.Path)" -ForegroundColor $(if($dvd.Path){"Green"}else{"Red"})
    Write-Host "Controller: $($dvd.ControllerNumber) Location: $($dvd.ControllerLocation)"
} else {
    Write-Host "AUCUN DVD Drive!" -ForegroundColor Red
}

# Firmware / Boot
Write-Host "`n=== FIRMWARE ===" -ForegroundColor Cyan
$fw = Get-VMFirmware -VMName $VMName
Write-Host "SecureBoot: $($fw.SecureBoot)"
Write-Host "Boot Order:"
$fw.BootOrder | ForEach-Object {
    Write-Host "  BootType: $($_.BootType) | Device: $($_.Device)" -ForegroundColor Yellow
}

# HDD
Write-Host "`n=== HDD ===" -ForegroundColor Cyan
Get-VMHardDiskDrive -VMName $VMName | ForEach-Object {
    Write-Host "  $($_.Path) | Controller: $($_.ControllerNumber)"
}

# Tentative de fix
Write-Host "`n=== TENTATIVE DE FIX ===" -ForegroundColor Cyan
if ($vm.State -ne "Off") {
    Stop-VM -Name $VMName -Force -TurnOff
    Start-Sleep 3
    Write-Host "VM eteinte." -ForegroundColor Yellow
}

# Supprimer et recréer le DVD proprement
Get-VMDvdDrive -VMName $VMName | Remove-VMDvdDrive
Add-VMDvdDrive -VMName $VMName -Path $ISOPath
Write-Host "DVD recree avec ISO." -ForegroundColor Green

# Reconfigurer boot
$newDvd = Get-VMDvdDrive -VMName $VMName
$newHdd = Get-VMHardDiskDrive -VMName $VMName
Set-VMFirmware -VMName $VMName -EnableSecureBoot Off -BootOrder $newDvd, $newHdd
Write-Host "Secure Boot OFF, Boot: DVD > HDD" -ForegroundColor Green

# Démarrer
Start-VM -Name $VMName
Write-Host "`nVM DEMARREE - Ouvrez la console et appuyez sur une touche!" -ForegroundColor Red
vmconnect localhost $VMName

pause
