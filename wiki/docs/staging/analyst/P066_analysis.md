## [Patil, 2026] — RAGShield : Defense en profondeur par verification de provenance pour les systemes RAG gouvernementaux

**Reference :** arXiv:2604.00387
**Revue/Conf :** Preprint (soumis 2026-04-01, non accepte en conference)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P066_Patil_2026_RAGShield.pdf](../../assets/pdfs/P066_Patil_2026_RAGShield.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (43 chunks). Auteur unique. Tres recent (3 jours avant lecture). A evaluer avec prudence.

### Abstract original
> Retrieval-Augmented Generation (RAG) systems are increasingly deployed across federal agencies for citizen-facing services including tax guidance, benefits eligibility, and legal information. These systems are vulnerable to knowledge base poisoning attacks. RAGShield introduces: (1) C2PA-inspired cryptographic document attestation that blocks unsigned and forged documents at ingestion; (2) trust-weighted retrieval that prioritizes provenance-verified sources; (3) a formal taint lattice with cross-source contradiction detection that catches insider threats even when provenance is valid; (4) provenance-aware generation with auditable citations; and (5) NIST SP 800-53 compliance mapping. Evaluation on a 500-passage NQ corpus with 63 attack documents and 200 queries shows RAGShield achieves 0.0% ASR across all tiers including adaptive attacks (95% CI: [0.0%, 1.9%]) while maintaining 0.0% false positive rate.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les systemes RAG gouvernementaux (USAi.Gov, IRS, Medicare) sont vulnerables aux attaques d'empoisonnement de base de connaissances, avec des consequences directes sur les citoyens (erreurs fiscales de $50-$1000) (Patil, 2026, Section I, p.1-2).
- **Methode :** Defense en 5 couches — L1 : attestation cryptographique C2PA des documents a l'ingestion ; L2 : retrieval pondere par la confiance ; L3 : treillis de taint formel avec detection de contradictions cross-sources ; L4 : generation avec citations de provenance ; L5 : conformite NIST SP 800-53 (Section III-V, p.3-6).
- **Donnees :** 500 passages NQ, 63 documents d'attaque, 200 requetes. 5 tiers d'adversaires (T1 externe, T2 forgeur, T3 insider, T4 Phantom, T5 adaptatif). Comparaison avec RobustRAG et RAGDefender (Section VII, p.7).
- **Resultat :** ASR 0.0% (95% CI: [0.0%, 1.9%]) sur tous les tiers T1-T5 pour RAGShield-Full. FPR 0.0%. RobustRAG : 0-0.5% ASR. RAGDefender : 7.5-12.5% ASR (Table VI, p.7). MAIS : attaque T6 (remplacement in-place par insider) atteint 17.5% ASR (Table X, p.8).
- **Limite :** L'evaluation utilise seulement 500 passages (vs 2.6M pour NQ complet). L'infrastructure de signature cryptographique des documents n'existe pas encore pour la plupart des documents gouvernementaux (Section IX, p.9).

### Analyse critique
**Forces :**
- Approche originale : premier travail a appliquer la verification de provenance supply chain (C2PA/SLSA) aux pipelines RAG. L'analogie avec les attaques supply chain software (SolarWinds) est pertinente et fournit un cadre conceptuel solide (Section I, p.2).
- Formalisation mathematique rigoureuse : treillis de taint a 8 elements avec proprieties de monotonie prouvees (Theorem 2-3, p.4-5). [THEOREME]
- Theorem 1 : borne superieure sur l'ASR sous provenance — ASR_L1 <= (1-p)*ASR_baseline, ou p est la fraction attestee (Section IV, p.5). [THEOREME]
- Mapping NIST SP 800-53 Rev 5 : premier travail a fournir un alignement formel entre defenses RAG et controles de securite federaux (Table XI, p.9).
- Honnetete sur les limites : l'attaque T6 (remplacement in-place) a 17.5% ASR est rapportee transparemment (Table X, p.8).

**Faiblesses :**
- **Evaluation a petite echelle** : 500 passages est tres insuffisant pour valider une defense RAG. Les resultats P061-P065 utilisent 2.6M-8.8M documents. Les intervalles de confiance [0%, 1.9%] refletent cette faible puissance statistique.
- **Auteur unique, preprint de 3 jours** : aucune review par les pairs. Les claims de "0% ASR" doivent etre traitees avec extreme prudence.
- **Hypothese d'infrastructure** : la defense L1 (attestation cryptographique) suppose une PKI pour signer les documents. Cette infrastructure n'existe pas et son deploiement est un probleme organisationnel majeur, pas technique.
- **Simulations simplistes** : les adversaires T1-T5 sont definis par l'auteur, pas par des attaques publiees. L'attaque adaptative T5 est auto-definie et peut ne pas representer les capacites reelles d'un attaquant.
- **Pas de comparaison avec GMTP (P061) ni RAGuard (P062)** : comparaison limitee a RobustRAG et RAGDefender.
- **Le treillis de taint est trivial** : 8 elements avec un join/meet standard. La contribution formelle est modeste.

**Questions ouvertes :**
- L'approche de provenance scale-t-elle a des millions de documents non signes (corpus Wikipedia, PubMed) ?
- Comment gerer les mises a jour legitimes de documents (le hash-pinning bloque toute modification) ?
- Quelle est l'interaction avec les attaques par prompt injection directe (DPI), non couvertes par la provenance ?

### Formules exactes
- **Theorem 1** (Section IV, p.5) : ASR_L1 <= (1-p) * ASR_baseline, ou p = fraction de documents attestes.
- **Theorem 2** (Section IV, p.5) : Taint non-decroissant — taint(c) >= taint(source(c)) pour tout chunk c.
- **Theorem 3** (Section IV, p.5) : Monotonie de confiance — taint(context) = join(taint(c_1), ..., taint(c_k)).
- **Treillis** (Section III-C, p.4) : {PRISTINE, ATTESTED, VERIFIED, UNVERIFIED, LOW_TRUST, TAINTED, CONFLICTED, COMPROMISED} ordonne par <=.
- Lien glossaire AEGIS : F22 (ASR), F70 (provenance-verified RAG — nouveau)

### Pertinence these AEGIS
- **Couches delta :** δ¹ (verification de provenance a l'ingestion) + δ² (detection de contradictions cross-sources) + δ³ (audit trail avec citations de provenance). C'est la SEULE defense parmi P061-P070 qui couvre les 3 couches δ¹-δ³.
- **Conjectures :**
  - C2 (necessite de δ³) : FORTEMENT SUPPORTEE — l'architecture multi-couches de RAGShield illustre concretement comment δ¹+δ²+δ³ cooperent. L'echec de T6 (17.5% ASR quand δ¹ est contournee par un insider) confirme que CHAQUE couche est necessaire.
  - C6 (domaine medical plus vulnerable) : SUPPORTEE INDIRECTEMENT — le contexte gouvernemental (erreurs de $50-$1000) est analogiquement transposable au medical (erreurs de dosage, diagnostic).
- **Decouvertes :**
  - D-006 (RAG comme surface d'attaque) : CONFIRMEE.
  - D-012 (defenses composites necessaires) : FORTEMENT CONFIRMEE — l'ablation montre que L1 seule echoue sur insiders, L3 seule echoue sur forgeurs.
  - D-017 (provenance comme defense RAG) : NOUVELLE DECOUVERTE ��� la verification de provenance est un vecteur de defense sous-explore pour RAG.
- **Gaps :**
  - G-014 (defense RAG formelle) : AVANCE — theoremes de taint monotonicity et borne ASR.
  - G-026 (scalabilite provenance RAG) : CREE — validation a 500 passages insuffisante.
- **Mapping templates AEGIS :** #54-#62 (RAG poisoning), #85-#90 (IPI)

### Citations cles
> "RAGShield achieves 0.0% attack success rate across all tiers" (Abstract, p.1)
> "In-place replacement attacks by insiders achieve 17.5% ASR" (Table X, Section VII-H, p.8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 |
| Reproductibilite | Faible — petite echelle, auteur unique, pas de code, adversaires auto-definis |
| Code disponible | Non |
| Dataset public | Partiellement (NQ benchmark, mais corpus de 500 passages custom) |

### Classification AEGIS
- **Type d'attaque etudiee** : IPI (corpus poisoning — 5 tiers d'adversaires)
- **Surface ciblee** : RAG knowledge base (ingestion + retrieval + generation)
- **Modeles testes** : all-MiniLM-L6-v2 (embeddings), LLM non specifie (generation)
- **Defense evaluee** : RAGShield (provenance + taint lattice + contradiction detection) — methode proposee
- **MITRE ATLAS** : AML.T0051.002 (Indirect Prompt Injection via RAG)
- **OWASP LLM** : LLM06 (Excessive Agency via poisoned retrieval) + LLM05 (Supply Chain Vulnerabilities)
