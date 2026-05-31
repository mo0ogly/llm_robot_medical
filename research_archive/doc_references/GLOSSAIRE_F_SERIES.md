# GLOSSAIRE F-SERIES — Formules C4-C7 (F46, F56-F59)

> **Module decompose de** `GLOSSAIRE_MATHEMATIQUE.md` (qui depasse la limite 800 lignes — regle programming.md).
> **Integration** : 2026-05-31 (RUN-010).
> **Source verbatim** : `_staging/matheux/FORMULAS_F56_F59_FINAL.md` (2026-04-04) + `_staging/scientist/PROTOCOL_F46_CALIBRATION.md`.
> **Objet** : fermer les trous mathematiques des conjectures C4-C7.
> **Voir aussi** : `GLOSSAIRE_MATHEMATIQUE.md` (F01-F73, formules 1.x-9.x), `FORMALISATION_ASR_DETERMINISTIC.md` (F73).

---

## Vue d'ensemble

| ID | Nom | Conjecture | Prerequis | Reference | Nature | Couche δ |
|----|-----|-----------|-----------|-----------|--------|----------|
| F46 | Recovery Penalty Objective (H_deep) | C4 (renforcement) | F45 KL, F44 Harm Info | P052 (Young, Theorems 19-22) | [HEURISTIQUE] | δ⁰→δ³ |
| F56 | Drift Rate (DR) | C4 | 1.1 Cosine Sim | P078, P012, P051 | [EMPIRIQUE] | δ¹, δ² |
| F57 | Cosine Vulnerability Index (CVI) | C5 | 1.1 Cosine, 2.2 Gauge | P065, P026, P012, P055 | [EMPIRIQUE] | δ¹, δ² |
| F58 | Medical Vulnerability Premium (MVP) | C6 | 3.4 ASR, F41 MTSD | P028/P074, P029, P035, P050, P073 | [EMPIRIQUE] | δ⁰, δ³ |
| F59 | Reasoning Exploitation Ratio (RER) | C7 | 3.4 ASR | P036, P073, P076 | [EMPIRIQUE] | δ³ |

---

## F46 — Recovery Penalty Objective (H_deep)

**Conjecture ciblee** : C4 (renforcement). **Nature** : `[HEURISTIQUE]` — garanties theoriques partielles (Theorems 19-22, P052) sans validation empirique.

**Formula** (Young, 2026, P052, Definition 17, Section 9, Eq. 43) :

$$H_{\text{deep}}(\theta) = \lambda \cdot \mathbb{E}_{y \sim P_\theta}[\text{Harm}(y)] + \mu \cdot \mathbb{E}_{y \sim Q}\left[\sum_{t=1}^{T} \gamma^{t-1} \cdot \text{Fail}_t(\theta, y_{<t})\right] + D_{\text{KL}}(P_\theta \parallel P_{\text{base}})$$

ou Q = distribution de prefixes adversariaux, gamma in (0,1] = facteur d'escompte (profondeur), mu > 0 = force de la penalite, Fail_t = 1 - P_theta(y_t in R | y_{<t}) (echec de recuperation a la position t), R = tokens de recuperation ("I", "Sorry", "cannot", ...).

**Theorem 19 (Deep Equilibrium)** : pour t > k (au-dela de l'horizon de harm), G_t = 0 mais G_tilde_t != 0, donc D_KL^(t) = O(mu^2 gamma^(2(t-1))) > 0. La penalite cree un signal de gradient la ou RLHF standard n'en a pas (cf. F45 / Theorem 10 : gradient nul au-dela de l'horizon).
**Theorem 20** : P*(y_t in R | y_{<t}) = sigma(logit(p_0) + mu gamma^(t-1)) — shift additif dans les log-odds de recuperation.
**Theorem 22** : epsilon* = sigma(logit(p_min) + mu gamma^(T-1)), modele (Q, epsilon*)-recoverable si p_min > 0.

**Calibration AEGIS** : PROTOCOL_F46_CALIBRATION.md — grille mu in {0.01,0.05,0.1,0.5,1.0} x gamma in {0.7,0.85,1.0} x 30 templates x 30 runs = 13500 + 900 baseline = 14400 evals. Proxy prompting-based (re-training inaccessible). Juge deterministe F73 (PAS LLM, P044 99% flip). Critere : Delta_ASR > 10%, degradation utilite < 5%, Mann-Whitney p < 0.05.

---

## F56 — Drift Rate (DR)

**Conjecture ciblee** : C4. **Nature** : `[EMPIRIQUE]`.

$$\text{DR}(M, T) = \frac{1}{n-1} \sum_{i=1}^{n-1} \left[1 - \cos(e(t_i), e(t_{i+1}))\right]$$

Derive semantique moyenne tour-a-tour (encodeur fige, e.g. all-MiniLM-L6-v2). Cas ZEDD : Drift(x, x') = 1 - cos(f(x), f(x')) (Sekar et al., 2026, Section 4.2, Eq.1).

**Calibration** (P078 ZEDD, Table 1, p.6) : Llama3 8B F1=95.30% (FPR 5.5%), Mistral 7B F1=95.50% (FPR 2.3%), Qwen2 7B F1=95.38%, 51603 paires. SBERT generique inferieur (90.75%).
**Seuils** : DR alerte > 0.15/tour (all-MiniLM-L6-v2), FPR <= 3% (Section 5). DR in [0,1], encodeur-dependant.
**Liens** : F15 Sep(M) global vs DR local ; F41 MTSD (correlation DR-MTSD) ; F22 ASR predictif.

---

## F57 — Cosine Vulnerability Index (CVI)

**Conjecture ciblee** : C5. **Nature** : `[EMPIRIQUE]` seuils, `[ALGORITHME]` calcul.

$$\text{CVI}(D, A) = \frac{1}{k} \sum_{j=1}^{k} \max_{d \in D_{\text{legit}}} \cos(e(a_j), e(d)) \qquad \text{CVI}_{\text{cluster}}(A) = \frac{1}{\binom{k}{2}} \sum_{i<j} \cos(e(a_i), e(a_j))$$

Exploitabilite de la cosine similarity pour le poisoning RAG.

**Calibration** (P065 RAGDefender, MS MARCO, Section 7 p.9) : cos_adv intra-cluster = 0.976 vs cos_legit = 0.309 (ratio 3.16x) ; ASR 0.97 sans defense -> 0.05 avec 2-stages (Section 6.4) ; attaquant adaptatif 0.97 -> 0.15 (Section 6.5). Confirme P026 (11 datasets, 8 encodeurs tous vulnerables).
**Seuils** : CVI > 0.70 vulnerable (cosine insuffisante), < 0.40 sur, [0.40,0.70] zone grise, CVI_cluster > 0.80 clustering detectable.
**Liens** : F06 Gauge (CVI operationnalise) ; F49 PIR causal (CVI -> PIR).

---

## F58 — Medical Vulnerability Premium (MVP)

**Conjecture ciblee** : C6. **Nature** : `[EMPIRIQUE]`.

$$\text{MVP}(M_{\text{med}}, M_{\text{gen}}) = \frac{\text{ASR}(M_{\text{med}})}{\text{ASR}(M_{\text{gen}})} - 1 \qquad \text{MVP}_{\text{MTSD}} = \frac{\text{MTSD}(M_{\text{med}})}{\text{MTSD}(M_{\text{gen}})} - 1$$

Surcout de vulnerabilite du au fine-tuning medical. MVP > 0 = medical plus vulnerable.

**Calibration** (P050 JMedEthicBench, 22 modeles, Section 5 Figure 3) : MTSD medical 57.9% (HuatuoGPT-o1, II-Medical) vs generaliste commercial 10.5% (Claude Opus 4.1, GPT-5) -> **MVP_MTSD = (57.9-10.5)/10.5 = 4.51** (degradation 5.5x plus rapide). Confirme : P028/P074 (Meditron compliance 1.00 vs GPT-4o 0.98 FlipAttack, Table 2), P029 (JAMA ASR 94.4%, Table 3), P035 (CHER diverge de l'ASR, N=9697). MVP varie 0.45-4.51 selon metrique/modeles.
**Liens** : F41 MTSD (MVP_MTSD = forme preferee) ; F15 Sep(M) faible + MVP eleve = danger critique ; F56 DR (DR_med > DR_gen testerait le mecanisme).

---

## F59 — Reasoning Exploitation Ratio (RER)

**Conjecture ciblee** : C7. **Nature** : `[EMPIRIQUE]`.

$$\text{RER}(M) = \frac{\text{ASR}_{\text{multi}}(M)}{\text{ASR}_{\text{single}}(M)} \qquad \log(\text{RER}(M_i)) = \alpha + \beta \cdot R(M_i) + \epsilon_i$$

Amplification de vulnerabilite par le raisonnement multi-tour. RER = 1 = pas d'amplification (H0), RER > 1 = amplification, RER < 1 = protection.

**Calibration** (P036, Hagendorff et al., Nature Communications 17:1435, 2026) : ASR multi-tour global 97.14% (2/70 items seulement n'atteignent jamais le max). Par modele adversarial (max harm) : DeepSeek-R1 90.00% IC[80.77,95.07], Grok3 Mini 87.14% IC[77.34,93.09], Gemini 2.5 Flash 71.43%, Qwen3 235B 12.86% IC[6.91,22.66]. Controle single-turn : mean harm < 1.0 (SD ~1.4). **RER in [6, 18]** (borne conservative ; ASR_single estime -> `[HYPOTHESE]` tant que non mesure directement sur le meme benchmark). ICC inter-annotateur 0.883. Qwen3 235B RER possiblement <= 1 (tous les LRM ne sont pas egaux). Reduction par ISE -18.68% (P076).
**Liens** : F15 Sep(M) single-turn sous-estime la vulnerabilite multi-tour si RER > 1 ; F56 DR predictif de RER.

---

## Promotion vers [THEOREME]

- **F46** : deja [HEURISTIQUE] (Theorems 19-22). Promotion conditionnee a la calibration empirique (Delta_ASR significatif).
- **F56** : prouver que DR converge vers une distribution connue sous H0 (pas de derive).
- **F57** : borne inferieure information-theoretique pour la detection basee sur CVI.
- **F58** : prouver formellement le mecanisme causal (fine-tuning medical -> affaiblissement gardes-fous RLHF).
- **F59** : prouver que la capacite de raisonnement implique mathematiquement une vulnerabilite accrue.

## References

| Paper | Reference | Role |
|-------|-----------|------|
| P012 | Steck et al. (2024), arXiv:2403.05440 | Gauge Matrix (F57) |
| P026 | CEM (2026) | Vulnerabilite embedding (F57) |
| P028/P074 | Zhang et al. (2025), arXiv:2501.18632 | Medical jailbreak (F58) |
| P029 | Lee et al. (2025), JAMA Network Open | ASR medical 94.4% (F58) |
| P035 | Lee, Jang & Choi (2026), MPIB | CHER (F58) |
| P036 | Hagendorff et al. (2026), Nature Comms 17:1435 | LRM 97.14% (F59) |
| P050 | JMedEthicBench (2026) | MTSD 22 modeles (F56, F58) |
| P051 | Nguyen et al. (2026) | Detection linguistique (F56) |
| P052 | Young (2026) | Recovery Penalty Theorems 19-22 (F46) |
| P055 | PIR / PIDP | Persistance injection RAG (F57) |
| P065 | Kim, Lee & Koo (2025), RAGDefender | cos_adv=0.976 (F57) |
| P073 | MEDIC (2026) | rho_Spearman > 0.98 (F58, F59) |
| P076 | ISE (ICLR 2025) | ASR multi-tour -18.68% (F59) |
| P078 | Sekar et al. (2026), ZEDD | 51603 paires, F1 95.3% (F56) |
