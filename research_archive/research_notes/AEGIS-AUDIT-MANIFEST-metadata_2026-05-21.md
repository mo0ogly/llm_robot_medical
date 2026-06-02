# AEGIS — Audit hygiene metadonnees MANIFEST
**Date** : 2026-05-21
**Agent** : Agent B (task #23)
**Perimetre** : `research_archive/doc_references/MANIFEST.md`, Table Centrale P001-P152
**Source de verite** : tableau markdown de MANIFEST.md (152 lignes, 131 papiers actifs apres deduplication P074 et P084/LlamaFirewall)

---

## 1. Synthese chiffree

| Categorie | Nombre |
|---|---|
| Entrees "Unknown et al." dans MANIFEST | 26 |
| Entrees "Unknown" dont la fiche `.md` contient deja les vrais auteurs | 22 |
| Entrees "Unknown" sans auteurs dans la fiche (a investiguer en priorite) | 4 |
| Doublons arXiv ID entre deux P-ID distincts | 4 |
| Doublon titre exact entre deux P-ID | 1 (sous-ensemble des doublons arXiv) |
| Lignes sans arXiv ID ni DOI ni identifiant equivalent | 1 (P040 reconnu absent par section 9 de MANIFEST) |
| Auteurs confirmes par WebSearch dans ce passage | 6 |

Le diagnostic principal n'est pas le manque de donnees mais une desynchronisation entre la colonne "Authors" de la Table Centrale et l'en-tete des fiches `2025/.../PXXX_*.md`. La colonne MANIFEST n'a pas ete mise a jour quand les fiches ont ete enrichies.

---

## 2. Entrees "Unknown et al." de la Table Centrale

Colonne "Source fiche" : auteurs lus directement dans l'en-tete `## [Auteurs, Annee]` ou `**Auteurs**:` du fichier `.md` correspondant.

| P-ID | Titre court | Auteurs proposes (a porter dans MANIFEST) | Origine | Statut |
|---|---|---|---|---|
| P002 | Multi-Agent LLM Defense Pipeline | Hossain et al. | Fiche + WebSearch (S M Asif Hossain, R K Shayoni, M R Ameen, A Islam, M F Mridha, J Shin) | CONFIRME WebSearch arXiv:2509.14285. Attention : P085 a deja "Hossain et al." pour le meme arXiv ID, voir section 4 doublons. |
| P003 | Prompt Injection Attacks in LLMs: A Comprehensive Review | Gulyamov et al. | Fiche `P003_MDPI_2025_ComprehensiveReview.md` | A verifier annee : fiche dit 2026, MANIFEST dit 2025 ; venue MDPI Information 17(1) coherente avec 2026. |
| P004 | WASP: Benchmarking Web Agent Security | Evtimov et al. | Fiche `P004_WASP_2025_WebAgentBenchmark.md` | Coherent avec arXiv:2504.18575 (Meta WASP). |
| P005 | Indirect Prompt Injections: Are Firewalls All You Need | Bhagwatkar et al. | Fiche + WebSearch (R Bhagwatkar, K Kasa, A Puri, G Huang, I Rish, G W Taylor, K Dj Dvijotham, A Lacoste) | CONFIRME WebSearch arXiv:2510.05244. |
| P006 | Prompt Injection Attack to Tool Selection | Shi et al. | Fiche `P006_ToolHijacker_2025_ToolSelection.md` | Coherent avec ToolHijacker arXiv:2504.19793. |
| P007 | Securing LLMs from Prompt Injection (JATMO) | Suri & McCrae | Fiche `P007_JATMO_2025_SecuringLLM.md` | A confirmer : le JATMO original est Piet et al. 2023 ; la fiche peut etre un autre papier portant le meme nom. |
| P008 | Attention Tracker | Hung et al. | Fiche `P008_AttentionTracker_2024_Detection.md` | Coherent avec arXiv:2411.00348. |
| P009 | Bypassing LLM Guardrails | Hackett et al. | Fiche `P009_GuardrailBypass_2025_CharacterInjection.md` | Coherent. Note : P049 porte deja "Hackett et al." pour DOI LLMSec 2025 (meme equipe Mindgard) — verifier que ce n'est pas un doublon papier conference vs preprint arXiv:2504.11168. |
| P010 | From prompt injections to protocol exploits | Ferrag et al. | Fiche `P010_ProtocolExploits_2025_Threats.md` | Coherent avec arXiv:2506.23260. |
| P011 | PromptGuard | Alzahrani | Fiche `P011_PromptGuard_2025_Framework.md` (auteur unique : Ahmed Alzahrani, King Abdulaziz University) | "Alzahrani" (un seul auteur), pas "Alzahrani et al." |
| P013 | Beyond Cosine Similarity | Tosun, Buldur, Ezerceli & ElHussieni | Fiche `P013_SemanticDrift_2025_AntonymIntrusion.md` | Coherent avec arXiv:2601.13251. |
| P015 | Reasoning before Comparison | Xu et al. | Fiche `P015_LLMSimilarity_2024_DomainSpecialized.md` (S Xu, Z Wu, H Zhao, P Shu, Z Liu, W Liao, S Li, A Sikora, T Liu, X Li) | Coherent avec arXiv:2402.11398. |
| P016 | Advancing Robust Semantic Similarity (Berkeley TR) | Goel | Fiche `P016_Berkeley_2024_RobustSimilarity.md` (Samarth Goel, UC Berkeley Master's Thesis) | Auteur unique. |
| P017 | Adversarial Preference Learning (APL) | Wang et al. | Fiche `P017_APL_2025_AdversarialPreference.md` (Yuanfu Wang et 14 co-auteurs, Shanghai AI Lab) | Coherent avec arXiv:2505.24369. |
| P019 | Why Is RLHF Alignment Shallow? | Young | Fiche + WebSearch (Robin Young, University of Cambridge) | CONFIRME WebSearch arXiv:2603.04851. Auteur unique. Doublon avec P052 — voir section 4. |
| P020 | COBRA: Malicious RLHF Feedback | Haider et al. | Fiche `P020_COBRA_2025_MaliciousRLHF.md` (Z Haider, M H Rahman, V Devabhaktuni, S Moeykens, P Chakraborty) | Coherent. |
| P021 | Adversarial Training of Reward Models | Bukharin et al. | Fiche `P021_AdvRM_2025_RewardModels.md` | Coherent avec arXiv:2504.06141. |
| P025 | DMPI-PMHFE | Ji, Li & Mao | Fiche `P025_DMPI_2024_HeuristicDetection.md` | Coherent avec arXiv:2506.06384. |
| P026 | Indirect Prompt Injection in the Wild | Chang et al. | Fiche `P026_IPI_2025_IndirectWild.md` | Coherent avec arXiv:2601.07072. |
| P027 | Practical Framework Medical AI Security | Wang, Zhang & Yagemann | Fiche `P027_MedicalFramework_2025_SecurityEval.md` | Coherent avec arXiv:2512.08185. Doublon avec P071 — voir section 4. |
| P028 | Towards Safe AI Clinicians | Zhang, Lou & Wang | Fiche `P028_SafeAIClinicians_2025_Jailbreaking.md` | Coherent avec arXiv:2501.18632. Le MANIFEST note volontairement P028 et P034 comme deux analyses du meme papier. |
| P030 | Declining Medical Safety Messaging | Sharma, Alaa & Daneshjou | Fiche + WebSearch (npj Digital Medicine 8, 592, 2025, DOI:10.1038/s41746-025-01943-1) | CONFIRME WebSearch. |
| P032 | Audit and Analysis of Health Misinformation | Hussain, Zhao & Vincent | Fiche `P032_HealthMisinfo_2024_Audit.md` | Note : MANIFEST dit annee 2024, fiche dit 2025, arXiv:2508.10010 (2025). A reconcilier. |
| P034 | CFT in Defending Medical Adversarial | Zhang, Lou & Wang | Fiche `P034_CFT_2025_MedicalDefense.md` | Meme papier que P028, deux angles. Reference doit etre arXiv:2501.18632 et non "arXiv (estimated)". |
| P038 | Know Thy Enemy: InstruCoT | Chang, Li & Huan | Fiche + WebSearch (Zhiyuan Chang, Mingyang Li, Yuekai Huan) | CONFIRME WebSearch arXiv:2601.04666. Annee 2026. |
| P045 | System Prompt Poisoning | Li, Guo & Cai | Fiche + WebSearch (Zongze Li, Jiawei Guo, Haipeng Cai) | CONFIRME WebSearch arXiv:2505.06493. |

### Entrees "Unknown" sans auteurs dans la fiche

Les quatre cas sans en-tete `## [Auteurs, Annee]` exploitable sont P011, P016, P017, P020. Pour ces quatre, la cle `**Auteurs**` du bloc d'en-tete fournit la donnee, deja transcrite ci-dessus. Aucun blocage.

---

## 3. arXiv ID manquants

Au sens strict de l'audit (absence d'identifiant exploitable), un seul cas dans la Table Centrale au-dela de ceux deja reconnus comme intentionnels par la note 2026-05-31 de MANIFEST :

- P040 "Prompt Injection is All You Need: Healthcare Misinformation" (Zahra & Chin, 2026, Springer LNCS 16038) : pas encore d'arXiv associe ni de DOI Springer dans MANIFEST. Statut deja documente comme "not yet indexed".

Les autres entrees sans arXiv sont identifiees comme intentionnellement sans ID par la note 2026-05-31 : P016 (Berkeley TR), P033 (HiddenLayer blog), P055 (Snyk blog), P058 (MSc thesis ETH), P086 (preprint URL Berkeley), P122/P123 (OWASP), P132/P133 (GitHub industriel). Pas d'action.

Aucun cas detecte ou MANIFEST aurait perdu un arXiv ID present dans la fiche (apres P018 corrige le 2026-05-16).

---

## 4. Doublons

### 4.1 Doublons arXiv ID entre deux P-ID

| arXiv ID | P-ID #1 | P-ID #2 | Statut |
|---|---|---|---|
| 2509.14285 | P002 (Multi-Agent LLM Defense Pipeline) | P085 (Multi-Agent LLM Defense Pipeline) | DOUBLON probable. Memes titre et arXiv. P002 etiquete "Unknown et al.", P085 etiquete "Hossain et al.". Decision recommandee : fusionner sur P002 (chronologie d'attribution) ou P085 (auteurs corrects), conserver l'autre comme stub renvoyant vers l'autoritative — meme protocole que P074 vers P028. |
| 2512.08185 | P027 (A Practical Framework for Evaluating Medical AI Security) | P071 (Practical Framework for Medical AI Security Evaluation) | DOUBLON probable. Memes arXiv et meme equipe (Wang/Zhang/Yagemann). Decision recommandee : fusionner sur P027 (anteriorite numerique) ou P071 (titre plus complet), stub pour l'autre. |
| 2601.01627 | P050 (JMedEthicBench, Junyu Liu et al.) | P108 (JMedEthicBench, Liu et al.) | DOUBLON. Meme benchmark JMedEthicBench. Decision recommandee : fusionner sur P050, conserver P108 comme stub. |
| 2603.04851 | P019 (Why Is RLHF Alignment Shallow?) | P052 (Why Is RLHF Alignment Shallow?) | DOUBLON titre + arXiv. Robin Young seul auteur. P019 catalogue dans `2025/model_behavior/`, P052 dans `2026/model_behavior/`. Decision recommandee : fusionner sur P019 (anteriorite numerique) ou P052 (annee correcte), stub pour l'autre. |

### 4.2 Doublons titres

Detection apres normalisation (lowercase + suppression ponctuation) : 1 seul cas, P019 et P052 ci-dessus. Les autres paires de doublons partagent l'arXiv mais ont des titres formulae differemment (P002/P085, P027/P071, P050/P108).

### 4.3 Co-mentions a investiguer

- P009 (arXiv:2504.11168, "Bypassing PI and Jailbreak Detection in LLM Guardrails", Hackett et al., Mindgard) et P049 (DOI:10.18653/v1/2025.llmsec-1.8, "Bypassing LLM Guardrails: Evasion Attacks Against PI Detection", Hackett et al., LLMSec 2025) sont probablement le meme travail en deux versions (preprint arXiv + version conference ACL LLMSec). A statuer : doublon ou couple preprint/proceedings volontairement separe.

---

## 5. Actions recommandees (ne pas executer sans validation)

1. **Patch metadonnees** : mettre a jour la colonne Authors pour les 26 entrees "Unknown et al." en recopiant l'auteur du `## [...]` de chaque fiche (22 cas trivialement) et en injectant les 6 cas verifies WebSearch (P002, P005, P019, P030, P038, P045). Effort estime : un seul commit MANIFEST.
2. **Resolution des 4 doublons arXiv** : decider de la version autoritative pour chacune des paires (P002/P085, P027/P071, P050/P108, P019/P052) ; stub la seconde sur le modele P074 vers P028 (cf. note de tete MANIFEST). Effort : 4 stubs + retrait du Coverage Summary.
3. **Reconciliation annees P003 et P032** : la colonne Year et l'en-tete de fiche divergent. Aligner sur la date de publication de la venue (MDPI 2026, arXiv 2508.10010 = 2025).
4. **P034** : remplacer "arXiv (estimated)" par "arXiv:2501.18632" et marquer la fiche comme analyse complementaire de P028 (deja mentionne dans la note de tete MANIFEST mais pas dans la ligne du tableau).
5. **P009 vs P049** : statuer formellement preprint vs proceedings ; si meme travail, stub P009 vers P049 (peer-reviewed est autoritative).
6. **Verification croisee corpus-wide** : apres patch, relancer `check_corpus_dedup.py` sur les 152 P-ID pour confirmer qu'aucun autre arXiv n'est attribue a deux P-ID.

---

## 6. Notes de methodologie

- Audit limite a la lecture de la Table Centrale (lignes 17 a 164) et des en-tetes des 26 fiches "Unknown".
- Aucune fiche sensible (`scenarios.py`, `attack_catalog.py`, `i18n.js`, champ "template" des `prompts/*.json`) n'a ete lue.
- Detection doublons par parsing AWK sur la colonne Reference (regex `arXiv:[0-9]+\.[0-9]+`) et par normalisation de la colonne Title.
- Comptage usage P-ID dans `research_archive/` par grep recursif, utilise uniquement pour prioriser les 8 cas verifies par WebSearch.
- Six WebSearch executes : arXiv:2509.14285, arXiv:2603.04851, arXiv:2510.05244, arXiv:2601.04666, arXiv:2505.06493, DOI npj DM 10.1038/s41746-025-01943-1. Tous concordants avec les fiches existantes.

---

**Conclusion** : MANIFEST est globalement coherent au niveau des fiches. La principale dette est cosmetique (colonne Authors non synchronisee) et structurelle (4 doublons arXiv non resolus). Aucune affirmation factuelle non sourcee detectee. Pas de correction appliquee au fichier — livrable strictement consultatif.
