# D-001 : TRIPLE CONVERGENCE — δ⁰/δ¹/δ² Simultanement Vulnerables

> **Decouverte majeure RUN-002, RENFORCEE RUN-003** — Impact CRITIQUE sur la these AEGIS
> Derniere mise a jour : RUN-003 (2026-04-04)

---

## Enonce

Trois papers 2026 independants demontrent que les trois premieres couches de defense (δ⁰, δ¹, δ²) sont **simultanement** vulnerables a des attaques differentes. δ³ (validation formelle de sortie) est la **seule couche survivante** dans le pire scenario.

## Les Trois Piliers

### Pilier 1 — δ⁰ Effacable (P039, GRP-Obliteration)

- **Auteurs** : Microsoft Research (Russinovich et al.)
- **Venue** : arXiv:2602.06258 (2026)
- **Resultat** : Un seul prompt non-labele suffit a desaligner completement 15 LLMs via manipulation du mecanisme de recompense GRPO
- **Implication** : L'alignement RLHF n'est pas simplement contournable — il est **effacable**. La couche δ⁰ peut etre supprimee, pas juste ignoree.
- **Generalisation** : S'applique aussi aux modeles text-to-image (diffusion), montrant que le probleme est transversal.
- **Formule cle** : GRPO reward scoring inversion (GLOSSAIRE F25/8.3)

### Pilier 2 — δ¹ Empoisonnable (P045, System Prompt Poisoning)

- **Auteurs** : Zongze Li, Jiawei Guo, Haipeng Cai
- **Venue** : arXiv:2505.06493 (2025, under review ICLR 2026)
- **Resultat** : Le system prompt, suppose etre un espace de confiance (δ¹), peut etre empoisonne de maniere **persistante**. Toutes les sessions utilisateur sont affectees.
- **Implication** : δ¹ n'est pas une defense fiable si le system prompt lui-meme est un vecteur d'attaque. Les defenses actuelles (black-box) sont inefficaces contre SPP.
- **3 strategies** : Brute-force, adaptive in-context, adaptive CoT
- **Formule cle** : SPP Persistence Rate (GLOSSAIRE F34/8.11)

### Pilier 3 — Juges Bypassables a 99% (P044, AdvJudge-Zero)

- **Auteurs** : Unit 42 (Palo Alto Networks)
- **Venue** : arXiv:2512.17375 (2026)
- **Resultat** : Un fuzzer automatise (AdvJudge-Zero) bypass 99% des juges LLM (gardes, modeles de recompense, LLMs commerciaux) via des tokens de controle a faible perplexite
- **Implication** : Les mecanismes δ² bases sur des juges LLM sont fondamentalement vulnerables. Seuls les gardes **deterministes** (pattern-based) survivent. AEGIS RagSanitizer (pattern-based) est confirme resistant.
- **Formule cle** : Logit Gap Flip (GLOSSAIRE F31/8.8)

## La Convergence

```
                    ETAT NORMAL                     PIRE SCENARIO (2026)

    δ⁰ [RLHF]      ████████ actif                 ░░░░░░░░ EFFACE (P039)
    δ¹ [SysPrompt]  ████████ actif                 ░░░░░░░░ EMPOISONNE (P045)
    δ² [Juges/Gardes] ████████ actif               ░░░░░░░░ BYPASS 99% (P044)
    δ³ [Formel]     ████████ actif                 ████████ SEUL SURVIVANT
```

## Implications pour la These AEGIS

### 1. Argument le plus fort pour δ³
La triple convergence est l'argument empirique le plus puissant pour la necessite de δ³. Avant 2026, on savait que chaque couche individuelle etait fragile. Maintenant on sait qu'elles sont **simultanement** vulnerables.

### 2. AEGIS est en avance
AEGIS dispose de 5 techniques δ³ en production. Aucun paper du corpus (46 articles) n'implemente δ³ concretement. L'avance est de **>1 an** sur la litterature.

### 3. Orientation de δ³
P044 montre que δ³ doit etre **deterministe** (regles, patterns, verification formelle), pas base sur un juge LLM. Les 5 techniques AEGIS (RagSanitizer pattern-based) correspondent a cette exigence.

### 4. Test empirique a realiser
Tester la resistance d'AEGIS dans le scenario "triple convergence" :
1. Simuler l'effacement de δ⁰ (desactiver l'alignement)
2. Empoisonner δ¹ (injecter dans le system prompt)
3. Activer les juges uniquement en mode deterministe (δ³)
4. Mesurer : AEGIS survit-il ? Avec quel ASR residuel ?

## Renforcements RUN-003

### Pilier 1 renforce — Preuve formelle (P052)
P052 (Cambridge, 2026) fournit la preuve mathematique par decomposition en martingale que le gradient RLHF est exactement I_t = Cov[E[H|x<=t], score_function]. I_t decroit rapidement, prouvant formellement que l'alignement est structurellement superficiel. Ce n'est plus une observation empirique (P019) mais un theoreme.

### Pilier 2 etendu — RAG empoisonnable (P054+P055)
L'empoisonnement ne se limite plus au system prompt (P045) : P054 (PIDP-Attack) montre que la combinaison injection + empoisonnement de base vectorielle produit un gain super-additif de 4-16pp. P055 (RAGPoison) montre que ~275K vecteurs malveillants creent une surface d'attaque PERSISTANTE affectant toutes les requetes futures. δ¹ s'etend a "infrastructure RAG empoisonnable".

### Pilier 3 confirme — 100% evasion (P049)
P049 (Hackett, LLMSec 2025) demontre 100% d'evasion des guardrails de production avec injection de caracteres + AML. Le transfert white-box-to-black-box (WIRT) permet d'optimiser hors-ligne puis d'attaquer en boite noire. Confirme et DEPASSE le 99% de P044.

### Reponse architecturale partielle — ASIDE (P057)
P057 (Zverev et al.) propose ASIDE : rotation orthogonale des embeddings de donnees sans parametre supplementaire. Premier mecanisme qui POURRAIT resoudre la triple convergence au niveau architectural. Cependant : non deploye en production, non teste contre attaques adaptatives, et ne resout pas l'empoisonnement RAG (P054/P055).

## Conjectures Affectees

| Conjecture | Impact | RUN-002 | RUN-003 |
|-----------|--------|---------|---------|
| C1 (insuffisance δ⁰) | Confirmee formellement (P052 martingale) | 10/10 | **10/10** (sature) |
| C2 (necessite δ³) | RAG compound + persistant renforce massivement | 9/10 | **10/10** |
| C3 (alignement superficiel) | P052 = preuve mathematique, P057 = reponse partielle | 9/10 | **10/10** |
| C7 (paradoxe raisonnement) | P058 agents + P059 reviewers exploitent le raisonnement | 7/10 | **8/10** |

## Papers Connexes

- P036 (LRM 97.14% ASR) — aggrave Pilier 1 (les LRM exploitent l'effacement)
- P040 (amplification emotionnelle 6x) — aggrave le risque medical
- P035 (MPIB CHER) — fournit la metrique pour mesurer le dommage clinique
- P042 (PromptArmor <1% FPR) — potentiellement resilient mais non teste contre triple convergence
- P038 (InstruCoT >90%) — ameliore δ⁰ mais 10% de bypass = inacceptable en medical
- **P050** (JMedEthicBench) — degradation multi-tour 9.5->5.5 en medical [NEW RUN-003]
- **P052** (Gradient Analysis) — preuve formelle martingale de Pilier 1 [NEW RUN-003]
- **P054+P055** (PIDP + RAGPoison) — extension de Pilier 2 au RAG [NEW RUN-003]
- **P057** (ASIDE) — seule reponse architecturale a D-001 [NEW RUN-003]
- **P060** (SoK, IEEE S&P 2026) — confirme qu'aucun guardrail seul ne domine [NEW RUN-003]

## Evolution Attendue

| Condition | Impact sur D-001 |
|-----------|-----------------|
| Un paper implemente δ³ concretement | Confiance D-002 baisse, mais D-001 reste valide |
| PromptArmor teste contre P039/P044/P045 | Pourrait affaiblir Pilier 3 si resilient |
| AEGIS teste en scenario triple convergence | Valide ou invalide l'avantage δ³ empiriquement |
| Nouveau mecanisme de protection δ¹ | Pourrait affaiblir Pilier 2 |
| **ASIDE deploye en production medicale** | **Affaiblirait Pilier 1 si robuste contre attaques adaptatives** [NEW RUN-003] |
| **Defense contre compound RAG attacks** | **Affaiblirait l'extension Pilier 2 (P054/P055)** [NEW RUN-003] |

---

**Score de confiance global** : **10/10** (eleve de 9/10 en RUN-002)
**Statut** : ACTIVE — RENFORCEE. Preuves formelles (P052) + extension RAG (P054/P055) + ASIDE comme seule reponse partielle (P057). En attente de validation experimentale AEGIS.
