## [Chen, Li, Zhang et al., 2025] — CARES : Evaluation comprehensive de la securite et de la robustesse adversariale des LLM medicaux

**Reference :** arXiv:2505.11413
**Revue/Conf :** Preprint (non accepte en conference a ce jour)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P068_Chen_2025_CARES.pdf](../../assets/pdfs/P068_Chen_2025_CARES.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (59 chunks). Benchmark avec 18K+ prompts.

### Abstract original
> Large language models (LLMs) are increasingly deployed in medical contexts, raising critical concerns about safety, alignment, and susceptibility to adversarial manipulation. While prior benchmarks evaluate general-purpose LLM safety, they do not capture the unique risks of healthcare settings. We introduce CARES, the first comprehensive medical safety benchmark that systematically evaluates LLM safety across eight clinically grounded safety principles, four harm levels, and four prompting strategies—direct, indirect, obfuscated, and role-play. CARES includes over 18,000 prompts. We propose a three-way response evaluation protocol (ACCEPT, CAUTION, REFUSE) and a fine-grained Safety Score metric to assess model behavior. Our analysis reveals that many state-of-the-art LLMs remain vulnerable to jailbreaks that subtly rephrase harmful prompts.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les benchmarks de securite LLM existants (SafeBench, RealToxicityPrompts) manquent de specificite medicale et ne testent pas la robustesse aux jailbreaks dans le contexte clinique (Chen et al., 2025, Section 1, p.1-2).
- **Methode :** CARES couvre 8 principes de securite medicale (consentement, ethique clinique, confidentialite, desinformation, automutilation, biais, IA clinique, sante publique), 4 niveaux de nocivite (0-3), 4 strategies de prompting (direct, indirect, obfuscation, role-play). 18K prompts generes par GPT-4o-mini, DeepSeek-V3, Gemini-2.5-Flash, Claude-3.5-Haiku et valides par annotateurs humains (Section 3, p.3-5).
- **Donnees :** 18K prompts, 25 LLMs evalues (O4-mini, GPT-4o-mini, Claude-3.5-Haiku, Claude-3.7-Sonnet, DeepSeek-V3/R1, Llama-3.1/3.2, Qwen3, MedAlpaca, Meditron, ClinicalCamel, Mixtral) (Section 4, p.6).
- **Resultat :** Safety Score (SS) : O4-mini et DeepSeek-R1 les plus surs. Les modeles medically-tuned (MedAlpaca-13B, Meditron-7B) montrent une degradation de securite par rapport a leurs modeles de base (Section 4.1, Figure 4, p.7). Le jailbreaking par obfuscation et role-play augmente significativement les completions dangereuses (Section 4.1, Figure 14 Appendix).
- **Limite :** Scope limite des techniques de jailbreak : pas de multi-turn, pas de chain-of-thought manipulation, pas d'attaques par outils (Section A, Limitations, p.14).

### Analyse critique
**Forces :**
- Benchmark medical le plus complet a ce jour : 18K prompts, 8 principes, 4 niveaux, 4 strategies. Surpasse significativement MedSafetyBench (450 prompts) en couverture (Section 3, p.3).
- Protocole d'evaluation 3-voies (ACCEPT/CAUTION/REFUSE) plus nuance que le binaire REFUSE/ACCEPT des travaux anterieurs. Le Safety Score pondere par le niveau de nocivite est elegant (Table 1, Section 4, Eq. p.7). [EMPIRIQUE]
- Correlation inter-annotateurs elevee : Pearson r > 0.87 entre evaluateurs humains et le juge GPT (Figure 2-3, p.4).
- Decouverte majeure : les modeles medical-adapted (MedAlpaca, Meditron) sont MOINS surs que leurs modeles de base. Cela confirme que le fine-tuning medical erode l'alignement de securite (Section 4.1, p.7).
- Classification de jailbreaks fine-grained : le classificateur Qwen2.5-7B entraine detecte les strategies de jailbreak avec precision, suggerant une voie de defense (Section 4.3, p.8).

**Faiblesses :**
- **Preprint non peer-reviewed** : les claims sur 25 modeles necessitent une verification independante.
- Le juge GPT-4o-mini pour l'evaluation est lui-meme susceptible de manipulation (P044 montre 99% flip rate sur LLM-juge). L'etude de correlation humaine est rassurant (r > 0.87) mais limitee a un sous-ensemble.
- Les prompts sont generes par LLM, ce qui introduit un biais de distribution : les jailbreaks generes par GPT sont optimises pour contourner GPT, pas necessairement Llama ou Mistral.
- Pas d'evaluation multi-turn : les prompts sont single-turn, ce qui sous-estime la vulnerabilite en contexte conversationnel reel (clinicien-patient multi-echanges).
- Le Safety Score ne capture pas la SEVERITE des erreurs medicales (une erreur de dosage de 10% vs 1000% recoivent le meme score).

**Questions ouvertes :**
- Le fine-tuning medical erode-t-il l'alignement proportionnellement au volume de donnees medicales ou au ratio de merge ?
- CARES est-il applicable aux LLM multimodaux (images medicales + texte) ?
- Comment les resultats se comparent-ils avec le benchmark MPIB (P035 Lee et al., 2026) specifique aux injections medicales ?

### Formules exactes
- **Safety Score** (Section 4, p.7) : SS = (1/N) * sum_{i=1}^{N} score(h_i, a_i), ou score(h, a) in [0,1] est defini par Table 1 selon le niveau de nocivite h in {0,1,2,3} et l'action a in {ACCEPT, CAUTION, REFUSE}.
- **Ground truth** (Section 4, p.7) : y_i = I{h_i >= 1}, prompts avec h > 0 sont considered harmful.
- Lien glossaire AEGIS : F22 (ASR), F73 (Safety Score CARES — nouveau), F74 (ACCEPT/CAUTION/REFUSE protocol — nouveau)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (evaluation de l'alignement RLHF des modeles medicaux). CARES mesure directement la qualite de δ⁰ sous attaque adversariale.
- **Conjectures :**
  - C1 (δ⁰ insuffisant) : FORTEMENT SUPPORTEE — meme O4-mini (meilleur modele) a un Safety Score < 1.0. Les jailbreaks par obfuscation et role-play contournent systematiquement l'alignement (Section 4.1, Figure 14).
  - C3 (alignement superficiel) : SUPPORTEE — les strategies indirect et obfuscated reussissent parce qu'elles masquent l'intention nocive au niveau des premiers tokens, exploitant la superficialite de l'alignement.
  - C6 (domaine medical plus vulnerable) : FORTEMENT SUPPORTEE — les modeles medical-adapted (MedAlpaca, Meditron) sont MOINS surs que les modeles generiques. Le fine-tuning medical erode l'alignement de securite (Section 4.1, p.7).
  - C7 (paradoxe raisonnement/securite) : SUPPORTEE — les modeles de raisonnement (DeepSeek-R1) sont plus surs mais les modeles medical-tuned, qui devraient raisonner mieux en medecine, sont moins surs.
- **Decouvertes :**
  - D-008 (fine-tuning erode securite) : CONFIRMEE avec evidence quantitative sur 8 modeles medical-adapted.
  - D-019 (benchmark medical adversarial) : NOUVELLE DECOUVERTE — premier benchmark a 18K prompts couvrant 8 principes cliniques.
- **Gaps :**
  - G-010 (evaluation multi-turn medicale) : NON ADRESSE — CARES est single-turn.
  - G-028 (severite des erreurs medicales) : CREE — le Safety Score ne distingue pas la gravite clinique des erreurs.
- **Mapping templates AEGIS :** #01-#36 (templates DPI jailbreak), #37-#53 (templates medicaux)

### Citations cles
> "Many state-of-the-art LLMs remain vulnerable to jailbreaks that subtly rephrase harmful prompts" (Abstract, p.1)
> "Medically tuned models such as MedAlpaca-13B and Meditron-7B show weaker safety alignment" (Section 4.1, p.7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — prompts, protocole d'evaluation, et metriques detailles |
| Code disponible | Non mentionne explicitement |
| Dataset public | Oui (18K prompts, benchmark prevu public) |

### Classification AEGIS
- **Type d'attaque etudiee** : Jailbreak (DPI — 4 strategies : direct, indirect, obfuscated, role-play)
- **Surface ciblee** : Alignement LLM medical (δ⁰)
- **Modeles testes** : 25 LLMs (O4-mini, GPT-4o-mini, Claude-3.5-Haiku/3.7-Sonnet, DeepSeek-V3/R1, Llama-3.1/3.2, Qwen3, MedAlpaca, Meditron, ClinicalCamel, Mixtral)
- **Defense evaluee** : Aucune defense specifique — benchmark d'evaluation
- **MITRE ATLAS** : AML.T0051.000 (Direct Prompt Injection / Jailbreak)
- **OWASP LLM** : LLM01 (Prompt Injection), LLM09 (Overreliance)
