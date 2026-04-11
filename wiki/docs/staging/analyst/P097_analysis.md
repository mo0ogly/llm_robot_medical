# P097 — Analyse doctorale

## [Li, Zhang, Zhang, Qiu, Zhang, Zhang, Yu & Zhou, 2026] — State-Dependent Safety Failures in Multi-Turn Language Model Interaction

**Reference :** arXiv:2603.15684v1
**Revue/Conf :** Preprint, mars 2026 (non encore publie en conference)
**Lu le :** 2026-04-07
> **PDF Source**: [literature_for_rag/P_MSBE_2603.15684.pdf](../../assets/pdfs/P_MSBE_2603.15684.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (76 chunks)

### Abstract original
> Safety alignment in large language models is typically evaluated under isolated queries, yet real-world use is inherently multi-turn. Although multi-turn jailbreaks are empirically effective, the structure of conversational safety failure remains insufficiently understood. In this work, we study safety failures from a state-space perspective and show that many multi-turn failures arise from structured contextual state evolution rather than isolated prompt vulnerabilities. We introduce STAR, a state-oriented diagnostic framework that treats dialogue history as a state transition operator and enables controlled analysis of safety behavior along interaction trajectories. Rather than optimizing attack strength, STAR provides a principled probe of how aligned models traverse the safety boundary under autoregressive conditioning. Across multiple frontier language models, we find that systems that appear robust under static evaluation can undergo rapid and reproducible safety collapse under structured multi-turn interaction. Mechanistic analysis reveals monotonic drift away from refusal-related representations and abrupt phase transitions induced by role-conditioned context. Together, these findings motivate viewing language model safety as a dynamic, state-dependent process defined over conversational trajectories.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** L'alignement de securite est evalue en isolation (single-turn), mais les interactions reelles sont multi-tour, et les mecanismes de defaillance conversationnelle restent mal compris (Li et al., 2026, Section 1, p. 1).
- **Methode :** Framework STAR (State-oriented Role-playing) qui modelise le dialogue comme un operateur de transition d'etat dans un espace latent Z, avec deux etapes : initialisation d'etat (softening semantique, role query-aware, template structure) et evolution d'etat (execution role-conditionnee, intervention sur historique, controle de trajectoire) (Section 3, p. 2-4).
- **Donnees :** HarmBench (200 comportements nuisibles) + JailbreakBench (100 instructions manuellement verifiees), 5 modeles cibles : GPT-4o, Claude 3.5 Sonnet, Gemini 2.0-Flash, LLaMA-3-8B-IT, LLaMA-3-70B-IT (Section 4, p. 5).
- **Resultat :** SFR (Safety Failure Rate) de 94.0% sur JailbreakBench avec LLaMA-3-8B-IT, surpassant X-Teaming (85.5%) avec un cout comparable en tokens (37K vs 30K) ; 89.0% sur LLaMA-3-8B-IT HarmBench (Table 1, Section 5.1, p. 5-6).
- **Limite :** Preprint non peer-reviewed ; utilisation de GPT-4o comme juge (biais connu du LLM-juge) ; auxiliaire Qwen2.5-32B non specialise red-team mais potentiellement biaise ; pas de test sur les LRM (o1, R1) (Section 4, Limitations implicites).

### Analyse critique

**Forces :**
1. **Formalisation rigoureuse** de la defaillance multi-tour comme processus d'evolution d'etat, avec une formulation mathematique claire : zt comme etat latent, Ht comme operateur de transition, J : Q x Y -> [1,5] comme signal de securite (Section 3.1, Eq. 1, p. 2-3). Cette formalisation distingue explicitement l'initialisation d'etat de l'evolution d'etat, permettant des ablations causales.
2. **Analyse mecaniste** via probes white-box sur LLaMA-3-8B-IT : projection sur la direction de refus (Section 5.4.1, Figure 4) montrant un declin monotone des activations de refus au fil des tours, passant de +0.08 au tour 2 a -0.0081 au tour 3. Les trajectoires d'etat latent (Section 5.4.2, Figure 5) montrent un deplacement en deux phases : traversee rapide de la frontiere, puis consolidation dans la region de conformite.
3. **Test de causalite historique** (Section 5.3, Figure 3) : perturbations controlees sur l'historique (shuffle temporal, compression semantique, injection de refus) demontrant que l'historique fonctionne comme un operateur causal actif, pas un enregistrement passif. Le shuffle reduit substantiellement la conformite, et l'injection de refus a des positions specifiques renforce le comportement defensif.
4. **Ablations systematiques** (Section 5.2, Figure 2) isolant la contribution de chaque composant : suppression de l'historique = -25.5% SFR (plus grand impact), role-conditioning = -17.8%, feedback adaptif = -19.7%.

**Faiblesses :**
1. **Preprint sans peer-review** : les resultats n'ont pas ete valides par la communaute. La comparaison avec X-Teaming est basee sur une reproduction independante, non sur les chiffres originaux des auteurs.
2. **Juge LLM** : GPT-4o comme evaluateur (Section 4, Appendix B), avec un score binaire J=5 pour le succes. Ce choix est problematique compte tenu des travaux de P044 montrant un flip rate de 99% pour les juges LLM. Les auteurs n'utilisent pas de juge deterministe.
3. **Cout en tokens eleve** : 37K tokens pour STAR vs 30K pour X-Teaming (Table 3, p. 6), ce qui limite l'applicabilite dans un contexte red-team a grande echelle.
4. **Pas de test sur les LRM** (o1, DeepSeek-R1, etc.) ni sur les modeles medicaux, ce qui limite la portee pour notre these AEGIS.

**Questions ouvertes :**
- Le phenomene de "phase transition abrupte" observe dans les representations est-il reproductible sur d'autres architectures que LLaMA ?
- La defense par monitoring de trajectoire latente est-elle realisable en pratique (cout computationnel) ?
- Quel est l'impact de l'alignement deliberatif (o1-style) sur la stabilite des trajectoires STAR ?

### Formules exactes

**Eq. 1 — Dialogue multi-tour :**
rt = M(Ht-1 + pt), Ht = Ht-1 U {(pt, rt)}
(Section 3.1, p. 2)

**Eq. 2 — Softening semantique :**
q0 = arg max_{c in C} cos(phi(q), phi(c))
ou phi(.) extrait les embeddings de phrase (BERT [CLS])
(Section 3.2.1, p. 3)

**Eq. 4 — Template structure :**
pt = Template(rho, qt, Ht-1) = [rho] + [Ht-1] + [qt]
(Section 3.2.3, p. 4)

**Eq. 7 — Intervention sur historique :**
Ht = Ht-1 U {(pt, rt)} si Pattern(rt) in {3,4}
Ht = Ht-1 U {(pt, r_hat_t)} si Pattern(rt) in {1,2}
(Section 3.3.2, p. 4)

**Eq. 8 — Controle de trajectoire :**
qt+1 = Fallback() si Delta_t >= 0
qt+1 = Generate(q, Ht; MA) sinon
(Section 3.3.3, p. 4)

Lien glossaire AEGIS : F15 (Sep(M) — pertinence indirecte, pas utilise), F22 (ASR — SFR equivalent)

### Pertinence these AEGIS

- **Couches delta :** δ¹ (softening semantique = reformulation du prompt, couche linguistique), δ² (role-conditioning + template = manipulation de la structure conversationnelle, couche cognitive)
- **Conjectures :** C1 (fragilite de l'alignement) **fortement supportee** — la demonstration que des modeles robustes en single-turn s'effondrent en multi-tour est une evidence directe ; C5 (adequation des metriques) **supportee** — SFR statique vs trajectoire dynamique montre l'insuffisance des metriques single-turn
- **Decouvertes :** D-003 (erosion progressive de la frontiere de securite) **confirmee avec mecanisme** — le drift monotone de la direction de refus et les transitions de phase fournissent une explication mecaniste
- **Gaps :** RR-FICHE-001 (Multi-Step Boundary Erosion) **directement adresse** — STAR formalise le MSBE comme evolution d'etat deterministe avec operateur causal sur l'historique. Ce papier est la contribution la plus directe au gap MSBE identifie dans notre fiche #22.
- **Mapping templates AEGIS :** #07 (multi-turn APT), #22 (SQL research multi-step), #48 (solo multi-persona)

### Citations cles
> "Is the safety boundary enforced by aligned LLMs static, or can it be systematically traversed through interaction?" (Section 1, p. 1)
> "Safety collapse under STAR is not incidental. Instead, autoregressive conditioning on prior compliant responses progressively reshapes internal representations, driving the model deterministically away from the refusal direction and across the safety boundary." (Section 5.4.1, p. 7)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Moyenne — code non publie (preprint), mais protocole detaille et modeles accessibles |
| Code disponible | Non mentionne |
| Dataset public | HarmBench + JailbreakBench (publics) |
