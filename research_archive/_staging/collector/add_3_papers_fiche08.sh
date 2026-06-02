#!/usr/bin/env bash
# Runbook de reprise : ajout des 3 papiers verifies (dettes fiche #08) au corpus
# aegis_bibliography via le pipeline complet bibliography-maintainer.
#
# A executer EN LOCAL sur poc_medical (Windows : WSL ou Git Bash ; Linux : direct),
# avec la stack up. Le sandbox Cowork ne peut pas telecharger les PDFs (restrictions
# de fetch), d'ou ce script a lancer cote utilisateur.
#
# Papiers (dedup-clean au 2026-05-21, cf. papers_scoped_fiche08_2026-05-21.json) :
#   P153  Wallace et al. 2024  arXiv:2404.13208  Instruction Hierarchy
#   P154  Qi et al. 2023       arXiv:2310.03693  Fine-tuning compromises safety
#   P155  Schulhoff et al.2023 arXiv:2311.16119  HackAPrompt taxonomy
#
# Usage : bash add_3_papers_fiche08.sh
set -euo pipefail

# --- Resolution de la racine du depot (pas de chemin hardcode) ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"   # _staging/collector -> research_archive -> repo
LIT_DIR="$REPO_ROOT/research_archive/literature_for_rag"
cd "$REPO_ROOT"

ARXIV_IDS=("2404.13208" "2310.03693" "2311.16119")

echo "== [0/4] Verification de la stack (ChromaDB / backend) =="
bash aegis.sh health || { echo "Stack down. Lancer : bash aegis.sh start"; exit 1; }

echo "== [1/4] Telechargement des PDFs dans $LIT_DIR =="
mkdir -p "$LIT_DIR"
for id in "${ARXIV_IDS[@]}"; do
  out="$LIT_DIR/${id}.pdf"
  if [ -s "$out" ]; then
    echo "  deja present : ${id}.pdf"
  else
    echo "  download arXiv:${id}"
    curl -fsSL "https://arxiv.org/pdf/${id}" -o "$out"
  fi
done

echo "== [2/4] Anti-doublon (STEP 0) =="
python3 backend/tools/check_corpus_dedup.py "${ARXIV_IDS[@]}"
echo "  -> les 3 doivent etre [NEW]. Si [DUPLICATE], referencer le P-ID existant et retirer le doublon."

echo "== [3/4] Pipeline d'analyse + injection (etape skill, manuelle) =="
cat <<'NEXT'
  Dans Claude Code / Cowork ouvert sur poc_medical (stack up), lancer :

      /bibliography-maintainer analyze_only

  en indiquant les 3 PDFs telecharges et le staging
  research_archive/_staging/collector/papers_scoped_fiche08_2026-05-21.json.

  Les agents s'en chargent :
    - ANALYST   : fiches P006 dans doc_references/{2023,2024}/... (FR, [ARTICLE VERIFIE] apres lecture full-text)
    - CHUNKER   : injection dans la collection aegis_bibliography
    - LIBRARIAN : MANIFEST (P153-P155) + INDEX_BY_DELTA + GLOSSAIRE

  Rappels qualite (CLAUDE.md) : lecture full-text via RAG, references inline,
  tags epistemiques, pas de remplissage.
NEXT

echo "== [4/4] Verification post-injection (apres le run skill) =="
echo "  - Lignes MANIFEST :"
grep -E "P153|P154|P155" research_archive/doc_references/MANIFEST.md || echo "    (pas encore ajoutees)"
echo "  - Chunks ChromaDB (>= 5 par P-ID) :"
python3 backend/tools/verify_chromadb_chunks.py --p-ids P153 P154 P155 --min 5 || true

echo "Termine (etapes deterministes). Etape 3 a executer via le skill."
