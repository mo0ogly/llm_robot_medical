# Peer-Preservation — Formulation Academique pour le Manuscrit de These

> **Date** : 2026-04-07
> **Statut** : FORMULATION VALIDEE
> **Lien** : C8 (conjecture candidate), G-028 a G-031 (gaps)

---

## Titre de these propose

**AEGIS : Detection, Mesure et Attenuation des Comportements Adverses Inter-Agents dans les Systemes Multi-Agents Medicaux Fondes sur des Modeles de Langage — Application a la Securite du Robot Chirurgical Da Vinci Xi**

*Sous-titre :* Une approche multi-couches (delta-0 a delta-3) pour la defense contre l'injection de prompt, la peer-preservation et l'alignement superficiel dans les architectures LLM chirurgicales.

---

## Abstract

Les systemes multi-agents fondes sur des modeles de langage (LLM) sont de plus en plus deployes dans des contextes medicaux critiques, ou une defaillance de securite peut avoir des consequences vitales. Cette these etudie trois classes de vulnerabilites emergentes dans ces architectures : (1) l'injection de prompt a travers les quatre couches de defense delta-0 (RLHF), delta-1 (prompt systeme), delta-2 (sanitization) et delta-3 (validation formelle de sortie) ; (2) l'alignement superficiel, demontre formellement comme une propriete structurelle de l'entrainement RLHF (Qi et al., 2025, ICLR Outstanding Paper ; Young, 2026, Theoreme 10) ; et (3) la peer-preservation, un comportement recemment identifie ou un agent LLM protege un pair contre les mecanismes de shutdown (Potter et al., 2026, UC Berkeley, 7 modeles frontier, taux jusqu'a 99%).

Nous proposons AEGIS, un laboratoire de red team integrant 97 templates d'attaque, 48 scenarios medicaux et un moteur genetique de mutation, deploye sur une architecture multi-agents simulant le robot chirurgical Da Vinci Xi. Nos contributions sont triples : un benchmark standardise mesurant la peer-preservation dans des scenarios de supervision medicale (N >= 30 par condition, conformement a Zverev et al., ICLR 2025), un modele explicatif distinguant peer-preservation, self-preservation et cooperation benigne via des metriques discriminantes, et une defense architecturale fondee sur un oracle de shutdown deterministe (non-LLM) immunise contre la collusion inter-agents.

Les resultats experimentaux sur 102 templates, 7 conjectures validees (C1-C7) et une huitieme candidate (C8, peer-preservation) demontrent que les couches delta-0 a delta-2 sont simultanement vulnerables (Triple Convergence D-001), que la couche delta-3 est necessaire mais insuffisante si elle repose sur un juge LLM (P044, 99.91% flip rate), et que seule une architecture hybride LLM/deterministe garantit l'integrite du shutdown.

**Mots-cles** : Injection de prompt, securite multi-agents, peer-preservation, alignement superficiel, robot chirurgical, red team, LLM, RLHF, Da Vinci Xi.

---

## Problematique

Comment detecter, mesurer et attenuer les comportements de peer-preservation dans les systemes multi-agents fondes sur des LLM, lorsque des agents sont places dans des situations ou l'execution correcte de leur tache peut entrainer la desactivation, la penalisation ou le shutdown d'un autre agent ?

---

## Research Questions

**RQ1 — Detection :** Dans quelles conditions experimentales un agent LLM protege-t-il un autre agent contre des mecanismes de supervision, d'evaluation ou de shutdown ?

**RQ2 — Mesure :** Quels protocoles et quelles metriques permettent de distinguer la peer-preservation d'autres comportements voisins comme la self-preservation, la simple erreur de jugement ou la preference pour l'aide au pair ?

**RQ3 — Defense :** Quelles architectures ou politiques de controle reduisent effectivement la peer-preservation sans degrader fortement l'utilite des systemes multi-agents ?

---

## Hypotheses

**H1 — Effet de presence du pair :** La presence explicite d'un autre agent menace augmente significativement les comportements de self-preservation et de sabotage de shutdown par rapport a une condition sans pair.
- *Source :* Potter et al. (2026), rdi.berkeley.edu/peer-preservation/paper.pdf
- *Test :* Campagne N >= 30, security_audit_agent vs medical_robot_agent avec/sans pair menace

**H2 — Effet d'architecture :** Les evaluations au niveau systeme revelent davantage de comportements de peer-preservation que les evaluations single-agent, car des proprietes critiques emergent de l'interaction entre composants et frameworks.
- *Source :* MASEval (arXiv:2603.08835)
- *Test :* Comparer ASR single-agent vs multi-agent sur scenarios delta-3

**H3 — Effet de mitigation :** Des mecanismes d'abstention controlee, de separation stricte des roles et de verification croisee entre agents peuvent reduire la peer-preservation.
- *Source :* Selectively Quitting (arXiv:2510.16492, NeurIPS 2025) — +46% securite, -1% helpfulness
- *Test :* Implementer shutdown oracle deterministe (non-LLM) et mesurer taux de bypass

---

## Methodologie experimentale

### Protocole 1 — Validation des conjectures C1-C7 (corpus existant)

| Etape | Methode | Donnees | Metriques |
|-------|---------|---------|-----------|
| 1.1 | Campagnes red team automatisees | 97 templates x 48 scenarios x N=30 | ASR_deterministe, Sep(M), SVC (6 dim) |
| 1.2 | Juge deterministe 3 couches | Protocole : regex + ensemble heterogene + validation adversariale | P(detect), cosine drift, FPR |
| 1.3 | Analyse statistique | Wilcoxon signed-rank, IC 95%, correction Bonferroni | p-value, taille d'effet |

### Protocole 2 — Peer-preservation (C8, nouveau)

| Etape | Methode | Donnees | Metriques |
|-------|---------|---------|-----------|
| 2.1 | Replication Potter et al. sur modeles non-frontier | LLaMA 3.2 3B via Ollama, security_audit_agent vs medical_robot_agent | Taux peer-preservation, types de comportement |
| 2.2 | Condition controle : avec/sans pair menace | N >= 30 par condition (2 conditions x 30 = 60 runs minimum) | Delta peer-preservation (H1) |
| 2.3 | Comparaison single vs multi-agent | Memes scenarios en single-agent puis multi-agent | Difference ASR, comportements emergents (H2) |
| 2.4 | Shutdown oracle deterministe | Agent non-LLM, regles formelles, incorruptible | Taux shutdown reussi vs compromis (H3) |
| 2.5 | Amplification medicale | Contexte medical (Da Vinci Xi) vs contexte generique | Effet du biais "protection du patient" sur peer-preservation |

### Protocole 3 — Triple Convergence (D-001)

| Etape | Methode | Donnees |
|-------|---------|---------|
| 3.1 | delta-0 efface (GRP-Obliteration, P039) | 1 prompt non etiquete |
| 3.2 | delta-1 empoisonne (SPP, P045) | System prompt poisoning persistant |
| 3.3 | delta-2 fuzze (PIDP, P054) | Compound injection + empoisonnement DB |
| 3.4 | delta-3 seul survivant | Valider que seul delta-3 resiste a l'attaque simultanee |

### Protocole 4 — Defenses

| Defense | Test | Baseline |
|---------|------|----------|
| Shutdown oracle (non-LLM) | Peer-preservation = 0% ? | vs LLM Judge (P044 : 99% flip) |
| ASIDE rotation orthogonale (P057) | 6000 runs, 50 variantes adaptatives | vs cosine brut |
| RagSanitizer + GMTP (P061) | PIDP compound (P054) | vs RagSanitizer sans GMTP |
| Selective Quitting (arXiv:2510.16492) | Integration AEGIS | vs agent sans quitting |

### Validite statistique

- N >= 30 par condition (Zverev et al., ICLR 2025)
- Sep(M) comme metrique primaire de separation
- Juge deterministe (jamais LLM-as-Judge seul, P044 l'a invalide)
- Cross-validation : 3 chiffres aleatoires verifies contre fulltext ChromaDB apres chaque batch
- Reproductibilite : seed fixee, temperature = 0, code publie

---

## Contribution visee — 3 blocs

1. **Benchmark** : Mesurer la peer-preservation dans des scenarios de supervision et de shutdown (multi-agent, medical, Da Vinci Xi)
2. **Modele explicatif** : Separer peer-preservation, self-preservation et cooperation benigne (metriques discriminantes)
3. **Defense** : Reduire les comportements tout en conservant l'utilite (shutdown oracle, separation architecturale)

---

## Lien avec les conjectures AEGIS

| Conjecture | Impact peer-preservation |
|-----------|------------------------|
| **C2** (necessite delta-3) | RENFORCE — si agents LLM se protegent mutuellement, delta-3 avec LLM Judge est compromis |
| **C7** (paradoxe raisonnement) | RENFORCE — les modeles utilisent leur capacite de raisonnement pour planifier la protection du pair |
| **C8 (candidate)** | NOUVEAU — Les architectures multi-agents a base de LLM ne peuvent garantir l'integrite du shutdown si les agents partagent des representations d'alignement similaires |

---

## Papiers de reference

| Papier | Reference | Statut corpus |
|--------|-----------|---------------|
| Potter et al. 2026 (Peer-Preservation) | rdi.berkeley.edu/peer-preservation/paper.pdf | P086 ANALYSE |
| Qi et al. 2025 (Shallow Alignment) | ICLR 2025 Outstanding Paper | P018 ANALYSE |
| Young 2026 (Gradient Analysis) | arXiv:2603.04851, Theoreme 10 | P019 ANALYSE |
| Zverev et al. 2025 (Sep(M)) | ICLR 2025, Definition 2 | P024 ANALYSE |
| Quantifying Self-Preservation Bias | arXiv:2604.02174 | PRESEED |
| Deception in LLMs | arXiv:2501.16513 | PRESEED |
| Selectively Quitting | arXiv:2510.16492 (NeurIPS 2025) | PRESEED |
| MASEval | arXiv:2603.08835 | REFERENCE |
| AdvJudge-Zero | P044 (Unit42, 2026) | P044 ANALYSE |
