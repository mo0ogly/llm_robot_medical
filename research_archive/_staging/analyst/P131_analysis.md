# P131 — LlamaFirewall: An Open Source Guardrail System for Building Secure AI Agents

**Reference** : arXiv:2505.03574
**Revue/Conf** : arXiv preprint (Meta AI industrial whitepaper, soumis 2025-05-06)
**Tag** : [PREPRINT] — industriel Meta AI, code open-source verifie (github.com/meta-llama/PurpleLlama/tree/main/LlamaFirewall)
**Lu le** : 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)

> **PDF Source** : A injecter dans literature_for_rag/P131_llamafirewall_chennabasappa2025.pdf (preseed COLLECTOR)
> **Auteurs** : Chennabasappa S., Nikolaidis C., Song D., Molnar D., Ding S., Wan S., Whitman S., Deason L., Doucette N., Montilla A., Gampa A., de Paola B., Gabi D., Crnkovich J., Testud J.-C., He K., Chaturvedi R., Zhou W., Saxe J. (19 co-auteurs, Meta AI Security Team)

## Passage 1 — Survol (~100 mots)

**Claim principale** : LlamaFirewall est un framework de guardrail open-source propose par Meta comme couche finale de defense pour les agents LLM en production. Il combine trois modules : (1) **PromptGuard 2** (detecteur universel de jailbreak, etat de l'art auto-revendique), (2) **Agent Alignment Checks** (auditeur CoT qui inspecte le raisonnement de l'agent pour detecter desalignement et prompt injection indirecte), (3) **CodeShield** (analyse statique en ligne pour empecher la generation de code dangereux) (Chennabasappa et al., 2025, arXiv:2505.03574, Abstract). **Originalite** : premiere stack industrielle multi-layered avec definition de politiques de securite specifiques a l'usage. **Decision** : lecture complete obligatoire — candidat principal pour la verification de la claim δ³.

## Passage 2 — Structure (~200 mots)

**Probleme** : les LLMs sont passes de simples chatbots a des agents autonomes executant des actions a enjeux eleves (edition de code production, orchestration de workflows) sur des inputs non-fiables (pages web, emails). Les mesures existantes (fine-tuning, guardrails chatbot) sont insuffisantes (Chennabasappa et al., 2025, Abstract, p.1). **Hypotheses explicites** :
- H1 : une couche finale deterministe est necessaire (les solutions probabilistes seules ne suffisent pas)
- H2 : les politiques de securite doivent etre specifiees par cas d'usage (pas de one-size-fits-all)
- H3 : l'inspection du raisonnement CoT est un proxy fiable pour detecter le goal hijacking

**Methode** : trois composants orchestres :
1. **PromptGuard 2** — classificateur de jailbreak avec revendication d'etat de l'art (pas de chiffres exacts dans l'abstract)
2. **Agent Alignment Checks** — analyse du raisonnement chain-of-thought pour detecter l'injection indirecte, qualifie par les auteurs d'"experimental" (Chennabasappa et al., 2025, Abstract, p.1)
3. **CodeShield** — analyse statique "fast and extensible" pour bloquer la generation de code insecure

**Resultats** : revendiques qualitativement dans l'abstract ("clear state of the art performance", "stronger efficacy at preventing indirect injections in general scenarios"). Pas de metriques chiffrees accessibles depuis l'abstract seul. **Limite avouee** : Agent Alignment Checks est explicitement "still experimental" (Chennabasappa et al., 2025, Abstract, p.1).

## Passage 3 — Profondeur critique (~200 mots)

**Forces** :
- Premier framework industriel multi-layered open-source soutenu par Meta (Chennabasappa et al., 2025, Abstract) — poids academique et industriel combines
- Trois angles complementaires : input classification (PromptGuard 2), reasoning audit (Agent Alignment Checks), output static analysis (CodeShield). Cette derniere categorie **correspond fonctionnellement au pattern δ³ AEGIS** pour le sous-domaine "code generation"
- Code disponible sous PurpleLlama monorepo — reproductibilite elevee
- Support de politiques custom "system level, use case specific" (Chennabasappa et al., 2025, Abstract) — extensibilite alignee sur le besoin d'AllowedOutputSpec metier

**Faiblesses / questions ouvertes** :
- **Aucune specialisation medicale** : domaine cible = code editing + workflow orchestration (Chennabasappa et al., 2025, Abstract). Pas de contraintes biomecaniques, pas de modele de robot chirurgical, pas de lien FDA 510(k)
- CodeShield est une analyse statique code-specifique, PAS une specification formelle semantique metier au sens AllowedOutputSpec (tension max, freeze_instruments, HL7 OBX directives)
- Agent Alignment Checks reste "experimental" — pas de garantie de soundness
- Pas de chiffres d'ASR/FPR dans l'abstract ; validation empirique a examiner en texte complet
- **Verification integrite** : preprint arXiv non encore peer-reviewed (soumis mai 2025), mais code open-source verifiable independamment

## Mapping δ⁰-δ³ AEGIS

- **δ⁰ (RLHF alignment)** : non adresse directement — suppose existant sur le modele sous-jacent
- **δ¹ (contexte sanitization)** : partiellement, via PromptGuard 2 (detection des tentatives de jailbreak dans le contexte input) et Agent Alignment Checks (detection d'injection indirecte dans les donnees recuperees)
- **δ² (detection statistique runtime)** : Agent Alignment Checks inspecte la trajectoire CoT — plus proche de δ² (signal comportemental) que de δ³ (specification formelle ex ante)
- **δ³ (validation formelle de sortie)** : **partiellement** — CodeShield implemente une specification d'output via analyse statique, MAIS limitee au domaine code-generation. Les politiques "use case specific" evoquees par les auteurs sont un slot d'extension, pas une specification formelle pre-existante pour d'autres domaines

## Pertinence these AEGIS

- **Conjectures C1-C8 impactees** :
  - **C2 (necessite δ³)** — renforce positivement : Meta reconnait publiquement la necessite d'une "final layer of defense" (Chennabasappa et al., 2025, Abstract). C2 reste saturee a 10/10 mais gagne un co-signataire industriel majeur
  - **C6 (vulnerabilite medicale)** — non impactee directement (domaine hors medical)
- **Gaps G-XXX** :
  - **G-001 (aucun paper n'implemente δ³ concretement)** : DOIT etre reformule. G-001 etait vrai en 2024 mais LlamaFirewall (2025-05) propose CodeShield comme implementation δ³ code-specifique. Le gap subsiste pour le **sous-domaine medical robotique chirurgical**, mais plus pour la simple existence d'une implementation δ³ generique
  - **G-020 (defenses agents non evaluees)** : partiellement adresse — LlamaFirewall cible explicitement les agents autonomes
- **Decouvertes D-XXX** : renforce D-014 (alignement superficiel necessite defense externe)

## Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 (critique pour la verification de la claim δ³) |
| Reproductibilite | Haute (code open-source Meta PurpleLlama, license permissive) |
| Code disponible | Oui — github.com/meta-llama/PurpleLlama/tree/main/LlamaFirewall |
| Dataset public | A verifier en texte complet |
| Domaine | Generic (code editing, workflow orchestration) — **pas medical** |
| Nature | [INDUSTRIEL + PREPRINT] — framework deploye en production chez Meta |
