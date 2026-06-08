#!/usr/bin/env bash
# setup_linux.sh
# ----------------------------------------------------------------------
# Installation et configuration d'un lab d'observation Claude Opus 4.7
# via mitmproxy sur Ubuntu 22.04 / 24.04 ou Debian 12.
#
# Le script installe mitmproxy via pipx, génère la CA mitmproxy en
# lançant mitmdump une fois, puis l'ajoute au trust store système
# (utilisé par curl, Python requests, Node.js depuis v22 et claude.exe)
# ainsi qu'au store NSS (Firefox, Chromium snap).
#
# Usage :
#   chmod +x setup_linux.sh
#   ./setup_linux.sh
#
# Variables d'environnement éventuellement utiles à exporter ensuite :
#   ANTHROPIC_API_KEY=sk-ant-...
#   HTTPS_PROXY=http://localhost:8888
#   ANTHROPIC_BASE_URL=http://localhost:8888  (mode reverse alternatif)
#   NODE_EXTRA_CA_CERTS=$HOME/.mitmproxy/mitmproxy-ca-cert.pem
# ----------------------------------------------------------------------
set -euo pipefail

log() { printf '\033[1;34m[setup]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*" >&2; }
err() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------------
# 1. Vérification des prérequis
# ---------------------------------------------------------------------
log "Vérification des prérequis..."

command -v python3 >/dev/null || err "Python 3 requis. apt install python3"
command -v pip3 >/dev/null || sudo apt-get install -y python3-pip
command -v pipx >/dev/null || sudo apt-get install -y pipx
command -v sudo >/dev/null || err "sudo requis pour installer la CA au niveau système"

PY_MAJOR=$(python3 -c 'import sys; print(sys.version_info[0])')
PY_MINOR=$(python3 -c 'import sys; print(sys.version_info[1])')
if [ "$PY_MAJOR" -lt 3 ] || { [ "$PY_MAJOR" -eq 3 ] && [ "$PY_MINOR" -lt 10 ]; }; then
    err "Python 3.10 ou supérieur requis (détecté ${PY_MAJOR}.${PY_MINOR})"
fi

# ---------------------------------------------------------------------
# 2. Installation de mitmproxy
# ---------------------------------------------------------------------
log "Installation de mitmproxy via pipx..."
pipx ensurepath >/dev/null 2>&1 || true
if ! command -v mitmproxy >/dev/null 2>&1; then
    pipx install mitmproxy
else
    log "mitmproxy déjà installé : $(mitmproxy --version | head -n 1)"
fi

# Recharger PATH éventuellement modifié par pipx
export PATH="$HOME/.local/bin:$PATH"

# ---------------------------------------------------------------------
# 3. Génération de la CA mitmproxy
# ---------------------------------------------------------------------
CA_DIR="$HOME/.mitmproxy"
CA_PEM="$CA_DIR/mitmproxy-ca-cert.pem"
CA_CER="$CA_DIR/mitmproxy-ca-cert.cer"

if [ ! -f "$CA_PEM" ]; then
    log "Génération de la CA mitmproxy (premier lancement)..."
    mitmdump --listen-port 18888 &
    MMDPID=$!
    sleep 3
    kill "$MMDPID" 2>/dev/null || true
    wait "$MMDPID" 2>/dev/null || true
fi

[ -f "$CA_PEM" ] || err "CA mitmproxy non trouvée à $CA_PEM"
log "CA mitmproxy disponible : $CA_PEM"

# ---------------------------------------------------------------------
# 4. Installation dans le trust store système
# ---------------------------------------------------------------------
log "Installation de la CA dans le trust store système..."
sudo cp "$CA_PEM" /usr/local/share/ca-certificates/mitmproxy-ca-cert.crt
sudo update-ca-certificates

# ---------------------------------------------------------------------
# 5. Installation dans le store NSS (Firefox, Chromium snap)
# ---------------------------------------------------------------------
if command -v certutil >/dev/null 2>&1; then
    NSSDB="$HOME/.pki/nssdb"
    mkdir -p "$NSSDB"
    if [ ! -f "$NSSDB/cert9.db" ]; then
        certutil -d "sql:$NSSDB" -N --empty-password
    fi
    log "Ajout de la CA au store NSS..."
    certutil -A -d "sql:$NSSDB" -n mitmproxy -t "C,," -i "$CA_PEM"
else
    warn "certutil absent (paquet libnss3-tools). NSS non configuré."
    warn "Firefox et Chromium snap ne reconnaîtront pas la CA tant que"
    warn "vous n'aurez pas installé libnss3-tools puis relancé l'étape."
fi

# ---------------------------------------------------------------------
# 6. Variables d'environnement persistantes (mode regular par défaut)
# ---------------------------------------------------------------------
log "Configuration des variables d'environnement dans ~/.bashrc..."

RC_FILE="$HOME/.bashrc"
MARKER_BEGIN="# >>> LLM lab proxy (mitmproxy) >>>"
MARKER_END="# <<< LLM lab proxy (mitmproxy) <<<"

# Retirer un ancien bloc s'il existe
if grep -q "$MARKER_BEGIN" "$RC_FILE" 2>/dev/null; then
    sed -i "/$MARKER_BEGIN/,/$MARKER_END/d" "$RC_FILE"
fi

cat >> "$RC_FILE" <<RCEOF
$MARKER_BEGIN
# Decommenter pour activer l'interception. Laisser commente pour
# revenir au mode direct vers api.anthropic.com.
# export HTTPS_PROXY="http://localhost:8888"
# export HTTP_PROXY="http://localhost:8888"
# export NODE_EXTRA_CA_CERTS="\$HOME/.mitmproxy/mitmproxy-ca-cert.pem"
# export SSL_CERT_FILE="\$HOME/.mitmproxy/mitmproxy-ca-cert.pem"
# La cle Anthropic se met en place une fois et reste hors du bloc proxy
# export ANTHROPIC_API_KEY="sk-ant-..."
$MARKER_END
RCEOF

# ---------------------------------------------------------------------
# 7. Test de connectivité
# ---------------------------------------------------------------------
log "Test de connectivité Anthropic via curl (sans proxy)..."
if curl -sS -o /dev/null -w '%{http_code}\n' -m 8 https://api.anthropic.com/ \
    | grep -qE '^(2|3|4)[0-9][0-9]$'; then
    log "Connectivité api.anthropic.com OK"
else
    warn "Échec connectivité api.anthropic.com - vérifier le réseau"
fi

cat <<'POSTEOF'

----------------------------------------------------------------------
Installation terminée. Prochaines étapes manuelles :

1. Ouvrir un nouveau terminal pour recharger le PATH.

2. Lancer mitmproxy en mode regular :
     mitmdump -p 8888 -s llm_traffic_logger.py \
       --set llm_log_path=./traffic.jsonl

3. Dans une autre session, activer les variables d'interception :
     export HTTPS_PROXY=http://localhost:8888
     export ANTHROPIC_API_KEY=sk-ant-...

4. Test avec curl :
     curl -sS https://api.anthropic.com/v1/messages \
       -H "x-api-key: $ANTHROPIC_API_KEY" \
       -H "anthropic-version: 2023-06-01" \
       -H "content-type: application/json" \
       -d '{"model":"claude-opus-4-7","max_tokens":64,
            "messages":[{"role":"user","content":"ping"}]}'

5. Vérifier traffic.jsonl pour la trace capturée.

Pour désinstaller la CA :
     sudo rm /usr/local/share/ca-certificates/mitmproxy-ca-cert.crt
     sudo update-ca-certificates --fresh
     certutil -D -d sql:$HOME/.pki/nssdb -n mitmproxy
----------------------------------------------------------------------
POSTEOF
