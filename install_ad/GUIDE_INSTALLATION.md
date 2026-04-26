# Lab Active Directory - Guide d'installation complet

## Apercu

Deploiement automatise d'un lab Active Directory complet sur Hyper-V (Windows 11).

| Element | Valeur |
|---------|--------|
| **Domaine** | `lab.local` (NetBIOS: `LAB`) |
| **DC** | `DC01` (`DC01-LAB` dans Hyper-V) |
| **IP DC** | `192.168.0.10/24` |
| **Passerelle** | `192.168.0.1` |
| **DNS** | `127.0.0.1` (localhost) + `8.8.8.8` |
| **DHCP Scope** | `10.0.0.100` - `10.0.0.200` |
| **OS** | Windows Server 2022 Evaluation |

---

## Pre-requis

- Windows 10/11 Pro ou Enterprise (Hyper-V requis)
- 8 Go RAM minimum (4 Go alloues a la VM)
- 100 Go espace disque libre
- ISO Windows Server 2022 (telecharger sur [Microsoft Eval Center](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022))
- PowerShell 5.1+ en mode Administrateur

---

## Architecture reseau

```
Internet
    |
[Box/Routeur 192.168.0.1]
    |
[LabSwitch - External vSwitch]
    |
    +--- Hote Windows 11 (192.168.0.98)
    |
    +--- VM DC01-LAB    (192.168.0.10)
```

> **IMPORTANT** : Le LabSwitch est un switch **External** lie a la carte reseau physique.
> La VM NIC doit etre en mode **Untagged** (pas de VLAN). Voir section Depannage.

---

## Etapes de deploiement

### Etape 1 — Creer la VM (sur l'hote)

```powershell
# Ouvrir PowerShell en Administrateur
.\01_Create-VM.ps1 -ISOPath "C:\chemin\vers\server2022.iso"
```

**Ce que fait le script :**
- Active Hyper-V si necessaire (reboot requis)
- Cree le vSwitch `LabSwitch` (External)
- Cree la VM `DC01-LAB` : 4 vCPU, 4 Go RAM, 80 Go disque, Gen 2
- Monte l'ISO et configure le boot DVD en premier

**Apres execution :**
1. La console VM s'ouvre → appuyer sur une touche pour booter sur le DVD
2. Installer Windows Server 2022 **Desktop Experience**
3. Definir le mot de passe Administrator : `Cim22091956!!??`

---

### Etape 2 — Installer Active Directory (dans la VM)

```powershell
# Dans la VM, PowerShell Administrateur
.\02_Install-ADDS.ps1
```

**Ce que fait le script :**
- Configure l'IP statique : `192.168.0.10/24`, GW `192.168.0.1`
- Renomme le serveur en `DC01` → **reboot automatique**
- Relancer le script apres reboot
- Installe AD DS + DNS
- Promeut en Domain Controller pour `lab.local` → **reboot automatique**
- Relancer le script apres reboot
- Configure la zone DNS inversee + forwarders (8.8.8.8, 1.1.1.1)
- Installe et configure DHCP (scope 192.168.0.100-200)

> **Note** : Ce script necessite **2-3 executions** (redemarrages intermediaires).
> Apres le 1er reboot, le nom change. Apres la promotion DC, se connecter en `LAB\Administrator`.

---

### Transfert des scripts dans la VM

Les scripts sont sur l'hote. Pour les copier dans la VM, lancer un **serveur HTTP temporaire sur l'hote** :

```powershell
# Sur l'HOTE — lancer le serveur HTTP (garder la fenetre ouverte)
python -m http.server 8888 --bind 192.168.0.98 --directory C:\chemin\vers\install_ad
```

Puis **dans la VM** :

```powershell
# Telecharger les scripts
New-Item -ItemType Directory -Path C:\LabScripts -Force
Invoke-WebRequest -Uri "http://192.168.0.98:8888/03_Install-Services.ps1" -OutFile "C:\LabScripts\03_Install-Services.ps1"
Invoke-WebRequest -Uri "http://192.168.0.98:8888/04_Populate-AD.ps1" -OutFile "C:\LabScripts\04_Populate-AD.ps1"
```

> **Note** : Le partage SMB (`\\192.168.0.98\partage`) peut etre bloque par le firewall de l'hote.
> Le serveur HTTP Python est l'alternative la plus fiable pour transferer les fichiers.

---

### Etape 3 — Installer les services (dans la VM)

```powershell
C:\LabScripts\03_Install-Services.ps1
```

**Duree** : 15-30 minutes

**Services installes :**

| Service | Details |
|---------|---------|
| ADCS (PKI) | CA Enterprise Root `LAB-ROOT-CA` (4096 bits, SHA256, 10 ans) + Web Enrollment |
| IIS | Web Server + ASP.NET + FTP + site `LabIntranet` (port 8080) |
| File Server | DFS Namespace + Replication + Resource Manager + 5 partages |
| NPS/RADIUS | Network Policy Server |
| AD FS | Federation Services (SSO) |
| AD LDS | Lightweight Directory Services |
| RDS | Remote Desktop Server + Licensing + Web Access + Gateway |
| Backup | Windows Server Backup |
| SNMP | Service + WMI Provider |
| IPAM | IP Address Management |
| WDS | Windows Deployment Services |
| Print Services | Serveur d'impression |
| BitLocker | Chiffrement + Network Unlock |
| SMTP | Serveur relai mail |
| Telnet Client | Outil de debug |
| RSAT | Tous les outils d'administration |

**Partages crees** (dans `C:\Shares\`) :
- `Partage_Commun`, `Partage_IT`, `Partage_RH`, `Partage_Finance`, `Partage_Direction`

**Ports ouverts** : 21 (FTP), 25 (SMTP), 53 (DNS), 67/68 (DHCP), 80/443 (IIS), 88 (Kerberos), 389/636 (LDAP/S), 445 (SMB), 1812 (RADIUS), 3389 (RDP), 8080 (Intranet)

---

### Etape 4 — Peupler l'AD (dans la VM)

```powershell
C:\LabScripts\04_Populate-AD.ps1
```

**Structure creee :**

#### OUs (20 unites organisationnelles)

```
lab.local
├── Entreprise
│   ├── Direction
│   ├── IT
│   │   ├── Helpdesk
│   │   ├── Infrastructure
│   │   └── Developpement
│   ├── Securite
│   │   ├── SOC
│   │   └── GRC
│   ├── RH
│   ├── Finance
│   ├── Commercial
│   ├── R_et_D
│   ├── Juridique
│   └── Support
├── Serveurs
├── Postes
├── Groupes
├── Services_Comptes
└── Quarantaine
```

#### Utilisateurs (50+)

| Departement | Utilisateurs cles | Nombre |
|------------|-------------------|--------|
| Direction | jean-pierre.delacroix (PDG), marie.fontaine (DRH), philippe.beaumont (DAF), catherine.morel (DSI) | 4 |
| IT Infra | thomas.laurent (Resp.), nicolas.bernard, julien.moreau, sophie.durand | 4 |
| IT Helpdesk | maxime.petit (Resp.), camille.robin, hugo.blanc, emma.faure | 4 |
| IT Dev | alexandre.chevalier (Lead), lea.dubois, lucas.roux, chloe.fournier | 4 |
| Securite/SOC | antoine.mercier (RSSI), clara.lefevre, mathieu.garnier, julie.perrin | 4 |
| RH | isabelle.rousseau (Resp.), stephanie.clement, pauline.guillaume, david.henry | 4 |
| Finance | pierre.bonnet (Dir.), nathalie.lambert, laurent.martinez, valerie.girard | 4 |
| Commercial | olivier.andre (Dir.) + 5 commerciaux | 6 |
| R&D | marc.david (Dir.) + 3 ingenieurs | 4 |
| Juridique | francois.richard (Dir.), emilie.duval | 2 |
| Support | kevin.muller (Resp.) + 3 charges support | 4 |

**Format login** : `prenom.nom` (ex: `thomas.laurent`)
**Format email** : `prenom.nom@labcorp.local`

#### Comptes de service (8)

`svc_backup`, `svc_sql`, `svc_iis`, `svc_monitor`, `svc_antivirus`, `svc_scan`, `svc_print`, `svc_mail`

#### Comptes admin privilegies (3)

| Compte | Groupes |
|--------|---------|
| `adm.thomas.laurent` | Domain Admins, GRP_IT_Admins |
| `adm.catherine.morel` | Domain Admins, Enterprise Admins, Schema Admins |
| `adm.antoine.mercier` | Domain Admins, GRP_IT_Admins, GRP_SOC |

#### Groupes de securite (27+)

- **Departements** : GRP_Direction, GRP_IT, GRP_Securite, GRP_RH, GRP_Finance, GRP_Commercial, GRP_R_D, GRP_Support, GRP_Juridique
- **Sous-equipes IT** : GRP_IT_Admins, GRP_IT_Helpdesk, GRP_IT_Infra, GRP_IT_Dev
- **ACL partages** : ACL_Partage_Commun_RW/RO, ACL_Partage_IT_RW, ACL_Partage_RH_RW, ACL_Partage_Finance_RW
- **Fonctionnels** : GRP_VPN_Users, GRP_RDP_Users, GRP_PrintOperators, GRP_Managers, GRP_SOC
- **Distribution** : DL_Tous, DL_IT, DL_Direction

#### GPOs (8)

| GPO | Cible |
|-----|-------|
| LAB - Password Policy | Domaine |
| LAB - Audit Policy | Domaine |
| LAB - Desktop Lockdown | OU Entreprise |
| LAB - Drive Mappings | OU Entreprise |
| LAB - Windows Firewall | Domaine |
| LAB - RDP Settings | OU Serveurs |
| LAB - WSUS Client | Domaine |
| LAB - Screen Lock 5min | OU Entreprise |

#### Politiques de mot de passe

**Standard (tous)** : 12 caracteres min, complexite, historique 24, expiration 90j, lockout 5 tentatives / 30min

**Admin (fine-grained)** : 16 caracteres min, complexite, historique 48, expiration 60j, lockout 3 tentatives / 60min

---

## Credentials

| Compte | Mot de passe | Usage |
|--------|-------------|-------|
| `Administrator` | `Cim22091956!!??` | Administrateur local/DSRM |
| `LAB\Administrator` | `Cim22091956!!??` | Admin domaine |
| Tous les users | `Cim22091956!!??` | Mot de passe par defaut |
| Comptes `adm.*` | `Adm1n!Cim22091956!!??` | Comptes admin privilegies |

---

## Deploiement automatise (alternative)

Le script `run_in_vm.ps1` automatise les etapes 2-4 via PowerShell Direct :

```powershell
# Sur l'hote, apres installation Windows dans la VM
.\run_in_vm.ps1
```

Il copie les scripts dans la VM et les execute sequentiellement.

---

## Scripts utilitaires

| Script | Usage |
|--------|-------|
| `diag.ps1` | Diagnostic VM (ISO, DVD, boot, firmware) |
| `fix_boot.ps1` | Corrige l'ordre de boot (DVD en premier) |
| `rebuild.ps1` | Reconstruction complete de la VM |
| `05_Fix-Network.ps1` | **Corrige le reseau** (VLAN, switch, connectivite) |

---

## Depannage

### La VM n'a pas internet

**Symptome** : `ping 192.168.0.1` echoue depuis la VM ("Destination host unreachable")

**Cause** : La carte reseau de la VM est assignee a un VLAN (ex: VLAN 2) qui l'isole du reseau physique.

**Solution** :
```powershell
# Sur l'hote, en Administrateur
.\05_Fix-Network.ps1
```

Ou manuellement :
```powershell
# 1. Verifier le VLAN actuel
Get-VMNetworkAdapterVlan -VMName DC01-LAB

# 2. Retirer le VLAN
Set-VMNetworkAdapterVlan -VMName DC01-LAB -Untagged

# 3. S'assurer que la VM est sur LabSwitch (externe)
Get-VM -Name DC01-LAB | Get-VMNetworkAdapter | Connect-VMNetworkAdapter -SwitchName "LabSwitch"
```

Puis dans la VM, verifier la config IP :
```cmd
ipconfig /all
ping 192.168.0.1
ping 8.8.8.8
```

### La VM ne boote pas sur l'ISO

```powershell
.\fix_boot.ps1
```

### Le partage SMB hote → VM ne fonctionne pas

**Symptome** : `Copy-Item "\\192.168.0.98\partage\..."` echoue ("path does not exist")

**Cause** : Le firewall Windows de l'hote bloque le trafic SMB entrant depuis le reseau de la VM.

**Solution** : Utiliser un serveur HTTP Python a la place (plus fiable) :

```powershell
# Sur l'HOTE
python -m http.server 8888 --bind 192.168.0.98 --directory C:\chemin\vers\install_ad
```

```powershell
# Dans la VM
Invoke-WebRequest -Uri "http://192.168.0.98:8888/nom_du_script.ps1" -OutFile "C:\LabScripts\nom_du_script.ps1"
```

### Reconstruire la VM from scratch

```powershell
.\rebuild.ps1
```

---

## Installation de Claude Code dans la VM

### Pre-requis

- La VM doit avoir acces a Internet (voir section Depannage reseau)
- Une cle API Anthropic valide

### Installation

Depuis **PowerShell Administrateur** dans la VM :

```powershell
# 1. Installer Node.js LTS
Invoke-WebRequest -Uri "https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi" -OutFile "$env:TEMP\nodejs.msi"
Start-Process msiexec.exe -ArgumentList "/i $env:TEMP\nodejs.msi /quiet /norestart" -Wait

# 2. Installer Git for Windows (requis : Git Bash)
Invoke-WebRequest -Uri "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.2/Git-2.47.1.2-64-bit.exe" -OutFile "$env:TEMP\git-installer.exe"
Start-Process "$env:TEMP\git-installer.exe" -ArgumentList "/VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS /COMPONENTS=icons,ext\reg\shellhere,assoc,assoc_sh" -Wait

# >>> FERMER ET ROUVRIR PowerShell <<<

# 3. Verifier les installations
node --version    # v22.14.0
npm --version     # 10.9.2
git --version     # git version 2.47.1.windows.2

# 4. Installer Claude Code
npm install -g @anthropic-ai/claude-code

# 5. Lancer Claude Code
claude
```

> **Note** : Claude Code sur Windows necessite **Git Bash**. Si Git est installe mais non detecte,
> definir la variable d'environnement :
> ```powershell
> $env:CLAUDE_CODE_GIT_BASH_PATH = "C:\Program Files\Git\bin\bash.exe"
> ```

### Script automatise

Le script `06_Install-Claude-Code.ps1` automatise les etapes ci-dessus.

```powershell
.\06_Install-Claude-Code.ps1
```

---

## Fichiers du kit

```
install_ad/
├── GUIDE_INSTALLATION.md    # Ce fichier
├── 01_Create-VM.ps1         # Creation VM Hyper-V (hote)
├── 02_Install-ADDS.ps1      # Installation AD DS + DNS + DHCP (VM)
├── 03_Install-Services.ps1  # Installation services Windows (VM)
├── 04_Populate-AD.ps1       # Population AD : users, groupes, GPOs (VM)
├── 05_Fix-Network.ps1       # Correction reseau / VLAN (hote)
├── 06_Install-Claude-Code.ps1 # Installation Claude Code CLI (VM)
├── run_in_vm.ps1            # Deploiement automatise via PowerShell Direct
├── diag.ps1                 # Diagnostic VM
├── fix_boot.ps1             # Correction boot DVD
├── rebuild.ps1              # Reconstruction complete VM
└── DEPLOY.bat               # Menu de lancement
```
