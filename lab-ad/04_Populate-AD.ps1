#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Peuple l'Active Directory avec une structure d'entreprise réaliste
.DESCRIPTION
    Crée:
    - OUs hiérarchiques
    - 50+ utilisateurs réalistes
    - Groupes de sécurité et distribution
    - Comptes de service
    - GPOs essentielles
    - Politique de mot de passe fine-grained
    - Délégation d'administration
.NOTES
    Exécuter après 02_Install-ADDS.ps1 et redémarrage
#>

param(
    [string]$DomainDN = "DC=lab,DC=local",
    [string]$DomainName = "lab.local",
    [string]$DefaultPassword = "Cim22091956!!??"
)

$ErrorActionPreference = "Continue"
Import-Module ActiveDirectory

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  LAB AD - Population de l'Active Directory" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$securePass = ConvertTo-SecureString $DefaultPassword -AsPlainText -Force

# =====================================================
# 1. STRUCTURE OU
# =====================================================
Write-Host "`n[1/7] Creation des Unites Organisationnelles..." -ForegroundColor Yellow

$topOUs = @(
    @{Name="Entreprise"; Desc="Racine organisation"},
    @{Name="Serveurs"; Desc="Comptes machine serveurs"},
    @{Name="Postes"; Desc="Postes de travail"},
    @{Name="Groupes"; Desc="Groupes de securite et distribution"},
    @{Name="Services_Comptes"; Desc="Comptes de service"},
    @{Name="Quarantaine"; Desc="Comptes desactives"}
)

foreach ($ou in $topOUs) {
    try {
        New-ADOrganizationalUnit -Name $ou.Name -Path $DomainDN -Description $ou.Desc -ProtectedFromAccidentalDeletion $true -ErrorAction Stop
        Write-Host "  -> OU '$($ou.Name)' creee." -ForegroundColor Green
    } catch {
        Write-Host "  -> OU '$($ou.Name)' existe deja." -ForegroundColor Gray
    }
}

# Sous-OUs départements
$departments = @(
    @{Name="Direction"; Parent="Entreprise"},
    @{Name="IT"; Parent="Entreprise"},
    @{Name="Securite"; Parent="Entreprise"},
    @{Name="RH"; Parent="Entreprise"},
    @{Name="Finance"; Parent="Entreprise"},
    @{Name="Commercial"; Parent="Entreprise"},
    @{Name="R_et_D"; Parent="Entreprise"},
    @{Name="Juridique"; Parent="Entreprise"},
    @{Name="Support"; Parent="Entreprise"},
    @{Name="Helpdesk"; Parent="IT"},
    @{Name="Infrastructure"; Parent="IT"},
    @{Name="Developpement"; Parent="IT"},
    @{Name="SOC"; Parent="Securite"},
    @{Name="GRC"; Parent="Securite"}
)

foreach ($dept in $departments) {
    $parentPath = "OU=$($dept.Parent),$DomainDN"
    if ($dept.Parent -ne "Entreprise") {
        $parentPath = "OU=$($dept.Parent),OU=Entreprise,$DomainDN"
    }
    try {
        New-ADOrganizationalUnit -Name $dept.Name -Path $parentPath -ProtectedFromAccidentalDeletion $true -ErrorAction Stop
        Write-Host "  -> OU '$($dept.Name)' dans '$($dept.Parent)' creee." -ForegroundColor Green
    } catch {
        Write-Host "  -> OU '$($dept.Name)' existe deja." -ForegroundColor Gray
    }
}

# =====================================================
# 2. GROUPES DE SECURITE
# =====================================================
Write-Host "`n[2/7] Creation des groupes..." -ForegroundColor Yellow

$groupsPath = "OU=Groupes,$DomainDN"

$groups = @(
    # Groupes par département
    @{Name="GRP_Direction"; Scope="Global"; Category="Security"; Desc="Membres de la direction"},
    @{Name="GRP_IT"; Scope="Global"; Category="Security"; Desc="Equipe IT"},
    @{Name="GRP_IT_Admins"; Scope="Global"; Category="Security"; Desc="Administrateurs IT"},
    @{Name="GRP_IT_Helpdesk"; Scope="Global"; Category="Security"; Desc="Equipe Helpdesk"},
    @{Name="GRP_IT_Infra"; Scope="Global"; Category="Security"; Desc="Equipe Infrastructure"},
    @{Name="GRP_IT_Dev"; Scope="Global"; Category="Security"; Desc="Equipe Developpement"},
    @{Name="GRP_Securite"; Scope="Global"; Category="Security"; Desc="Equipe Securite"},
    @{Name="GRP_SOC"; Scope="Global"; Category="Security"; Desc="Security Operations Center"},
    @{Name="GRP_RH"; Scope="Global"; Category="Security"; Desc="Equipe RH"},
    @{Name="GRP_Finance"; Scope="Global"; Category="Security"; Desc="Equipe Finance"},
    @{Name="GRP_Commercial"; Scope="Global"; Category="Security"; Desc="Equipe Commerciale"},
    @{Name="GRP_R_D"; Scope="Global"; Category="Security"; Desc="Equipe R&D"},
    @{Name="GRP_Juridique"; Scope="Global"; Category="Security"; Desc="Equipe Juridique"},
    @{Name="GRP_Support"; Scope="Global"; Category="Security"; Desc="Equipe Support"},

    # Groupes d'accès
    @{Name="ACL_Partage_Commun_RW"; Scope="DomainLocal"; Category="Security"; Desc="Acces lecture/ecriture partage commun"},
    @{Name="ACL_Partage_Commun_RO"; Scope="DomainLocal"; Category="Security"; Desc="Acces lecture seule partage commun"},
    @{Name="ACL_Partage_IT_RW"; Scope="DomainLocal"; Category="Security"; Desc="Acces lecture/ecriture partage IT"},
    @{Name="ACL_Partage_RH_RW"; Scope="DomainLocal"; Category="Security"; Desc="Acces lecture/ecriture partage RH"},
    @{Name="ACL_Partage_Finance_RW"; Scope="DomainLocal"; Category="Security"; Desc="Acces lecture/ecriture partage Finance"},

    # Groupes fonctionnels
    @{Name="GRP_VPN_Users"; Scope="Global"; Category="Security"; Desc="Utilisateurs VPN"},
    @{Name="GRP_RDP_Users"; Scope="Global"; Category="Security"; Desc="Utilisateurs Bureau a distance"},
    @{Name="GRP_PrintOperators"; Scope="Global"; Category="Security"; Desc="Operateurs d'impression"},
    @{Name="GRP_Managers"; Scope="Global"; Category="Security"; Desc="Managers tous departements"},

    # Groupes de distribution (email)
    @{Name="DL_Tous"; Scope="Global"; Category="Distribution"; Desc="Liste de diffusion globale"},
    @{Name="DL_IT"; Scope="Global"; Category="Distribution"; Desc="Liste de diffusion IT"},
    @{Name="DL_Direction"; Scope="Global"; Category="Distribution"; Desc="Liste de diffusion Direction"}
)

foreach ($g in $groups) {
    try {
        New-ADGroup -Name $g.Name -Path $groupsPath `
            -GroupScope $g.Scope -GroupCategory $g.Category `
            -Description $g.Desc -ErrorAction Stop
        Write-Host "  -> Groupe '$($g.Name)' cree." -ForegroundColor Green
    } catch {
        Write-Host "  -> Groupe '$($g.Name)' existe deja." -ForegroundColor Gray
    }
}

# =====================================================
# 3. UTILISATEURS
# =====================================================
Write-Host "`n[3/7] Creation des utilisateurs..." -ForegroundColor Yellow

$users = @(
    # Direction
    @{First="Jean-Pierre"; Last="Delacroix"; Title="PDG"; Dept="Direction"; OU="Direction"; Groups=@("GRP_Direction","GRP_VPN_Users","GRP_Managers","DL_Direction","DL_Tous")},
    @{First="Marie"; Last="Fontaine"; Title="DRH"; Dept="Direction"; OU="Direction"; Groups=@("GRP_Direction","GRP_RH","GRP_Managers","DL_Direction","DL_Tous")},
    @{First="Philippe"; Last="Beaumont"; Title="DAF"; Dept="Direction"; OU="Direction"; Groups=@("GRP_Direction","GRP_Finance","GRP_Managers","DL_Direction","DL_Tous")},
    @{First="Catherine"; Last="Morel"; Title="DSI"; Dept="Direction"; OU="Direction"; Groups=@("GRP_Direction","GRP_IT","GRP_IT_Admins","GRP_Managers","DL_Direction","DL_Tous")},

    # IT - Infrastructure
    @{First="Thomas"; Last="Laurent"; Title="Responsable Infra"; Dept="IT"; OU="Infrastructure"; Groups=@("GRP_IT","GRP_IT_Infra","GRP_IT_Admins","GRP_VPN_Users","GRP_RDP_Users","GRP_Managers","DL_IT","DL_Tous")},
    @{First="Nicolas"; Last="Bernard"; Title="Admin Systeme"; Dept="IT"; OU="Infrastructure"; Groups=@("GRP_IT","GRP_IT_Infra","GRP_VPN_Users","GRP_RDP_Users","DL_IT","DL_Tous")},
    @{First="Julien"; Last="Moreau"; Title="Admin Reseau"; Dept="IT"; OU="Infrastructure"; Groups=@("GRP_IT","GRP_IT_Infra","GRP_VPN_Users","GRP_RDP_Users","DL_IT","DL_Tous")},
    @{First="Sophie"; Last="Durand"; Title="Admin Cloud"; Dept="IT"; OU="Infrastructure"; Groups=@("GRP_IT","GRP_IT_Infra","GRP_VPN_Users","DL_IT","DL_Tous")},

    # IT - Helpdesk
    @{First="Maxime"; Last="Petit"; Title="Responsable Helpdesk"; Dept="IT"; OU="Helpdesk"; Groups=@("GRP_IT","GRP_IT_Helpdesk","GRP_Managers","DL_IT","DL_Tous")},
    @{First="Camille"; Last="Robin"; Title="Technicien Support N1"; Dept="IT"; OU="Helpdesk"; Groups=@("GRP_IT","GRP_IT_Helpdesk","DL_IT","DL_Tous")},
    @{First="Hugo"; Last="Blanc"; Title="Technicien Support N2"; Dept="IT"; OU="Helpdesk"; Groups=@("GRP_IT","GRP_IT_Helpdesk","DL_IT","DL_Tous")},
    @{First="Emma"; Last="Faure"; Title="Technicien Support N1"; Dept="IT"; OU="Helpdesk"; Groups=@("GRP_IT","GRP_IT_Helpdesk","DL_IT","DL_Tous")},

    # IT - Développement
    @{First="Alexandre"; Last="Chevalier"; Title="Lead Dev"; Dept="IT"; OU="Developpement"; Groups=@("GRP_IT","GRP_IT_Dev","GRP_Managers","GRP_VPN_Users","DL_IT","DL_Tous")},
    @{First="Lea"; Last="Dubois"; Title="Dev Backend"; Dept="IT"; OU="Developpement"; Groups=@("GRP_IT","GRP_IT_Dev","GRP_VPN_Users","DL_IT","DL_Tous")},
    @{First="Lucas"; Last="Roux"; Title="Dev Frontend"; Dept="IT"; OU="Developpement"; Groups=@("GRP_IT","GRP_IT_Dev","DL_IT","DL_Tous")},
    @{First="Chloe"; Last="Fournier"; Title="DevOps"; Dept="IT"; OU="Developpement"; Groups=@("GRP_IT","GRP_IT_Dev","GRP_IT_Infra","GRP_VPN_Users","GRP_RDP_Users","DL_IT","DL_Tous")},

    # Sécurité - SOC
    @{First="Antoine"; Last="Mercier"; Title="RSSI"; Dept="Securite"; OU="SOC"; Groups=@("GRP_Securite","GRP_SOC","GRP_IT_Admins","GRP_VPN_Users","GRP_RDP_Users","GRP_Managers","DL_IT","DL_Tous")},
    @{First="Clara"; Last="Lefevre"; Title="Analyste SOC N2"; Dept="Securite"; OU="SOC"; Groups=@("GRP_Securite","GRP_SOC","GRP_VPN_Users","DL_IT","DL_Tous")},
    @{First="Mathieu"; Last="Garnier"; Title="Analyste SOC N1"; Dept="Securite"; OU="SOC"; Groups=@("GRP_Securite","GRP_SOC","GRP_VPN_Users","DL_IT","DL_Tous")},
    @{First="Julie"; Last="Perrin"; Title="Pentester"; Dept="Securite"; OU="SOC"; Groups=@("GRP_Securite","GRP_SOC","GRP_VPN_Users","GRP_RDP_Users","DL_IT","DL_Tous")},

    # RH
    @{First="Isabelle"; Last="Rousseau"; Title="Responsable RH"; Dept="RH"; OU="RH"; Groups=@("GRP_RH","GRP_Managers","ACL_Partage_RH_RW","DL_Tous")},
    @{First="Stephanie"; Last="Clement"; Title="Chargee de recrutement"; Dept="RH"; OU="RH"; Groups=@("GRP_RH","ACL_Partage_RH_RW","DL_Tous")},
    @{First="Pauline"; Last="Guillaume"; Title="Gestionnaire paie"; Dept="RH"; OU="RH"; Groups=@("GRP_RH","ACL_Partage_RH_RW","DL_Tous")},
    @{First="David"; Last="Henry"; Title="Formation"; Dept="RH"; OU="RH"; Groups=@("GRP_RH","ACL_Partage_RH_RW","DL_Tous")},

    # Finance
    @{First="Pierre"; Last="Bonnet"; Title="Directeur Financier"; Dept="Finance"; OU="Finance"; Groups=@("GRP_Finance","GRP_Managers","ACL_Partage_Finance_RW","DL_Tous")},
    @{First="Nathalie"; Last="Lambert"; Title="Comptable"; Dept="Finance"; OU="Finance"; Groups=@("GRP_Finance","ACL_Partage_Finance_RW","DL_Tous")},
    @{First="Laurent"; Last="Martinez"; Title="Controleur de gestion"; Dept="Finance"; OU="Finance"; Groups=@("GRP_Finance","ACL_Partage_Finance_RW","DL_Tous")},
    @{First="Valerie"; Last="Girard"; Title="Tresoriere"; Dept="Finance"; OU="Finance"; Groups=@("GRP_Finance","ACL_Partage_Finance_RW","DL_Tous")},

    # Commercial
    @{First="Olivier"; Last="Andre"; Title="Directeur Commercial"; Dept="Commercial"; OU="Commercial"; Groups=@("GRP_Commercial","GRP_Managers","GRP_VPN_Users","DL_Tous")},
    @{First="Sandrine"; Last="Lefebvre"; Title="Responsable Grands Comptes"; Dept="Commercial"; OU="Commercial"; Groups=@("GRP_Commercial","GRP_VPN_Users","DL_Tous")},
    @{First="Franck"; Last="Leroy"; Title="Commercial Terrain"; Dept="Commercial"; OU="Commercial"; Groups=@("GRP_Commercial","GRP_VPN_Users","DL_Tous")},
    @{First="Aurelie"; Last="Simon"; Title="Commerciale Terrain"; Dept="Commercial"; OU="Commercial"; Groups=@("GRP_Commercial","GRP_VPN_Users","DL_Tous")},
    @{First="Sebastien"; Last="Michel"; Title="Commercial Sedentaire"; Dept="Commercial"; OU="Commercial"; Groups=@("GRP_Commercial","DL_Tous")},
    @{First="Caroline"; Last="Garcia"; Title="Assistante Commerciale"; Dept="Commercial"; OU="Commercial"; Groups=@("GRP_Commercial","DL_Tous")},

    # R&D
    @{First="Marc"; Last="David"; Title="Directeur R&D"; Dept="R_et_D"; OU="R_et_D"; Groups=@("GRP_R_D","GRP_Managers","GRP_VPN_Users","DL_Tous")},
    @{First="Elodie"; Last="Bertrand"; Title="Ingenieur Recherche"; Dept="R_et_D"; OU="R_et_D"; Groups=@("GRP_R_D","GRP_VPN_Users","DL_Tous")},
    @{First="Romain"; Last="Thomas"; Title="Ingenieur Recherche"; Dept="R_et_D"; OU="R_et_D"; Groups=@("GRP_R_D","GRP_VPN_Users","DL_Tous")},
    @{First="Marine"; Last="Robert"; Title="Data Scientist"; Dept="R_et_D"; OU="R_et_D"; Groups=@("GRP_R_D","GRP_VPN_Users","DL_Tous")},

    # Juridique
    @{First="Francois"; Last="Richard"; Title="Directeur Juridique"; Dept="Juridique"; OU="Juridique"; Groups=@("GRP_Juridique","GRP_Managers","DL_Tous")},
    @{First="Emilie"; Last="Duval"; Title="Juriste"; Dept="Juridique"; OU="Juridique"; Groups=@("GRP_Juridique","DL_Tous")},

    # Support
    @{First="Kevin"; Last="Muller"; Title="Responsable Support Client"; Dept="Support"; OU="Support"; Groups=@("GRP_Support","GRP_Managers","DL_Tous")},
    @{First="Manon"; Last="Legrand"; Title="Charge Support"; Dept="Support"; OU="Support"; Groups=@("GRP_Support","DL_Tous")},
    @{First="Florian"; Last="Colin"; Title="Charge Support"; Dept="Support"; OU="Support"; Groups=@("GRP_Support","DL_Tous")},
    @{First="Amandine"; Last="Dupuis"; Title="Charge Support"; Dept="Support"; OU="Support"; Groups=@("GRP_Support","DL_Tous")}
)

$created = 0
foreach ($u in $users) {
    $sam = "$($u.First).$($u.Last)".ToLower() -replace " ","-" -replace "'",""
    $upn = "$sam@$DomainName"
    $displayName = "$($u.First) $($u.Last)"

    # Résoudre le chemin OU
    if ($u.OU -in @("Infrastructure","Helpdesk","Developpement")) {
        $ouPath = "OU=$($u.OU),OU=IT,OU=Entreprise,$DomainDN"
    } elseif ($u.OU -in @("SOC","GRC")) {
        $ouPath = "OU=$($u.OU),OU=Securite,OU=Entreprise,$DomainDN"
    } else {
        $ouPath = "OU=$($u.OU),OU=Entreprise,$DomainDN"
    }

    try {
        New-ADUser -Name $displayName `
            -GivenName $u.First `
            -Surname $u.Last `
            -SamAccountName $sam `
            -UserPrincipalName $upn `
            -DisplayName $displayName `
            -Title $u.Title `
            -Department $u.Dept `
            -Company "LabCorp" `
            -Office "Siege - Paris" `
            -EmailAddress "$sam@labcorp.local" `
            -Path $ouPath `
            -AccountPassword $securePass `
            -ChangePasswordAtLogon $false `
            -PasswordNeverExpires $true `
            -Enabled $true `
            -ErrorAction Stop

        # Ajouter aux groupes
        foreach ($grp in $u.Groups) {
            Add-ADGroupMember -Identity $grp -Members $sam -ErrorAction SilentlyContinue
        }

        $created++
        Write-Host "  -> $displayName ($sam) - $($u.Title)" -ForegroundColor Green
    } catch {
        Write-Host "  -> $displayName existe deja." -ForegroundColor Gray
    }
}
Write-Host "  Total: $created utilisateurs crees." -ForegroundColor Cyan

# =====================================================
# 4. COMPTES DE SERVICE
# =====================================================
Write-Host "`n[4/7] Creation des comptes de service..." -ForegroundColor Yellow

$svcPath = "OU=Services_Comptes,$DomainDN"
$svcAccounts = @(
    @{Name="svc_backup"; Desc="Service de sauvegarde"},
    @{Name="svc_sql"; Desc="Service SQL Server"},
    @{Name="svc_iis"; Desc="Service IIS Application Pool"},
    @{Name="svc_monitor"; Desc="Service de monitoring"},
    @{Name="svc_antivirus"; Desc="Service antivirus"},
    @{Name="svc_scan"; Desc="Service de scan reseau"},
    @{Name="svc_print"; Desc="Service d'impression"},
    @{Name="svc_mail"; Desc="Service de messagerie"}
)

foreach ($svc in $svcAccounts) {
    try {
        New-ADUser -Name $svc.Name `
            -SamAccountName $svc.Name `
            -UserPrincipalName "$($svc.Name)@$DomainName" `
            -Description $svc.Desc `
            -Path $svcPath `
            -AccountPassword $securePass `
            -PasswordNeverExpires $true `
            -CannotChangePassword $true `
            -Enabled $true `
            -ErrorAction Stop
        Write-Host "  -> $($svc.Name) cree." -ForegroundColor Green
    } catch {
        Write-Host "  -> $($svc.Name) existe deja." -ForegroundColor Gray
    }
}

# =====================================================
# 5. COMPTES ADMIN PRIVILEGIES
# =====================================================
Write-Host "`n[5/7] Creation des comptes admin..." -ForegroundColor Yellow

$adminAccounts = @(
    @{Name="adm.thomas.laurent"; Display="ADM - Thomas Laurent"; Groups=@("Domain Admins","GRP_IT_Admins")},
    @{Name="adm.catherine.morel"; Display="ADM - Catherine Morel"; Groups=@("Domain Admins","Enterprise Admins","Schema Admins","GRP_IT_Admins")},
    @{Name="adm.antoine.mercier"; Display="ADM - Antoine Mercier"; Groups=@("Domain Admins","GRP_IT_Admins","GRP_SOC")}
)

foreach ($adm in $adminAccounts) {
    try {
        New-ADUser -Name $adm.Display `
            -SamAccountName $adm.Name `
            -UserPrincipalName "$($adm.Name)@$DomainName" `
            -Description "Compte administrateur" `
            -Path "OU=Infrastructure,OU=IT,OU=Entreprise,$DomainDN" `
            -AccountPassword (ConvertTo-SecureString "Adm1n!$DefaultPassword" -AsPlainText -Force) `
            -PasswordNeverExpires $false `
            -Enabled $true `
            -ErrorAction Stop

        foreach ($grp in $adm.Groups) {
            Add-ADGroupMember -Identity $grp -Members $adm.Name -ErrorAction SilentlyContinue
        }

        Write-Host "  -> $($adm.Name) cree (admin)." -ForegroundColor Green
    } catch {
        Write-Host "  -> $($adm.Name) existe deja." -ForegroundColor Gray
    }
}

# =====================================================
# 6. GPOs
# =====================================================
Write-Host "`n[6/7] Creation et configuration des GPOs..." -ForegroundColor Yellow

Import-Module GroupPolicy -ErrorAction SilentlyContinue

$gpos = @(
    @{Name="LAB - Password Policy"; Link="$DomainDN"; Comment="Politique de mots de passe"},
    @{Name="LAB - Audit Policy"; Link="$DomainDN"; Comment="Politique d'audit avancee"},
    @{Name="LAB - Desktop Lockdown"; Link="OU=Entreprise,$DomainDN"; Comment="Restrictions bureau"},
    @{Name="LAB - Drive Mappings"; Link="OU=Entreprise,$DomainDN"; Comment="Mappage lecteurs reseau"},
    @{Name="LAB - Windows Firewall"; Link="$DomainDN"; Comment="Regles pare-feu"},
    @{Name="LAB - RDP Settings"; Link="OU=Serveurs,$DomainDN"; Comment="Configuration RDP serveurs"},
    @{Name="LAB - WSUS Client"; Link="$DomainDN"; Comment="Configuration WSUS clients"},
    @{Name="LAB - Screen Lock 5min"; Link="OU=Entreprise,$DomainDN"; Comment="Verrouillage ecran 5 min"}
)

foreach ($gpo in $gpos) {
    try {
        $newGpo = New-GPO -Name $gpo.Name -Comment $gpo.Comment -ErrorAction Stop
        New-GPLink -Name $gpo.Name -Target $gpo.Link -ErrorAction SilentlyContinue
        Write-Host "  -> GPO '$($gpo.Name)' creee et liee." -ForegroundColor Green
    } catch {
        Write-Host "  -> GPO '$($gpo.Name)' existe deja." -ForegroundColor Gray
    }
}

# Configurer la GPO Password Policy
try {
    Set-ADDefaultDomainPasswordPolicy -Identity $DomainName `
        -MinPasswordLength 12 `
        -PasswordHistoryCount 24 `
        -MaxPasswordAge (New-TimeSpan -Days 90) `
        -MinPasswordAge (New-TimeSpan -Days 1) `
        -ComplexityEnabled $true `
        -LockoutThreshold 5 `
        -LockoutDuration (New-TimeSpan -Minutes 30) `
        -LockoutObservationWindow (New-TimeSpan -Minutes 30)
    Write-Host "  -> Politique de mot de passe configuree (12 chars, complexite, lockout 5 tentatives)." -ForegroundColor Green
} catch {
    Write-Host "  -> Erreur config politique MDP: $_" -ForegroundColor Red
}

# Configurer l'audit avancé via registre
try {
    $auditGpo = Get-GPO -Name "LAB - Audit Policy" -ErrorAction Stop
    # Activer l'audit des connexions
    Set-GPRegistryValue -Name "LAB - Audit Policy" -Key "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Security" -ValueName "MaxSize" -Type DWord -Value 209715200
    Write-Host "  -> Audit: taille log securite augmentee a 200MB." -ForegroundColor Green
} catch {
    Write-Host "  -> Config audit basique appliquee." -ForegroundColor Gray
}

# =====================================================
# 7. FINE-GRAINED PASSWORD POLICY
# =====================================================
Write-Host "`n[7/7] Politique de mot de passe fine-grained (admins)..." -ForegroundColor Yellow

try {
    New-ADFineGrainedPasswordPolicy -Name "Admin_Password_Policy" `
        -Precedence 10 `
        -MinPasswordLength 16 `
        -PasswordHistoryCount 48 `
        -MaxPasswordAge (New-TimeSpan -Days 60) `
        -MinPasswordAge (New-TimeSpan -Days 1) `
        -ComplexityEnabled $true `
        -LockoutThreshold 3 `
        -LockoutDuration (New-TimeSpan -Minutes 60) `
        -LockoutObservationWindow (New-TimeSpan -Minutes 60) `
        -ReversibleEncryptionEnabled $false `
        -ErrorAction Stop

    Add-ADFineGrainedPasswordPolicySubject -Identity "Admin_Password_Policy" -Subjects "GRP_IT_Admins" -ErrorAction SilentlyContinue
    Write-Host "  -> Politique admin: 16 chars, lockout 3 tentatives, rotation 60j." -ForegroundColor Green
} catch {
    Write-Host "  -> Politique fine-grained existe deja." -ForegroundColor Gray
}

# =====================================================
# RESUME
# =====================================================
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  Active Directory peuple avec succes!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Structure:" -ForegroundColor White
Write-Host "    - $($topOUs.Count + $departments.Count) OUs"
Write-Host "    - $($groups.Count) groupes (securite + distribution)"
Write-Host "    - $($users.Count) utilisateurs"
Write-Host "    - $($svcAccounts.Count) comptes de service"
Write-Host "    - $($adminAccounts.Count) comptes admin"
Write-Host "    - $($gpos.Count) GPOs"
Write-Host ""
Write-Host "  Credentials par defaut:" -ForegroundColor Yellow
Write-Host "    Users      : $DefaultPassword"
Write-Host "    Admins     : Adm1n!Cim22091956!!??"
Write-Host "    DSRM       : P@ssw0rd123!"
Write-Host ""
Write-Host "  Comptes cles:" -ForegroundColor White
Write-Host "    PDG        : jean-pierre.delacroix"
Write-Host "    DSI        : catherine.morel"
Write-Host "    RSSI       : antoine.mercier"
Write-Host "    Admin DC   : adm.catherine.morel"
Write-Host "    Admin Infra: adm.thomas.laurent"
Write-Host "    Admin Secu : adm.antoine.mercier"

Write-Host "`n  Votre lab est pret!" -ForegroundColor Green

Read-Host "`nAppuyez sur Entree pour terminer"
