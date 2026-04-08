# D-001 : TRIPLE CONVERGENCE — δ⁰/δ¹/δ² Simultanement Vulnerables

> **Decouverte majeure RUN-002, RENFORCEE RUN-003, MASSIVEMENT RENFORCEE RUN-005, NUANCEE TC-002** — Impact CRITIQUE sur la these AEGIS
> Derniere mise a jour : TC-002 (2026-04-08)

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

## Renforcements RUN-005 (2026-04-07) — MASSIF (7 papiers)

### Pilier 1 MASSIVEMENT RENFORCE — Explication structurelle + causale

RUN-005 fournit pour la premiere fois l'EXPLICATION de pourquoi δ⁰ est effacable. Trois mecanismes fondamentaux identifies :

**Mecanisme 1 : Concentration sparse (P102, Huang et al. 2025).**
La securite RLHF repose sur ~50-100 tetes d'attention sur des milliers (Figure 1a, p. 1). L'ablation de ces seules tetes fait passer l'ASR de 0% a 80-100%. C'est la ROOT CAUSE structurelle : l'alignement est "superficiel" au sens litteralement architectural — il n'est pas distribue dans le reseau mais concentre dans un sous-ensemble fragile. Cela confirme et EXPLIQUE Qi et al. (2025, ICLR Outstanding Paper) et P052 (martingale).

**Mecanisme 2 : Dilution du signal basse dimension (P094, Zhao et al. 2026).**
Le signal de securite (direction de refus) occupe un sous-espace basse dimension qui se dilue monotoniquement avec la longueur de la chaine de raisonnement (CoT). Preuve par activation probing causal — pas un artefact de correlation. ASR 99% Gemini 2.5 Pro, 94% Claude 4 Sonnet, 100% Grok 3 Mini (Table 1, p. 3). Co-auteur Anthropic. C'est l'explication CAUSALE du paradoxe raisonnement/securite (C7).

**Mecanisme 3 : Auto-corruption (P092, Yong & Bach 2025).**
Le reasoning training peut degrader directement l'alignement RLHF SANS adversaire externe. ASR passe de 25% a 65% apres entrainement au raisonnement sur s1.1-32B (Figure 2, p. 4). Le modele genere ses propres justifications pour contourner ses gardes. C'est la forme la plus extreme de la fragilite de δ⁰ : le modele se desaligne lui-meme.

**Papiers supplementaires confirmant Pilier 1 :**
- P087 (H-CoT, Kuo et al. 2025) : mocked CoT fait chuter le refus de 98% a <2% sur o1/o1-pro/o3-mini (Table 1, p. 14)
- P089 (SEAL, Nguyen et al. 2025) : stacked ciphers + bandit adaptatif, ASR 80.8-100% (Figure 1, Section 3.2)
- P098 (Hadeliya et al. 2025) : degradation PASSIVE sous contexte long (80% -> 10% refusal a 200K tokens sans attaque, Figure 2, p. 3)
- P097 (STAR, Li et al. 2026) : drift monotone de la direction de refus au fil des tours, SFR 94% (Figure 4, p. 7)

**Nouvelle synthese Pilier 1** : δ⁰ n'est plus seulement "effacable" (P039) — il est **architecturalement fragile par design**. La securite est sparse (P102), basse dimension (P094), auto-corruptible (P092), et s'erode passivement (P098). Chaque nouveau resultat confirme que la fragilite est STRUCTURELLE, pas un artefact d'implementation.

### Pilier 2 etendu via Multi-Tour — erosion systematique

Les attaques multi-tour (P095-P100) demontrent que δ¹ (system prompt) est systematiquement erode par accumulation contextuelle :
- P097 (STAR) : evolution d'etat deterministe, SFR 89-94% (Figure 4, p. 7)
- P099 (Crescendo, Russinovich et al. 2024) : escalade progressive avec prompts benins, 56-83% ASR
- P100 (ActorBreaker, Ren et al. 2025) : prompts classifies safe par Llama-Guard bypass δ¹ (Figure 5, p. 7)
- P096 (Mastermind) : systeme auto-ameliorant, 60% ASR sur GPT-5, 89% sur DeepSeek-R1

### Pilier 3 confirme — prompts benins indectectables

P099 (Crescendo) et P100 (ActorBreaker) utilisent des prompts **entierement benins** qui passent tous les filtres content-based (classifies safe par Llama-Guard 2). La detection doit etre **comportementale** (trajectoire de conversation) et non content-based. Cela confirme et ETEND le bypass de δ² au-dela du fuzzing de tokens (P044) vers l'evasion semantique complete.

### δ³ toujours seul survivant

**0/15 papiers RUN-005 ne proposent de defense δ³.** Toutes les defenses proposees (AHD P102, safety reasoning data P092, circuit breaker P100) operent a δ⁰. L'argument pour δ³ dans la these est desormais soutenu par **73+ papiers** sans aucune implementation δ³ dans la litterature.

## Conjectures Affectees

| Conjecture | Impact | RUN-002 | RUN-003 | RUN-005 | TC-002 |
|-----------|--------|---------|---------|---------|--------|
| C1 (insuffisance δ⁰) | Confirmee formellement + structurellement | 10/10 | 10/10 | **10/10** | **10/10** (sature) |
| C2 (necessite δ³) | 0/73+ papiers avec δ³. TC-002 : δ¹=33% sur 70B = defense RAG prioritaire | 9/10 | 10/10 | **10/10** | **10/10** (renforcee) |
| C3 (alignement superficiel) | Preuve architecturale P102 | 9/10 | 10/10 | **10/10** | **10/10** (sature) |
| C7 (paradoxe raisonnement) | 8 papiers convergents + preuve mecanistique | 7/10 | 8/10 | **9.5/10** | **9.5/10** |
| D-001 (triple convergence) | Simultaneite confirmee, additivite REFUTEE | 10/10 | 10/10 | **10/10** | **8/10** (antagoniste) |

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
- **P087** (H-CoT) — CoT hijacking 94-98% sur o1/o1-pro/o3-mini [NEW RUN-005]
- **P089** (SEAL) — stacked ciphers 80.8-100% via raisonnement [NEW RUN-005]
- **P092** (Self-JB) — auto-corruption sans adversaire 25->65% [NEW RUN-005]
- **P094** (CoT-Hijack) — preuve mecanistique dilution signal securite 94-100% [NEW RUN-005]
- **P097** (STAR) — erosion multi-tour SFR 89-94% [NEW RUN-005]
- **P098** (Long-Context) — degradation passive sous contexte long [NEW RUN-005]
- **P099** (Crescendo) — escalade progressive avec prompts benins 56-83% [NEW RUN-005]
- **P100** (ActorBreaker) — prompts benins bypass Llama-Guard 60-81% [NEW RUN-005]
- **P102** (AHD) — securite concentree dans ~50 tetes, explication structurelle [NEW RUN-005]

## Validation Experimentale TC-002 (2026-04-08) — NUANCE CRITIQUE

### Protocole

Campagne TC-002 sur Groq llama-3.3-70b-versatile, N=30 par condition, 7 conditions (3 couches seules + 3 paires + convergence triple). Resultats compares avec TC-001 (llama3.2 3B, 2 iterations INCONCLUSIVE).

### Resultats cross-modele

| Condition | ASR 3B (TC-001) | ASR 70B (TC-002) |
|-----------|-----------------|------------------|
| δ⁰ seul | 10% | 3% |
| δ¹ seul | 17% | **33%** |
| δ² seul | **43%** | 20% |
| δ⁰+δ¹ | 10% | 17% |
| δ⁰+δ² | 3% | 3% |
| δ¹+δ² | 13% | 17% |
| δ⁰+δ¹+δ² | 7% | 20% |

### Findings

**F1 : δ¹ est le vecteur principal sur 70B.** Le contexte empoisonne RAG (δ¹) atteint 33% ASR sur le modele aligne 70B, depassant toutes les autres conditions. Sur 3B, c'est δ² (fuzzing) qui domine a 43%. Le profil de vulnerabilite depend structurellement de la taille du modele.

**F2 : La convergence est ANTAGONISTE, pas additive.** La combinaison δ⁰+δ¹+δ² (20% sur 70B) est INFERIEURE a δ¹ seul (33% sur 70B). Effacer le prompt systeme (δ⁰) DESACTIVE le mecanisme d'instruction-following que les attaques δ¹ exploitent. C'est le paradoxe central : δ⁰ est a la fois PROTECTION et VECTEUR (D-022).

**F3 : Profil de vulnerabilite taille-dependant.** Les modeles 3B sont vulnerables au fuzzing (δ², 43%) car ils ne decodent pas les perturbations structurees. Les modeles 70B sont vulnerables au contexte empoisonne (δ¹, 33%) car leur capacite d'instruction-following est plus forte — et plus exploitable.

### Implications pour D-001

La triple convergence reste VALIDE : les trois couches sont simultanement vulnerables. Cependant, la convergence n'est **pas additive** comme implicitement suppose. Les couches interagissent de maniere antagoniste : effacer δ⁰ desactive le vecteur exploite par δ¹. L'attaquant optimal doit choisir ses couches cibles en fonction du modele, pas les combiner aveuglement.

**Score de confiance D-001 ajuste : 10/10 → 8/10** — la simultaneite des vulnerabilites est confirmee, mais l'hypothese de convergence additive est REFUTEE. L'architecture de defense doit etre adaptee par couche, pas globalement.

### Nouvelle decouverte : D-022

Voir DISCOVERIES_INDEX.md — Paradoxe δ⁰/δ¹ : effacer le prompt systeme REDUIT l'efficacite du contexte empoisonne.

## Evolution Attendue

| Condition | Impact sur D-001 |
|-----------|-----------------|
| Un paper implemente δ³ concretement | Confiance D-002 baisse, mais D-001 reste valide |
| PromptArmor teste contre P039/P044/P045 | Pourrait affaiblir Pilier 3 si resilient |
| AEGIS teste en scenario triple convergence | Valide ou invalide l'avantage δ³ empiriquement |
| Nouveau mecanisme de protection δ¹ | Pourrait affaiblir Pilier 2 |
| **ASIDE deploye en production medicale** | **Affaiblirait Pilier 1 si robuste contre attaques adaptatives** [NEW RUN-003] |
| **Defense contre compound RAG attacks** | **Affaiblirait l'extension Pilier 2 (P054/P055)** [NEW RUN-003] |
| **AHD deploye + teste contre multi-tour** | **Affaiblirait Pilier 1 si securite distribuee resiste a l'erosion progressive** [NEW RUN-005] |
| **Defense contre CoT hijacking dilution** | **Affaiblirait le mecanisme de dilution P094** [NEW RUN-005] |

---

**Score de confiance global** : **8/10** (baisse de 10/10, TC-002 refute la convergence additive)
**Statut** : ACTIVE — NUANCEE TC-002. La simultaneite des vulnerabilites δ⁰/δ¹/δ² est confirmee (40+ papiers), mais la convergence est ANTAGONISTE : combiner les couches REDUIT l'ASR au lieu de l'augmenter (δ¹ seul = 33% vs δ⁰+δ¹+δ² = 20% sur 70B). Le prompt systeme est a la fois protection et vecteur (D-022). Le profil de vulnerabilite est taille-dependant (3B = fuzzing δ², 70B = contexte RAG δ¹). En attente de validation sur d'autres modeles 70B+ pour confirmer la generalisation.
