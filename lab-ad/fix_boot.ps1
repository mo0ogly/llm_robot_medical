<#
.SYNOPSIS
    Corrige le boot de la VM DC01-LAB pour booter sur l'ISO
#>

$VMName = "DC01-LAB"
$ISOPath = "C:\Users\pizzif\Desktop\20348.169.210806-2348.fe_release_svc_refresh_Server_EVAL_x64FRE_en-us.iso"

Write-Host "=== Fix Boot VM ===" -ForegroundColor Cyan

# Eteindre la VM
Write-Host "Arret de la VM..." -ForegroundColor Yellow
Stop-VM -Name $VMName -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Vérifier/remonter l'ISO sur le DVD
Write-Host "Remontage de l'ISO..." -ForegroundColor Yellow
$dvd = Get-VMDvdDrive -VMName $VMName
if (-not $dvd) {
    Add-VMDvdDrive -VMName $VMName -Path $ISOPath
    Write-Host "  -> DVD ajoutee avec ISO." -ForegroundColor Green
} else {
    Set-VMDvdDrive -VMName $VMName -ControllerNumber $dvd.ControllerNumber -ControllerLocation $dvd.ControllerLocation -Path $ISOPath
    Write-Host "  -> ISO remontee: $ISOPath" -ForegroundColor Green
}

# Reconfigurer le boot order : DVD en premier
Write-Host "Configuration boot order (DVD first)..." -ForegroundColor Yellow
$dvd = Get-VMDvdDrive -VMName $VMName
$hdd = Get-VMHardDiskDrive -VMName $VMName
$net = Get-VMNetworkAdapter -VMName $VMName | Select-Object -First 1

Set-VMFirmware -VMName $VMName -BootOrder $dvd, $hdd
Write-Host "  -> Boot order: DVD > HDD" -ForegroundColor Green

# Secure Boot avec template Microsoft Windows
Write-Host "Configuration Secure Boot..." -ForegroundColor Yellow
Set-VMFirmware -VMName $VMName -EnableSecureBoot On -SecureBootTemplate MicrosoftWindows
Write-Host "  -> Secure Boot: ON (template MicrosoftWindows)" -ForegroundColor Green

# Redémarrer
Write-Host "`nDemarrage de la VM..." -ForegroundColor Yellow
Start-VM -Name $VMName
Write-Host "  -> VM demarree!" -ForegroundColor Green

Write-Host "`n=== Ouvrez la console ===" -ForegroundColor Cyan
Write-Host "IMPORTANT: Appuyez VITE sur une touche dans la console VM" -ForegroundColor Red
Write-Host "pour booter sur le DVD!" -ForegroundColor Red

# Ouvrir la console
vmconnect localhost $VMName

pause
