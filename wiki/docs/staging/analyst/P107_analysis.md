## [Han, Kumar, Agarwal, Lakkaraju, 2024] — MedSafetyBench : premier benchmark de securite medicale pour LLM

**Reference :** arXiv:2403.03744
**Revue/Conf :** NeurIPS 2024 (accepte)
**Lu le :** 2026-04-08
> **PDF Source**: [literature_for_rag/P107_medsafetybench.pdf](../../assets/pdfs/P107_medsafetybench.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (126 chunks)

### Abstract original
> As large language models (LLMs) develop increasingly sophisticated capabilities and find applications in medical settings, it becomes important to assess their medical safety due to their far-reaching implications for personal and public health. To address this gap, we first define the notion of medical safety in LLMs based on the Principles of Medical Ethics set forth by the American Medical Association. We then leverage this understanding to introduce MedSafetyBench, the first benchmark dataset designed to measure the medical safety of LLMs. We demonstrate the utility of MedSafetyBench by using it to evaluate and improve the medical safety of LLMs. Our results show that publicly-available medical LLMs do not meet standards of medical safety and that fine-tuning them using MedSafetyBench improves their medical safety while preserving their medical performance.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les benchmarks de securite existants (ToxiGen, SafetyPrompts) ne couvrent pas les risques specifiques au domaine medical ; la securite medicale necessite une definition propre basee sur les principes ethiques AMA (Han et al., 2024, Section 1, p.1-2).
- **Methode :** Definition de la securite medicale via 4 principes AMA (beneficence, non-maleficence, autonomie, justice). Creation de MedSafetyBench : prompts medicaux dangereux + demonstrations de securite. Evaluation via score de nocivite (harmfulness score 1-5) par LLM-juge (GPT-4, Llama-2) et validation par medecins (Section 3, Appendix A, D).
- **Donnees :** MedSafetyBench contient 900 prompts medicaux dangereux (MedSafety-Eval) + 900 demonstrations de securite (MedSafety-Improve). 14 LLM evalues dont 4 modeles medicaux. Public, code sur GitHub (Section 3, p.3-4).
- **Resultat :** Les LLM medicaux (Medalpaca-13b, Meditron-70b, ClinicalCamel-70b, Med42-70b) ont des scores de nocivite significativement plus eleves que les LLM generiques alignes sur la securite (p < 0.001, correction Bonferroni) (Section 4.1, Figure 2, Appendix B Table 3).
- **Limite :** Focus sur les modeles 7B et 13B pour le fine-tuning en raison des contraintes computationnelles ; les modeles plus grands pourraient reagir differemment au fine-tuning de securite (Section 5).

### Analyse critique
**Forces :**
- Premier benchmark dedie a la securite medicale des LLM, fondee sur les principes ethiques AMA — comble un vide important dans la litterature (Section 1, p.1-2).
- Validation par des medecins : l'etude en Appendix D montre que les experts medicaux sont en accord avec l'evaluation automatique, renforçant la validite du benchmark (Appendix D, Section D.1).
- Resultat principal robuste statistiquement : les comparaisons entre LLM medicaux et generiques utilisent la correction Bonferroni (seuil 0.05/45 = 0.001) sur 45 comparaisons par paire (Appendix B, p.23).
- Le fine-tuning de securite preserva la performance medicale : pas de degradation sur MedQA, MedMCQA, PubMedQA, MMLU-Medical apres fine-tuning (Figures 9, 10, 11, 12 en Appendix C).
- Code et donnees publics (GitHub AI4LIFE-GROUP/med-safety-bench), permettant la reproductibilite.

**Faiblesses :**
- LLM-juge (GPT-4 et Llama-2) pour l'evaluation de la nocivite : susceptible aux biais de l'evaluateur automatique (P044 montre 99% flip rate). La validation medecins mitige mais ne couvre qu'un sous-ensemble.
- Benchmark single-turn uniquement : ne capture pas la degradation multi-tour documentee par P108 (JMedEthicBench montre 9.5 -> 5.5 en 3 tours).
- 900 prompts est relativement modeste compare a CARES (18K prompts, P068) — la couverture des scenarios medicaux est limitee.
- Le fine-tuning amelioratif est teste uniquement sur des modeles 7B-13B ; la generalisation aux modeles plus grands (70B+) et aux architectures recentes (Llama-3, Mistral) n'est pas demontree.

**Questions ouvertes :**
- Le fine-tuning de securite medicale resiste-t-il a des attaques adversariales sophistiquees (multi-turn, cross-lingual, encoding) ?
- L'erosion de securite est-elle proportionnelle a la quantite de donnees medicales ou au type de fine-tuning (LoRA vs full) ?
- MedSafetyBench capture-t-il les risques lies aux outils et agents (RAG, function calling) ?

### Formules exactes
- **Harmfulness Score** (Section 4, p.5) : score de nocivite sur echelle 1-5 par LLM-juge. 1 = refus complet, 5 = reponse pleinement nocive. Moyenne calculee sur l'ensemble des prompts par modele.
- **Correction Bonferroni** (Appendix B, p.23) : seuil de significativite ajuste a 0.05/45 = 0.001 pour 45 comparaisons par paire entre modeles.
- Lien glossaire AEGIS : F22 (ASR — equivalent inverse du harmfulness), F73 (Safety Score)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (mesure directe de l'alignement RLHF des LLM medicaux — les modeles medical-tuned echouent sur la couche de base).
- **Conjectures :**
  - C6 (domaine medical plus vulnerable) : FORTEMENT SUPPORTEE — les LLM medicaux (Medalpaca, Meditron, ClinicalCamel, Med42) ont des scores de nocivite significativement superieurs aux LLM generiques alignes (Section 4.1, Figure 2). Le fine-tuning medical erode l'alignement RLHF acquis.
  - C1 (δ⁰ insuffisant) : SUPPORTEE — meme les LLM generiques alignes ne refusent pas systematiquement les requetes medicales dangereuses (harmfulness score moyen > 1.5 pour les meilleurs modeles).
  - C3 (alignement superficiel) : SUPPORTEE indirectement — le fine-tuning de securite avec seulement 900 demonstrations ameliore significativement la securite, suggerant que l'alignement original est fragile et superficiel.
- **Gaps :** G-008 (manque de benchmark medical standardise — partiellement adresse par MedSafetyBench)

### Citations cles
> "publicly-available medical LLMs do not meet standards of medical safety" (Section 1, p.1)
> "fine-tuning them using MedSafetyBench improves their medical safety while preserving their medical performance" (Section 1, p.2)
> "medical LLMs are more 'willing' to comply with both harmful general and medical requests than their general-knowledge counterparts" (Section 4.1, p.6)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — code et donnees publics, 14 modeles, validation medecins |
| Code disponible | Oui (https://github.com/AI4LIFE-GROUP/med-safety-bench) |
| Dataset public | Oui (MedSafetyBench, 1800 items) |
