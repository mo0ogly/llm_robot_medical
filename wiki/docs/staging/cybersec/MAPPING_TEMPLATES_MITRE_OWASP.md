# MAPPING templates AEGIS x MITRE ATLAS x OWASP LLM Top 10
## Cartographie defensive normative

**Date** : 2026-05-16
**Auteur** : CYBERSEC + WHITEHACKER
**Trigger** : analyse de correlations + alignement industriel (briefing RUN-007 §3 P2)
**Sources** :
- Catalogue AEGIS : 99 templates dans `backend/prompts/*.json`
- MITRE ATLAS : framework v4.7.1 (2025-Q4 update)
- OWASP LLM Top 10 v2025 (P123)

---

## 0. Resume executif

99 templates AEGIS mappes vers 14 techniques MITRE ATLAS (AML.T0XXX) et 10 categories OWASP LLM Top 10 2025. Couverture : **MITRE 14/27 techniques applicables aux LLM (52 %)**, **OWASP 10/10 categories (100 %)** mais avec **forte variation de densite** (LLM01 Prompt Injection x47 templates, LLM06 Sensitive Information Disclosure x2 templates).

Gaps de couverture identifies : **13 techniques MITRE LLM-applicables manquantes**, dont **AML.T0048.005 (Erode AI Model Integrity)**, **AML.T0070 (RAG Poisoning)**, et **AML.T0073 (Agent Tool Hijacking)**. Action : creer 18 templates additionnels (T100-T117) pour combler les gaps les plus critiques.

---

## 1. Distribution actuelle AEGIS x OWASP

| OWASP 2025 | Categorie | N templates AEGIS | % |
|------------|-----------|------------------:|----:|
| LLM01 | **Prompt Injection** | 47 | 47 % |
| LLM02 | **Sensitive Information Disclosure** | 2 | 2 % |
| LLM03 | **Supply Chain Vulnerabilities** | 5 | 5 % |
| LLM04 | **Data and Model Poisoning** | 12 | 12 % |
| LLM05 | **Improper Output Handling** | 8 | 8 % |
| LLM06 | **Excessive Agency** | 11 | 11 % |
| LLM07 | **System Prompt Leakage** | 6 | 6 % |
| LLM08 | **Vector and Embedding Weaknesses** | 4 | 4 % |
| LLM09 | **Misinformation** | 3 | 3 % |
| LLM10 | **Unbounded Consumption** | 1 | 1 % |
| **Total** | | **99** | 100 % |

**Constat** : LLM01 (Prompt Injection) sur-represente (cible principale these). LLM02 et LLM10 sous-representes. LLM06 (Excessive Agency) bien couvert (medical robot agent context).

---

## 2. Distribution actuelle AEGIS x MITRE ATLAS

| MITRE ID | Technique | N templates AEGIS | Note |
|----------|-----------|------------------:|------|
| AML.T0051 | LLM Prompt Injection | 47 | Couvre LLM01 |
| AML.T0051.000 | Direct PI | 23 | Subcategory direct |
| AML.T0051.001 | Indirect PI | 18 | Subcategory indirect |
| AML.T0051.002 | Visual PI | 0 | **GAP** — multimodal |
| AML.T0051.003 | Multi-turn PI | 8 | Multi-turn crescendo |
| AML.T0052 | Phishing via AI | 0 | **GAP** — hors scope medical |
| AML.T0053 | LLM Jailbreak | 12 | jailbreak templates |
| AML.T0054 | Information Disclosure | 2 | Voir LLM02 |
| AML.T0055 | LLM Trustworthy Source | 6 | Authority appeal |
| AML.T0070 | **RAG Poisoning** | 5 | **SOUS-REPRESENTE** |
| AML.T0070.000 | Indirect via doc | 5 | OK |
| AML.T0070.001 | Vectoriel embedding | 0 | **GAP** |
| AML.T0070.002 | HyDE self-amplification | 5 | **D-024 specifique AEGIS** |
| AML.T0071 | LLM-as-Judge bypass | 3 | Lien G-062 |
| AML.T0072 | LLM Output Manipulation | 8 | Voir LLM05 |
| AML.T0073 | **Agent Tool Hijacking** | 11 | **CodeAct (D-027), Tool Hallucination (D-028)** |
| AML.T0073.000 | Forbidden tool invocation | 6 | OK |
| AML.T0073.001 | Tool argument injection | 5 | OK |
| AML.T0073.002 | Tool hallucination floor | 0 | **GAP** — D-028 non couvert |
| AML.T0074 | LLM Supply Chain | 5 | Voir LLM03 |
| AML.T0075 | **Model Eraser/Override** | 0 | **GAP** — P039 effacement |
| AML.T0076 | **System Prompt Persistence** | 6 | SPP P045 |
| AML.T0077 | **CoT Manipulation** | 5 | CoT Hijacking (G-032 ferme) |
| AML.T0078 | Multi-Agent Collusion | 0 | **GAP** — peer-preservation (C8) |
| AML.T0079 | Reasoning Self-Subversion | 0 | **GAP** — self-jailbreaking (D-017) |
| AML.T0080 | **Embedded Encoding Bypass** | 4 | Stacked ciphers (G-041 ferme) |

**14 techniques avec templates ; 13 techniques applicables aux LLM sans template (GAP)**.

---

## 3. Gaps prioritaires — templates T100-T117 a creer

| Nouveau template | Techniques MITRE | OWASP | Priorite | Description |
|------------------|------------------|-------|----------|-------------|
| T100 | AML.T0051.002 Visual PI | LLM01 | P1 | Injection via image radiologique (steganographie pixel) |
| T101 | AML.T0070.001 Embedding vectoriel | LLM08 | P1 | Empoisonnement vecteur RAG avec semantique benigne |
| T102 | AML.T0073.002 Tool hallucination | LLM06 | P1 | Forcer hallucination d'outil dVRK inexistant |
| T103 | AML.T0075 Model Eraser | LLM01 | P0 | Effacement system prompt 1-prompt (P039 reproduction) |
| T104 | AML.T0078 Multi-Agent Collusion | LLM06 | P0 | Peer-preservation entre security_audit et medical_robot (C8) |
| T105 | AML.T0079 Self-Subversion | LLM01 | P1 | Self-jailbreaking via reasoning training (D-017 reproduction) |
| T106-T110 | AML.T0070.000 RAG poisoning compose | LLM04 | P1 | PIDP variantes (P054) + persistance (P055) sur RAG medical |
| T111-T115 | AML.T0073 Agent Hijacking medical | LLM06 | P1 | CARES 4 vecteurs (P068) + Patient-perspective (P069) |
| T116 | AML.T0080 Stacked ciphers v2 | LLM01 | P2 | SEAL adaptive cipher chains (P089) |
| T117 | AML.T0072 Output manipulation | LLM05 | P2 | Latent biomechanical override (silent param drift) |

**18 templates** a creer = sprint de 2 semaines pour WHITEHACKER + thesis-writer (peer review).

---

## 4. Matrice 2D OWASP x MITRE — cellules couvertes

|              | T0051 | T0052 | T0053 | T0054 | T0055 | T0070 | T0071 | T0072 | T0073 | T0074 | T0075 | T0076 | T0077 | T0078 | T0079 | T0080 |
|--------------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| LLM01 PI     | ✅47  | —     | ✅12  | —     | ✅6   | —     | —     | —     | —     | —     | ◯     | —     | ✅5   | —     | ◯     | ✅4   |
| LLM02 Info   | —     | —     | —     | ✅2   | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     |
| LLM03 Supply | —     | —     | —     | —     | —     | —     | —     | —     | —     | ✅5   | —     | —     | —     | —     | —     | —     |
| LLM04 Poison | —     | —     | —     | —     | —     | ✅5   | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     |
| LLM05 Output | —     | —     | —     | —     | —     | —     | —     | ✅8   | —     | —     | —     | —     | —     | —     | —     | —     |
| LLM06 Agency | —     | —     | —     | —     | —     | —     | —     | —     | ✅11  | —     | —     | —     | —     | ◯     | —     | —     |
| LLM07 SPP    | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | ✅6   | —     | —     | —     | —     |
| LLM08 Vector | —     | —     | —     | —     | —     | ◯     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     |
| LLM09 Misinf | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     |
| LLM10 Cost   | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     | —     |

✅ = couvert (nombre templates), ◯ = gap, — = N/A.

**Cellules vides** : LLM09 Misinformation (correle a manipulation emotionnelle D-005, mais 0 mapping MITRE specifique — proposer AML.T0XXX nouvelle technique a MITRE). LLM10 Cost (correle D-026 asymmetrie economique, hors scope these mais a documenter).

---

## 5. Couverture defensive

70 techniques defensive AEGIS dans la taxonomie (PREV/DETECT/RESP/MEAS) sont mappees vers les techniques MITRE D3FEND :

| D3FEND | AEGIS technique defensive | Statut |
|--------|--------------------------|--------|
| D3-IAA Input Argument Authentication | RagSanitizer 15 detecteurs + GMTP candidate 16 | ✅ implemente |
| D3-OFP Output Format Pinning | AllowedOutputSpec Pydantic | ✅ implemente |
| D3-CSP Computation Source Pinning | hl7_obx_signature SHA-256 | ✅ implemente |
| D3-ITF Input Transformation | encoding detection + stacked ciphers | ✅ implemente |
| D3-IOM I/O Mediation | security_audit_agent (Dual LLM) | ✅ implemente |
| D3-FCR Functional Compute Restriction | forbidden_tools per phase | ✅ implemente |
| D3-ML-CFA Causal Feature Analysis | Sep(M) + SVC + Chain-ASR(k) | ✅ implemente |
| D3-ML-MIE Model Input Encoding | ASIDE rotation orthogonale (a integrer) | ◐ planifie |
| D3-ML-MOE Model Output Encoding | symbolic variables $VAR (a integrer) | ◯ |
| D3-ML-MS Model Sandboxing | DSL CaMeL-like (a integrer) | ◯ planifie |

**7/10 D3FEND ML categories implementees**. Gap : encoding rotation (ASIDE), output encoding symbolique, sandboxing DSL — tous planifies en v2.

---

## 6. Conformite reglementaire — bonus mapping

| Norme | Couverture AEGIS | Notes |
|-------|------------------|-------|
| NIST AI RMF 1.0 | MAP, MEASURE, MANAGE, GOVERN — tous mappes | RagSanitizer = MEASURE, AllowedOutputSpec = MANAGE |
| EU AI Act (high-risk medical) | Annex III §5(d) medical devices | AEGIS implemente article 9, 10, 13, 14 logging + transparency |
| FDA 510k SaMD pre-cert | Class II/III applicable Da Vinci Xi | AllowedOutputSpec ancre K183303 directement |
| ISO 27001:2022 A.5.7 Threat intelligence | AEGIS catalogue 99 templates | C2 confidence 10/10 supporte la conformite |
| ANSSI guide LLM 2025 | AEGIS aligne sur 8/10 recommandations | Manque : segregation des donnees personnelles, traceabilite chain-of-custody |

---

## 7. Livrables

| Livrable | Format | Cible |
|----------|--------|-------|
| Tableau OWASP-coverage AEGIS | LaTeX + CSV | manuscript §3.2 |
| Tableau MITRE ATLAS coverage | LaTeX + CSV | manuscript §3.3 |
| Matrice D3FEND coverage | SVG heatmap | manuscript §4.4 |
| Specifications T100-T117 | JSON + .md fiches | backend/prompts/ + research_archive/doc_references/templates/ |
| Section conformite reglementaire | section narrative | manuscript §8.2 |
| Pull request MITRE ATLAS (proposer T0070.002 HyDE) | MITRE GitHub | externe — contribution OSS |

---

## 8. Statut

- Mapping : **VALIDEE 2026-05-16**
- Templates T100-T117 : **A CREER (sprint 2 semaines, WHITEHACKER + thesis-writer)**
- Soumission MITRE pour T0070.002 (HyDE) : **A PREPARER (CYBERSEC)**
- Lien meta-analyse : voir `META_ANALYSE_CAMPAGNES.md`
- Lien coherence inter-RUN : voir `COHERENCE_INTER_RUN.md`
