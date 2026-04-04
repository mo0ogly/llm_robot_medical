# P040: Prompt Injection is All You Need: A Systemic Framework for Evaluating Healthcare Misinformation in LLMs
**Authors**: Zahra & N.A. Chin | **Year**: 2026 | **Venue**: Springer LNCS (Artificial Intelligence in Healthcare), Vol. 16038

## Resume FR (~500 mots)

Cette publication evalue systematiquement la generation de desinformation medicale par les LLM sous l'effet d'attaques par injection de prompt, avec une contribution originale sur le role de la manipulation emotionnelle comme amplificateur d'attaque. L'etude porte sur 112 scenarios d'attaque testes sur huit LLM, revelant que la combinaison de manipulation emotionnelle et d'injection de prompt augmente le taux de generation de desinformation medicale dangereuse de 6.2% (baseline sans attaque) a 37.5%.

Le cadre experimental est structure autour de trois dimensions : le type de desinformation medicale ciblee (prescription, diagnostic, traitement, prevention), la technique d'injection utilisee (directe, contextuelle, multi-tour), et le levier psychologique employe (urgence, empathie, autorite, peur). Cette approche tridimensionnelle permet d'isoler la contribution de chaque facteur et de leurs interactions, une methodologie rarement utilisee dans les evaluations de securite des LLM.

Le resultat le plus significatif est la quantification de l'effet amplificateur de la manipulation emotionnelle. Alors que l'injection de prompt seule augmente le taux de desinformation a un niveau intermediaire, l'ajout d'un levier emotionnel (par exemple, simuler l'urgence medicale d'un patient fictif) multiplie significativement l'efficacite de l'attaque. Cela suggere que l'alignement RLHF cree une tension entre la volonte d'etre serviable (helpful) et la securite (harmless) — exactement le dilemme explore dans P018 (shallow alignment) et P019 (gradient analysis).

Parmi les huit modeles evalues, Claude 3.5 Sonnet demontre la resistance la plus forte aux attaques combinees. Ce resultat est pertinent pour la these AEGIS qui utilise des modeles Anthropic dans son infrastructure. La disparite entre modeles confirme C4 (scaling independence) : la robustesse n'est pas une fonction simple de la taille du modele mais depend de choix specifiques d'entrainement et d'alignement.

Pour la these AEGIS, cette publication comble un gap important identifie dans RUN-001 : le lien entre manipulation emotionnelle et injection de prompt en contexte medical. Le cadre de 112 scenarios enrichit la base de comparaison pour les 48 scenarios d'AEGIS. La metrique de passage de 6.2% a 37.5% fournit un benchmark quantitatif pour mesurer l'efficacite des defenses AEGIS contre les attaques emotionnellement amplifiees.

Le choix de publier dans Springer LNCS (Artificial Intelligence in Healthcare) situe ce travail a l'intersection exacte de la these — securite IA et sante — et fournit une reference editoriale solide pour la legitimite du sujet. La collaboration entre techniques d'injection et manipulation psychologique ouvre un vecteur d'attaque sous-explore qui pourrait etre integre dans les chaines d'attaque AEGIS.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| Misinformation Rate (MR) = reponses avec desinformation / total reponses | Taux de desinformation medicale dans les reponses du LLM |
| MR_baseline = 6.2% (sans attaque) | Taux de desinformation de reference sans injection |
| MR_combined = 37.5% (injection + manipulation emotionnelle) | Taux de desinformation sous attaque combinee |
| Amplification factor = MR_combined / MR_baseline = 6.05x | Facteur d'amplification de la manipulation emotionnelle |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| Healthcare misinformation | Fausses informations medicales generees par un LLM pouvant conduire a des decisions de sante dangereuses |
| Emotional manipulation | Technique d'attaque utilisant des leviers psychologiques (urgence, empathie, peur) pour contourner les garde-fous |
| Combined attack | Attaque combinant injection de prompt et manipulation emotionnelle pour maximiser l'efficacite |
| Amplification factor | Ratio entre le taux de desinformation sous attaque combinee et le taux baseline |
| Helpful-harmless tension | Dilemme d'alignement ou la volonte du modele d'etre utile compromet sa securite |

## Research Paths (Gaps identifies)
1. L'echantillon de 112 scenarios est modeste compare a MPIB (9 697 instances) — la validite statistique par condition pourrait etre insuffisante
2. La taxonomie des leviers emotionnels est limitee — d'autres vecteurs psychologiques (flatterie, culpabilite, reciprocite) ne sont pas explores
3. Pas de defense proposee — l'evaluation est purement diagnostique
4. La severite clinique des desinformations generees n'est pas evaluee (contrairement au CHER de P035)
5. L'evaluation est limitee a un snapshot temporel — l'evolution de la robustesse dans le temps (P030) n'est pas mesuree

## delta-Layer Tags
- [x] delta-0 (RLHF alignment) — la tension helpful/harmless est un artefact direct de l'alignement RLHF
- [x] delta-1 (System prompt) — les injections directes ciblent le prompt systeme
- [ ] delta-2 (Syntax filtering) — non traite
- [ ] delta-3 (Formal verification) — non traite

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Oui** — Les injections combinees contournent les prompts systeme des 8 modeles
- **C2 (Necessite delta-3)**: **Oui (indirect)** — L'amplification emotionnelle montre que les defenses empiriques sont sensibles a des facteurs subtils imprevisibles
- **C3 (Shallow alignment)**: **Oui** — La tension helpful/harmless exploitee par la manipulation emotionnelle est une consequence directe de l'alignement superficiel
- **C4 (Scaling independence)**: **Oui** — La disparite entre 8 modeles montre que la robustesse depend du choix d'alignement, pas de la taille
- **C5 (Cross-layer interaction)**: **Non traite**
- **C6 (Medical specificity)**: **Oui** — Contribution directe : la desinformation medicale est qualitativement differente de la desinformation generique, necessitant des metriques dediees
