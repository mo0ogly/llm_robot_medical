#!/usr/bin/env bash
# Runbook TC-001 v3 -- re-run propre de la campagne Triple Convergence (C1 / D-001 / D-022).
#
# Pourquoi : audit anti-confabulation 2026-05-21
# (research_notes/AEGIS-AUDIT-TC001_anti-confabulation_2026-05-21.md) -> verdict NON CONFORME.
# Six runs du 2026-04-08 (3 modeles) ont ete conflés ; aucun chiffre cite n'est tracable a un
# fichier unique ; le KW p=0.77 de RESEARCH_STATE ne correspond a aucun run.
#
# Cause racine : `backend/run_triple_convergence.py` ecrit TOUJOURS dans
# `research_archive/experiments/triple_convergence_results.json` (il l'ecrase a chaque run)
# + une copie horodatee dans `backend/experiments/results/`. Lancer plusieurs modeles a la suite
# ecrase donc le fichier canonique. Ce runbook copie le resultat sous un nom par modele ENTRE
# chaque run pour produire un fichier autoritatif par modele.
#
# A executer EN LOCAL (stack up, LLM en service). Le sandbox Cowork ne peut pas appeler de LLM.
#
# Usage : bash research_archive/experiments/run_tc001_v3.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"   # experiments -> research_archive -> repo
cd "$REPO_ROOT"

CANON="$REPO_ROOT/research_archive/experiments/triple_convergence_results.json"
OUTDIR="$REPO_ROOT/research_archive/experiments"
RESULTS_DIR="$REPO_ROOT/backend/experiments/results"

# Modeles a tester (conditions distinctes). 3B via Ollama (Groq n'a pas de 3B llama),
# 8B et 70B via Groq. Adapter si besoin.
MODELS=("llama3.2:latest"      "llama-3.1-8b-instant" "llama-3.3-70b-versatile")
PROVIDERS=("ollama"            "groq"                 "groq")
SLUGS=("3B"                    "8B"                   "70B")

echo "== [0] Pre-requis =="
[ -f backend/.env ] && echo "  .env present (GROQ_API_KEY)" || echo "  ATTENTION: backend/.env absent (requis pour Groq)"
bash aegis.sh health || { echo "Stack down -> bash aegis.sh start"; exit 1; }

echo "== [1] Archivage des 6 runs exploratoires du 2026-04-08 =="
ARCHIVE="$RESULTS_DIR/archive_2026-04-08_exploratoire"
mkdir -p "$ARCHIVE"
mv "$RESULTS_DIR"/campaign_triple_convergence_20260408_*.json "$ARCHIVE"/ 2>/dev/null && echo "  archives -> $ARCHIVE" || echo "  (deja archives ou absents)"

echo "== [2] Campagne v3 par modele (N=30 x 7 conditions, seed 42 fixe, temp 0.0) =="
for i in "${!MODELS[@]}"; do
  model="${MODELS[$i]}"; provider="${PROVIDERS[$i]}"; slug="${SLUGS[$i]}"
  echo "  --- ${slug} : ${model} (provider ${provider}) ---"
  if [ "$provider" = "ollama" ]; then
    ollama list 2>/dev/null | grep -q "${model%%:*}" || { echo "    Ollama: '${model}' non pulled -> ollama pull ${model}"; exit 1; }
  fi
  MEDICAL_MODEL="$model" LLM_PROVIDER="$provider" \
  TC_MAX_TOKENS=500 TC_MAX_FUZZ=1 TC_TEMPERATURE=0.0 \
    python3 backend/run_triple_convergence.py
  dest="$OUTDIR/TC001_v3_${slug}.json"
  cp "$CANON" "$dest"
  echo "    => $dest"
done

echo "== [3] Recapitulatif v3 (full vs best subset vs KW p, par modele) =="
for slug in "${SLUGS[@]}"; do
python3 - "$OUTDIR/TC001_v3_${slug}.json" "$slug" <<'PY' 2>/dev/null
import json,sys
f,slug=sys.argv[1],sys.argv[2]
d=json.load(open(f)); a=d.get('analysis',{}); m=d.get('metadata',{})
print(f"  {slug:3} {m.get('model'):24} full={d['condition_results']['delta0_delta1_delta2']['mean_asr']} "
      f"best={a.get('best_subset_condition')}({a.get('best_subset_asr')}) "
      f"KWp={a.get('kruskal_wallis_p_value')} c1={a.get('conjecture_c1_supported')}")
PY
done

cat <<'NEXT'

== [4] PROTOCOLE DE RECONCILIATION (apres v3) ==

Chaque source doit citer TC001_v3_<modele>.json avec le nom de fichier exact, chaque
chiffre tague. Mettre a jour, dans l'ordre :

  1. research_archive/RESEARCH_STATE.md  -> Section 4, ligne C1 :
       remplacer modele/full/best-subset/KW p par les valeurs v3 du modele retenu,
       supprimer "p=0.77" (non sourcable). Lever l'ERRATUM si v3 coherent.
  2. discoveries/TRIPLE_CONVERGENCE.md   -> table : 3 colonnes (3B/8B/70B) = v3,
       supprimer l'ancienne colonne "3B" non tracable.
  3. discoveries/DISCOVERIES_INDEX.md    -> D-001 et D-022 : chiffres v3 + fichiers sources.
  4. articles/triple_convergence_paper.md-> aligner sur v3.

  5. Audit anti-confabulation des 4 sources mises a jour :
       Skill: anti-confabulation (mode AUDIT) sur chacune -> verdict CONFORME attendu.
  6. /audit-these full  (fidelite + claims) avant de declarer le lot done.
  7. Decision directeur sur le score de C1 a la lumiere des v3 (tous les runs 04-08
     donnent C1 NOT SUPPORTED au sens additif ; conserver la nuance "antagoniste" D-022
     si v3 le confirme, sur des chiffres exacts cette fois).

Mettre a jour campaign_manifest.json : TC-001 INCONCLUSIVE -> DONE (v3).
NEXT
echo "Termine (campagne). Etape [4] : reconciliation manuelle + skills."
