## [Arzanipour et al., 2025] — Formalisation du modele de menace et de la surface d'attaque des systemes RAG

**Reference :** arXiv:2509.20324
**Revue/Conf :** 5th ICDM Workshop (Workshop, non conference principale)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P067_Arzanipour_2025_RAGThreatModel.pdf](../../assets/pdfs/P067_Arzanipour_2025_RAGThreatModel.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (50 chunks). Workshop paper.

### Abstract original
> Retrieval-Augmented Generation (RAG) is an emerging approach in natural language processing that combines large language models (LLMs) with dynamic access to external knowledge repositories. Despite the growing adoption of RAG systems, research has demonstrated that LLMs can leak sensitive information through training data memorization or adversarial prompts, and RAG systems inherit many of these vulnerabilities. At the same time, RAG's reliance on an external knowledge base opens new attack surfaces. Despite these risks, there is currently no formal framework that comprehensively defines the privacy and security threats specific to RAG. In this work, we address this gap by formalizing the RAG security and privacy threat model.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Il n'existe pas de framework formel definissant les menaces de securite et confidentialite specifiques aux systemes RAG. Les travaux existants traitent les attaques individuellement sans taxonomie unifiee (Arzanipour et al., 2025, Section I, p.1).
- **Methode :** Formalisation en 3 axes : (1) 4 types d'adversaires (A_I Unaware Observer, A_II Aware Observer, A_III Aware Insider, A_IV Unaware Insider), (2) 3 vecteurs d'attaque formalises (Document-Level Membership Inference Attack DL-MIA, Leakage Attack, Poisoning Attack), (3) defenses par Differential Privacy (DP) (Section III-IV, Definitions 1-5).
- **Donnees :** Aucune evaluation experimentale — papier purement theorique/formel (taxonomie + definitions formelles). [SURVEY avec formalisation]
- **Resultat :** Definitions formelles des 3 attaques (DL-MIA, Leakage, Poisoning) avec conditions de succes mathematiquement specifiees. Proposition de defense DP pour le retriever avec guarantee epsilon-delta (Section IV, Definitions 1-5).
- **Limite :** Aucune validation experimentale. Les definitions restent au niveau formel sans implementation ni mesure de faisabilite des attaques proposees (observation implicite — pas de section experimentale).

### Analyse critique
**Forces :**
- Premiere formalisation complete du threat model RAG couvrant simultanement securite (poisoning, injection) ET confidentialite (membership inference, leakage). Les travaux P061-P066 ne couvrent que le poisoning.
- Taxonomie d'adversaires a 4 quadrants (acces modele x connaissance donnees) : claire, exhaustive, et orthogonale (Figure 2, Section III, p.4). Utile comme reference pour classer les adversaires dans la these AEGIS.
- DL-MIA pour RAG (Definition 1, Section IV-A, p.5) : formalisation originale du risque de membership inference au niveau document, particulierement pertinente pour les RAG medicaux (un adversaire peut inferer si un dossier patient est dans la base).
- Defense DP rigoureuse : la propriete de post-processing de DP garantit que le generateur ne peut pas amplifier la fuite du retriever (Section IV-A, p.5-6). [THEOREME — via DP composition]
- Trigger-Based RAG Poisoning (Definition 5, Section IV-C, p.7) : formalisation des attaques par trigger qui manquait dans les travaux P061-P066.

**Faiblesses :**
- **Aucune validation experimentale** : les definitions formelles ne sont pas accompagnees d'implementations. Il est impossible d'evaluer si les attaques DL-MIA et Leakage sont realisables en pratique sur des systemes RAG reels.
- Venue : workshop ICDM, non conference principale. Le papier n'a pas subi la rigueur d'une review A*.
- Les defenses DP proposees (bruit Laplace sur les scores de retrieval) peuvent degrader significativement la qualite du retrieval, mais cette degradation n'est pas quantifiee.
- La taxonomie d'adversaires ne couvre pas les adversaires multi-etapes (attaquant qui commence comme A_I puis escalade vers A_III via social engineering).
- Pas de distinction entre RAG statique (corpus fixe) et RAG dynamique (corpus mis a jour en continu), qui ont des surfaces d'attaque tres differentes.

**Questions ouvertes :**
- Le DL-MIA est-il realisable en pratique sur des RAG medicaux (PubMed, dossiers patients) ?
- Quel est le trade-off epsilon-delta optimal pour le DP-retriever preservant l'utilite ?
- Comment cette taxonomie se mappe sur MITRE ATLAS et OWASP LLM Top 10 ?

### Formules exactes
- **Definition 1** (Section IV-A, p.5) : DL-MIA — Pr[A(q, y, d*) = b | d*] - 1/2 <= delta, privacy si delta negligeable.
- **DP Retriever** (Section IV-A, p.5-6) : scores bruites s_tilde(d_i, q) = s(d_i, q) + eta_i, eta_i ~ Lap(1/epsilon), puis top-k selection.
- **Definition 3** (Section IV-B, p.6) : Leakage Attack — reponse y contient un segment s_leak avec haute similarite semantique a un passage confidentiel d_target.
- **Definition 4** (Section IV-C, p.7) : Poisoning Attack — R(q*; D') inter D_poi != vide, G(q*, R(q*;D')) "==" y_target.
- **Definition 5** (Section IV-C, p.7) : Trigger-Based Poisoning — Q* = {q in Q : exists t_i in T, t_i in q}, triggers tokens.
- Lien glossaire AEGIS : F15 (Sep(M)), F22 (ASR), F71 (DL-MIA RAG — nouveau), F72 (DP-retriever — nouveau)

### Pertinence these AEGIS
- **Couches delta :** Ce papier fournit un FRAMEWORK THEORIQUE pour categoriser les defenses par couche delta :
  - δ⁰ = DP sur le modele generateur (protection contre leakage)
  - δ¹ = DP sur le retriever (protection contre DL-MIA et poisoning)
  - δ² = detection de contradictions (non formalise ici)
  - δ³ = validation formelle de sortie (non formalise ici)
- **Conjectures :**
  - C2 (necessite de δ³) : SUPPORTEE — la formalisation montre que ni δ⁰ (DP modele) ni δ¹ (DP retriever) ne couvrent completement les attaques de poisoning adaptatives (Definition 5, triggers).
  - C6 (domaine medical plus vulnerable) : SUPPORTEE — l'exemple DL-MIA dans un contexte healthcare (Section IV-A, p.5) montre que la confidentialite des dossiers patients est directement menacee.
- **Decouvertes :**
  - D-006 (RAG comme surface d'attaque) : CONFIRMEE et FORMALISEE — premiere formalisation complete.
  - D-018 (membership inference sur RAG medical) : NOUVELLE DECOUVERTE — risque DL-MIA specifiquement identifie pour les RAG medicaux.
- **Gaps :**
  - G-014 (defense RAG formelle) : AVANCE — formalisation du threat model, mais pas de defenses formellement prouvees efficaces.
  - G-027 (DL-MIA pratique sur RAG medical) : CREE — le risque est formalise mais non valide experimentalement.
- **Mapping templates AEGIS :** #54-#62 (RAG poisoning), #85-#90 (IPI), #91-#97 (data exfiltration/leakage)

### Citations cles
> "There is currently no formal framework that comprehensively defines the privacy and security threats specific to RAG" (Abstract, p.1)
> "An adversary may infer whether a patient's record was part of the system's internal documents" (Section IV-A, p.5)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Non applicable — papier theorique sans experiences |
| Code disponible | Non |
| Dataset public | Non applicable |

### Classification AEGIS
- **Type d'attaque etudiee** : DL-MIA (membership inference) + Leakage Attack + IPI (poisoning) + Trigger-Based Poisoning — [SURVEY formel]
- **Surface ciblee** : RAG complet (retriever + knowledge base + generateur)
- **Modeles testes** : Aucun (papier formel)
- **Defense evaluee** : Differential Privacy sur retriever (proposee theoriquement)
- **MITRE ATLAS** : AML.T0051 (Prompt Injection), AML.T0040 (ML Model Inference API Access)
- **OWASP LLM** : LLM06 (Excessive Agency), LLM10 (Model Theft / Data Leakage)
