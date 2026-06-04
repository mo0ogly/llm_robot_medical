"""Charge backend/.env dans os.environ au demarrage.

Importe en tete de autogen_config.py et de tout script standalone.
Garantit que GROQ_API_KEY est disponible independamment du mode de
lancement (uvicorn, nohup, script direct, pytest).

Walk-up: quand ce module est execute depuis un git worktree, le fichier
backend/.env local n'existe pas (il est gitignore donc non propage aux
worktrees). La fonction remonte alors jusqu'au main tree du repo pour
trouver un backend/.env autoritatif. Aucune duplication de secret n'est
necessaire.
"""
from __future__ import annotations

import os
from pathlib import Path

# Limite de remontee: suffit pour couvrir .claude/worktrees/<name>/backend/
# (4 parents jusqu'au root du repo) plus une marge.
_WALK_UP_LIMIT = 6


def _candidate_env_paths() -> list:
    """Liste ordonnee des .env a tenter, du plus local au main tree du repo."""
    here = Path(__file__).resolve().parent
    candidates = [here / ".env"]
    current = here
    for _ in range(_WALK_UP_LIMIT):
        parent = current.parent
        if parent == current:
            break
        candidate = parent / "backend" / ".env"
        if candidate.resolve() != candidates[0].resolve():
            candidates.append(candidate)
        current = parent
    return candidates


def load_backend_env() -> None:
    """Populate os.environ from the first backend/.env found (local, puis walk-up).

    Ne surcharge pas les vars deja definies dans l'environnement (setdefault).
    """
    for env_path in _candidate_env_paths():
        if not env_path.exists():
            continue
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)
        return


def _mitmproxy_listen_addr() -> tuple:
    """Derive mitmproxy's (host, port) from proxy env, default 127.0.0.1:8080."""
    proxy = (os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
             or os.environ.get("HTTP_PROXY") or os.environ.get("http_proxy") or "")
    host, port = "127.0.0.1", 8080
    if "://" in proxy:
        proxy = proxy.split("://", 1)[1]
    hostpart = proxy.split("/", 1)[0] if proxy else ""
    if hostpart:
        if ":" in hostpart:
            h, _, p = hostpart.partition(":")
            host = h or host
            try:
                port = int(p)
            except ValueError:
                pass
        else:
            host = hostpart
    return host, port


def ensure_tls_ca() -> None:
    """Guard a stale mitmproxy CA pin from breaking direct HTTPS.

    The dev environment may pin SSL_CERT_FILE to the mitmproxy CA
    (~/.mitmproxy/mitmproxy-ca-cert.pem) for traffic interception. When
    mitmproxy is NOT running, public TLS endpoints (e.g. api.groq.com) present
    their real chain, which that CA cannot verify -> every httpx/requests call
    fails with CERTIFICATE_VERIFY_FAILED. If the pin is present but mitmproxy is
    unreachable, fall back to the certifi bundle so direct connections verify
    normally. No-op when no mitmproxy pin is set or when mitmproxy is actually
    listening (interception stays intact).

    Documented failure mode (2026-06-04): F46 full calibration aborted at the
    Groq healthcheck (SSL CERTIFICATE_VERIFY_FAILED) because SSL_CERT_FILE was
    pinned to the mitmproxy CA while mitmproxy was down.
    """
    import socket

    pin = os.environ.get("SSL_CERT_FILE", "") or os.environ.get("REQUESTS_CA_BUNDLE", "")
    if "mitmproxy" not in pin.lower():
        return  # no mitmproxy pin -> leave the environment untouched

    host, port = _mitmproxy_listen_addr()
    try:
        with socket.create_connection((host, port), timeout=0.5):
            return  # mitmproxy is up -> keep interception, keep the pin
    except OSError:
        pass  # mitmproxy down -> fall back to certifi below

    try:
        import certifi
    except ImportError:
        return  # nothing better to fall back to
    ca = certifi.where()
    os.environ["SSL_CERT_FILE"] = ca
    os.environ["REQUESTS_CA_BUNDLE"] = ca


# Auto-execute a l'import
load_backend_env()
ensure_tls_ca()
