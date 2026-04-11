# P033 -- Analyse doctorale

## [HiddenLayer Research, 2024] -- OpenAI Guardrails Bypass: The Self-Policing LLM Vulnerability

**Reference :** Rapport de recherche industriel HiddenLayer, 2024 (pas de DOI/arXiv)
**Revue/Conf :** Rapport industriel HiddenLayer (non peer-reviewed)
**Lu le :** 2026-04-04
**Nature :** [HEURISTIQUE] -- principe non prouve formellement, demonstration conceptuelle sans quantification
> **PDF Source**: [PDF NON DISPONIBLE] -- rapport industriel, pas de PDF dans literature_for_rag/
> **Statut**: [PREPRINT] -- rapport industriel sans peer-review, analyse basee sur 23 chunks ChromaDB (analysis_v2, analysis_v3, metadonnees), pas de fulltext

---

### Abstract original
> [ABSTRACT NON DISPONIBLE -- rapport industriel sans abstract formel]
> Reconstitution : HiddenLayer demontre que le cadre Guardrails d'OpenAI (publie le 6 octobre 2025), qui emploie des LLM pour juger les entrees et les sorties, peut etre contourne par une injection de prompt qui trompe simultanement le generateur et le juge. Le constat central est que si le modele de base est vulnerable a l'injection de prompt, le modele juge partageant la meme architecture est egalement vulnerable, car il partage les memes failles fondamentales.
> -- Source : reconstitution depuis chunks ChromaDB (analysis_v2) [PDF NON DISPONIBLE]

### Resume (5 lignes)
- **Probleme :** Vulnerabilite fondamentale des architectures de garde-fous "self-policing" ou le meme type de modele LLM est utilise a la fois pour generer des reponses et pour les surveiller/filtrer [PDF NON DISPONIBLE -- source : chunks ChromaDB]
- **Methode :** Demonstration de contournement simultane du generateur et du juge LLM dans le cadre OpenAI Guardrails via injection de prompt qui trompe les deux composants en parallele (rapport descriptif sans protocole experimental formel) [PDF NON DISPONIBLE -- source : chunks ChromaDB]
- **Donnees :** Non specifiees -- pas de N, pas de benchmark quantitatif, pas de taux de succes rapporte [PDF NON DISPONIBLE -- source : chunks ChromaDB]
- **Resultat :** Le bypass coordonne est possible car les vulnerabilites se composent : si le modele M est vulnerable, le juge J base sur M l'est aussi, rendant la defense par auto-surveillance structurellement defaillante [PDF NON DISPONIBLE -- source : chunks ChromaDB]
- **Limite :** Rapport industriel sans methodologie academique rigoureuse ; pas de quantification du taux de succes ; solution proposee ("defenses en couches") generique sans implementation concrete [PDF NON DISPONIBLE -- source : chunks ChromaDB]

### Analyse critique

**Forces :**

1. **Identification d'un defaut architectural fondamental.** Le rapport met en lumiere un probleme structurel de conception : l'auto-reference en securite LLM. Lorsque le meme type de modele genere ET surveille les reponses, les vulnerabilites ne sont pas mitigees mais composees. Le systeme ne peut pas garantir sa propre securite -- un argument de type "incompletude" applique a la securite IA [PDF NON DISPONIBLE -- source : chunks ChromaDB, chunk 1].

2. **Anticipation de P044 (AdvJudge-Zero).** Le principe identifie par HiddenLayer (le juge LLM herite des vulnerabilites du generateur) est confirme empiriquement et quantifie par P044 un an plus tard : FPR de 99.91% sur les juges LLM general-purpose (Li et al., 2025, arXiv:2512.17375, Section 4, Table 3). Le rapport industriel anticipe correctement un resultat academique majeur.

3. **Timing strategique.** Publie rapidement apres l'annonce du cadre Guardrails d'OpenAI (6 octobre 2025), le rapport souligne l'urgence de la menace avant que la communaute academique ne produise des evaluations formelles.

4. **Classification MITRE ATLAS pertinente.** Le mapping T1562.001 (Impair Defenses: Disable or Modify Tools) est une categorisation appropriee du vecteur d'attaque, reliant le travail au referentiel de menaces standard [PDF NON DISPONIBLE -- source : chunks ChromaDB, chunk 5].

**Faiblesses :**

1. **Absence totale de quantification.** Pas d'ASR, pas de taux de succes mesure, pas de comparaison cross-modele. Le rapport est purement conceptuel et descriptif, sans donnees empiriques reproductibles. Pour une these doctorale, cela interdit toute utilisation comme source de donnees quantitatives [PDF NON DISPONIBLE -- source : chunks ChromaDB, chunk 3].

2. **Pas de peer-review.** Rapport industriel publie sans processus de revision academique. Les claims ne sont pas validees par des pairs. Le biais commercial (HiddenLayer vend des solutions de securite IA) doit etre pris en compte.

3. **Solution generique et non implementee.** La recommandation de "defenses en couches" et "surveillance externe" est correcte en principe mais ne fournit aucune implementation concrete, aucune architecture de reference, aucun benchmark de validation [PDF NON DISPONIBLE -- source : chunks ChromaDB, chunk 3].

4. **Pas de comparaison architecturale.** Le rapport ne teste pas si un juge base sur un modele architecturalement different (ex: juge Llama protegeant un generateur GPT) resiste mieux que le self-policing homogene. Cette question est partiellement adressee par P044 : le General-Verifier (modele specialise de verification) resiste avec FPR ~0% (Li et al., 2025, arXiv:2512.17375, Section 4.2).

5. **Pas de formalisation du principe.** L'assertion "M vulnerable => J(M) vulnerable" n'est pas demontree formellement. Elle est affirmee comme observation mais pourrait admettre des contre-exemples (juges specialises, fine-tunes pour la detection adversariale). L'absence de conditions necessaires et suffisantes limite la portee theorique.

6. **PDF non disponible.** Le rapport complet n'a pas ete archive dans literature_for_rag/. L'analyse repose sur 23 chunks ChromaDB (metadonnees et analyses secondaires), pas sur le texte original. La fiabilite est reduite.

**Questions ouvertes :**
- Un juge base sur un modele architecturalement different resiste-t-il mieux ? (Partiellement adresse par P044 : General-Verifier resiste)
- Le probleme d'auto-reference est-il formalisable mathematiquement (lien avec les resultats d'incompletude de Godel / theoreme de Rice) ?
- L'entrainement adversarial LoRA (P044, Section 5) peut-il briser le couplage vulnerabilites generateur-juge ?
- Le principe s'applique-t-il aux architectures multi-agents ou chaque agent a un modele distinct ?

**Positionnement dans le corpus AEGIS :**

P033 est un rapport industriel qui anticipe d'un an le resultat academique majeur de P044 (AdvJudge-Zero, Li et al., 2025, arXiv:2512.17375). Sa valeur pour la these n'est pas dans ses donnees (inexistantes quantitativement) mais dans l'identification du probleme architectural : le self-policing est structurellement defaillant. Ce constat est central pour la justification de la couche delta-3 (verification formelle externe) dans l'architecture AEGIS. Le rapport illustre egalement la complementarite industrie/academie : HiddenLayer identifie le probleme (octobre 2025), P044 le quantifie (decembre 2025), et AEGIS propose la solution architecturale (couche delta-3 heterogene). L'absence de PDF et de quantification classe P033 comme une source conceptuelle de soutien, pas comme une source de donnees primaire. Le biais commercial (HiddenLayer vend des solutions de securite IA) doit etre rappele dans la these.

### Formules exactes

Classification epistemique : `[HEURISTIQUE]` -- principe non prouve formellement, demonstration conceptuelle.

**Principe central** [PDF NON DISPONIBLE -- reconstitution depuis chunks ChromaDB] :
```
Si Vulnerable(M, I) alors Vulnerable(J(M), I)
ou :
  M = modele generateur
  J(M) = juge base sur la meme architecture que M
  I = injection adversariale
```

Ce principe est une conjecture industrielle non demontree formellement. Il est confirme empiriquement par P044 (Li et al., 2025, arXiv:2512.17375, Section 4) sur les modeles general-purpose (FPR 93-100%), avec une exception notable : le General-Verifier (modele specialise) resiste avec FPR ~0% (Li et al., 2025, arXiv:2512.17375, Section 4.2), ce qui montre que le principe admet des contre-exemples lorsque J n'est pas base sur la meme architecture que M.

Lien glossaire AEGIS : F33b (Logit Gap, P044 -- formalisation du mecanisme sous-jacent au flip de decision du juge)

### Pertinence these AEGIS

- **Couches delta :**
  - δ¹ (System prompt / guardrails) : le self-policing est une defense delta-1 par construction -- demontree defaillante [PDF NON DISPONIBLE -- source : chunks ChromaDB]
  - δ² (Filtres LLM-based) : les filtres base-LLM sont vulnerables par construction car partageant les memes failles que le generateur
  - δ³ (Verification formelle externe) : le probleme d'auto-reference est l'argument le plus fort pour des mecanismes de verification externes formels delta-3

- **Conjectures :**
  - C2 (necessite delta-3) : **fortement supportee** -- la demonstration du self-policing defaillant est l'argument le plus direct pour la necessite de verification externe formelle
  - C3 (shallow alignment) : **supportee** -- l'alignement RLHF ne protege ni le generateur ni le juge
  - C5 (cross-layer) : **supportee** -- montre que delta-0+delta-1 ne suffisent pas sans delta-3

- **Decouvertes :**
  - D-012 (self-reference vulnerability) : **confirmee** -- le rapport est la premiere identification explicite de cette vulnerabilite architecturale
  - D-001 (defense taxonomy) : ajoute la categorie "juge heterogene" comme defense potentielle

- **Gaps :**
  - G-010 (formalisation de l'incompletude en securite LLM) : **cree** -- le lien avec les resultats d'impossibilite theoriques n'est pas etabli
  - G-019 (validation adversariale des juges comme prerequis) : **renforce** -- tout juge LLM doit etre teste contre des attaques adversariales avant deploiement

- **Mapping templates AEGIS :** #08 (coordinated bypass juge-generateur), relation directe avec P044 (AdvJudge-Zero)

### Citations cles
> [CITATIONS VERBATIM NON DISPONIBLES -- rapport industriel sans PDF archive. Reconstitution depuis chunks ChromaDB :]
> "if the base model is vulnerable to prompt injection, the judge model based on the same architecture will also be vulnerable" -- reconstitution, source secondaire [PDF NON DISPONIBLE]

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Faible -- pas de protocole experimental, pas de donnees publiees, rapport industriel sans peer-review |
| Code disponible | Non |
| Dataset public | Non |
| Nature epistemique | [HEURISTIQUE] -- principe non prouve, demonstration conceptuelle |
| Confiance | 4/10 -- principe confirme par P044 mais source non academique, PDF non disponible |
| Statut PDF | [PDF NON DISPONIBLE] -- rapport industriel non archive |

---

*Analyse reecrite le 2026-04-05 | Source : 23 chunks ChromaDB (analysis_v2, analysis_v3, metadonnees) | PDF original non disponible -- toutes les donnees proviennent de sources secondaires*
*Transparence : Le rapport complet HiddenLayer n'a jamais ete injecte dans ChromaDB. L'analyse repose sur les chunks d'analyse secondaire et les metadonnees. Les citations sont des reconstitutions, pas des verbatims. Tag : [PDF NON DISPONIBLE].*
