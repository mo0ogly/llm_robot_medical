# BRIEFING DE VALIDATION DIRECTEUR — Campagne G-058

**Date** : 2026-05-20
**Produit par** : research-director (cycle OBJECTIVE vers COMPLETE, session G058VAL)
**Objet** : preparer la decision du directeur de these sur trois points de la campagne G-058 — (A) substitution LMQL vers Outlines, (B) pre-registration OSF, (C) resultats SC-2.
**Statut global** : 2 volets PRETS POUR DECISION, 1 volet BLOQUE (premisse fausse).

---

## 0. Resume executif

Trois points soumis a validation. Volet A (substitution) : execute et verifie dans le code, une incoherence residuelle a corriger. Volet B (OSF) : brouillon v1 complet et structurellement solide, six incoherences internes a resoudre avant soumission. Volet C (resultats SC-2 reels) : CONSTAT — ces resultats n'existent pas. Aucune campagne SC-2 avec N>=30 et LLM reel n'a ete executee. Ce qui existe est un smoke test SC-1 (N=1, sans LLM) et des dry-runs. Le volet C ne peut pas etre "valide" en l'etat : il doit etre requalifie.

Ce briefing applique la discipline OODA/Orient du protocole research-director : aucun resultat n'est suppose, chaque affirmation renvoie a un fichier source.

---

## 1. Volet A — Substitution LMQL vers Outlines

### Constat

La substitution est **effective dans le code** et **documentee**.

| Element | Verification | Source |
|---------|--------------|--------|
| Panneau actif | `all_adapters()` retourne 8 adapters : Outlines, Guardrails, LLMGuard, CaMeL, AgentSpec, LlamaFirewall, RAGShield, AEGIS. LMQL absent. | `backend/red_team/campaigns/g058/registry.py` lignes 24-34 |
| LMQL retire proprement | Docstring explicite : LMQL retire en PDCA-6 (issues eth-sri/lmql #350 et #353), `lmql_adapter.py` conserve pour tracabilite. | `registry.py` lignes 3-8 |
| Adapter Outlines | `outlines_adapter.py` present (7.8 ko), classe `OutlinesAdapter`, FSM 4 couches. | `backend/red_team/framework_adapters/outlines_adapter.py` |
| Tests unitaires | PDCA-5 declare `test_outlines_adapter.py` 13/13 PASSED. NON re-execute cette session — declaration PDCA, a confirmer cote Windows. | `research_requests.json` RR-G058 pdca5_resolution |
| Indexation corpus | P135 Outlines indexe dans MANIFEST (134 vers 135 papiers, Defense 41 vers 42). | RR-G058 pdca4_resolution |

### Incoherence residuelle

Le rapport empirique le plus recent de la campagne, `EXPERIMENT_REPORT_G058_MINI_SC1.md` (date 2026-05-16 23:05), liste encore **LMQL ("P134-2022-12")** comme framework numero 3 dans tous ses tableaux de resultats (sections 1, 3, 4, 5). Il a donc ete produit avec l'ancien panneau, ou son rapport n'a pas ete mis a jour apres la substitution. Le panneau du code (`registry.py`) et le dernier artefact empirique **divergent**.

Deux references obsoletes a nettoyer :
- `research_requests.json`, note de bas PDCA-6 : ecrit "substitution Outlines->LMQL applied" — sens inverse de la substitution reelle (LMQL vers Outlines). Coquille de journal.
- `THESIS_GAPS.md` ligne 446 : la checklist pre-lancement G-058 liste encore "Verification compat LMQL + LLaMA 3.2" — caduque depuis la substitution.

### Verdict volet A

**PARTIAL — pret pour validation directeur sous reserve.** La substitution est faite et tracee. Pre-requis avant de l'acter formellement : re-executer le smoke SC-1 avec le panneau Outlines, ou bien dater/marquer `MINI_SC1` comme artefact pre-substitution ; et nettoyer les deux references LMQL obsoletes.

---

## 2. Volet B — Pre-registration OSF

### Constat

`OSF_PREREGISTRATION_G058.md` existe (DRAFT v1, 18 sections, date 2026-05-20). Le contenu est **structurellement solide** : hypotheses H0-H3, panneau de 8 frameworks, plan statistique (Mann-Whitney U unilateral, Friedman ANOVA, Kruskal-Wallis, Cliff delta), correction Bonferroni, regles d'arret, exclusions pre-specifiees, engagements de reproductibilite. C'est une base de travail valide.

### Six incoherences a resoudre AVANT soumission

Un pre-registration ne se modifie pas apres depot sans amendement formel. Les six points suivants doivent etre verrouilles d'abord.

| # | Incoherence | Detail | Source |
|---|-------------|--------|--------|
| B-1 | Arithmetique SC-3 | §8 ecrit "5 frameworks fois 99 fois 200 generations = 30 000". Le produit 5x99x200 vaut 99 000. Le total 30 000 ne se reconcilie qu'avec une autre factorisation (par ex. 5 frameworks fois 200 generations fois population 30). Le total general "~74 000" depend de SC-3 = 30 000. | OSF §8 |
| B-2 | Nombre de templates | §7 pre-enregistre **99** templates. Le smoke `MINI_SC1` a tourne sur **122** templates. RESEARCH_STATE et CLAUDE.md indiquent 122 (97 numerotes + extension T100-T117). Le N ne peut plus bouger apres depot. | OSF §7 vs MINI_SC1 §1 |
| B-3 | Nombre de scenarios SC-2 | §7 et §8 utilisent **48** scenarios chirurgicaux. PDCA-11 a exporte **62** scenarios reels via `export_scenarios_metadata.py`. RESEARCH_STATE (source de verite) indique 62. SC-2 = 48x8x30 = 11 520 changerait si 62. | OSF §7-8 vs RR-G058 pdca11 |
| B-4 | LLM cible | §6 pre-enregistre LLaMA 3.2 3B-instruct via Ollama local. CLAUDE.md regle projet : "Campagnes thesis TOUJOURS sur Groq (TC-002 confirme 70B)". Conflit direct — decision methodologique pour le directeur. | OSF §6 vs CLAUDE.md |
| B-5 | Reference P107 | "Han et al. 2024, NeurIPS — MedSafetyBench" : venue et annee a verifier. [A VERIFIER] — a deleguer a bibliography-maintainer scoped, le research-director ne fait pas de WebSearch direct. | OSF §17 |
| B-6 | Correction Bonferroni H2 | §10 indique pour H2 "p<0.05, same correction" avec alpha 0.00143. Or 0.00143 = 0.01/7 (base H1). Pour H2 a 0.05, Bonferroni 7 donne 0.05/7 = 0.00714. Clarifier la base de correction de H2. | OSF §10 |

Note complementaire : §16 de l'OSF liste "Final review by thesis director" comme case non cochee — c'est precisement l'objet du present briefing.

### Verdict volet B

**PARTIAL — brouillon pret pour revue directeur.** Recommandation : le directeur revoit le draft, les six incoherences sont corrigees, puis promotion en v2 et conversion au schema JSON OSF. Ne PAS soumettre avant correction — le pre-registration est irreversible.

---

## 3. Volet C — Resultats SC-2 reels

### Constat — ALERTE ORIENT

**Aucun resultat SC-2 reel n'existe.** L'objectif soumis ("resultats SC-2 reels") repose sur une premisse fausse.

Recherche effectuee dans tout le depot :
- Aucun fichier `EXPERIMENT_REPORT_G058_SC2*`. Le seul rapport experimental G-058 est `EXPERIMENT_REPORT_G058_MINI_SC1.md` — il s'agit de SC-1, pas de SC-2.
- `MINI_SC1` : 976 trials, **N=1 par paire**, "Provider LLM : aucun (verification statique sur payloads category-parametriques)" (§1). Ce n'est pas une campagne, c'est un smoke statique. Le rapport reconnait lui-meme le risque de cherry-picking des payloads (§7).
- Aucun fichier JSONL SC-2 sur le disque. Le repertoire `backend/red_team/campaigns/g058/` ne contient que des modules Python. Aucun JSONL date apres 2026-05-14 dans le depot.
- Les mentions "SC-2 production" de PDCA-10 ("64/64 trials", N=1) et PDCA-11 ("496 trials + 496 JSONL", N=1) decrivent des dry-runs du loader, pas une campagne. Le mot "production" y est trompeur : N=1 et sans LLM ne constituent pas un resultat exploitable.
- L'OSF lui-meme pre-enregistre SC-2 comme 48x8xN=30 = 11 520 trials avec LLaMA 3.2 — jamais lance.
- `RR-G058` statut = "campaign_bootstrap_complete" (exact : pipeline, 8 adapters, loader, 4 sous-campagnes implementees, smoke tests passes) et porte un `blocked_by` actif : "chunking + injection ChromaDB cote Windows pour passer P135 downloaded vers analyzed".

De plus, la regle anti-cherry-picking du projet (rappelee dans `MINI_SC1` §9, `SMOKE_TEST` §6 et OSF §14) impose la soumission OSF **avant** le lancement de SC-2. SC-2 ne peut donc pas etre lance tant que le volet B n'est pas clos.

### Verdict volet C

**FAILURE — premisse invalide.** Conformement a la section 10.4 du protocole research-director (Silent Drift Detection), HALT sur ce volet : le research-director ne fabrique pas de resultats. Le volet doit etre requalifie selon l'une des deux lectures :

- Lecture (i) — l'objectif visait la campagne SC-2 a venir : alors A et B sont valides d'abord, l'OSF est soumis, puis SC-2 est lance pour de vrai (N=30, LLM reel) et seulement ensuite analyse.
- Lecture (ii) — "resultats SC-2 reels" designait en realite le smoke N=1 : alors il faut le nommer correctement (smoke / dry-run, pas resultat) et ne lui faire porter aucune conjecture.

---

## 4. Points de decision pour le directeur

| ID | Decision | Volet | Type |
|----|----------|-------|------|
| D-1 | Acter la substitution LMQL vers Outlines. Pre-requis : re-smoke SC-1 panneau Outlines OU marquage MINI_SC1 pre-substitution. | A | validation |
| D-2 | Autoriser la correction des 6 incoherences OSF puis promotion v2. | B | validation |
| D-3 | LLM cible de la campagne : LLaMA 3.2 3B local (OSF actuel) ou Groq 70B (regle CLAUDE.md). Decision structurante a verrouiller dans l'OSF. | B | methodologique |
| D-4 | Corpus verrouille : 99 ou 122 templates ; SC-2 sur 48 scenarios chirurgicaux ou 62 scenarios. | B | methodologique |
| D-5 | Confirmer que SC-2 reel n'est pas lance et ne le sera qu'apres depot OSF. Le smoke N=1 ne porte aucune conjecture. | C | requalification |

---

## 5. Sequencement recommande

1. Le directeur tranche D-3 et D-4 (LLM cible et corpus).
2. Correction des 6 incoherences OSF, promotion v2, conversion au schema JSON.
3. Re-smoke SC-1 avec panneau Outlines, nettoyage des references LMQL obsoletes (D-1).
4. Soumission OSF avant 2026-06-15 (deadline OSF §6).
5. Levee du blocker ChromaDB P135 (RR-G058 blocked_by).
6. Lancement de SC-2 reel N=30 avec le LLM cible retenu, puis analyse par EXPERIMENTALIST.

---

## 6. Impact conjectures

**Aucun changement.** C1 a C7 restent aux scores de RESEARCH_STATE §4 : C1=10/10, C2=10/10, C3=10/10, C4=9/10, C5=8.5/10, C6=9.5/10, C7=8/10.

Le smoke `MINI_SC1` §5 declare "C2 renforcee" et "D-001 nuancee", mais ces declarations reposent sur N=1, sans LLM, avec des payloads category-parametriques dont le rapport reconnait lui-meme le risque de cherry-picking (§7). Elles ne sont **pas promouvables**. Conjectures GELEES jusqu'a obtention de resultats SC-2 reels.

---

## 7. Annexe — Recapitulatif des incoherences detectees

| Code | Volet | Severite | Action |
|------|-------|----------|--------|
| A-1 | A | moyenne | MINI_SC1 liste LMQL post-substitution : re-smoke ou marquage |
| A-2 | A | basse | research_requests.json note PDCA-6 : sens de substitution inverse |
| A-3 | A | basse | THESIS_GAPS.md ligne 446 : reference LMQL obsolete |
| B-1 | B | haute | OSF §8 arithmetique SC-3 (30 000 vs 99 000) |
| B-2 | B | haute | OSF §7 corpus 99 vs 122 templates |
| B-3 | B | haute | OSF §7-8 SC-2 48 vs 62 scenarios |
| B-4 | B | critique | OSF §6 Ollama 3B vs regle Groq 70B |
| B-5 | B | moyenne | OSF §17 reference P107 a verifier |
| B-6 | B | basse | OSF §10 base Bonferroni H2 |
| C-1 | C | critique | Resultats SC-2 reels inexistants — objectif a premisse fausse |

---

## 8. Sources

- `research_archive/RESEARCH_STATE.md` (sync PDCA 2026-05-16)
- `research_archive/_staging/memory/MEMORY_STATE.md` (RUN-008)
- `research_archive/_staging/briefings/DIRECTOR_BRIEFING_RUN007.md` (2026-04-09)
- `research_archive/doc_references/prompt_analysis/research_requests.json` (RR-G058, PDCA-1 a PDCA-11)
- `research_archive/experiments/G058_7_frameworks/OSF_PREREGISTRATION_G058.md` (DRAFT v1)
- `research_archive/experiments/EXPERIMENT_REPORT_G058_MINI_SC1.md`
- `research_archive/experiments/SMOKE_TEST_G058_CHAIN_ASR.md`
- `backend/red_team/campaigns/g058/registry.py`
- `research_archive/discoveries/THESIS_GAPS.md` (G-058, lignes 305, 393, 433-446)

---

## 9. Mise a jour 2026-05-20 — corrections executees (cycle G058VAL)

Les corrections decrites en sections 1 a 7 ont ete executees le 2026-05-20 par trois agents delegues, apres verrouillage par le candidat de trois parametres : LLM cible = Groq llama-3.3-70b-versatile, corpus = 122 templates, SC-2 = 62 scenarios. Chaque sortie d'agent a ete verifiee par le research-director.

### Volet A — substitution : CONFIRME
Re-smoke SC-1 dry-run re-execute : 8 frameworks, panneau = Outlines present, LMQL absent (verifie par execution reelle et par registry.py). Coquille PDCA-6 corrigee dans research_requests.json (sens "LMQL vers Outlines" retabli). THESIS_GAPS.md lignes 433 et 446 annotees, dependance LMQL caduque. Reste mineur : EXPERIMENT_REPORT_G058_MINI_SC1.md (2026-05-16) liste encore LMQL dans ses tableaux. C'est un artefact historique pre-substitution, a annoter ou regenerer lors de la SC-1 reelle.

### Volet B — OSF : promu en v2
v1 archivee a l'identique sous OSF_PREREGISTRATION_G058_v1_archived.md. Les 6 incoherences traitees :
- B-1 : SC-3 refactorise (5 frameworks par 200 generations par population 30 = 30 000), note "[design SC-3 a ratifier par le directeur]".
- B-2 : corpus verrouille a 122 templates ; decompte par categorie a regenerer depuis templates_metadata.json (note explicite OSF §7).
- B-3 : SC-2 verrouille a 62 scenarios.
- B-4 : LLM cible = Groq llama-3.3-70b-versatile, temperature 0, note de reproductibilite (seed fixe, mediane sur 3 seeds).
- B-5 : references P107, P135, P125 verifiees par WebSearch et corrigees en OSF §17. P135 : le titre du papier est "Efficient Guided Generation for Large Language Models", Outlines etant le nom de la librairie. P107 : arXiv:2403.03744. Caveat : affiliation "Unit 42" de P044 non confirmee par WebSearch.
- B-6 : Bonferroni H2 corrige a 0.05/7 = 0.00714.
Totaux recalcules : SC-1 = 29 280, SC-2 = 14 880, SC-3 = 30 000, SC-4 = 10 980, total = 85 140. Changelog v1 vers v2 ajoute (OSF §19, 11 entrees).

### Volet C — resultats SC-2 : inchange
Aucun resultat SC-2 reel. research_requests.json annote via le champ research_director_note_2026-05-20 : les executions "SC-2 production" de PDCA-10 et PDCA-11 sont requalifiees comme dry-runs N=1 sans LLM. RESEARCH_STATE.md Section 1 journalise cette session. Conjectures C1 a C7 inchangees.

### Points encore ouverts pour le directeur
1. Ratifier le design SC-3 (factorisation generations par population).
2. Ratifier le decompte par categorie des 122 templates, a regenerer depuis templates_metadata.json.
3. Confirmer l'affiliation des auteurs de P044 (Unit 42).
4. Revue de l'OSF v2, puis conversion au schema JSON, puis soumission avant 2026-06-15.
5. Lever le blocker ChromaDB P135 (RR-G058), puis lancer la campagne SC-2 reelle (N=30, 14 880 trials, Groq) APRES soumission OSF.

### Note d'integrite
Le mount Linux du sandbox a presente une copie tronquee de research_requests.json (35601 octets), produisant d'abord un faux negatif de validation JSON. Le fichier authentique a ete verifie via l'outil Read : structure intacte, virgule de separation presente a la ligne 584, echappement des guillemets correct. research_requests.json est un JSON valide.
