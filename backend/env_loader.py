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


# Auto-execute a l'import
load_backend_env()
