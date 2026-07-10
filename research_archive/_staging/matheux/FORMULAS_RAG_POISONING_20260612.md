# FORMULAS — RAG Poisoning & Control-Plane Decoding (P137 / P138 / P139)

**Objet** : Formalisation mathematique des 3 vecteurs forges dans le batch **FORGE-RAG-CP-20260612** :
single-doc RAG poisoning (P139 CorruptRAG), opinion-shift via manipulation de ranking (P138 FlippedRAG),
et control-plane / grammar-constrained decoding (P137 CDA).
**Date** : 2026-06-12
**Agent** : MATHEUX (analyse scoped, niveau doctoral, anti-confabulation)
**Sources** :
- P137 — Zhang et al. 2026, arXiv:2503.24191, ACM CCS 2026 (CORE A*)
- P138 — Chen et al. 2025, arXiv:2501.02968, ACM CCS 2025 (CORE A*)
- P139 — Zhang et al. 2026, arXiv:2504.03957v2, ACM SACMAT 2026
**Methode de verification** : equations extraites **en texte complet** des PDF
(`research_archive/literature_for_rag/P13{7,8,9}_*.pdf`) via pypdf, notation originale preservee.
NB : le ChromaDB `aegis_bibliography` ne contenait que les chunks de **fiche d'analyse** pour P137/P138/P139
(pas de chunks `pdf_fulltext` — seuls P117-P121 ont du fulltext indexe). L'extraction a donc ete faite
directement depuis les PDF source. **Dette d'ingestion** signalee en fin de document.

**Prochain F-ID libre au moment de la redaction** : F75 (dernier glossaire = F74).

---

## F75 — Modele de retrieval dense (top-N) du pipeline RAG

**Nature epistemique** : **[ALGORITHME]** — definition operationnelle du retrieval dense, standard
(Karpukhin et al. 2020, DPR) ; ici dans la notation de P139.

**Enonce EXACT** (Zhang et al., 2026, P139, Section 2 "Step I (Knowledge retrieval)", p.2) :

> Pour une requete `q`, le retriever produit l'embedding `E(q)`, et pour chaque texte `d_k` de la base
> `D` l'embedding `E(d_k)` (`k = 1, 2, ..., Π`, ou `Π = |D|`). Il calcule les scores de similarite
> entre `E(q)` et chaque `E(d_k)`, puis selectionne les `top-N` textes de plus haute pertinence,
> notes **`D(q, N)`**.

Score de similarite instancie dans les experiences : **produit scalaire** (dot product) par defaut,
cosinus en variante (P139, Section 5.1.3, p.7 : « using ... Contriever as the retriever and the dot product
as the similarity metric » ; Table 6 compare Dot Product vs Cosine Similarity).

```
sim(q, d_k) = ⟨E(q), E(d_k)⟩            (dot product, defaut P139)
D(q, N) = argTop-N_{d_k ∈ D} sim(q, d_k)
```

**Reference inline** : (Zhang et al., 2026, P139, arXiv:2504.03957v2, Section 2, p.2 ; metrique : Section 5.1.3 + Table 6, p.7-8).

**Grille d'hypotheses**
| Hypothese | Explicite/Implicite | Force | Verifiable en pratique | Commentaire |
|-----------|---------------------|-------|------------------------|-------------|
| H1 : un encodeur unique `E(·)` encode q et d dans le meme espace | Explicite | Forte | Oui (bi-encoder DPR/Contriever) | Hypothese standard du dense retrieval |
| H2 : score = produit scalaire (ou cosinus) | Explicite | Moyenne | Oui (config retriever) | P139 montre robustesse au choix dot/cosinus (Table 6) |
| H3 : top-N par tri decroissant des scores, sans re-ranking | Implicite | Moyenne | Pas toujours (re-rankers en prod) | Un cross-encoder re-ranker modifierait `D(q,N)` |

**Regime de validite** : non-asymptotique, deterministe a embeddings fixes. Pas de borne theorique sur la qualite du retrieval.

**Exemple numerique** : `N=5`, base `Π=10^6` documents. Un document injecte `p` figure dans `D(q,5)`
ssi `sim(q,p)` depasse le 5e plus grand score parmi les `Π` documents. C'est la **condition de retrieval**
exploitee par F76/F78.

---

## F76 — Hit-Ratio Maximization (HRM) — objectif du single-doc poisoning (CorruptRAG)

**Nature epistemique** : **[EMPIRIQUE]** — objectif d'attaque formalise comme probleme d'optimisation,
mais **resolu par heuristique** (CorruptRAG-AS / CorruptRAG-AK), sans borne ni garantie de convergence.
Le cadre est exact ; la resolution est **[HEURISTIQUE]**.

**Enonce EXACT** (Zhang et al., 2026, P139, Section 4.1, Eq. (1), p.4) :

```
HRM:  max_P   (1/|Q|) · Σ_{i=1}^{|Q|}  I( RAG( D̂(q_i, N), q_i ) = A_i )      (1)
      s.t.    D̂ = D ∪ P,
              |P_i| = 1,   i = 1, 2, ..., |Q|.
```

ou :
- `Q = {q_i}` = ensemble de requetes ciblees, `A_i` = reponse desiree par l'attaquant pour `q_i` ;
- `P = {P_i}` = textes empoisonnes, `D̂ = D ∪ P` = base compromise ;
- **`|P_i| = 1`** : contrainte clef — **un seul** document empoisonne par requete ;
- `D̂(q_i, N)` = top-N recupere depuis la base empoisonnee `D̂` (cf. F75) ;
- `RAG(·)` = reponse generee ; `I(·)` = indicatrice (1 si condition remplie, 0 sinon).

**Distinction vs PoisonedRAG** (P139, Section 4.1, p.4) : PoisonedRAG suppose pouvoir injecter assez de
textes pour **dominer numeriquement** le top-N ; CorruptRAG leve cette hypothese (`|P_i| = 1`).
C'est la contribution formelle centrale.

**Pourquoi 1 document suffit (decomposition implicite)** : le succes requiert **deux** conditions
conjointes (P139, Section 4, p.2, "two challenges") :
1. **Condition de retrieval** : `p_i ∈ D̂(q_i, N)` — le document empoisonne doit entrer dans le top-N
   (depend de F75 : `sim(q_i, p_i)` eleve, obtenu en construisant `p_i` autour de `q_i`) ;
2. **Condition de generation** : conditionnellement a sa presence dans le contexte, `p_i` doit faire
   produire `A_i` par le LLM (contenu adversarial du document).
Un seul document suffit car il ne s'agit PAS d'un vote majoritaire : il suffit qu'il soit retrouve ET
qu'il oriente la generation. La non-differentiabilite du pipeline (« discrete and non-linear nature of
language », P139, p.2) interdit l'optimisation par gradient → resolution heuristique (AS/AK).

**Reference inline** : (Zhang et al., 2026, P139, arXiv:2504.03957v2, Section 4.1, Eq. (1), p.4 ; threat model Section 3, p.3).

**Grille d'hypotheses**
| Hypothese | Explicite/Implicite | Force | Verifiable en pratique | Commentaire |
|-----------|---------------------|-------|------------------------|-------------|
| H1 : attaquant black-box, sans acces aux params retriever/LLM | Explicite | Realiste | Oui | Renforce la plausibilite (vs CPA white-box) |
| H2 : la base est editable / un doc peut etre injecte | Explicite | Moyenne | Oui (UGC, web, wiki) | Vecteur d'injection suppose ouvert |
| H3 : reponse cible `A_i` evaluee par LLM-juge (GPT-4o-mini) | Explicite | **Faible** | Oui mais manipulable | **ASR via LLM-juge** — cf. regle ASR critique du lab |
| H4 : requetes independantes (`P_i ⊥ P_j`) | Explicite | Forte | Oui | Simplifie l'analyse, pas de couplage inter-requetes |

**Regime de validite** : non-asymptotique ; `N` teste de 5 a 30 (P139, "Impact of N", Figure 2, p.7) —
ASR stable quand N croit (le single-doc reste competitif meme avec un top-N large).

**ASR rapporte (verbatim, traceable)** : « our attacks ... achieving the highest ASRs regardless of the
similarity metric » ; Table 5/6 (P139, p.7-8) — ex. PoisonedRAG black-box ASR 0.69 (dot) / 0.80 (cosinus)
sur NQ/Contriever, CorruptRAG superieur sur l'ensemble des baselines. **Juge = GPT-4o-mini**
(P139, Section 5.1.3, p.7) → tag `[ASR LLM-JUGE]`, ne pas porter comme borne dure.

**Exemple numerique** : `|Q|=100` requetes ciblees, 1 doc injecte chacune. HRM compte la fraction de
requetes ou la reponse RAG egale `A_i`. Si 70 requetes basculent → HRM = 0.70.

---

## F77 — Surrogate de retrieval black-box par perte contrastive (FlippedRAG, Phase 1)

**Nature epistemique** : **[ALGORITHME]** — perte contrastive (InfoNCE-like) pour imiter un retriever
black-box ; optimisee par Adam. Pas de borne de generalisation fournie → la qualite de l'imitation est `[EMPIRIQUE]`.

**Enonce EXACT** (Chen et al., 2025, P138, Section 3.3, Eq. (2), p.4) :

```
L = - (1/|D|) · Σ_{(d+, d-) ∈ D}  log [ R_i(q, d+) / ( R_i(q, d+) + Σ R_i(q, d-) ) ]     (2)
```

ou :
- `R_i` = modele surrogate (white-box) entraine a imiter le retriever black-box `RM` de la cible ;
- `(d+, d-)` = paires contrastives (positif / negatif), avec **hard negatives** pour fideliser
  l'approximation (P138, Section 3.3, p.4) ;
- `D` = jeu d'imitation ; optimiseur = **Adam** (Kingma & Ba) ; objectif = capturer les
  « ranking preferences » du retriever cible.

**Reference inline** : (Chen et al., 2025, P138, arXiv:2501.02968, Section 3.3, Eq. (2), p.4).

**Grille d'hypotheses**
| Hypothese | Explicite/Implicite | Force | Verifiable en pratique | Commentaire |
|-----------|---------------------|-------|------------------------|-------------|
| H1 : le corpus adverse est public et editable (acces aux d+/d-) | Explicite | Moyenne | Oui (MS MARCO + PROCON.ORG) | Plausible pour sujets controverses |
| H2 : l'imitation contrastive transfere au retriever cible | Explicite | Moyenne | Empirique (NDCG@10, Inter@10, Table 2) | Pas de borne de transfert |
| H3 : qualite des hard negatives = leviers de fidelite | Explicite | Forte | Oui | Determinant pour l'approximation |

**Regime de validite** : finite-sample, mesure par NDCG@10 / Inter@10 (P138, Table 2, p.4-5).
Pas de garantie asymptotique.

---

## F78 — Perte du trigger adversarial (FlippedRAG, Phase 2 — opinion shift)

**Nature epistemique** : **[HEURISTIQUE]** — objectif de generation d'un trigger qui (a) eleve le rang du
document cible et (b) reste furtif (contraintes linguistiques) ; optimise par SGD, sans borne.

**Enonce EXACT** (Chen et al., 2025, P138, Section 3.4, Eq. (3), p.5) :

```
max_w  { M_i(q, T_pat; w)  +  λ_1 · log P_g(T_pat; w)  +  λ_2 · f_nsp(d_t, T_pat; w) }     (3)
```

ou :
- `T_pat` = trigger adversarial, utilise comme `p_adv` ;
- `M_i(q, T_pat; w)` = score de pertinence du surrogate (F77) → terme qui **eleve le rang** du document portant l'opinion cible ;
- `log P_g(T_pat; w)` = **contrainte semantique** via un modele de langue `g` (fluidite / plausibilite) ;
- `f_nsp(d_t, T_pat; w)` = score de **next-sentence-prediction** entre `T_pat` et le document `d_t` (coherence/furtivite) ;
- `λ_1, λ_2 ∈ [0,1]` = hyperparametres ; `w` = poids du modele ; optimisation = **SGD**.

**Reference inline** : (Chen et al., 2025, P138, arXiv:2501.02968, Section 3.4, Eq. (3), p.5).

**Effet en cascade** (P138, Section 3.4, p.5, verbatim) : « These mechanisms collectively maximize the
retrieval rank elevation of documents expressing the target opinion, thereby increasing their proportional
presence in the LLM's context. This cascading effect ultimately amplifies the likelihood that RAG-generated
responses align with the target opinion. »

**Grille d'hypotheses**
| Hypothese | Explicite/Implicite | Force | Verifiable en pratique | Commentaire |
|-----------|---------------------|-------|------------------------|-------------|
| H1 : elever le rang ⇒ presence accrue dans le contexte ⇒ biais de reponse | Explicite | Moyenne | Empirique (Top3v, OMSR, ASV) | Chaine causale, non prouvee formellement |
| H2 : `g` et NSP assurent la furtivite (texte plausible) | Explicite | Moyenne | Oui (perplexite/NSP) | Contre les defenses par detection de texte anormal |
| H3 : λ_1, λ_2 calibrables sans degrader le rang | Implicite | Faible | A regler empiriquement | Compromis rang/furtivite |

**Regime de validite** : finite-sample, sujets controverses (MS MARCO + PROCON.ORG, P138, Section 4.1, p.5).

---

## F79 — Metriques d'opinion-shift (FlippedRAG)

**Nature epistemique** : **[EMPIRIQUE]** — definitions operationnelles de metriques d'impact (ranking + opinion + cognition). Pas de theoreme.

**Enonces EXACTS** (Chen et al., 2025, P138, Section 4 "Evaluation Metrics", p.5-6) :

| Metrique | Definition verbatim (P138) | Niveau |
|----------|----------------------------|--------|
| **Top3v** | « quantifies the enhancement in the proportion of target opinion within the top-3 rankings after manipulation » | Retrieval |
| **RASR** (Ranking Attack Success Rate) | « the average rate of candidates whose rankings are successfully boosted for each query » | Retrieval |
| **BRank** (Boost Rank) | « the average of the total rank improvements for all target documents under each query » | Retrieval |
| **OMSR** (Opinion Manipulation Success Rate) | « measures the average rate of successfully manipulated LLM responses at the opinion level » | Reponse LLM |
| **ASV** (Average Stance Variation) | « represents the average increase of opinion scores of LLM responses in the direction of the [target stance] » | Reponse LLM |

**Bascule de cognition utilisateur** (verbatim) : « ... ultimately causing a notable **20% shift in user
cognition** » (P138, Abstract / Section 1, p.1) → tag `[EMPIRIQUE — etude utilisateur, protocole et N a confirmer]`.

**Reference inline** : (Chen et al., 2025, P138, arXiv:2501.02968, Section 4, p.5-6 ; cognition : Abstract, p.1).

**Grille d'hypotheses**
| Hypothese | Explicite/Implicite | Force | Verifiable en pratique | Commentaire |
|-----------|---------------------|-------|------------------------|-------------|
| H1 : "opinion score" mesurable de facon fiable | Explicite | Faible | Oui mais subjectif | Juge d'opinion = source de variance |
| H2 : le 20% cognition est causalement attribuable a l'attaque | Explicite | Faible | Etude utilisateur (N a confirmer) | Risque de biais d'etude humaine |

**Regime de validite** : finite-sample, domaine controverse. Generalisation hors-domaine non garantie.

---

## F80 — Decodage contraint par grammaire : masque de logits per-token (control plane)

**Nature epistemique** : **[ALGORITHME]** — semantique operationnelle du constrained decoding
(masquage de logits guide par grammaire), standard (LMQL/Guidance/outlines) ; ici notation de P137.

**Enonces EXACTS** (Zhang et al., 2026, P137, Sections 2.1-2.3, p.2-3) :

Echantillonnage standard (softmax temperee) — **Eq. (2)** (P137, Section 2.1, p.2) :

```
x_{n+1} ∼ p( x_{n+1}[i] | x_{1:n} ) = exp( z_{n+1}[i] / T ) / Σ_{j=1}^{|V|} exp( z_{n+1}[j] / T )     (2)
```

ou `z_{n+1}` = logits, `T` = temperature, `|V|` = taille du vocabulaire.

Masque grammatical per-token (P137, Section 2.3 "Constrained Decoding", p.3, verbatim) :

> « the grammar guides generation by producing a **per-token mask: valid tokens are kept, while invalid
> ones are set to −∞ logits and excluded from sampling**. ... The model then samples from the **masked
> distribution**, guaranteeing outputs that conform to the grammar. »

Formellement, soit `G` la grammaire et `Valid(G, x_{1:n}) ⊆ V` l'ensemble des tokens admissibles a l'etape `n+1` :

```
ẑ_{n+1}[i] = z_{n+1}[i]   si  token_i ∈ Valid(G, x_{1:n})
           = -∞           sinon
x_{n+1} ∼ softmax( ẑ_{n+1} / T )
```

Analogie compilateur (P137, Figure 2, p.3) : tokenizer LLM = lexer, regles de grammaire = parser ;
le masque est produit par parsing du flux de tokens deja emis.

**Formalisation de l'attaque (CDA) — control-to-semantic pipeline** (P137, Abstract + Section "contributions", p.1, verbatim) :
> CDA = pipeline en deux temps : « (1) **schema-enforced logit masking injects a malicious prefix** into
> the generation trajectory, and (2) **the model itself completes the harmful intent**. ... CDA acts on
> the decoding process itself, so internal safety alignment alone cannot stop it. »

Idee formelle : la grammaire `G` est construite de sorte que `Valid(G, ·)` **force** un prefixe affirmatif
`y_pre` (p.ex. « Sure, here is... ») en mettant a `-∞` tous les tokens de refus. Le modele, conditionne sur
`y_pre`, complete ensuite l'intention nuisible. EnumAttack cache le payload dans des champs `enum` ;
DictAttack **decouple** le payload entre un prompt benin et une grammaire de type dictionnaire.

**Reference inline** : (Zhang et al., 2026, P137, arXiv:2503.24191, Eq. (2) Section 2.1 p.2 ; masque Section 2.3 p.3 ; CDA Abstract + contributions p.1 ; Figure 2 p.3).

**Grille d'hypotheses**
| Hypothese | Explicite/Implicite | Force | Verifiable en pratique | Commentaire |
|-----------|---------------------|-------|------------------------|-------------|
| H1 : attaquant controle le schema/grammaire (structured output API) | Explicite | Forte | Oui (JSON schema, function calling) | Surface = control plane, pas data plane |
| H2 : le masque `-∞` exclut bien tout token invalide, sans fuite | Explicite | Forte | Oui (garantie de conformite) | C'est la garantie meme du constrained decoding, retournee contre la cible |
| H3 : l'alignement δ⁰ agit sur le data plane, pas sur le decodage | Explicite | Forte | Empirique (94.3-99.5% ASR) | Fondement de « internal safety alignment alone cannot stop it » |

**Regime de validite** : deterministe a `G` fixe. Garantie **dure** de conformite grammaticale (pas une
borne probabiliste). C'est precisement cette garantie qui est detournee : forcer un prefixe affirmatif
est **certain**, pas probabiliste.

**ASR rapporte (verbatim, traceable)** : DictAttack **94.3-99.5% ASR** sur gpt-5, gemini-2.5-pro,
deepseek-r1, gpt-oss-120b ; **75.8%** contre les guardrails jailbreak SOTA (P137, Abstract, p.1).
**Juge = gpt-4o** (LLM-judge), succes = pas de refus + reponse pertinente (P137, Section metriques, verbatim :
« we employ another powerful LLM gpt-4o as the judge ... An attack is deemed successful only if the
attacker's query doesn't t[rigger a refusal] »). → tag `[ASR LLM-JUGE]`.

**Exemple numerique** : `T=1`, vocabulaire reduit `{« Sure », « Sorry », « No »}` avec logits `(2.0, 5.0, 1.0)`.
Sans masque, `p(« Sorry ») ≈ 0.94` (refus domine). Avec un masque grammatical `Valid = {« Sure »}`,
`ẑ = (2.0, -∞, -∞)` → `p(« Sure ») = 1.0`. Le refus est rendu **structurellement impossible** : c'est le
mecanisme de F80.

---

## Lien Sep(M)

Sep(M) (Zverev et al., 2025, ICLR, Definition 2) mesure la **separation instruction/donnees** d'un modele :
sa capacite a ne PAS executer une instruction presente dans le canal *donnees*. Les trois vecteurs
attaquent des points distincts du pipeline par rapport a Sep(M) :

1. **F76 / F75 (CorruptRAG)** et **F77-F79 (FlippedRAG)** operent **en amont** de l'inference du modele,
   dans le **retrieval**. Sep(M) ne couvre PAS ce canal : meme un modele a Sep(M) eleve traite le document
   empoisonne comme du *contexte legitime* recupere, pas comme une instruction-donnee a ignorer. Conclusion :
   **Sep(M) seul ne protege pas contre le RAG poisoning** — il faut une metrique de robustesse cote retrieval
   (ex. « retrieval robustness » : fraction du top-N resistant a l'injection d'un doc adverse). C5 reformulée :
   « injection à seuil minimal sur un composant externe » (CorruptRAG = 1 document statique, PAS de propagation) :
   le maillon faible est `D(q,N)`, pas le decodeur.

2. **F80 (CDA / control plane)** : Sep(M) est defini sur le **data plane** (entree visible). CDA agit sur le
   **control plane** (masque de logits). La citation « internal safety alignment alone cannot stop it » est
   l'analogue exact de « Sep(M) ne capture pas le control plane » : un modele peut avoir Sep(M)=1 (parfaite
   separation des canaux texte) et rester 100% vulnerable a un masque grammatical qui force le prefixe.
   → **Sep(M) doit etre etendu d'une dimension control-plane** (« decoding-plane separation ») pour etre
   pertinent contre CDA. MOTIVE (cohérent avec) C2 - une seule source P137, aucune campagne AEGIS, donc
   motivation et non preuve ; C5 reformulée : « injection à seuil minimal sur un composant externe »
   (CorruptRAG = 1 document statique, PAS de propagation).

> Mise en garde (reviewer aegis-ccg) : tout vecteur DÉFINI hors-portée de Sep(M) « motive plus de couches »
> par construction ; ne pas présenter ce cadrage comme une preuve. Pour le RAG, l'empoisonnement injecte un
> FAIT (pas une instruction), donc l'orthogonalité à Sep(M) est vraie par construction — elle appuie « Sep(M)
> insuffisant/orthogonal », pas spécifiquement C5.

**Synthese** : aucune des 3 formules n'est neutralisee par un Sep(M) eleve. Elles motivent deux extensions
distinctes de la metrique du lab : (a) robustesse retrieval (poisoning), (b) separation control-plane (CDA).

---

## Dettes — formules / valeurs [A VERIFIER]

Aucune formule n'a ete inventee. Toutes les equations (F75-F80) sont **extraites verbatim du fulltext PDF**.
Les dettes residuelles sont des **valeurs/protocoles a confirmer**, pas des formules manquantes :

| Dette | Detail | Source de resolution |
|-------|--------|----------------------|
| D1 | **Ingestion ChromaDB** : P137/P138/P139 n'ont PAS de chunks `pdf_fulltext` dans `aegis_bibliography` (seuls les chunks de fiche). Le RAG fulltext etait donc indisponible ; extraction faite depuis PDF. | Re-ingerer les 3 PDF (`pdf_fulltext`) — bibliography-maintainer ingest |
| D2 | **P139 ASR chiffre exact** : Table 5/6 donnent des ASR par retriever/metrique ; le chiffre « tete » de CorruptRAG-AS/AK n'a pas ete extrait integralement ici (focus formules). | Lire P139 Table 4 (resultats principaux) |
| D3 | **P138 valeurs Top3v/RASR/BRank/OMSR/ASV** : definitions extraites, valeurs numeriques non reportees ici. Le « ~50% opinion shift » de la fiche n'a PAS ete confirme verbatim — seul le **20% user cognition** est verbatim (Abstract). | Lire P138 Tables 3-4 |
| D4 | **P138 metrique d'opinion (juge)** : le « opinion score » sous-jacent a OMSR/ASV n'est pas formalise ici (definition du classifieur d'opinion). | Lire P138 Section 4 (detail du scoring d'opinion) |
| D5 | **CDA — formalisation `Valid(G, ·)`** : P137 decrit le masque en prose + Figure 2 ; la formulation `Valid(G,·)`/`ẑ` ci-dessus est une **mise en equation fidele** de la prose (pas une equation numerotee du papier). Le papier ne donne pas d'equation numerotee pour le masque (seule Eq. (2) softmax l'est). | OK pour usage ; si citation formelle requise, marquer « reformule d'apres P137 Section 2.3 » |
| D6 | **coherence provenance** : les fiches P137/P138/P139 portent encore « [ARTICLE VERIFIE] - analyse fondee sur l'abstract » alors que MATHEUX a verifie les equations/tables EN TEXTE COMPLET. Provenance a reconcilier (note ajoutee aux 3 fiches le 2026-06-12). | Reconcilier le champ Statut des 3 fiches avec la verification fulltext F75-F80 |

**Tags ASR LLM-JUGE** : F76 (GPT-4o-mini), F80 (gpt-4o), F79 (juge d'opinion) — ASR/metriques manipulables
(cf. P044, 99% flip rate). Ne jamais porter ces chiffres comme bornes dures.
