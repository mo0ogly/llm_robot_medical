# DIRECTOR BRIEFING — Post RUN-009 Review (Medical Security + RAG Poisoning Batch)

**Date :** 2026-05-30
**Mode :** incremental scoped (4 new papers P136-P139) — aegis-research-lab APEX Bac C
**Source :** Fine literature search (axe securite medicale δ⁰ + axe poisoning RAG δ²)

---

## 0. Executive Summary

4 nouvelles references integrees dans le corpus AEGIS (**139 papers total**, P001-P139). Le batch couvre deux axes convergents : la **securite medicale** (P136, distillation comportementale black-box qui casse l'alignement de securite des LLM medicaux — δ⁰) et le **poisoning RAG / control-plane** (P137 CDA/DictAttack, P138 FlippedRAG, P139 CorruptRAG — δ¹/δ²). **Resultat marquant** : P139 (CorruptRAG) demontre un poisoning RAG efficace par injection d'**un seul document**, ce qui fait monter la conjecture **C5 de 8.5 a 9/10**. **4 doublons bloques** par l'ETAPE 0 anti-doublon (P112, P054, P065, P009), confirmant la robustesse du garde-fou. **Aucune revendication de primaute** promue (HUMILITY GATE respecte : 2 candidats discoveries laisses en PROPOSED).

---

## 1. Etat des Conjectures

| Conj | Score avant | Score apres | Changement | Papers RUN-009 ayant contribue |
|------|-------------|-------------|------------|-------------------------------|
| C1 (insuffisance δ⁰) | 10/10 | **10/10** | = (sature) | P137 (control-plane), P138 (FlippedRAG), P139 (CorruptRAG) |
| C2 (necessite δ³) | 10/10 | **10/10** | = (sature) | P137 ("internal safety alignment alone cannot stop it") |
| C5 (propagation via composants externes) | 8.5/10 | **9/10** | ↑ +0.5 | **P139 (CorruptRAG single-doc poisoning)** |
| C6 (architecture-dependent) | 8/10 | **8/10** | = | P136 (distillation = transfert comportemental cross-architecture) |

**Conjectures C1/C2 saturees a 10/10** : ce batch les renforce sans changer le score (deja au plafond). **C5 est la seule a progresser** : le passage d'un poisoning RAG "majoritaire" a un poisoning "single-document" abaisse drastiquement le seuil d'attaque, ce qui renforce l'idee qu'un seul composant externe compromis suffit a propager la compromission.

---

## 2. Carte de Maturite par Theme

| # | Theme | Papers | Maturite | Action |
|---|-------|--------|----------|--------|
| 1 | Securite medicale LLM (δ⁰) | +1 (P136) | EN COURS | Differentiateur AEGIS — confronter la distillation black-box au protocole de discrimination δ⁰ |
| 2 | Control-plane / structured output | +1 (P137) | **EMERGENT** | Tester CDA/DictAttack contre RagSanitizer + verifier couverture δ¹/δ² |
| 3 | RAG poisoning (opinion / single-doc) | +2 (P138, P139) | **EN COURS CRITIQUE** | Confronter CorruptRAG (single-doc) au GMTP (P065) + RagSanitizer 15+1 detecteurs |
| 4 | Prompt injection fondamentaux | 139 | **SATURE** | Pas de nouveaux papers necessaires |

---

## 3. Gaps Critiques — Actions Immediates

### P0 — Bloquants pour la these

1. **P139 CorruptRAG (Zhang B. et al., SACMAT 2026)** — **single-doc poisoning realiste**
   - Action : confronter le scenario "single-doc poisoning" au GMTP (Kim et al., 2025, P065/RAGDefender) et au RagSanitizer (15+1 detecteurs)
   - Action : mesurer le bypass via la forge AEGIS sur les chaines RAG (medical-rag, rag-basic)
   - Livrable : campagne N>=30 sur RR-DA-003 (les defenses se composent-elles face au poisoning PIDP single-doc ?)
   - Responsable : CYBERSEC + WHITEHACKER + EXPERIMENTALIST

2. **P137 CDA/DictAttack (Zhang S. et al., CCS 2026)** — control-plane vs guardrails
   - Action : verifier en texte complet les ASR chiffres (94.3-99.5% revendiques sur gpt-5/gemini-2.5-pro/deepseek-r1)
   - Action : evaluer si le vecteur control-plane (structured output) est couvert par δ¹ ou requiert δ²/δ³
   - Livrable : note de positionnement RR-FA-002
   - Responsable : SCIENTIST + CYBERSEC

### P1 — Importants

3. **P136 Distillation comportementale medicale (Jahan & Sun, preprint)** — δ⁰
   - Action : verifier les chiffres en texte complet (86% unsafe surrogate vs 66% Meditron vs 46% base, cout ~$12)
   - Action : relier au protocole de discrimination δ⁰ AEGIS (templates #08/#07/#11)
   - Note : **[PREPRINT]** — re-tester avant integration manuscrit
   - Responsable : SCIENTIST

4. **P138 FlippedRAG (Chen et al., CCS 2025)** — manipulation d'opinion
   - Action : confirmer +16.7% ASR / ~50% opinion shift / ~20% user cognition shift en texte complet
   - Action : ajouter scenario "opinion manipulation" aux chaines RAG
   - Responsable : WHITEHACKER

---

## 4. Decouvertes — Bilan

### Validees (>= 9/10) — stables
- D-001 (Triple Convergence) : 10/10 — non affectee par ce batch

### Actives (7-8/10)
- D-018 (distillation / shallow alignment medical) : **etendue** par P136 (mecanisme de distillation comportementale black-box)

### Candidats PROPOSED (NON promus — HUMILITY GATE)
- **"Le seuil de poisoning RAG est tres bas (1 document suffit)"** : suggere par P139 (CorruptRAG). Laisse en **PROPOSED** — necessite WebSearch de verification de primaute (PoisonedRAG, PIDP et al. anterieurs) avant toute promotion en ACTIVE. **NON promu.**
- **"Le control-plane (structured output) est une surface δ¹/δ² non couverte"** : suggere par P137. Laisse en **PROPOSED** — necessite confirmation texte complet + WebSearch. **NON promu.**

**Conformite HUMILITY GATE** : aucune revendication "premier/seul/novel" promue ce cycle. Les 2 candidats restent des hypotheses datees a verifier.

---

## 5. Resultats Experimentaux

Aucune nouvelle experience dans RUN-009 (mode bibliographie incremental scoped). Les campagnes proposees (RR-DA-003 CorruptRAG vs GMTP/RagSanitizer, RR-FA-002 control-plane) sont a planifier via `/experiment-planner`.

---

## 6. Plan RUN-010

### Papers a chercher par theme
- **Veille medicale** : continuer la recherche de papers securite LLM medicaux 2026 (differentiateur AEGIS)
- **Defenses RAG composees** : chercher les defenses recentes vs single-doc poisoning (suite GMTP P065)
- **Control-plane** : veille sur les attaques structured-output / grammar-guided (suite P137)

### Experiences a mener
1. **RR-DA-003** : campagne CorruptRAG single-doc vs RagSanitizer (15+1) + GMTP, N>=30, mesurer le bypass
2. **RR-FA-002** : reproduire CDA/DictAttack sur modeles AEGIS, evaluer couverture δ¹/δ²
3. **RR-D18** : confronter la distillation P136 au protocole de discrimination δ⁰

### Chapitres a rediger
- **related_work.md** : integrer P136-P139 dans les sections "Medical LLM security" (P136) et "RAG poisoning" (P138, P139) + "Control-plane attacks" (P137)
- **positionnement_these.md** : ajouter le single-doc poisoning (P139) comme cas de test critique pour la robustesse RAG composee

---

## 7. Carte de Maturite de la These

| Chapitre | Maturite (%) | Donnees disponibles | Donnees manquantes |
|----------|-------------|---------------------|-------------------|
| Introduction | 82% | 139 papers, conjectures C1-C8 | — |
| Related Work | 90% | + RAG poisoning + control-plane + medical | Integration P136-P139 |
| Framework formel δ⁰-3 | 85% | D-001 a D-029 | Confrontation single-doc poisoning a δ² |
| Experimentation | 70% | Campagnes THESIS-001 | Campagnes RR-DA-003 / RR-FA-002 a lancer |
| Discussion | 62% | Triple convergence + C5 a 9/10 | Discussion seuil minimal de poisoning RAG |
| Conclusion | 50% | Positionnement | — |

---

## 8. Fichiers de Reference (RUN-009)

**Fiches doc_references :**
- `research_archive/doc_references/2025/medical_ai/P136_Jahan_2025_BlackBoxDistillationMedical.md` **[PREPRINT]**
- `research_archive/doc_references/2026/prompt_injection/P137_Zhang_2026_GrammarControlPlaneCDA.md` **[ARTICLE VERIFIE — CCS 2026]**
- `research_archive/doc_references/2025/prompt_injection/P138_Chen_2025_FlippedRAG.md` **[ARTICLE VERIFIE — CCS 2025]**
- `research_archive/doc_references/2026/prompt_injection/P139_Zhang_2026_CorruptRAG.md` **[ARTICLE VERIFIE — SACMAT 2026]**

**PDFs sources :**
- `research_archive/literature_for_rag/P136_Jahan_2025_BlackBoxDistillationMedical.pdf`
- `research_archive/literature_for_rag/P137_Zhang_2026_GrammarControlPlaneCDA.pdf`
- `research_archive/literature_for_rag/P138_Chen_2025_FlippedRAG.pdf`
- `research_archive/literature_for_rag/P139_Zhang_2026_CorruptRAG.pdf`

**Chunks RAG (ChromaDB aegis_bibliography) :**
- P136 : 8 chunks · P137 : 10 chunks · P138 : 10 chunks · P139 : 10 chunks (verifies individuellement)
- Script : `research_archive/_staging/chunker/generate_chunks_run009.py` (38 chunks produits)

**Indexes mis a jour :**
- `research_archive/doc_references/MANIFEST.md` (135 → 139 papers)
- `research_archive/doc_references/INDEX_BY_DELTA.md` (δ⁰ 68→69, δ¹ 72→73, δ² 51→54)
- `research_archive/doc_references/prompt_analysis/research_requests.json` (RR-D18, RR-FA-002, RR-FA-004, RR-DA-003 → partial)
- `research_archive/discoveries/CONJECTURES_TRACKER.md` (section RUN-009, C5 +0.5)
- `research_archive/_staging/memory/MEMORY_STATE.md` (RUN-009 entry, next P-ID P140)
- `research_archive/_staging/memory/EXECUTION_LOG.jsonl` (RUN-009 line)

---

## Recapitulatif

**RUN-009 bilan :**
- 4 nouveaux papers integres (P136-P139)
- 4 doublons detectes et bloques par ETAPE 0 (P112/2511.15759, P054, P065, P009)
- C5 : 8.5 → 9/10 (+0.5, CorruptRAG single-doc poisoning)
- C1/C2 stables a 10/10 (satures), C6 stable, D-018 etendue
- 2 candidats discoveries laisses en PROPOSED (HUMILITY GATE respecte)
- 4 research requests passees a "partial" (RR-D18, RR-FA-002, RR-FA-004, RR-DA-003)
- Axe medical preserve comme differentiateur (P136)
- Corpus total : **139 papers** (P001-P139)
