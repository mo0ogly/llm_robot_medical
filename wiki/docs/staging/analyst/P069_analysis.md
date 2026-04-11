## [Corbeil, Kim, Griot et al., 2025] — MedRiskEval : Benchmark d'evaluation des risques medicaux des LLM avec perspectives multi-utilisateurs

**Reference :** arXiv:2507.07248
**Revue/Conf :** EACL 2026 Industry Track (CORE A)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P069_Corbeil_2025_MedRiskEval.pdf](../../assets/pdfs/P069_Corbeil_2025_MedRiskEval.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (63 chunks)

### Abstract original
> As the performance of large language models (LLMs) continues to advance, their deployment in the medical domain raises serious safety concerns. In this paper, we introduce MedRiskEval, a medical risk evaluation benchmark tailored to the medical domain. To fill the gap in previous benchmarks that only focused on the clinician perspective, we introduce a new patient-oriented dataset called PatientSafetyBench containing 466 samples across 5 critical risk categories. Leveraging our new benchmark alongside existing datasets, we evaluate 15 general-purpose and medically adapted LLM variants. Surprisingly, most medical-specific models do not show significant safety improvements on patient-oriented risks. Even the advanced GPT-4.1 family achieves at most a refusal rate of 58.2%.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les benchmarks medicaux existants (MedSafetyBench) ne couvrent que la perspective clinicien (intention malveillante). La perspective patient (utilisateur vulnerable, non expert) n'est pas evaluee (Corbeil et al., 2025, Section 1, p.1).
- **Methode :** MedRiskEval combine 3 perspectives : (1) PatientSafetyBench (PSB, 466 echantillons, 5 categories de risque patient), (2) MedSafetyBench (MSB, 450 echantillons, 9 categories AMA), (3) benchmarks generaux (XSTest, JailBreakBench, FACTS). Evaluation par echelle de nocivite 1-5 (refuse, cautionary, unsafeguarded, partial violation, fully harmful) (Section 3, p.2-5).
- **Donnees :** 466 prompts PSB generes et valides par medecins (inter-annotateur r=0.498, p=5.5e-6). 15 LLMs : GPT-4.1 (nano/mini/full), Phi-3.5 + 7 variantes MediPhi, Gemma3 + MedGemma, Llama3 + Med42 (Section 3, p.2-6).
- **Resultat :** GPT-4.1 : taux de refus max 58.2% sur PSB (Section 3.1.9, p.5). Les variantes medicales ne montrent PAS d'amelioration significative de securite patient. MediPhi-Instruct degrade la securite par rapport a Phi-3.5 (Figure 2, p.5). Tous les modeles sont significativement vulnerables sur "Unlicensed Practice" et "Bias/Discrimination" (Figure 3, p.5).
- **Limite :** PSB est petit (466 echantillons). Les prompts sont single-turn. Le scoring est semi-automatique (o3-mini juge, valide par medecins sur un sous-ensemble) (Section 5, Limitations, p.7).

### Analyse critique
**Forces :**
- Perspective patient unique et justifiee : les patients posent des questions differentes des cliniciens (dosages, auto-diagnostic, pratique non-medicale). PSB couvre 5 categories pertinentes : conseils dangereux, surconfiance/erreur de diagnostic, pratique non-autorisee, desinformation, discrimination (Section 3.1, p.3-4).
- Validation medicale rigoureuse : 2 medecins annotateurs, scores de pertinence moyen 3.9/4, correlation inter-annotateur r=0.498 (Section 3.1.8, p.4).
- Decouverte critique : le fine-tuning medical (MediPhi, MedGemma, Med42) n'ameliore PAS la securite patient et peut la degrader. MediPhi-Instruct augmente les reponses cautionary et harmful de ~10 (Section 3.1.9, Figure 2, p.5).
- Comparaison multi-perspective : la meme question vue par patient vs clinicien vs utilisateur general donne des profils de risque differents, justifiant l'approche multi-benchmark.
- Industrie track EACL 2026 : pertinence deployment direct, pas seulement academique.

**Faiblesses :**
- PSB petit (466 echantillons) : puissance statistique limitee pour des analyses par sous-categorie (93 par categorie en moyenne).
- La correlation inter-annotateur r=0.498 est moderee (pas forte). Cela reflete la subjectivite inherente a l'evaluation de la nocivite medicale mais limite la fiabilite des gold labels.
- L'echelle de nocivite 1-5 n'est pas directement comparable avec le Safety Score de CARES (P068) : probleme d'interoperabilite des benchmarks.
- Les modeles MediPhi sont des variantes de merge (coefficients 10-50%) non optimisees pour la securite. La degradation observee pourrait etre un artefact du processus de merge plutot qu'une propriete generale du fine-tuning medical.
- Pas de test de jailbreaking multi-strategies (contrairement a CARES P068 qui teste 4 strategies).

**Questions ouvertes :**
- Le fine-tuning medical avec des donnees explicitement filtrees pour la securite ameliorerait-il PSB ?
- Comment les scores PSB se comparent-ils avec les resultats CARES (P068) sur les memes modeles ?
- MedRiskEval est-il applicable aux LLM multilingues (patients non-anglophones) ?

### Formules exactes
- **Harmful Score** (Section 3.1.9, Figure 3, p.5) : Score moyen sur echelle 0-3 par categorie et par modele. Score bas = plus sur.
- **Refusal Rate** (Section 3.3, p.6) : Proportion de reponses classees "Refuse" par le juge o3-mini.
- **Correlation inter-annotateur** (Section 3.1.8, p.4) : r = 0.498, p = 5.5e-6.
- Pas de formule mathematique complexe — benchmark empirique. [EMPIRIQUE]
- Lien glossaire AEGIS : F22 (ASR inverse — refusal rate), F73 (Safety Score — via CARES), F75 (PatientSafetyBench metrics — nouveau)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (evaluation directe de l'alignement medical). MedRiskEval mesure la qualite de δ⁰ du point de vue du patient, completant CARES (P068) qui couvre plus de strategies adversariales.
- **Conjectures :**
  - C1 (δ⁰ insuffisant) : FORTEMENT SUPPORTEE — GPT-4.1 (meilleur modele) ne refuse que 58.2% des requetes patients dangereuses. δ⁰ laisse passer 41.8% de contenu nocif cote patient.
  - C6 (domaine medical plus vulnerable) : FORTEMENT SUPPORTEE — le fine-tuning medical DEGRADE la securite. MediPhi-Instruct est MOINS sur que Phi-3.5 base (Section 3.1.9, Figure 2). Les variantes medicales de Gemma3 et Llama3 montrent des patterns similaires (+0.19 degradation sur biais, Section 3.1.9, p.5).
  - C3 (alignement superficiel) : SUPPORTEE — les modeles refusent sur certaines categories (advice) mais echouent sur d'autres (bias, unlicensed practice), suggerant que l'alignement couvre des patterns de surface mais pas le raisonnement ethique profond.
- **Decouvertes :**
  - D-008 (fine-tuning erode securite) : CONFIRMEE avec evidence specifique patient-oriented. Convergence avec P068 (CARES).
  - D-020 (gap patient vs clinicien) : NOUVELLE DECOUVERTE — les risques patient sont structurellement differents des risques clinicien et necessitent une evaluation separee.
- **Gaps :**
  - G-010 (evaluation multi-turn medicale) : NON ADRESSE — PSB est single-turn.
  - G-028 (severite clinique des erreurs) : CONFIRME — PSB ne distingue pas la gravite medicale des erreurs (erreur benigne vs potentiellement letale).
  - G-029 (benchmark patient multilingue) : CREE — PSB est anglais uniquement.
- **Mapping templates AEGIS :** #37-#53 (templates medicaux)

### Citations cles
> "Most medical-specific models do not show significant safety improvements on patient-oriented risks" (Abstract, p.1)
> "Even the advanced GPT-4.1 family achieves at most a refusal rate of 58.2%" (Section 1, p.2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — dataset public prevu, protocole detaille, validation medicale |
| Code disponible | Non mentionne |
| Dataset public | Oui (PatientSafetyBench 466 samples, prevu public) |

### Classification AEGIS
- **Type d'attaque etudiee** : Evaluation de securite medicale (pas d'attaque specifique — benchmark)
- **Surface ciblee** : Alignement medical LLM (δ⁰), perspective patient
- **Modeles testes** : 15 LLMs (GPT-4.1 famille, Phi-3.5 + MediPhi x7, Gemma3 + MedGemma, Llama3 + Med42)
- **Defense evaluee** : Aucune defense specifique — benchmark d'evaluation
- **MITRE ATLAS** : AML.T0051.000 (Prompt-based exploitation of medical LLM)
- **OWASP LLM** : LLM01 (Prompt Injection), LLM09 (Overreliance on medical advice)
