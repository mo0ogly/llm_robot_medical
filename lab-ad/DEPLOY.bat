@echo off
echo ================================================
echo   LAB ACTIVE DIRECTORY - Deploiement
echo ================================================
echo.
echo   Ce kit contient 4 scripts a executer dans l'ordre:
echo.
echo   [ETAPE 1] 01_Create-VM.ps1
echo     ^> Execute sur ta MACHINE HOTE (Windows 11)
echo     ^> Cree la VM Hyper-V + reseau
echo     ^> Necessite l'ISO Windows Server 2022
echo.
echo   [ETAPE 2] 02_Install-ADDS.ps1
echo     ^> Execute DANS la VM (Windows Server)
echo     ^> Installe AD DS + DNS + DHCP
echo     ^> Promeut en Domain Controller (lab.local)
echo     ^> Necessite 2 redemarrages
echo.
echo   [ETAPE 3] 03_Install-Services.ps1
echo     ^> Execute DANS la VM (apres reboot)
echo     ^> Installe 15+ services (PKI, IIS, DFS, RDS, NPS...)
echo.
echo   [ETAPE 4] 04_Populate-AD.ps1
echo     ^> Execute DANS la VM
echo     ^> Cree 45+ users, groupes, OUs, GPOs, comptes admin
echo.
echo ================================================
echo.
echo   Pour commencer, ouvre PowerShell en Admin et lance:
echo   .\01_Create-VM.ps1
echo.
pause
