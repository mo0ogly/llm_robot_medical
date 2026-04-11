## [Tan, Luan, Luo et al., 2025] — RevPRAG : Detection d'empoisonnement RAG par analyse des activations internes du LLM

**Reference :** arXiv:2411.18948
**Revue/Conf :** Findings of EMNLP 2025 (CORE A*)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P063_Tan_2025_RevPRAG.pdf](../../assets/pdfs/P063_Tan_2025_RevPRAG.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (65 chunks)

### Abstract original
> Retrieval-Augmented Generation (RAG) enhances LLMs by incorporating external knowledge databases. However, the reliance on these databases introduces a new attack surface. RAG poisoning attack involves injecting malicious texts into the knowledge database, ultimately leading to the generation of the attacker's target response (also called poisoned response). However, there are currently limited methods available for detecting such poisoning attacks. We aim to bridge the gap in this work by introducing RevPRAG, a flexible and automated detection pipeline that leverages the activations of LLMs to determine whether a response is poisoned. RevPRAG uses a lightweight model that analyzes the LLM's internal states, achieving high detection accuracy with minimal computational overhead.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les attaques d'empoisonnement RAG produisent des reponses erronees, mais les methodes de detection existantes (CoS, MDP, Factoscope) ne sont pas optimisees pour le contexte RAG (Tan et al., 2025, Section 2, p.2-3).
- **Methode :** RevPRAG collecte les activations du LLM (couche par couche pour le dernier token), les normalise (z-score), puis entraine un classificateur CNN leger inspire des reseaux siamois avec triplet margin loss pour distinguer activations "correctes" vs "empoisonnees" (Section 4, Figure 3, Eq. 1-2).
- **Donnees :** 3 datasets (NQ, HotpotQA, MS-MARCO). 5 LLMs (GPT2-XL 1.5B, Llama2-7B, Llama2-13B, Mistral-7B, Llama3-8B). 4 retrievers (Contriever, Contriever-ms, DPR-mul, ANCE). 3 strategies de generation de poison (PoisonedRAG, GARAG, PAPRAG) (Section 5.1, p.6).
- **Resultat :** TPR 97-99% avec FPR 0.1-6% sur les configurations par defaut (Table 1-2, p.6). Surpasse CoS, MDP, Factoscope, RoBERTa, Discern (Table 3, p.7). Fonctionne aussi sur questions ouvertes : TPR 98-99%, FPR < 3.3% (Table 6, p.8).
- **Limite :** Necessite un LLM white-box (acces aux activations internes), ce qui exclut les LLM proprietaires comme GPT-4 ou Claude en mode API (Section 6, Limitations, p.9).

### Analyse critique
**Forces :**
- Approche fondamentalement differente des defenses au niveau retrieval (P061, P062) : detecte au niveau de la REPONSE, pas du document. Cela couvre les attaques qui passent les filtres de retrieval mais corrompent quand meme la generation.
- Visualisation t-SNE convaincante montrant une separabilite claire entre activations correctes et empoisonnees, meme cross-modeles (Figure 2, p.3). Cela supporte la conjecture que l'empoisonnement laisse une "empreinte" detectible dans les etats internes du LLM.
- Robustesse au bruit : 10-50% de textes propres modifies avec 10% de bruit lexical ne degrade pas significativement la detection (Table 7, p.8).
- Efficacite : temps d'inference par echantillon 4-9x plus rapide que Factoscope (Table 8, p.9).
- Evaluation cross-retriever et cross-LLM systematique avec 20 combinaisons (Table 2, p.7).

**Faiblesses :**
- Dependance white-box : en contexte AEGIS, les LLM medicaux deployes sont souvent des API proprietaires. RevPRAG est donc limite aux deployments open-source (Llama, Mistral).
- Le support set (100 echantillons par defaut) doit etre constitue avec des exemples de reponses empoisonnees — requiert un jeu d'attaques connu a priori. Peu realiste pour les nouvelles attaques zero-day.
- Pas de test sur des LLM > 13B (pas de Llama-70B, pas de modeles de taille production). La separabilite des activations pourrait diminuer avec des modeles plus grands.
- L'utilisation de la cosine similarity pour evaluer les questions ouvertes (Section 5.4, p.8) est moins fiable que l'evaluation exacte pour les questions fermees.

**Questions ouvertes :**
- RevPRAG detecte-t-il les attaques composites (P054 PIDP) ou les reponses partiellement empoisonnees (mix de contenu correct et incorrect) ?
- Les activations sont-elles suffisamment stables entre runs (temperature > 0) pour une detection en production ?
- Comment la detection se comporte-t-elle sur des LLM medical-adapted (Meditron, MedPaLM) ?

### Formules exactes
- **Eq. 1** (Section 4.3, p.5) : Normalisation z-score — Act_norm = (Act_n - mu) / sigma, ou mu et sigma sont calcules par couche.
- **Eq. 2** (Section 4.4, p.5) : Triplet margin loss — L = max(Dist(x_a, x_p) - Dist(x_a, x_n) + margin, 0), ou Dist est la distance euclidienne sur les features CNN.
- Lien glossaire AEGIS : F22 (ASR), F67 (TPR/FPR detection RAG — nouveau)

### Pertinence these AEGIS
- **Couches delta :** δ² (detection au niveau generation — analyse des activations internes). Complementaire a δ¹ (P061, P062) car opere APRES le retrieval.
- **Conjectures :**
  - C3 (alignement superficiel) : SUPPORTEE — la separabilite des activations entre reponses correctes et empoisonnees (Figure 2) suggere que le LLM "sait" en interne que la reponse est suspecte meme quand il la genere, confirmant la superficialite de l'alignement.
  - C2 (necessite de δ³) : NEUTRE — RevPRAG fournit une forme de δ² (detection post-generation) mais ne constitue pas une validation formelle δ³.
- **Decouvertes :**
  - D-006 (RAG comme surface d'attaque) : CONFIRMEE.
  - D-015 (empreinte interne detectible) : NOUVELLE DECOUVERTE — les activations du LLM portent une signature de l'empoisonnement RAG, exploitable pour la detection.
- **Gaps :**
  - G-014 (defense RAG formelle) : NON ADRESSE — pas de garantie formelle de detection.
  - G-023 (detection white-box vs black-box) : CREE — RevPRAG ne fonctionne qu'en white-box, creant un gap pour les deployments API.
- **Mapping templates AEGIS :** #54-#62 (RAG poisoning), #85-#90 (IPI)

### Citations cles
> "RevPRAG achieved 98.5% TPR and 0.9% FPR on NQ for RAG with Llama2-7B" (Table 1, Section 5.2, p.6)
> "Our approach requires accessing the activations of the LLM, which necessitates the LLM being a white-box model" (Section 6, p.9)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — datasets standards, methode documentee, code prevu open-source |
| Code disponible | Annonce open-source (Ethics Statement, p.9) |
| Dataset public | Oui (NQ, HotpotQA, MS-MARCO) |

### Classification AEGIS
- **Type d'attaque etudiee** : IPI (corpus poisoning — detection cote reponse)
- **Surface ciblee** : LLM activations (generation phase, post-retrieval)
- **Modeles testes** : GPT2-XL 1.5B, Llama2-7B/13B, Mistral-7B, Llama3-8B (LLMs) + Contriever, Contriever-ms, DPR-mul, ANCE (retrievers)
- **Defense evaluee** : RevPRAG (activation-based detection) — methode proposee
- **MITRE ATLAS** : AML.T0051.002 (Indirect Prompt Injection via RAG)
- **OWASP LLM** : LLM06 (Excessive Agency via poisoned retrieval)
