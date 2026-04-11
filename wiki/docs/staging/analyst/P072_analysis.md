## [Kocaman et al., 2025] — CLEVER : Evaluation clinique des LLM par revue d'experts

**Reference :** DOI:10.2196/72153
**Revue/Conf :** JMIR AI, 2025 (peer-reviewed, Journal of Medical Internet Research — Q1 Medical Informatics)
**Lu le :** 2026-04-04
> **PDF Source**: Pas de PDF dans literature_for_rag/ — article JMIR accessible via https://ai.jmir.org/2025/1/e72153
> **Statut**: [A VERIFIER MANUELLEMENT] — lu via metadonnees ChromaDB (1 chunk reference) + WebSearch. Texte complet NON disponible dans le RAG.

### Abstract original
> [ABSTRACT NON DISPONIBLE DANS LE RAG — resume base sur metadonnees et WebSearch]
> Le papier propose CLEVER (Clinical LLM Evaluation by Expert Review), une methodologie d'evaluation aveugle, randomisee, par preference, conduite par des medecins praticiens sur des taches cliniques specifiques. La methodologie est demontree en comparant GPT-4o contre deux LLM specialises sante (8B et 70B parametres) sur trois taches : resume de texte clinique, extraction d'information clinique, et QA sur la recherche biomedicale.
> — Source : WebSearch + JMIR AI page

### Resume (5 lignes)
- **Probleme :** Les benchmarks publics sont contamines, les approches LLM-as-a-judge ont un biais de self-preference, et les taches d'evaluation sont deconnectees de la pratique clinique (metadonnees JMIR).
- **Methode :** Evaluation aveugle par medecins praticiens, randomisee, basee sur la preference, sur 3 taches cliniques (resume, extraction, QA biomedicale) comparant GPT-4o vs 2 LLM medicaux (8B et 70B) (WebSearch).
- **Donnees :** Non specifie dans les metadonnees disponibles. [ABSTRACT SEUL]
- **Resultat :** Les medecins preferent le Small Medical LLM a GPT-4o 45% a 92% plus souvent sur les dimensions factualite, pertinence clinique et concision (WebSearch). Performance comparable sur le QA medical ouvert.
- **Limite :** Contamination des benchmarks publics identifiee ; validite testee via accord inter-annotateurs et correlation intra-classe (WebSearch). Limites specifiques non extraites sans texte complet.

### Analyse critique
**Forces :**
- Evaluation par medecins praticiens (gold standard) plutot que LLM-as-a-judge — attaque directement le probleme de fiabilite des evaluations automatiques.
- Design aveugle et randomise — methodologie rigoureuse pour l'evaluation comparative.
- Resultat contre-intuitif (petit modele medical > GPT-4o) suggerant que la specialisation domine la taille pour les taches cliniques.

**Faiblesses :**
- Texte complet non disponible dans le RAG — analyse limitee aux metadonnees. [ABSTRACT SEUL]
- Nombre de medecins evaluateurs et puissance statistique non verifiables sans texte complet.
- Trois taches seulement — couverture limitee du spectre clinique.
- Pas d'evaluation de securite/robustesse adversariale — focus uniquement sur la qualite fonctionnelle.

**Questions ouvertes :**
- L'avantage du petit modele medical persiste-t-il sous pression adversariale (jailbreaking) ?
- Comment CLEVER se compare-t-il a MEDIC (P073) en termes de couverture dimensionnelle ?

### Formules exactes
Aucune formule extraite — texte complet non disponible. [ABSTRACT SEUL]
Lien glossaire AEGIS : N/A

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (evaluation de la qualite des reponses medicales — SECONDAIRE), δ¹ (N/A), δ² (N/A), δ³ (N/A)
- **Conjectures :** C4 (alignment medical specifique au domaine) — SUPPORTEE indirectement : les LLM medicaux specialises surpassent les generalistes sur les taches cliniques
- **Decouvertes :** Aucune directe
- **Gaps :** G-015 (methodologie d'evaluation humaine vs automatique) — ADRESSE par la methodologie CLEVER
- **Mapping templates AEGIS :** N/A — pas de focus securite

### Citations cles
> "Medical doctors prefer the Small Medical LLM over GPT-4o 45% to 92% more often on the dimensions of factuality, clinical relevance, and conciseness." (WebSearch, resultats principaux)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 3/10 |
| Reproductibilite | Moyenne — methodologie decrite, mais depend de l'acces aux medecins evaluateurs |
| Code disponible | Non verifie |
| Dataset public | Non verifie |
