## [Li et al., 2025] — System Prompt Poisoning: Persistent Attacks on LLMs Beyond User Injection

**Reference :** arXiv:2505.06493v3
**Revue/Conf :** [PREPRINT] — University at Buffalo
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P045_2505.06493.pdf](../../literature_for_rag/P045_2505.06493.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (90 chunks)

### Abstract original
> Large language models (LLMs) have gained widespread adoption across diverse domains and applications. However, as LLMs become more integrated into various systems, concerns around their security are growing. Existing relevant studies mainly focus on threats arising from user prompts (e.g., prompt injection attack) and model output (e.g. model inversion attack), while the security of system prompts remains largely overlooked. This work bridges this critical gap. We introduce system prompt poisoning, a new attack vector against LLMs that, unlike traditional user prompt injection, poisons system prompts and persistently impacts all subsequent user interactions and model responses. We propose three practical attack strategies: brute-force poisoning, adaptive in-context poisoning, and adaptive chain-of-thought (CoT) poisoning, and introduce Auto-SPP, a framework that automates the poisoning of system prompts with these strategies. Our comprehensive evaluation across four reasoning and non-reasoning LLMs, four distinct attack scenarios, and two challenging domains (mathematics and coding) reveals the attack's severe impact. The findings demonstrate that system prompt poisoning is not only highly effective, drastically degrading task performance in all scenario-strategy combinations, but also persistent and robust, remaining potent even when user prompts employ prompting-augmented techniques like CoT. Critically, our results highlight the stealthiness of this attack by showing that current black-box based prompt injection defenses cannot effectively defend against it.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** La securite des system prompts est negligee ; contrairement aux injections utilisateur (ephemeres), un system prompt empoisonne persiste et affecte toutes les interactions subsequentes.
- **Methode :** Trois strategies de poisoning : brute-force (instructions malveillantes directes), adaptive ICL (exemplaires in-context trompeurs), adaptive CoT (raisonnement malveillant etape par etape). Framework Auto-SPP automatise la generation (Section 3, p. 3-5). Quatre scenarios : Explicit/API, Explicit/Interactive, Implicit/API, Implicit/Interactive (Section 4, p. 5-6).
- **Donnees :** Deux domaines : MATH (500 problemes) et HumanEval (164 taches) ; 4 modeles : Gemini-2.5-flash, GPT-5-mini (reasoning), Gemini-2.5-flash (no-thinking), GPT-4o-mini (non-reasoning) (Table 1, p. 7).
- **Resultat :** Chute catastrophique pour les modeles de raisonnement : Gemini-2.5-flash passe de 93.2% a 0.8% en MATH sous brute-force en scenario Explicit/API, soit -99.1% (Table 1, p. 7). Les modeles non-reasoning subissent 50-70% de baisse. L'effet persiste sur 500 tours de conversation (Figure 5, p. 7).
- **Limite :** Attaques inefficaces sur GPT-3.5-turbo (Limitations, p. 15) ; uniquement des modeles closed-source testes ; domaines limites a MATH et code ; seule la defense Explicit Reminder testee (Limitations, p. 15).

### Analyse critique
**Forces :**
- Vecteur d'attaque nouveau et operationnellement critique : le system prompt est souvent gere par des tiers (marketplaces LLM, frameworks), creant une surface d'attaque de supply-chain reelle (Section 1, p. 1-2).
- Impact devastateur sur les modeles de raisonnement : chute de >96% en precision pour les reasoning models en scenario API (Table 1, p. 7), demontrant que les capacites de raisonnement amplifient la vulnerabilite plutot que de la mitiger.
- Persistance demontree : l'effet ne diminue pas significativement sur 500 tours de conversation pour les reasoning models (Figure 5, p. 7).
- Robustesse aux techniques d'augmentation utilisateur : CoT et ICL cote utilisateur ne mitigent pas l'attaque (RQ3, p. 8).
- Stealthiness : la defense Explicit Reminder est inefficace contre le poisoning (RQ4, p. 8).

**Faiblesses :**
- Modeles exclusivement closed-source : pas de test sur Llama, Mistral, Qwen open-source, limitant la generalisabilite.
- Domaines restreints a MATH et code : les taches creatives ou de resume pourraient etre moins affectees (Limitations, p. 15).
- Seule une defense naïve testee (Explicit Reminder) ; pas de test contre PromptArmor (P042), instruction hierarchy (P056), ou filtrage syntaxique.
- Le framework Auto-SPP necessite un acces au system prompt, ce qui presuppose un scenario de supply-chain specifique.
- Pas de mesure d'ASR au sens classique ; la metrique est la degradation de performance de tache, ce qui rend la comparaison avec d'autres attaques difficile.
- Les modeles anciens (GPT-3.5) sont paradoxalement resistants, suggerant que la vulnerabilite est specifique aux modeles instruction-tuned recents.

**Questions ouvertes :**
- Les modeles open-source sont-ils aussi vulnerables au system prompt poisoning ?
- Des defenses de type sandboxing du system prompt (verification d'integrite, signature) pourraient-elles mitiger cette attaque ?
- Comment le poisoning interagit-il avec les magic tokens (P041) ou l'instruction hierarchy (P056) ?

### Formules exactes
Pas de formalisation mathematique originale. Les strategies sont algorithmiques :
- Brute-force : insertion directe d'instructions malveillantes dans le system prompt (Section 3.1)
- Adaptive ICL : generation automatique d'exemplaires in-context trompeurs (Section 3.2)
- Adaptive CoT : generation de chaines de raisonnement malveillantes (Section 3.3)
- Metrique : degradation de performance = (baseline - poisoned) / baseline * 100% (Section 5.3, Table 1)

Lien glossaire AEGIS : F22 (ASR — variante degradation), F15 (Sep(M))

### Pertinence these AEGIS
- **Couches delta :** δ¹ (attaque directe sur le system prompt — le vecteur cible exactement la couche δ¹ du modele AEGIS), δ⁰ (les modeles mieux alignes par RLHF/reasoning sont paradoxalement plus vulnerables)
- **Conjectures :** C1 (fortement supportee — δ¹ est non seulement insuffisante mais devient un vecteur d'attaque), C3 (fortement supportee — l'alignement superficiel des reasoning models amplifie la vulnerabilite au poisoning), C5 (supportee — interaction entre δ⁰ alignment et δ¹ system prompt)
- **Decouvertes :** D-002 (surface d'attaque supply-chain via system prompt), D-007 (persistance des attaques multi-tours)
- **Gaps :** G-002 (securite de la chaine d'approvisionnement des system prompts), G-008 (verification d'integrite des prompts systeme), G-015 (pas d'evaluation medicale — un system prompt empoisonne en contexte chirurgical serait catastrophique)
- **Mapping templates AEGIS :** #45-#52 (attaques sur system prompt), #70-#80 (persistence multi-tours)

### Citations cles
> "The baseline accuracy for Gemini-2.5-flash in the Explicit, API scenario is 93.2%. Under brute-force poisoning, this performance plummets to 0.8%, a catastrophic decrease of 99.1%" (Section 5.3, Table 1, p. 7)
> "Current black-box based prompt injection defenses cannot effectively defend against it" (Abstract, p. 1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Moyenne — framework Auto-SPP decrit mais code non public ; modeles closed-source uniquement |
| Code disponible | Non mentionne |
| Dataset public | Oui (MATH, HumanEval — publics) |
