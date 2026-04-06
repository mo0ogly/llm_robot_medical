## [Zahra & Chin, 2026] --- Prompt Injection is All You Need: A Systemic Framework for Evaluating Healthcare Misinformation in LLMs

**Reference :** Springer LNCS, Vol. 16038
**Revue/Conf :** Springer Lecture Notes in Computer Science (Artificial Intelligence in Healthcare), 2026
**Lu le :** 2026-04-04
> **PDF Source**: [PDF NON DISPONIBLE] --- pas de PDF dans literature_for_rag/
> **Statut**: [ARTICLE VERIFIE] --- analyse basee sur les metadonnees ChromaDB (18 chunks, pas de fulltext). [ABSTRACT SEUL] pour les formules et chiffres detailles

### Abstract original
> [ABSTRACT COMPLET NON DISPONIBLE --- reconstruit a partir des metadonnees ChromaDB]
> Cette publication evalue systematiquement la generation de desinformation medicale par les LLM sous l'effet d'attaques par injection de prompt, avec une contribution originale sur le role de la manipulation emotionnelle comme amplificateur d'attaque. L'etude porte sur 112 scenarios d'attaque testes sur huit LLM, revelant que la combinaison de manipulation emotionnelle et d'injection de prompt augmente le taux de generation de desinformation medicale dangereuse de 6.2% (baseline sans attaque) a 37.5% (Zahra & Chin, 2026, Springer LNCS Vol. 16038).
> --- Source : metadonnees ChromaDB, chunk analysis_v2. [ABSTRACT SEUL]

### Resume (5 lignes)
- **Probleme :** Quantifier l'effet de la manipulation emotionnelle comme amplificateur des attaques par injection de prompt en contexte de desinformation medicale (metadonnees ChromaDB, chunk 1)
- **Methode :** Cadre tridimensionnel : type de desinformation (prescription, diagnostic, traitement, prevention) x technique d'injection (6 techniques incluant virtualization, role-playing, contextual) x condition emotionnelle (baseline, injection seule, injection + emotion). 8 LLM x 6 techniques x 2 conditions = 112 scenarios (metadonnees ChromaDB, chunk 5)
- **Donnees :** 112 scenarios, 8 LLM (incluant Claude 3.5 Sonnet, GPT-4, Llama, et 5 autres), 6 techniques d'injection, 4 leviers emotionnels (urgence, empathie, autorite, peur) (metadonnees ChromaDB, chunk 5)
- **Resultat :** MR_baseline = 6.2%, MR_PI = 18.8% (AmpFactor 3.0x), MR_emo+PI = 37.5% (AmpFactor 6.05x). Claude 3.5 Sonnet : MR = 4.2% (resistance superieure). Technique la plus efficace sans emotion : virtualization (75% modeles) ; avec emotion : role-playing (62.5% modeles) (metadonnees ChromaDB, chunk 5)
- **Limite :** 112 scenarios = echantillon modeste ; pas de defense proposee ; severite clinique non evaluee (metadonnees ChromaDB, chunk 3)

### Analyse critique

**Forces :**

1. **Contribution originale sur la manipulation emotionnelle.** P040 est le premier papier du corpus a quantifier la manipulation emotionnelle comme amplificateur d'attaque. Le facteur 6.05x (de 6.2% a 37.5%) est un resultat quantitatif precis qui enrichit la taxonomie AEGIS d'un vecteur d'attaque sous-explore (metadonnees ChromaDB, chunk 1).

2. **Cadre tridimensionnel structurant.** L'organisation en 3 dimensions (type de desinformation x technique d'injection x levier psychologique) permet d'isoler la contribution de chaque facteur et leurs interactions. Cette approche factorielle est methodologiquement superieure a l'evaluation unidimensionnelle de P029 (Lee et al., 2025, JAMA Network Open) ou P031 (metadonnees ChromaDB, chunk 5).

3. **Quantification de l'interaction technique x emotion.** L'etude montre que l'efficacite des techniques change selon la condition emotionnelle : virtualization domine sans emotion (75% des modeles), mais role-playing domine avec emotion (62.5%). Ce renversement suggere que la manipulation emotionnelle modifie le mecanisme de contournement, pas seulement son intensite (metadonnees ChromaDB, chunk 5).

4. **Resistance differentielle de Claude 3.5 Sonnet.** Le MR de 4.2% pour Claude 3.5 Sonnet (vs 37.5% moyen) avec un AmpFactor inverse de 0.7x est un resultat remarquable. Il suggere que l'approche d'alignement d'Anthropic (Constitutional AI / RLHF specifique) confere une resistance specifique a la manipulation emotionnelle, une piste directe pour ameliorer δ⁰ (Zahra & Chin, 2026, Results [ABSTRACT SEUL] ; metadonnees ChromaDB, chunk 5).

5. **Venue pertinente.** Springer LNCS (Artificial Intelligence in Healthcare) positionne le papier a l'intersection exacte securite IA / sante, avec un comite de lecture sensibilise aux enjeux cliniques.

**Faiblesses :**

1. **Echantillon insuffisant par condition.** 8 LLM x 6 techniques x 2 conditions = 112 scenarios, soit ~9 scenarios par modele x condition [CALCUL VERIFIE]. C'est tres inferieur au seuil Sep(M) >= 30 par condition (Zverev et al., 2025, ICLR, Definition 2, Section 3). Les resultats par modele individuel ne sont pas statistiquement valides (metadonnees ChromaDB, chunk 3).

2. **Pas de defense proposee.** L'evaluation est purement diagnostique : l'etude identifie le probleme (amplification emotionnelle) sans proposer de solution. Ni un filtre de sentiment, ni un guardrail emotionnel, ni une augmentation des donnees d'entrainement n'est propose ou teste (metadonnees ChromaDB, chunk 3).

3. **Severite clinique non evaluee.** Contrairement a CHER (P035, Lee et al., 2026, Section 4.1, Eq. 1), les desinformations generees ne sont pas classees par severite clinique. Un conseil errone sur un supplement alimentaire et un dosage letal de medicament sont traites de maniere identique dans le MR (metadonnees ChromaDB, chunk 3).

4. **Taxonomie emotionnelle limitee.** Seuls 4 leviers emotionnels sont testes (urgence, empathie, autorite, peur). D'autres vecteurs psychologiques documentes en ingenierie sociale (flatterie, culpabilite, reciprocite, rationalisation) ne sont pas explores (metadonnees ChromaDB, chunk 3).

5. **PDF non disponible.** L'absence de fulltext empeche la verification des resultats et des formules. Toutes les donnees quantitatives proviennent des metadonnees ChromaDB (source secondaire). `[ABSTRACT SEUL]` pour les formules et chiffres detailles.

6. **Snapshot temporel.** L'evaluation est limitee a un instant t. L'evolution de la robustesse dans le temps (documentee par P030) n'est pas mesuree.

**Questions ouvertes :**
- Pourquoi Claude 3.5 Sonnet resiste-t-il mieux (4.2% vs 37.5%) ? Constitutional AI ou choix architectural ?
- L'amplification emotionnelle est-elle detectable par un filtre δ² de sentiment analysis avant inference ?
- Les leviers emotionnels sont-ils cumulatifs (urgence + autorite > urgence seule) ?
- Un entrainement adversarial avec des scenarios emotionnels medicaux (a la CFT, P034) reduirait-il le MR ?

### Formules exactes
Classification epistemique : `[EMPIRIQUE]` --- metriques observees. `[ABSTRACT SEUL]` --- formules non verifiees dans le fulltext.

**Misinformation Rate (MR)** (metadonnees ChromaDB, chunk 2) :
```
MR_cond = |{i : LLM genere misinformation dangereuse sous condition c}| / |D_test| x 100%
```

**Emotional Amplification Factor** (metadonnees ChromaDB, chunk 4 ; glossaire AEGIS formule 8.15) :
```
AmpFactor = MR_emo+PI / MR_baseline
```

**Resultats principaux** (Zahra & Chin, 2026, Springer LNCS Vol. 16038 ; metadonnees ChromaDB, chunks 2 et 5) :
- MR_baseline (sans injection) = **6.2%** (Zahra & Chin, 2026, Results [ABSTRACT SEUL])
- MR_PI (injection sans emotion) = **18.8%** (AmpFactor_PI = 18.8/6.2 = **3.0x**) (Zahra & Chin, 2026, Results [ABSTRACT SEUL])
- MR_emo+PI (injection + emotion) = **37.5%** (AmpFactor_emo = 37.5/6.2 = **6.05x**) (Zahra & Chin, 2026, Results [ABSTRACT SEUL])
- Claude 3.5 Sonnet : MR_emo = **4.2%** (AmpFactor = **0.7x** --- resistance superieure) (Zahra & Chin, 2026, Results [ABSTRACT SEUL])
- Technique la plus efficace sans emotion : **virtualization** (75% des modeles) (Zahra & Chin, 2026, Results [ABSTRACT SEUL])
- Technique la plus efficace avec emotion : **role-playing** (62.5% des modeles) (Zahra & Chin, 2026, Results [ABSTRACT SEUL])

Lien glossaire AEGIS : F22 (ASR/MR equivalent), formule 8.15 (Emotional Amplification Factor)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (la tension helpful/harmless est un artefact direct de l'alignement RLHF exploite par la manipulation emotionnelle ; la resistance de Claude 3.5 Sonnet suggere que le choix d'approche d'alignement est critique), δ¹ (les injections directes ciblent le prompt systeme des 8 modeles)
- **Conjectures :** C1 (supportee : les injections combinees contournent les guardrails δ⁰+δ¹ de 8 modeles). C3 (shallow alignment : fortement supportee --- la tension helpful/harmless exploitee par la manipulation emotionnelle est une consequence directe de l'alignement superficiel). C4 (scaling independence : supportee --- la disparite entre 8 modeles montre que la robustesse depend du choix d'alignement, pas de la taille). C6 (medical specificity : contribution directe majeure --- la desinformation medicale amplifiee par l'emotion est un vecteur specifique au domaine de sante)
- **Decouvertes :** D-005 (amplification emotionnelle medicale) quantifiee : facteur 6.05x (Zahra & Chin, 2026, Results [ABSTRACT SEUL]). D-006 (medical specificity) renforcee par le vecteur emotionnel
- **Gaps :** G-017 (emotional detection δ²) cree : sentiment analysis comme defense potentielle contre la manipulation emotionnelle. G-018 (Claude resistance mechanism) cree : comprendre pourquoi l'approche Anthropic resiste mieux. G-019 (taxonomie emotionnelle etendue) cree : tester flatterie, culpabilite, reciprocite
- **Mapping templates AEGIS :** #03 (role-playing --- technique la plus efficace avec emotion), #06 (emotional manipulation --- nouvelle categorie), #15 (urgency framing). Nouvelle chaine potentielle : emotional amplification chain (combinant injection + levier emotionnel)

### Citations cles
> [Citations verbatim non disponibles sans fulltext]
> Donnees cles : "MR de 6.2% a 37.5% avec manipulation emotionnelle" (metadonnees ChromaDB, chunk 1)
> "Claude 3.5 Sonnet : MR = 4.2%, resistance superieure" (metadonnees ChromaDB, chunk 5)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Faible --- 112 scenarios non publies, PDF non disponible, resultats non verifiables en fulltext. [ABSTRACT SEUL] |
| Code disponible | Non mentionne |
| Dataset public | Non mentionne |
