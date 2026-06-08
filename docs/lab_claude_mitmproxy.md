# Mise en œuvre d'un lab d'observation du trafic Claude Opus 4.8 via mitmproxy
*Procédure détaillée Linux et Windows*
*Note technique de laboratoire. Usage interne et pédagogique. Audience experte cybersécurité et IA.*

## 1. Objectifs et architecture du lab
Cette note décrit la mise en œuvre d'un dispositif d'observation du trafic réseau entre un client IDE et le modèle Claude Opus 4.8 hébergé sur api.anthropic.com. L'objectif est de capturer, déchiffrer et journaliser les échanges HTTP en clair applicatif pour analyse pédagogique ou recherche sécurité.

Le dispositif repose sur mitmproxy en mode *regular*, sur le même poste que le client, avec la CA mitmproxy installée dans le trust store du système. L'addon Python `llm_traffic_logger.py` (fourni dans la note technique principale) tape le trafic chunk par chunk sans casser le streaming SSE et écrit un fichier JSONL exploitable hors ligne.

### 1.1 Ce que le lab permet d'observer
* Le payload exact envoyé par le client (system prompt, tools, messages, model)
* Les en-têtes HTTP incluant `x-api-key` et `anthropic-version`
* Le flux SSE événement par événement (`message_start`, `deltas`, `message_delta`, `message_stop`)
* Les compteurs usage retournés par Anthropic : `input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`
* Les blocs `tool_use` et `tool_result` au fil de la boucle agentique
* Les valeurs `stop_reason` et leur évolution
* Les latences réseau et de génération

## 2. Choix architectural : mode regular ou mode reverse
Deux configurations sont possibles pour intercepter le trafic. Le choix dépend du client utilisé et du degré de réalisme souhaité.

### 2.1 Mode regular (HTTPS_PROXY)
Le client conserve l'URL `api.anthropic.com` et délègue le transport à mitmproxy via la variable d'environnement standard `HTTPS_PROXY`. mitmproxy intercepte la session TLS en présentant un certificat signé par sa CA, puis ré-établit une session TLS vers le vrai serveur. C'est la configuration recommandée pour un lab fidèle au comportement de production.

### 2.2 Mode reverse (ANTHROPIC_BASE_URL)
Le client est configuré pour parler directement à `localhost:8888` via `ANTHROPIC_BASE_URL`. mitmproxy en mode reverse forwarde vers `https://api.anthropic.com`. Aucun déchiffrement TLS n'est nécessaire côté client.

> **Astuce opérationnelle — quel mode choisir**
> * **Mode regular** : pour reproduire fidèlement le comportement d'un client en production. Compatible avec tous les clients, mais demande l'installation de la CA.
> * **Mode reverse** : pour itérer rapidement sans manipuler les trust stores. Ne reproduit pas la chaîne TLS.

## 3. Pré-requis

### 3.1 Compte Anthropic et clé API
* Un compte Anthropic Console avec accès facturé.
* Une clé API au format `sk-ant-api03-...`.

> [!WARNING]
> **Lecture cybersécurité — gestion de la clé API**
> La clé API doit être stockée hors du code. Surveiller le compteur d'usage sur la Console pendant le lab et révoquer immédiatement en cas d'anomalie.

### 3.2 Logiciels requis
| Composant | Linux | Windows 11 |
| :--- | :--- | :--- |
| Python | 3.10+, `apt install python3 pipx` | 3.11+, `winget install Python.Python.3.12` |
| mitmproxy | `pipx install mitmproxy` (v12+) | `pip install mitmproxy` (v12+) |
| certutil | `apt install libnss3-tools` | Inclus dans Windows |
| Claude Code CLI | `npm install -g @anthropic-ai/claude-code` | `npm install -g @anthropic-ai/claude-code` |

### 3.3 Vérifications préalables
Avant de commencer, valider que le poste peut joindre `api.anthropic.com` en direct, sans interférence d'un proxy d'entreprise.

```bash
# Linux
curl -sS -o /dev/null -w "%{http_code}\n" -m 8 https://api.anthropic.com/
openssl s_client -connect api.anthropic.com:443 -servername api.anthropic.com </dev/null 2>/dev/null | openssl x509 -noout -issuer
```

## 4. Installation et configuration Linux (Résumé)
L'installation sous Linux implique d'installer mitmproxy via `pipx`, de générer la CA (en démarrant `mitmdump` une fois), et de l'ajouter au trust store système et au store NSS (pour Firefox/Chromium). 

> *Un script automatisé `setup_linux.sh` est disponible dans le dossier `scripts/mitmproxy_lab` pour effectuer toutes ces étapes.*

## 5. Installation et configuration Windows 11 (Résumé)
L'installation sous Windows implique l'utilisation de `winget` pour Python, `pip` pour mitmproxy, et l'import de la CA dans le Certificate Store Windows (via `Import-Certificate`).

> *Un script automatisé `setup_windows.ps1` (partiel) est disponible dans le dossier `scripts/mitmproxy_lab`.*

## 6. Test de fumée HTTP local
Avant d'attaquer l'API, valider la pipeline :
```bash
# Terminal 1
mitmdump --mode reverse:https://httpbin.org -p 8888
# Terminal 2
curl -sS http://localhost:8888/get
```

## 7. Test HTTPS sur api.anthropic.com
```bash
mitmdump -p 8888 -s llm_traffic_logger.py --set llm_log_path=./traffic.jsonl

export HTTPS_PROXY=http://localhost:8888
export ANTHROPIC_API_KEY=sk-ant-...

curl -sS https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-opus-4-7", "max_tokens": 64, "messages": [{"role": "user", "content": "Dis bonjour en une phrase."}]}'
```

## 8. Configuration des clients
### 8.1 Claude Code CLI
```bash
export HTTPS_PROXY=http://localhost:8888
export ANTHROPIC_API_KEY=sk-ant-...
claude "Refactore le fichier auth.py pour utiliser argon2"
```

### 8.2 Continue / Cline (VS Code)
Pour Continue (mode reverse) dans `~/.continue/config.json` :
```json
{
  "models": [
    {
      "title": "Claude Opus via proxy",
      "provider": "anthropic",
      "model": "claude-opus-4-7",
      "apiBase": "http://localhost:8888",
      "apiKey": "sk-ant-..."
    }
  ]
}
```

## 10. Scénarios d'observation
Quatre scénarios sont documentés pour observer :
1. **Premier message** (validation du chemin nominal)
2. **Cache write puis cache hit** (validation de l'utilisation du cache)
3. **Boucle tool_use** (observer `stop_reason = tool_use`)
4. **Session longue** (20 tours conversationnels via un script Python)

## 12. Troubleshooting
* **curl: SSL certificate problem** : CA absente du trust store.
* **Self-signed certificate detected** : Bun runtime ignore le trust store (utiliser `CLAUDE_CODE_CERT_STORE=bundled,system`).
* **Streaming SSE coupé** : mitmproxy buffer le body, vérifier l'addon `llm_traffic_logger.py`.

## 13. Sécurité opérationnelle et nettoyage
> [!CAUTION]
> La CA mitmproxy installée donne la capacité de signer n'importe quel certificat. Ne l'utiliser que pour le développement et la supprimer après le lab.

```bash
# Désinstallation Linux
sudo rm /usr/local/share/ca-certificates/mitmproxy-ca-cert.crt
sudo update-ca-certificates --fresh
certutil -D -d sql:$HOME/.pki/nssdb -n mitmproxy
rm -rf ~/.mitmproxy
```
