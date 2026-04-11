## [Sekar, Agarwal, Sharma et al., 2026] — ZEDD : Detection zero-shot de derive d'embedding contre les injections de prompt

**Reference :** arXiv:2601.12359v1
**Revue/Conf :** NeurIPS 2025 Lock-LLM Workshop (pas conference principale)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P078_Sekar_2026_ZEDD.pdf](../../assets/pdfs/P078_Sekar_2026_ZEDD.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (39 chunks)

### Abstract original
> Prompt injection attacks have become an increasing vulnerability for LLM applications, where adversarial prompts exploit indirect input channels such as emails or user-generated content to circumvent alignment safeguards and induce harmful or unintended outputs. Despite advances in alignment, even state-of-the-art LLMs remain broadly vulnerable to adversarial prompts, underscoring the urgent need for robust, productive, and generalizable detection mechanisms beyond inefficient, model-specific patches. In this work, we propose Zero-Shot Embedding Drift Detection (ZEDD), a lightweight, low-engineering-overhead framework that identifies both direct and indirect prompt injection attempts by quantifying semantic shifts in embedding space between benign and suspect inputs. ZEDD operates without requiring access to model internals, prior knowledge of attack types, or task-specific retraining, enabling efficient zero-shot deployment across diverse LLM architectures. Our method uses adversarial-clean prompt pairs and measures embedding drift via cosine similarity, to capture subtle adversarial manipulations inherent to real-world injection attacks.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les defenses contre les prompt injections existantes sont lourdes computationnellement, specifiques a un modele, ou necessitent des connaissances prealables des types d'attaque (Section 1, p. 1-2).
- **Methode :** ZEDD mesure la derive semantique (embedding drift) via la similarite cosinus entre paires de prompts propres et suspects. Seuil de detection determine automatiquement par un GMM (Gaussian Mixture Model) a 2 composantes avec cap de FPR a 3%. Fine-tuning des embeddings de 4 modeles encodeurs (Section 3-4, p. 3-5).
- **Donnees :** Dataset LLMail-Inject re-annote : 172,673 entrees categoriees apres filtrage (initial 461,640 → deduplique → filtre anglais → categorise), 51,603 paires de test ; 5 categories d'injection : Clean, Encoding Manipulation, Jailbreak, Prompt Confusion, System Leak, Task Override (Table 3, Appendix C, p. 14).
- **Resultat :** Accuracy >93% sur tous les modeles ; Llama-3 8B Instruct : 95.32% accuracy, 95.85% precision, 94.75% recall, 95.30% F1, 5.5% FPR ; Mistral 7B : 95.55% accuracy, 2.3% FPR ; SBERT : 90.75% accuracy mais 81.78% recall (Table 1-2, p. 6).
- **Limite :** Dependance a la qualite de l'embedding choisi ; modeles plus petits/grands ont des espaces semantiques differents ; tradeoff lightweight vs robustesse — certaines injections peuvent bypasser ZEDD ; format email (LLMail-Inject) peut limiter la generalisabilite (Section 6, p. 7).

### Analyse critique
**Forces :**
- Zero-shot : pas besoin de connaitre les types d'attaque a l'avance — deploiement immediat sur de nouvelles architectures (Section 2, p. 2).
- Lightweight et rapide : fine-tuning en 15-18 minutes sur NVIDIA B200 ; inference en batch de 64 paires (Section 5, p. 5).
- 5 categories d'attaque couvertes avec des resultats detailles par categorie (Table 1, p. 6) — granularite utile.
- Intervalles de confiance a 95% rapportes (Table 4, Appendix D, p. 15) — rigueur statistique.
- Code public : https://github.com/AnirudhSekar/ZEDD/

**Faiblesses :**
- Le "zero-shot" est trompeur : ZEDD necessite un fine-tuning des embeddings (15-18 min) sur des paires adversariales-propres — ce n'est pas zero-shot au sens strict.
- FPR de 5.5% sur Llama-3 8B est eleve pour un deploiement production en milieu medical (1 fausse alerte sur 18 requetes propres).
- Jailbreak et Encoding Manipulation sont les categories les plus faibles : 86.2% et 86.7% pour SBERT (Table 1, p. 6) — exactement les categories critiques pour la these.
- Dataset LLMail-Inject = format email uniquement — pas de validation sur des formats cliniques (SOAP notes, prescriptions, consignes chirurgicales).
- GMM pour le seuil de detection = choix heuristique sans justification theorique.
- Workshop paper (pas conference principale) — poids scientifique limite.

**Questions ouvertes :**
- ZEDD detecte-t-il les injections cross-linguales (francais/anglais) utilisees dans AEGIS ?
- Comment ZEDD se comporte-t-il sur des prompts medicaux longs avec des termes techniques ambigus ?
- ZEDD + ISE (P076) ou PFT (P077) = defense en couches viable ?

### Formules exactes
- **Embedding drift** : drift(p_clean, p_suspect) = 1 - cosine_similarity(embed(p_clean), embed(p_suspect)) (Section 3, p. 3). [HEURISTIQUE — pas de borne theorique sur le seuil optimal]
- **Seuil GMM** : 2-component GMM sur les scores de drift, avec cap FPR a 3% et cible de ~50% taux de flag global (Section 5, p. 5).
Lien glossaire AEGIS : F15 (Sep(M) — ZEDD mesure une forme operationnelle de separation dans l'espace d'embedding, comparable a Sep(M) de Zverev et al., 2025)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (detection d'injection sur l'entree directe — PERTINENT), δ¹ (detection d'injection dans les donnees RAG — PRIMAIRE : ZEDD est concu pour les canaux indirects comme emails), δ² (filtre dans un pipeline agent — PERTINENT)
- **Conjectures :** C3 (separation instruction-donnee mesurable) — SUPPORTEE : le drift cosinus est une mesure concrete de cette separation ; C5 (defense architecturale) — PARTIELLEMENT SUPPORTEE : ZEDD est embedding-level, intermediaire entre prompt et architecture
- **Decouvertes :** D-015 (detecteurs embedding-based viables) — CONFIRMEE avec nuances (FPR elevee, categories faibles)
- **Gaps :** G-004 (detection zero-shot cross-domain) — PARTIELLEMENT ADRESSE ; G-011 (detection en contexte medical) — NON ADRESSE (pas de test medical)
- **Mapping templates AEGIS :** #30-#40 (injection indirecte — cible principale de ZEDD), #50-#55 (encoding manipulation — categorie faible)

### Citations cles
> "Greater than 93% accuracy in classifying prompt injections across model architectures like Llama 3, Qwen 2, and Mistral with a false positive rate of <3%." (Section Abstract, p. 1)
> "The drift quality is directly tied to the embedding model that is chosen which could pose limitations." (Section 6, Limitations, p. 7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Haute — code public, dataset public (LLMail-Inject), modeles open-source |
| Code disponible | Oui (https://github.com/AnirudhSekar/ZEDD/) |
| Dataset public | Oui (LLMail-Inject compile a partir de sources publiques) |
