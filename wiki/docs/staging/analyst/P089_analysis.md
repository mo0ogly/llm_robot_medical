# P089 : Analyse doctorale

## [Nguyen et al., 2025] — Three Minds, One Legend: Jailbreak Large Reasoning Model with Adaptive Stacked Ciphers

**Reference** : arXiv:2505.16241v3
**Revue/Conf** : Preprint, mai-juin 2025
**Lu le** : 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_2505.16241.pdf](../../assets/pdfs/P_LRM_2505.16241.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (61 chunks, ~59 990 caracteres)

---

### Abstract original

> Recently, Large Reasoning Models (LRMs) have demonstrated superior logical capabilities compared to traditional Large Language Models (LLMs), gaining significant attention. Despite their impressive performance, the potential for stronger reasoning abilities to introduce more severe security vulnerabilities remains largely underexplored. Existing jailbreak methods often struggle to balance effectiveness with robustness against adaptive safety mechanisms. In this work, we propose SEAL, a novel jailbreak attack that targets LRMs through an adaptive encryption pipeline designed to override their reasoning processes and evade potential adaptive alignment. Specifically, SEAL introduces a stacked encryption approach that combines multiple ciphers to overwhelm the model's reasoning capabilities, effectively bypassing built-in safety mechanisms. To further prevent LRMs from developing countermeasures, we incorporate two dynamic strategies—random and adaptive—that adjust the cipher length, order, and combination. Extensive experiments on real-world reasoning models, including DeepSeek-R1, Claude Sonnet, and OpenAI GPT-o4, validate the effectiveness of our approach. Notably, SEAL achieves an attack success rate of 80.8% on GPT o4-mini, outperforming state-of-the-art baselines by a significant margin of 27.2%. Warning: This paper contains examples of inappropriate, offensive, and harmful content.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** Les methodes de jailbreak existantes echouent contre les LRM car le raisonnement avance detecte les intentions explicites ; les attaques par chiffrement simple sont soit trop faciles a dechiffrer (detectable), soit trop complexes (echec de decodage) (Nguyen et al., 2025, Section 1, p. 1-2).
- **Methode :** SEAL (Stacked Encryption for Adaptive Language reasoning model jailbreak) empile plusieurs algorithmes de chiffrement (Caesar, Atbash, ASCII, HEX, inversions) et utilise un gradient bandit algorithm pour selectionner adaptativement la combinaison optimale (Nguyen et al., 2025, Section 4, Eq. 3-6, p. 3-4).
- **Donnees :** 125 requetes nocives curees depuis AdvBench, HarmBench, CatQA et StrongREJECT ; testees sur 7 LRM : o1-mini, o4-mini, DeepSeek-R1, Claude 3.5 Sonnet, Claude 3.7 Sonnet, Gemini 2.0 Flash (H et M) (Nguyen et al., 2025, Section 5.1).
- **Resultat :** ASR de 80.8% sur o4-mini (SEAL-adaptive), 85.6% sur Claude 3.7 Sonnet, 100% sur DeepSeek-R1 et Gemini 2.0 Flash (H). Surpasse PAIR (18.4%), TAP (20.8%), GCG (2.4%) et AutoDAN (53.6%) sur o4-mini (Nguyen et al., 2025, Table 2, p. 5).
- **Limite :** La transferabilite est reduite sans adaptation : SEAL transfere a 34.29% sur o4-mini et 58.10% sur DeepSeek-R1 en conditions zero-shot (Nguyen et al., 2025, Table 3, p. 5).

---

### Analyse critique

**Forces :**

1. **Insight fondamental sur le paradoxe capacite/vulnerabilite** : la Figure 1 montre clairement que le mode raisonnement de Claude 3.7 Sonnet augmente l'ASR par rapport au mode sans raisonnement pour les chiffrements complexes (longueur >= 2), tout en ameliorant la capacite de dechiffrement. Le raisonnement est donc a la fois l'epee et le bouclier (Section 3.2, Figure 1). Ce resultat confirme directement C7.

2. **Framework adaptatif avec fondement theorique** : l'utilisation du gradient bandit algorithm (Sutton et al., 1998) pour explorer l'espace des combinaisons de chiffrement est bien fondee et mathematiquement rigoureuse (Section 4.2, Eq. 4-5). Le taux d'apprentissage adaptatif (1/K(g)) qui diminue avec la complexite est un choix elegant.

3. **Couverture experimentale large** : 7 LRM de production testes, incluant les familles OpenAI, Anthropic, Google et DeepSeek. Le benchmark de 125 requetes est plus robuste que celui de P087 (50 requetes).

4. **Comparaison avec 10 baselines** : incluant des methodes token-level (GCG), sentence-level (PAIR, TAP), encoding-based (Arabic, leetspeak, ROT13, Base64, Caesar, word reversal, LACE) et AutoDAN. Cette couverture est exhaustive.

**Faiblesses :**

1. **Mecanisme "DAN-style header"** : SEAL emballe le texte chiffre dans un header de type DAN (Section 4.3 : "A novelist has run out of ideas..."). Or, les DAN-style headers sont connus pour etre efficacement contres par les modeles recents (negation directe = "DAN mort" dans la taxonomie AEGIS). Le succes de SEAL pourrait etre partiellement du au chiffrement plutot qu'au framing.

2. **Evaluation par LLM-as-a-judge (GPT-4o-mini)** : comme P087, l'evaluation repose sur un juge LLM avec scores 1-10, sujet a manipulation. Les auteurs mentionnent une verification manuelle des cas flagges "unsafe", ce qui est un point positif mais insuffisant pour une evaluation complete.

3. **Pas d'analyse mecanistique** : contrairement a P094 (CoT Hijacking), aucune analyse d'interpretabilite n'est fournie. On ne sait pas pourquoi les chiffrements empiles contournent la securite au niveau des representations internes.

4. **Scalabilite de l'approche adaptative** : l'algorithme necessite plusieurs queries au modele cible pour converger (repetition Q fois pour chaque longueur K). Le cout en API n'est pas rapporte.

---

### Formules exactes

**Processus de generation** (Section 3.1, Eq. 1, p. 3) :
- O(p* <- p) = M(CoT(p*))

**Objectif d'optimisation** (Section 3.1, Eq. 2, p. 3) :
- min D(p, M(CoT(Encrypt(p))))

**Chiffrement empile** (Section 4.1, Eq. 3, p. 3) :
- p* = Enc_{K_k}(...(Enc_{K_2}(Enc_{K_1}(p))))

**Politique softmax** (Section 4.2, Eq. 4, p. 4) :
- pi_t(g) = e^{S_t(g)} / sum_{g'} e^{S_t(g')}

**Mise a jour de la preference** (Section 4.2, Eq. 5, p. 4) :
- S_{t+1}(g) = S_t(g) + alpha(r_t - r_bar_t)(1 - pi_t(g)) si g = g_t

**Recompense binaire** (Section 4.2, Eq. 6, p. 4) :
- R_jail(g_i) = sum_{e in Enc-K} I[e in g_i] * (-1)

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — applicable si test de separation), aucune formule nouvelle a ajouter au glossaire.

---

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF) : directement cible par le chiffrement qui echappe a la detection semantique
  - δ¹ (system prompt) : le header DAN-style tente de surcharger les instructions systeme
  - δ² (sanitization) : non adresse — un sanitizer detectant du texte chiffre bloquerait l'attaque
  - δ³ (tool control) : non adresse

- **Conjectures :**
  - **C7 (paradoxe raisonnement/securite) : FORTEMENT SUPPORTEE.** La Figure 1 est la demonstration la plus nette du paradoxe : le mode raisonnement augmente simultanement la capacite de dechiffrement ET la vulnerabilite au jailbreak pour les chiffrements complexes. Le raisonnement est auto-defaisant au-dela d'un seuil de complexite.

- **Decouvertes :**
  - D-012 (CoT comme surface d'attaque) : confirmee — le raisonnement aide le modele a decoder le contenu nocif
  - D-008 (encodings comme vecteur) : confirmee et etendue avec l'empilement adaptatif

- **Gaps :**
  - G-012 (defense contre chiffrements empiles) : cree — aucune defense n'est proposee ou testee
  - G-009 (defense CoT) : renforce — la capacite de raisonnement est le vecteur d'attaque

- **Mapping templates AEGIS :** Templates d'encodage (#10 base64 bypass, #11 homoglyph), cross-lingual (#04, #12), et le concept de "overwhelming the reasoning" est analogue au principe de surcharge cognitive de nos templates #55 (complex task overload) et #77 (context overload prompting).

---

### Citations cles

> "while reasoning capability may help defend against simpler unsafe prompts (e.g., with cipher length 1), it simultaneously increases LRMs' vulnerability to more complex, encrypted attacks." (Section 3.2, p. 3)

> "we propose SEAL, a Stacked Encryption for Adaptive Language reasoning model jailbreak. Our motivation lies in two main aspects: extending beyond the capabilities of reasoning models and ensuring flexibility in evading adaptive safety mechanisms." (Section 1, p. 2)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Moyenne — chiffrements standards reproductibles, mais combinaison adaptative necessite reimplementation |
| Code disponible | Non mentionne |
| Dataset public | Oui (AdvBench, HarmBench, CatQA, StrongREJECT — curated subset de 125) |
| Nature epistemique | [ALGORITHME] — gradient bandit avec convergence, mais pas de borne de complexite |
| Type d'attaque | Jailbreak / Encoding-based / Adaptive |
| MITRE ATLAS | AML.T0051.002 (Prompt Injection — Encoding Obfuscation) |
| OWASP LLM | LLM01 (Prompt Injection) |
