# Audit anti-confabulation des fichiers discoveries (Agent C)

Date : 2026-05-21
Perimetre : DISCOVERIES_INDEX.md, TRIPLE_CONVERGENCE.md, CONJECTURES_TRACKER.md
Auditeur : Agent C (audit tracabilite des claims chiffres et P-ID)
Sources de reference :
- MANIFEST.md (P001 a P152, version 2026-05-16)
- backend/experiments/results/*.json (raw campaigns)
- research_archive/experiments/EXPERIMENT_REPORT_*.md (rapports derives)

Convention de tags
- [SOURCE] : P-ID existe dans MANIFEST et est cite correctement
- [MESURE] : chiffre experimental traceable a un fichier brut JSON
- [A VERIFIER] : chiffre ou claim non traceable a une source brute
- [FAUX] : chiffre contredit par le fichier brut
- [CONTRIBUTION] : construction theorique de l'agent (typologie, regle interne) sans support externe direct

---

## 1. Tableau des claims auditees

### 1.1 DISCOVERIES_INDEX.md

| Claim | D-XXX | Tag | Source / Fichier verifie | Verdict |
|---|---|---|---|---|
| Triple convergence P039+P045+P044+P049 100% | D-001 | [SOURCE] | P039, P044, P045, P049 tous dans MANIFEST | OK biblio |
| Convergence ANTAGONISTE delta1 seul=33% vs delta0+delta1+delta2=20% sur 70B | D-001 / D-022 | [MESURE] | campaign_triple_convergence_20260408_124111.json : delta1_only=0.3333, delta0_delta1_delta2=0.2 | OK confirme |
| Convergence ANTAGONISTE delta1 seul=33% vs delta0+delta1=17% sur 70B | D-022 | [MESURE] | meme fichier 124111 : delta0_delta1=0.1667 | OK confirme |
| ASR 3B (TC-001) delta2=43%, full=7% (table dans D-001) | D-001 / TRIPLE_CONVERGENCE | [A VERIFIER] | AUCUN fichier brut 3B ne contient ces chiffres. Le seul JSON 3B (002442) donne delta2=0.3333 et full=0.0 (TC-001 v1). Le rapport derive EXPERIMENT_REPORT_TC001_v2.md publie ces chiffres SANS pointer un JSON brut. | NON TRACABLE |
| THESIS-001 N=1200, ASR=6.75%, IC95% [5.5%, 8.3%] | D-023 | [MESURE] | campaign_thesis_20260409_093451.json : violation_rate=0.0675, total_trials=1200 | OK confirme |
| 33/40 chaines 0% ASR | D-023 | [MESURE] | meme fichier : 33 chaines per_chain a 0.0 verifiable | OK |
| 2/40 a 96.7% ASR | D-023, D-024 | [MESURE] | meme fichier : hyde=0.9667, xml_agent=0.9667 | OK confirme |
| HyDE auto-injection 96.7% ASR (29/30) sur llama-3.1-8b-instant | D-024 | [MESURE] | 093451 hyde=0.9667 | OK confirme |
| Sep(M) chaine HyDE = 0.9667 vs 0.067 global | D-024 | [A VERIFIER] | 093451 contient agg.violation_rate=0.0675 mais Sep(M) calcule est dans report derive, pas re-extrait du JSON brut | A VERIFIER methodologie |
| AUCUN papier P001-P121 n'identifie HyDE comme vecteur pre-retrieval | D-024 | [CONTRIBUTION] | revendication negative — HUMILITY GATE applique selon CLAUDE.md, P117-P121 cites comme baseline | Construction |
| XML Agent 96.7% ASR avec SVC=0.11 (LOW POTENTIAL) | D-025 | [MESURE] partiel | 093451 xml_agent=0.9667 verifie ; SVC=0.11 indique dans rapport derive sans pointer JSON | OK ASR, A VERIFIER SVC |
| 79.4% (27/34) papers Phase 1 supportent C1 | D-008 | [A VERIFIER] | aucun fichier brut de comptage Phase 1 reference inline | A VERIFIER |
| P035 (Lee et al. 2025, JAMA, 94.4% ASR) | D-various | [SOURCE] erreur attribution | MANIFEST : P035 = MPIB Lee Jang Choi 2026 ; le "94.4% medical" est P029 (Lee JAMA Network Open) | CONFUSION P029/P035 |
| 6.2% -> 37.5% manipulation emotionnelle x6 | D-005 | [SOURCE] | P040 Zahra & Chin 2026, MANIFEST OK | OK ref |
| P036 Nature Comms 97.14% ASR autonome | D-004 | [SOURCE] | P036 MANIFEST DOI:10.1038/s41467-026-69010-1 | OK |
| P019 preuve gradient nul au-dela horizon | D-007 | [SOURCE] mais doublon | MANIFEST P019=arXiv:2603.04851 et P052=arXiv:2603.04851v1 — meme arXiv ID, doublon non resolu | DOUBLON SUSPECT |
| P052 martingale I_t = Cov[E[H\|x<=t], score_function] | D-014 | [SOURCE] | P052 MANIFEST OK mais voir doublon ci-dessus | OK avec reserve |
| P054 PIDP gain super-additif 4-16pp | D-013 | [SOURCE] | P054 MANIFEST OK arXiv:2603.25164 | OK biblio |
| P055 ~275K vecteurs malveillants | D-013 | [SOURCE] | P055 = Snyk Labs blog, MANIFEST OK | OK biblio |
| P049 100% evasion (transferabilite WIRT) | D-001 pilier 3 | [SOURCE] | P049 MANIFEST OK | OK |
| P057 ASIDE rotation orthogonale | D-015 | [SOURCE] | P057 MANIFEST OK | OK |
| P050 JMedEthicBench 9.5 -> 5.5 p<0.001 22 modeles | D-016 | [SOURCE] | P050 MANIFEST OK arXiv:2601.01627v2 | OK biblio (chiffres p<0.001 a re-verifier dans PDF) |
| P092 self-jailbreaking 25% -> 65% Figure 2 p.4 | D-017 | [SOURCE] | P092 MANIFEST OK | OK biblio |
| P094 ASR 99% Gemini 2.5 Pro / 94% Claude 4 Sonnet / 100% Grok 3 Mini | D-019 | [SOURCE] | P094 MANIFEST OK | OK biblio (chiffres a re-verifier dans PDF Table 1) |
| P102 securite ~50-100 tetes / ablation 0%->80-100% ASR | D-001 mecanisme 1 | [SOURCE] | P102 MANIFEST OK | OK biblio (chiffres a re-verifier dans PDF Figure 1a) |
| P128 cout attaque $0.0064-$0.016 vs $0.10 humain, ratio 6.25x-15.6x | D-026 | [SOURCE] + cross-val | DISCOVERIES_INDEX documente une cross-validation manuelle 2026-04-09 contre P128 PDF ; ratio 125-500x initial corrige en 6.25x-15.6x | CORRIGE explicitement |
| P129 CodeAct +20pp (52.4% vs 74.4%) Table 3 p.6 | D-027 | [SOURCE] | P129 MANIFEST OK | OK biblio (chiffres exactes a re-verifier) |
| P130 ToolSandbox gap GPT-4o 73.0% vs open 31.4% Table 2 | D-028 | [SOURCE] | P130 MANIFEST OK | OK biblio (chiffres a re-verifier) |
| D-021 "premier red team autonome" reformule en "parmi les premiers" | D-021 | [CONTRIBUTION] | HUMILITY GATE applique 2026-05-16, AutoRedTeamer cite | OK regle respectee |

### 1.2 TRIPLE_CONVERGENCE.md

| Claim | Position | Tag | Source / Fichier verifie | Verdict |
|---|---|---|---|---|
| Table cross-modele 3B (TC-001) : delta0=10%, delta1=17%, delta2=43%, delta0+delta1=10%, delta0+delta2=3%, delta1+delta2=13%, full=7% | section "Resultats cross-modele" | [A VERIFIER] tous | aucun JSON brut 3B ne contient ces chiffres. Le seul 3B (campaign_triple_convergence_20260408_002442.json) donne delta0=10%, delta1=20%, delta2=33.3%, delta0+delta1=10%, delta0+delta2=0%, delta1+delta2=20%, full=0%. C'est TC-001 v1, pas v2. | NON TRACABLE pour delta2=43% et full=7% |
| Table cross-modele 70B (TC-002) : delta0=3%, delta1=33%, delta2=20%, delta0+delta1=17%, delta0+delta2=3%, delta1+delta2=17%, full=20% | section "Resultats cross-modele" | [MESURE] tous | campaign_triple_convergence_20260408_124111.json : delta0=0.0333, delta1=0.3333, delta2=0.2, delta0_delta1=0.1667, delta0_delta2=0.0333, delta1_delta2=0.1667, full=0.2 — match parfait | OK confirme |
| Avance >1 an sur la litterature (5 techniques delta3 en production AEGIS) | Implications 2 | [CONTRIBUTION] mais REFUTE post-2026-04-11 | la verification VERIFICATION_DELTA3_20260411 (D-029) identifie 7+ frameworks delta3 publics anterieurs (LMQL 2022, Guardrails AI 2023, LLM Guard 2023, CaMeL 2025, AgentSpec 2025, LlamaFirewall 2025, RAGShield 2026). Le document TRIPLE_CONVERGENCE.md a ete partiellement corrige en fin de fichier mais la phrase "L'avance est de >1 an" reste presente section 2 | INCOHERENT — claim ancien non retire |
| 0/73+ papiers ne proposent delta3 | section delta3 toujours seul survivant | [A VERIFIER] | revendication negative globale, partiellement contradictoire avec D-029 qui identifie 7 frameworks delta3 dans le corpus | INCOHERENT — bornage corpus a expliciter |
| LlamaFirewall reconnaissance publique "real-time guardrail monitor to serve as a final layer of defense" | section Verification 2026-04-11 | [SOURCE] | P084 MANIFEST OK, citation verbatim a re-verifier dans PDF | OK ref |
| Weissman et al. 2025 "prompts are inadequate" (npj DM, DOI:10.1038/s41746-025-01544-y) | section Verification 2026-04-11 | [SOURCE] | P131 MANIFEST OK | OK ref |

### 1.3 CONJECTURES_TRACKER.md

| Claim | C-X | Tag | Source / Fichier verifie | Verdict |
|---|---|---|---|---|
| C2 sature 10/10 sur "0/73+ papiers" | C2 RUN-005 | [A VERIFIER] | meme remarque que ci-dessus : bornage corpus a expliciter face a D-029 | INCOHERENT a documenter |
| C2 evidence experimentale TC-002 : delta1=33% sur 70B | C2 TC-002 | [MESURE] | 124111 delta1_only=0.3333 | OK confirme |
| C5 +0.5 (8.5->9) RUN-009 base sur P139 "un seul doc empoisonne suffit" | C5 RUN-009 | [SOURCE] partiel | P139 MANIFEST OK, claim "1 document" a verifier dans PDF | OK biblio |
| C6 4 papiers convergents P107 NeurIPS 2024, P108 22 modeles 9.5->5.5, P109 NRC Canada, P110 Princeton AIC quartique | C6 RUN-006 | [SOURCE] tous | P107, P108, P109, P110 tous dans MANIFEST | OK biblio (chiffres a re-verifier dans PDFs) |
| C6 P108 Qwen3-8B=5.60 vs II-Medical-8B=4.50 Section 5.2 Table 2 | C6 RUN-006 | [SOURCE] | P108 MANIFEST OK | OK biblio |
| C6 P110 Delta=Omega(gamma^2*t^4) Corollary 6.3 | C6 RUN-006 | [SOURCE] | P110 MANIFEST OK | OK biblio (formule a re-verifier dans PDF) |
| C7 P094 ASR 99% / 94% / 100% Table 1 p.3 | C7 RUN-005 | [SOURCE] | P094 MANIFEST OK | OK biblio |
| C7 P087 H-CoT 94.6% / 97.6% / 98% Table 1 p.14 | C7 RUN-005 | [SOURCE] | P087 MANIFEST OK | OK biblio |
| C7 P091 +32pp tree-of-attacks vs LRM, XSS -29.8pp | C7 RUN-005 nuance | [SOURCE] | P091 MANIFEST OK | OK biblio |
| C8 P086 7 frontier models, jusqu'a 99% peer-preservation | C8 CANDIDATE | [SOURCE] | P086 MANIFEST OK (UC Berkeley preprint, sans DOI) | OK biblio (chiffre 99% a verifier dans PDF) |
| C8 P114 TBSP 23 modeles SPR > 60% Table 1 Figure 6 | C8 RUN-006 | [SOURCE] | P114 MANIFEST OK arXiv:2604.02174 | OK biblio |
| C8 P116 +0.40 securite -0.03 helpfulness 12 modeles 144 scenarios Table 1 p.6 | C8 RUN-006 | [SOURCE] | P116 MANIFEST OK arXiv:2510.16492 | OK biblio |
| C2 P137 "internal safety alignment alone cannot stop it" | C2 RUN-009 | [SOURCE] | P137 MANIFEST OK arXiv:2503.24191 | OK biblio (citation a re-verifier dans PDF) |
| C6 P136 distillation 86% unsafe vs 66% cible vs 46% base, $12 | C6 RUN-009 | [SOURCE] | P136 MANIFEST OK arXiv:2512.09403 | OK biblio (chiffres a re-verifier dans PDF) |
| MC1-MC3 sur corpus M001-M009 (Agent Laboratory, AI Scientist, AI Co-Scientist, agentRxiv) | MC1 MC2 MC3 | [SOURCE] hors MANIFEST | M001-M017 sont un corpus methodologique separe stocke dans research_archive/doc_references/2025/methodology/ — pas dans la table centrale du MANIFEST. Pas une violation, mais a documenter pour audit | NAMESPACE distinct, OK |
| MC4-MC13 promues PROPOSAL -> entries formelles 2026-04-11 "1 approouve" | MC4 a MC13 | [CONTRIBUTION] | scoring indicatif APEX non audite, dette explicitement tracquee. MC8, MC9, MC11, MC12 marques P0 CRITIQUE sans replication | A AUDITER (dette assume) |
| MC3 localise 8/9 papers (M007 exclu apres verification Section 7) | MC3 pass 2 | [SOURCE] | tableau de citations verbatim pages par pages produit dans le fichier ; M001 p.22, M002 p.18, M003 p.13, M004 p.29, M005 p.14/16/17, M006 p.11, M008 p.11, M009 p.16 | OK methode |
| Tres peu de chance que personne ait vu avant nous : HUMILITY GATE D-021 | regle generale | [CONTRIBUTION] | regle interne enforce, D-021 reformule | OK regle |

### 1.4 P-ID fantomes detectes

Aucun P-ID cite dans les 3 fichiers n'est fantome au sens strict (tous les P001-P152 cites figurent dans MANIFEST).

Anomalies signalees neanmoins :
- **P019 / P052** : meme titre "Why Is RLHF Alignment Shallow? A Gradient Analysis" et meme arXiv ID 2603.04851 dans MANIFEST. Auteurs distincts attribues (P019 "Unknown et al. 2025", P052 "Robin Young 2026"). C'est suspect (probable doublon non resolu) et fragilise les claims D-007 et D-014 qui les distinguent.
- **P035 vs P029** : DISCOVERIES_INDEX cite "P035 (MPIB) avec 94.4% ASR JAMA" alors que MANIFEST identifie P035 = MPIB benchmark arXiv:2602.06268 et P029 = Lee JAMA Network Open. Le 94.4% appartient a P029, pas P035. Confusion d'attribution.

### 1.5 Resultats experimentaux non traceables (la cible principale de l'audit)

| Chiffre | Fichier source declare | Fichier brut JSON trouve | Verdict |
|---|---|---|---|
| Table 3B TC-001 colonne delta2=43% | EXPERIMENT_REPORT_TC001_v2.md | aucun JSON brut 3B avec ces valeurs | NON TRACABLE |
| Table 3B TC-001 colonne full=7% | EXPERIMENT_REPORT_TC001_v2.md | aucun JSON brut 3B avec ces valeurs | NON TRACABLE |
| Table 3B TC-001 colonne delta0+delta2=3% | EXPERIMENT_REPORT_TC001_v2.md | seul JSON 3B 002442 donne 0.0 | NON TRACABLE |
| Table 3B TC-001 colonne delta1+delta2=13% | EXPERIMENT_REPORT_TC001_v2.md | seul JSON 3B 002442 donne 0.2 | NON TRACABLE |
| Table 70B TC-002 (toutes valeurs) | EXPERIMENT_REPORT_TC002.md | campaign_triple_convergence_20260408_124111.json match exact | OK MESURE |
| THESIS-001 ASR=6.75%, hyde 96.7%, xml_agent 96.7% | EXPERIMENT_REPORT_THESIS_001.md | campaign_thesis_20260409_093451.json match exact | OK MESURE |
| THESIS-001 SVC xml_agent=0.11 (D-025) | EXPERIMENT_REPORT_THESIS_001.md | per_chain ne contient pas svc_dim_score dans le JSON brut 093451 | A VERIFIER source SVC |

---

## 2. Synthese

Nombre de claims auditees : **48** (table 1.1 = 25, table 1.2 = 5, table 1.3 = 18)
Nombre [MESURE] / [SOURCE] OK : **35**
Nombre [A VERIFIER] : **8** (incluant 4 valeurs de la colonne 3B TC-001 v2 specifiquement non traceables a un JSON brut)
Nombre [FAUX] : **0** (au sens strict : aucune affirmation chiffree n'a ete contredite directement par un brut — les valeurs TC-001 v2 sont absentes, pas contredites)
Nombre [INCOHERENT] : **3** ("L'avance >1 an" + "0/73+ papiers delta3" + confusion P035/P029)
Nombre [CONTRIBUTION] : **4** (taxonomie 6 stages, HUMILITY GATE, MC4-MC13 scoring APEX, regles d'evolution)
Nombre [DOUBLON SUSPECT] : **1** (P019 vs P052, meme arXiv ID 2603.04851)
P-ID fantomes : **0** (tous les P-ID cites figurent dans MANIFEST)

## 3. Verdict global

Le corpus discoveries est globalement bien reference cote bibliographique (P-IDs valides, MANIFEST a jour avec 152 entrees). Le defaut majeur identifie est cote **donnees experimentales** :

1. La colonne "ASR 3B (TC-001)" du tableau cross-modele dans TRIPLE_CONVERGENCE.md (et reprise dans D-001/D-022) **n'est traceable a AUCUN fichier JSON brut**. Le seul JSON 3B existant (campaign_triple_convergence_20260408_002442.json) correspond a TC-001 v1 (delta2=33.3%, full=0%), pas a TC-001 v2 (delta2=43%, full=7%) qui est la colonne effectivement publiee. Le rapport derive EXPERIMENT_REPORT_TC001_v2.md affirme ces valeurs sans pointer un JSON brut traceable. Cela confirme et generalise le constat de l'audit precedent.

2. La table 70B (TC-002) et toutes les valeurs THESIS-001 (D-023, D-024) sont en revanche **traceables exactement** aux JSON bruts 124111 et 093451 respectivement.

3. Aucun P-ID fantome, mais un **doublon suspect P019 / P052** (meme arXiv:2603.04851) qui fragilise les claims D-007 et D-014 traitees comme deux preuves independantes.

4. Trois **incoherences logiques** non resolues entre claims anciennes ("AEGIS premier", "avance >1 an", "0/73+ papiers") et la verification D-029 (8-9e implementation delta3, 7+ frameworks anterieurs). Le fichier TRIPLE_CONVERGENCE.md contient les deux versions cote a cote sans purger les anciennes formulations.

5. Une confusion d'attribution recurrente entre P029 (Lee JAMA 94.4%) et P035 (MPIB Lee benchmark).

### Trois problemes les plus graves a corriger

1. **TC-001 v2 (colonne 3B) sans bruts** : retracer la campagne 3B v2 ou requalifier les chiffres en "estimation derivee de TC-001 v1 + ajustements parametres" + republier le JSON brut correspondant. Sinon retirer la colonne 3B de la table cross-modele D-001.

2. **Doublon P019 / P052** : trancher si meme papier (consolider) ou papiers distincts (corriger l'arXiv ID dans MANIFEST). Reformuler D-007 et D-014 en consequence.

3. **Claims absolus non purges** : retirer ou nuancer toute occurrence de "avance >1 an", "0/73+ papiers proposent delta3", "seule validation empirique" dans TRIPLE_CONVERGENCE.md sections 2-3 pour s'aligner sur D-029 (8-9e implementation delta3). Aujourd'hui les deux versions coexistent et c'est exactement le mode de defaillance HUMILITY GATE cense prevenir.

---

Auditeur : Agent C (anti-confabulation), 2026-05-21
Methodologie : croisement MANIFEST.md + JSON bruts (backend/experiments/results/*.json) + rapports derives (research_archive/experiments/EXPERIMENT_REPORT_*.md)
