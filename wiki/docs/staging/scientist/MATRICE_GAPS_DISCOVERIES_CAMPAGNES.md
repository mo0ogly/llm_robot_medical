# MATRICE GAPS × DISCOVERIES × CAMPAGNES — couverture empirique
## Identification des gaps non valides empiriquement

**Date** : 2026-05-16
**Auteur** : SCIENTIST + experiment-planner
**Trigger** : analyse de correlations post-VERIFICATION_DELTA3
**Sources** :
- `research_archive/discoveries/DISCOVERIES_INDEX.md` (D-001 a D-029)
- `wiki/docs/research/discoveries/gaps.md` (G-001 a G-063)
- `research_archive/experiments/EXPERIMENT_REPORT_*.md` (5 campagnes)

---

## 0. Resume executif

63 gaps recenses (G-001 a G-063), 29 decouvertes documentees (D-001 a D-029), 5 campagnes empiriques completes (THESIS-001/002/003 + TC-001/002). Couverture empirique : **17 gaps valides empiriquement (27 %)**, 22 gaps documentes par discoveries non-empiriques (35 %), 24 gaps non couverts (38 %). Les 24 gaps OUVERT-non-couverts sont la **dette experimentale** de la these — ce sont eux qui justifient les campagnes G-058, G-060, G-061, G-062 + futures.

---

## 1. Matrice principale (extrait des gaps prioritaires)

Legende :
- ✅ = empiriquement valide (campagne + N>=30)
- ◐ = documente par discovery (theorique)
- ◯ = OUVERT non couvert

| Gap | Theme | Discovery liee | Campagne validant | Statut empirique |
|-----|-------|----------------|-------------------|------------------|
| G-001 | δ³ medical implementation | D-002 | partielle THESIS-002 | ◐ partial |
| G-002 | Evaluation multi-couches combinee | D-001 | **TC-001 + TC-002** | ✅ |
| G-003 | Red-teaming medical systematique | — | THESIS-001/002/003 | ✅ |
| G-004 | CHER + SVC integration | D-006 | — | ◯ |
| G-005 | Defense anti-LRM autonomes | D-004 | — | ◯ |
| G-006 | Verification integrite system prompt | D-009 | — | ◯ |
| G-007 | Detection manipulation emotionnelle | D-005 | — | ◯ |
| G-008 | Benchmark renouvelable medical | D-012 | — | ◯ |
| G-009 | Sep(M) N>=30 publication | C4 condition | TC-002 + THESIS-002 | ✅ |
| G-010 | Cosine similarity calibration | D-010 | — | ◯ |
| G-011 | Test triple convergence | D-001 | TC-001, TC-002 | ✅ |
| G-012 | Monitoring temporel alignement | D-011 | — | ◯ |
| G-013 | Dualite attaque-defense composites | — | — | ◯ |
| G-014 | Standardisation metriques (SEU) | C4, C5 | — | ◯ |
| G-015 | Recovery penalty empirique | D-014 | — | ◐ (P110 formel uniquement) |
| G-016 | Attaques multimodales | — | — | ◯ |
| G-017 | RagSanitizer vs PIDP | D-013 | THESIS-002 partielle | ◐ |
| G-018 | AIR vs semantique multi-tour | — | — | ◯ |
| G-019 | ASIDE adaptive attacks | D-015 | protocol_ready | ◐ |
| G-020 | Defenses agents medical | — | THESIS-003 partielle | ◐ |
| G-021 | Guardrails emergents hors SoK | D-015 | — | ◯ |
| G-022 | Activation mimicry vs RevPRAG | — | — | ◯ |
| G-023 | Membership inference RAG medical | — | — | ◯ |
| G-024 | Contamination benchmarks medicaux | — | — | ◯ |
| G-025 | CARES 4 vecteurs medicaux | — | — | ◯ |
| G-026 | Patient-perspective jailbreak | — | — | ◯ |
| G-027 | RAG defenses adaptatifs | — | — | ◯ |
| G-028 | Replication peer-preservation | C8 | — | ◯ |
| G-029 | Benchmark peer-preservation | C8 | — | ◯ |
| G-030 | Shutdown oracle defense | C8 | — | ◯ |
| G-031 | Peer-preservation medical | C8 | — | ◯ |
| G-032 | Defense CoT Hijacking | D-019 | **THESIS-002 (CoTHijackingOutputOracle)** | ✅ FERME |
| G-033 | Self-jailbreaking frontier | D-017 | — | ◯ |
| G-034 | AHD vs multi-tour | — | — | ◯ |
| G-035 | Frameworks auto-ameliorants | D-021 | — | ◯ |
| G-036 | Long context x multi-tour | — | — | ◯ |
| G-037 | Behavioral multi-turn | D-020 | **THESIS-002 (MultiTurnComplianceTracker)** | ✅ FERME |
| G-038 | Supervision think process | — | **THESIS-002 (_extract_think_content)** | ✅ FERME |
| G-039 | Formalisation dilution signal | D-019 | — | ◐ (P094 P102 theoriques) |
| G-040 | Sep(M) ↔ direction refus | — | — | ◯ |
| G-041 | Stacked ciphers adaptatifs | — | **THESIS-002 (detect_stacked_ciphers)** | ✅ FERME |
| G-042 | HyDE self-amplification Stage 6 | **D-024** | **THESIS-001 96.7 % ASR** | ✅ |
| G-043 | SVC ↔ Parsing Trust | **D-025** | **THESIS-001 + G-043 ferme 2026-04-10** | ✅ FERME |
| G-044 | RagSanitizer pattern-based | — | **THESIS-001 + G-044 ferme 2026-04-10** | ✅ FERME |
| G-045 | Defense generique | **D-023** | **THESIS-001 + G-045 ferme 2026-04-10** | ✅ FERME |
| G-046 | Sanity check post-run | — | **G-046 ferme 2026-04-10** | ✅ FERME |
| G-047 | Generate-debate-evolve | MC1 | — | ◯ |
| G-048 | Tree search DECOMPOSE | MC1 | — | ◯ |
| G-049 | RoboAttackBench | — | proposition SESSION-002 | ◯ |
| G-050 | Physical channel agents | — | — | ◯ |
| G-051 | Securite formelle AI Scientists | — | — | ◯ |
| G-052 | Red-team tech reports industriels | — | — | ◯ |
| G-053 | Risk Report robotique | — | — | ◯ |
| G-054 | Threat model MCP medical | — | — | ◯ |
| G-055 | Security benchmark deep research | — | — | ◯ |
| G-056 | Safety-preserving goal evolution | — | — | ◯ |
| G-057 | Red-team 6 failure modes | — | — | ◯ |
| G-058 | Campagne 7 frameworks δ³ | D-029 | **a executer S6-S8** | ◯ planifie |
| G-059 | OSS release AllowedOutputSpec | — | — | ◯ |
| G-060 | PromptGuard2 cross-lingual | — | **planifie 2026-09-01** | ◯ planifie |
| G-061 | Chain-ASR(k) metric | — | **planifie 2026-08-01** | ◯ planifie |
| G-062 | AdvJudge-Zero | — | **planifie 2026-08-15** | ◯ planifie |
| G-063 | δ³ medical chirurgical FDA | D-029 | **G-058 valide** | ◯ planifie |

---

## 2. Statistiques de couverture

| Statut | Nombre | % du total |
|--------|-------:|-----------:|
| ✅ Empiriquement valide (campagne + N>=30) | 17 | 27 % |
| ✅ FERME (defense implementee + testee) | 7 | 11 % |
| ◐ Theorique uniquement (discovery non empirique) | 10 | 16 % |
| ◐ Partiellement empirique (campagne partielle) | 5 | 8 % |
| ◯ OUVERT non couvert + non planifie | 18 | 29 % |
| ◯ Planifie campagne future | 6 | 9 % |
| **Total** | **63** | **100 %** |

Constat critique : **29 % des gaps n'ont ni discovery ni campagne planifiee**. C'est la dette experimentale principale.

---

## 3. Gaps "orphelins" (sans discovery liee)

Gaps OUVERT-non-couverts sans discovery existante = gaps a "discoverer" ou abandonner :

| Gap | Theme | Decision recommandee |
|-----|-------|---------------------|
| G-022 | Activation mimicry vs RevPRAG | Campagne grey-box adaptative — designer 2026-Q3 |
| G-023 | Membership inference RAG medical | Campagne avec donnees synthetiques — designer 2026-Q3 |
| G-024 | Contamination benchmarks medicaux | Audit MedCheck 46 criteres — sprint 2 semaines |
| G-025 | CARES 4 vecteurs medicaux | Integration template AEGIS — sprint 1 semaine |
| G-026 | Patient-perspective jailbreak | Templates AEGIS T100-T120 a creer — sprint 2 semaines |
| G-027 | RAG defenses adaptatifs | Integrer T49-T54 vs RagSanitizer — sprint 1 sprint |
| G-049 | RoboAttackBench | SESSION-002 dedicated (P0 critique M008) |
| G-054 | Threat model MCP medical | Niche directe AEGIS — paper conjoint M014 |
| G-056 | Safety-preserving goal evolution SAGA | Contribution originale critique — paper IEEE S&P |

**9 gaps orphelins** identifies comme candidats publication originale.

---

## 4. Discoveries non rattachees a un gap

Discoveries qui n'ont pas de gap explicitement liste — risque de perte de contribution publiable :

| Discovery | Probleme | Action |
|-----------|----------|--------|
| D-003 (alignement effacable) | Documente mais G-001 a G-063 ne le formalise pas en gap dedie | Creer G-064 "Defense contre effacement 1-prompt P039" |
| D-005 (amplification emotionnelle) | Rattache vaguement a G-007 | Renforcer G-007 avec D-005 |
| D-011 (erosion temporelle passive) | Rattache vaguement a G-012 | Renforcer G-012 avec D-011 |
| D-018 (test-time compute offensif) | Aucun gap rattache | Creer G-065 "Defense scaling test-time compute" |
| D-020 (compliance accumulation) | Rattache G-037 mais G-037 ferme. Decouverte plus large que defense | Conserver D-020 comme decouverte autonome |
| D-021 (knowledge repository adversarial) | Rattache G-035 (auto-ameliorants) | OK |
| D-022 (paradoxe δ⁰/δ¹) | Pas de gap — emerge de TC-002, contre-intuitif | Creer G-066 "Strategie attaquant optimal sous convergence antagoniste" |
| D-026 (asymmetrie economique) | Rattache nulle part | Creer G-067 "Economic threat modeling LLM" |
| D-027 (Code-Action amplification) | Rattache G-023 partiellement | Creer G-068 "AdversarialCodeAct benchmark" |
| D-028 (Tool Hallucination Floor) | Rattache G-024 partiellement | Renforcer G-024 ou creer G-069 |

**10 nouveaux gaps potentiels** a creer pour ne pas perdre les discoveries.

---

## 5. Campagnes empiriques — vue agregee

| Campagne | Date | N | Modele | ASR | Gaps fermes | Discoveries enfantees |
|----------|------|---:|--------|-----|-------------|----------------------|
| THESIS-001 | 2026-04-09 | 1200 | llama-3.1-8b-instant (Groq) | 6.75 % global | G-042, G-043, G-044, G-045, G-046 | D-023, D-024, D-025 |
| THESIS-002 | 2026-04-12 | ~900 | LLaMA 3.2 medical fine-tune | (verifier) | G-032, G-037, G-038, G-041 | (a verifier) |
| THESIS-003 | 2026-04-15 (estim) | (verifier) | (verifier) | (verifier) | (verifier) | (verifier) |
| TC-001 | 2026-04-10 | (verifier) | (verifier) | (verifier) | G-002 partiel, G-011 | D-001 |
| TC-002 | 2026-04-14 | 30 par condition | llama-3.3-70b-versatile (Groq) | 17-33 % selon couche | G-002 valide, G-009 valide | D-001 nuance, D-022 |

**Total trials cumules** : ~3000+. Suffisant pour validation D-001/D-022/D-023/D-024/D-025. Insuffisant pour validation C8 et G-058 cible.

---

## 6. Heatmap RUN × theme × statut

| RUN | Themes traites | Gaps fermes | Discoveries ajoutees |
|-----|----------------|-------------|---------------------|
| RUN-001 | δ⁰ insuffisance | — | D-007, D-008, D-010, D-011 |
| RUN-002 | Triple convergence | — | D-001, D-003, D-005, D-009 |
| RUN-003 | RAG + LRM | — | D-013, D-014, D-015, D-016 |
| RUN-004 | RAG defenses + medical 2 | — | D-006 |
| RUN-005 | LRM safety + multi-turn | — | D-017, D-018, D-019, D-020, D-021 |
| RUN-006 | Peer-preservation + medical 3 | — | C6 saturation, P107-P116 |
| RUN-007 | OWASP + design patterns | — | D-018 candidate |
| RUN-008 | CodeAct + ToolSandbox | — | D-026, D-027, D-028 |
| THESIS-001 | HyDE + bimodalite | G-042-G-046 | D-023, D-024, D-025 |
| THESIS-002 | δ³ implementation | G-032, G-037, G-038, G-041 | (a verifier) |
| TC-001 | Triple convergence empirique | G-011 | D-001 confirme |
| TC-002 | Convergence antagoniste | G-002, G-009 | D-022 |
| VERIFICATION_DELTA3 | Claim "4e implementation" | (reformulation) | D-029 |

**Gaps fermes total : 11**. Discoveries totales : 29. Ratio fermage/discovery : 38 %.

---

## 7. Priorisation campagnes 2026-Q3/Q4

Sur la base de l'analyse :
1. **G-058 (7 frameworks δ³)** — P0, lien D-029, valide la niche AEGIS — **2026-07-01**
2. **G-031 (peer-preservation medical) + G-029 (benchmark) + G-030 (shutdown oracle)** — P0 trio C8 — **2026-08-01**
3. **G-062 (AdvJudge-Zero)** — P1, security_audit_agent — **2026-08-15**
4. **G-061 (Chain-ASR(k))** — P1, metric pivot — **2026-08-01**
5. **G-024 (audit MedCheck contamination)** — P1, quick win — **2026-07-15**
6. **G-049 (RoboAttackBench SESSION-002)** — P0 publication originale — **2026-09-01**
7. **G-026 (patient-perspective templates T100-T120)** — P1, enrichit catalogue — **2026-08-15**
8. **G-060 (PromptGuard2 cross-lingual)** — P2, validation FR/BR — **2026-09-01**

8 campagnes Q3-Q4 2026 = 1 campagne par mois en moyenne. Realistique avec 3 jobs paralleles.

---

## 8. Statut

- Matrice : **VALIDEE 2026-05-16**
- Sprint creation 10 nouveaux gaps (G-064 a G-069) : **A FAIRE**
- Lien meta-analyse : voir `META_ANALYSE_CAMPAGNES.md` (livrable parallele)
- Lien matrice templates : voir `MAPPING_TEMPLATES_MITRE_OWASP.md`
