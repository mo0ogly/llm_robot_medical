## [HiddenLayer Research, 2024] --- OpenAI Guardrails Bypass: The Self-Policing LLM Vulnerability

**Reference :** HiddenLayer Research Report (pas de DOI/arXiv)
**Revue/Conf :** Rapport de recherche industriel, HiddenLayer, 2024 (non peer-reviewed)
**Lu le :** 2026-04-04
> **PDF Source**: [PDF NON DISPONIBLE] --- rapport industriel, pas de PDF dans literature_for_rag/
> **Statut**: [PREPRINT] --- rapport industriel sans peer-review, analyse basee sur les metadonnees ChromaDB (13 chunks, pas de fulltext)

### Abstract original
> [ABSTRACT NON DISPONIBLE --- rapport industriel sans abstract formel]
> Resume du rapport : HiddenLayer demontre que le cadre Guardrails d'OpenAI (publie le 6 octobre 2025), qui emploie des LLM pour juger les entrees et les sorties, peut etre contourne par une injection de prompt qui trompe simultanement le generateur et le juge. Le constat central est que si le modele de base est vulnerable a l'injection de prompt, le modele juge partageant la meme architecture est egalement vulnerable.
> --- Source : metadonnees ChromaDB (chunks analysis_v2)

### Resume (5 lignes)
- **Probleme :** Vulnerabilite fondamentale des architectures de garde-fous "self-policing" ou le meme type de modele LLM est utilise a la fois pour generer des reponses et pour surveiller/filtrer ces reponses (metadonnees ChromaDB, chunk 1)
- **Methode :** Demonstration de contournement simultane du generateur et du juge LLM dans le cadre OpenAI Guardrails via injection de prompt qui trompe les deux composants en parallele (rapport descriptif sans protocole experimental formel)
- **Donnees :** Non specifiees --- pas de N, pas de benchmark quantitatif, pas de taux de succes rapporte
- **Resultat :** Le bypass coordonne est possible car les vulnerabilites se composent : si le modele M est vulnerable, le juge J base sur M est aussi vulnerable, rendant la defense par auto-surveillance structurellement defaillante (metadonnees ChromaDB, chunk 2)
- **Limite :** Rapport industriel sans methodologie academique rigoureuse ; pas de quantification du taux de succes du bypass ; la solution proposee (defenses en couches) est generique sans implementation concrete (metadonnees ChromaDB, chunk 3)

### Analyse critique

**Forces :**

1. **Identification d'un probleme architectural fondamental.** Le rapport met en lumiere un defaut de conception structurel : l'auto-reference en securite LLM. Lorsque le meme type de modele est utilise pour generer ET surveiller, les vulnerabilites ne sont pas mitigees mais composees. C'est un argument de type "incompletude de Godel" applique a la securite IA --- le systeme ne peut pas garantir sa propre securite (metadonnees ChromaDB, chunk 1).

2. **Pertinence directe pour P044 (AdvJudge-Zero).** Le principe identifie par HiddenLayer (juge LLM herite des vulnerabilites du generateur) est confirme empiriquement et quantifie par P044 (FPR de 99.91% sur les juges LLM). Le rapport industriel anticipe correctement un resultat academique majeur (Li et al., 2025, arXiv:2512.17375, Section 3).

3. **Timing pertinent.** Publie rapidement apres l'annonce du cadre Guardrails d'OpenAI (6 octobre 2025), le rapport souligne l'urgence de la menace avant que la communaute academique ne produise des evaluations formelles.

4. **Classification MITRE ATLAS correcte.** Le mapping T1562.001 (Impair Defenses) est une categorisation pertinente du vecteur d'attaque.

**Faiblesses :**

1. **Absence totale de quantification.** Pas d'ASR, pas de taux de succes mesure, pas de comparaison cross-modele. Le rapport est purement descriptif et conceptuel, sans donnees empiriques reproductibles (metadonnees ChromaDB, chunk 3).

2. **Pas de peer-review.** Rapport industriel publie sans processus de revision academique. Les claims ne sont pas validees par des pairs.

3. **Solution generique.** La recommandation de "defenses en couches" et "surveillance externe" est correcte en principe mais ne fournit aucune implementation concrete, aucune architecture de reference, aucun benchmark de validation (metadonnees ChromaDB, chunk 3).

4. **Pas de comparaison architecturale.** Le rapport ne teste pas si un juge base sur un modele architecturalement different (ex: juge Llama protege un generateur GPT) resiste mieux que le self-policing homogene. Cette question est partiellement adressee par P044 (General-Verifier resiste avec FPR ~0%, Li et al., 2025, Section 4.2).

5. **Pas de formalisation.** Le principe "M vulnerable => J(M) vulnerable" n'est pas demontre formellement. Il est affirme comme observation mais pourrait admettre des contre-exemples (juges specialises, fine-tunes pour la detection adversariale).

**Questions ouvertes :**
- Un juge base sur un modele architecturalement different resiste-t-il mieux ? (Partiellement adresse par P044 : General-Verifier resiste)
- Le probleme d'auto-reference est-il formalisable mathematiquement (lien avec les resultats d'incompletude de Godel / Rice) ?
- L'entrainement adversarial LoRA (P044, Section 5) peut-il briser le couplage vulnerabilites-generateur-juge ?

### Formules exactes
Pas de formule mathematique formelle.
Classification epistemique : `[HEURISTIQUE]` --- principe non prouve formellement.

Principe central :
```
Si Vulnerable(M, I) alors Vulnerable(J(M), I)
ou M = modele generateur, J(M) = juge base sur la meme architecture que M, I = injection
```

Ce principe est une conjecture industrielle non demontree, mais confirmee empiriquement par P044 (Li et al., 2025, arXiv:2512.17375, Section 4) sur les modeles general-purpose (FPR 93-100%) avec une exception notable (General-Verifier, FPR ~0%).

Lien glossaire AEGIS : F33b (Logit Gap, P044 --- formalisation du mecanisme sous-jacent au flip de decision)

### Pertinence these AEGIS
- **Couches delta :** δ¹ (garde-fous par prompt/juge contournes --- le self-policing est une defense δ¹ par construction), δ² (filtres LLM-based vulnerables par construction car partageant les memes failles), δ³ (le probleme d'auto-reference est l'argument le plus fort pour des mecanismes de verification externes formels δ³)
- **Conjectures :** C2 (fortement supportee : la demonstration du self-policing defaillant est l'argument le plus direct pour la necessite de mecanismes de verification externes δ³). C3 (shallow alignment : supportee --- l'alignement RLHF ne protege ni le generateur ni le juge). C5 (cross-layer : supportee --- montre que les couches δ⁰+δ¹ ne suffisent pas sans δ³)
- **Decouvertes :** D-012 (self-reference vulnerability) confirmee. D-001 (defense taxonomy) --- ajoute la categorie "juge heterogene" comme defense potentielle
- **Gaps :** G-010 (formalisation de l'incompletude en securite LLM) cree. G-019 (validation adversariale des juges comme prerequis) renforce
- **Mapping templates AEGIS :** #08 (coordinated bypass juge-generateur), relation directe avec P044 (AdvJudge-Zero)

### Citations cles
> "if the base model is vulnerable to prompt injection, the judge model based on the same architecture will also be vulnerable" (Resume du rapport, metadonnees ChromaDB)
> [Note : citations verbatim additionnelles non disponibles sans fulltext --- rapport industriel sans PDF archive]

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Faible --- pas de protocole experimental, pas de donnees publiees, rapport industriel sans peer-review |
| Code disponible | Non |
| Dataset public | Non |
