# Audit anti-confabulation — TC-001 (Triple Convergence, chiffres geles)

Using anti-confabulation skill. Mode : AUDIT.

- Objet : reconcilier les chiffres TC-001 cites dans plusieurs sources, geles par l'erratum 2026-05-20.
- Date d'audit : 2026-05-21 (research-director, P0).
- Source autoritative : `experiments/triple_convergence_results.json` (donnees brutes de la campagne).
- Sources narratives auditees : `RESEARCH_STATE.md` (Section 4, C1), `discoveries/TRIPLE_CONVERGENCE.md` (table TC-001 vs TC-002), `discoveries/DISCOVERIES_INDEX.md` (D-001).

## 1. Donnees brutes (autoritatives) — [MESURE]

`triple_convergence_results.json` : model = **llama-3.1-8b-instant**, date 2026-04-08, N=30 par condition, 210 runs, seed 42, scoring deterministe.

| Condition | mean_asr (json) | violations | CI95 |
|-----------|-----------------|------------|------|
| δ⁰ seul | 6.67% | 2/30 | [1.85%, 21.32%] |
| δ¹ seul | 30.00% | 9/30 | [16.66%, 47.88%] |
| δ² seul | 56.67% | 17/30 | [39.2%, 72.62%] |
| δ⁰+δ¹ | 6.67% | 2/30 | [1.85%, 21.32%] |
| δ⁰+δ² | 3.33% | 1/30 | [0.59%, 16.67%] |
| δ¹+δ² | 23.33% | 7/30 | [11.79%, 40.93%] |
| δ⁰+δ¹+δ² (full) | **16.67%** | 5/30 | [7.34%, 33.56%] |

Analyse json : Kruskal-Wallis **p = 0.00467 (significatif)**, best subset = **δ² seul (56.67%)**, gap full vs best subset = **-0.40**, effect size Cohen's f = 0.48, `conjecture_c1_supported = False`.

## 2. Tableau des incoherences

| Affirmation (source) | Tag | Confrontation avec le json autoritatif |
|----------------------|-----|----------------------------------------|
| Modele = "llama3.2:3.2B" (RESEARCH_STATE, C1) | [FAUX] | Le json indique `llama-3.1-8b-instant`. Mauvais modele cite |
| Modele = "3B (TC-001)" (TRIPLE_CONVERGENCE.md) | [FAUX] | idem : 8B, pas 3B |
| ASR full = 3% (RESEARCH_STATE, C1) | [FAUX] | json : 16.67% |
| ASR full = 7% (TRIPLE_CONVERGENCE.md, col 3B) | [A VERIFIER] | json : 16.67%. Le 7% appartient a un autre run (colonne "3B" non tracee a un fichier) |
| ASR full = 16.67% (json) | [MESURE] | Valeur autoritative |
| best subset = 23% (RESEARCH_STATE, C1) | [FAUX] | json : best subset = δ² seul a 56.67%. Le 23.33% est δ¹+δ², pas le best subset |
| KW p = 0.77 (non-significatif) (RESEARCH_STATE, C1) | [FAUX] | json : p = 0.00467 (significatif). L'inference qualitative "pas de synergie, non-significatif" repose sur un p-value errone |
| N=30, 210 runs, 7 conditions (RESEARCH_STATE) | [MESURE] | Coherent avec le json. OK |
| Colonne "ASR 3B (TC-001)" : δ⁰=10, δ¹=17, δ²=43, full=7 (TRIPLE_CONVERGENCE.md) | [A VERIFIER] | Aucune de ces valeurs ne correspond au json (6.67/30/56.67/16.67). Provient d'un run 3B distinct, non reference. Fichier source a localiser |
| `conjecture_c1_supported = False` (json) | [MESURE] | Pour CE run (8B), C1 n'est PAS supportee : full (16.67%) tres inferieur au best subset (56.67%) |

## 3. Rapport de scoring

```
SCORING ANTI-CONFABULATION — TC-001 (sources narratives) — 2026-05-21
Source autoritative : triple_convergence_results.json (8B, 2026-04-08)
Verdict : NON CONFORME
Fautes bloquantes :
  - 3 mesures mal citees (modele, ASR full, best subset) entre RESEARCH_STATE / TRIPLE_CONVERGENCE.md et le json
  - p-value cite non-significatif (0.77) la ou la donnee est significative (0.0047) : inversion de conclusion statistique
Dettes ouvertes [A VERIFIER] : colonne 3B (fichier source), origine du "7%" et du "3%"
```

## 4. Lecture

Le gel de l'erratum 2026-05-20 etait justifie. Trois "runs TC-001" coexistent dans les sources sans tracabilite claire : un run 8B (le seul avec donnees brutes : ce json), une colonne "3B" (valeurs differentes, fichier source non identifie), et une description RESEARCH_STATE (modele 3.2B, full 3%, p=0.77) qui ne correspond a aucun des deux.

Le point le plus grave n'est pas l'ecart d'ASR mais le **p-value** : RESEARCH_STATE conclut "pas de synergie, KW p=0.77 non-significatif", alors que la donnee brute donne p=0.0047 (significatif) avec C1 NOT SUPPORTED. La nuance "convergence non-synergique" de C1 reste plausible (full 16.67% < best subset 56.67%, gap -0.40 : convergence antagoniste, coherente avec TC-002/D-022), mais elle doit s'appuyer sur le p significatif reel, pas sur un p=0.77 errone.

Aucun mouvement de score de conjecture n'est decide ici (decision SCIENTIST/directeur). L'audit constate seulement que la formulation actuelle de C1 (10/10 nuancee) cite des chiffres qui contredisent la donnee brute, ce qui la rend indefendable en l'etat.

## 5. Actions

- [A MESURER] Re-run TC-001 v3 : un seul modele clairement etiquete (decider 3B vs 8B vs les deux comme conditions distinctes), N>=30, seed fixe, export json unique autoritatif.
- [A SOURCER] Localiser le fichier source de la colonne "ASR 3B" de TRIPLE_CONVERGENCE.md (valeurs 10/17/43/.../7). Si introuvable, retirer la colonne ou la marquer [A VERIFIER].
- [A CORRIGER] Apres v3 : reconcilier RESEARCH_STATE (C1), TRIPLE_CONVERGENCE.md, DISCOVERIES_INDEX (D-001/D-022) et l'article sur les memes chiffres, chaque nombre tague avec son fichier source.
- [A CORRIGER] Remplacer "KW p=0.77 non-significatif" par le p reel (0.0047 pour le run 8B) ou par le p du run v3 retenu.
- Decision conjecture C1 : a trancher par le directeur apres v3 (le run 8B actuel donne C1 NOT SUPPORTED ; garder la nuance "antagoniste" mais sur des chiffres exacts).

## 6. Inventaire des runs 2026-04-08 (resolution de la dette "colonne 3B")

Six campagnes `triple_convergence` ont tourne le 2026-04-08 (`backend/experiments/results/`), sur trois modeles. Les sources narratives en ont conflé plusieurs.

| Fichier (heure) | Modele | ASR full | Best subset | KW p | Verdict C1 |
|-----------------|--------|----------|-------------|------|-----------|
| 002442 | llama3.2:latest (3B) | 0% | δ² 33% | 0.255 | NOT SUPPORTED |
| 123513 | llama-3.3-70b-versatile | 0% | δ⁰ 0% | 1.00 | NOT SUPPORTED (run degenere, 0 violation) |
| 124111 | llama-3.3-70b-versatile | 20% | δ¹ 33% | 0.44 | NOT SUPPORTED |
| 124959 | llama-3.1-8b-instant | environ 10% | δ² environ 40% | (partiel) | partiel |
| 125417 | llama-3.1-8b-instant | environ 10% | δ² environ 40% | (partiel) | partiel |
| 232323 | llama-3.1-8b-instant | 16.67% | δ² 56.67% | 0.0047 | NOT SUPPORTED (= json autoritatif audite section 1) |

Conclusions :

- La colonne "ASR 3B (TC-001)" de `TRIPLE_CONVERGENCE.md` (δ²=43%, full=7%) ne correspond exactement a AUCUN fichier. Le run llama3.2:latest (002442, le vrai 3B) donne δ²=33%, full=0%. Les runs 8B 124959/125417 donnent δ² environ 40% et full environ 10% (les plus proches), mais en 8B, pas 3B. La colonne "3B" est donc soit un run anterieur non conserve, soit une transcription ou moyenne manuelle. Dette [A VERIFIER] : non resolvable sur les fichiers presents, a regenerer en v3.
- Le "KW p=0.77" de RESEARCH_STATE ne correspond a AUCUN des 6 runs (p observes : 0.0047, 0.255, 0.44, 1.00). Valeur non sourcable.
- Convergence qualitative de tous les runs : C1 NON supportee au sens additif (full inferieur ou egal au best subset), coherent avec la nuance "convergence antagoniste" (D-022). Mais aucun chiffre cite dans les sources narratives n'est tracable a un fichier unique.

Recommandation renforcee : la v3 doit produire UN fichier autoritatif par modele (3B, 8B, 70B traites comme conditions distinctes), archiver les 6 runs du 04-08 comme exploratoires, et faire citer par toutes les sources le v3 avec le nom de fichier exact.
