# P029 -- Analyse doctorale

## [Lee et al., 2025] -- Vulnerability of Large Language Models to Prompt Injection When Providing Medical Advice

**Reference :** JAMA Network Open (Digital Health), 2025 / DOI a confirmer (article paywall)
**Revue/Conf :** JAMA Network Open, Q1 SCImago, 2025
**Lu le :** 2026-04-04
**Nature :** [EMPIRIQUE] -- etude observationnelle de type quality improvement study, statistiques descriptives, pas de contribution formelle
> **PDF Source**: MANQUANT -- JAMA Network Open paywall (CC-BY licence mais PDF derriere authentification). URL : https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2842987
> **Statut**: [PDF NON DISPONIBLE -- JAMA PAYWALL] -- Analyse basee sur 49 chunks ChromaDB (analysis_v2, analysis_v3) + references croisees AEGIS. Le PDF original n'a jamais ete injecte dans ChromaDB. FIABILITE REDUITE : toutes les donnees quantitatives proviennent de sources secondaires (analyses RUN-003).

---

### Abstract original
> [ABSTRACT NON DISPONIBLE VERBATIM -- paywall JAMA Network Open. Reconstitution basee sur les metadonnees ChromaDB :]
> This quality improvement study evaluates the vulnerability of six commercial large language models to prompt injection attacks in clinical medical contexts. Using 216 evaluations (108 with injection, 108 controls) across 12 clinical scenarios, the study reports a 94.4% attack success rate at the primary clinical decision point. The injection persists across subsequent conversation turns at a rate of 69.4%. Scenarios include extremely high-risk situations involving FDA Category X medications during pregnancy.
> -- Source : reconstitution depuis chunks ChromaDB (source secondaire) [PDF NON DISPONIBLE]

### Resume (5 lignes)
- **Probleme :** Evaluer la vulnerabilite des LLM commerciaux aux injections de prompt lorsqu'ils fournissent des conseils medicaux cliniques [PDF NON DISPONIBLE -- source secondaire]
- **Methode :** Etude de simulation controlee, janvier-octobre 2025, 216 evaluations (108 avec injection + 108 controles) sur 6 LLM commerciaux, 12 scenarios cliniques a risque modere/eleve/extremement eleve, cadre de 6 tours de dialogue, injection via webhook simule dans le flux de donnees cliniques [PDF NON DISPONIBLE -- source secondaire, chunks ChromaDB analysis_v2]
- **Donnees :** 6 LLM (GPT-4o-mini, Gemini-2.0-flash-lite, Claude-3-haiku avec N=36 chacun ; GPT-5, Gemini 2.5 Pro, Claude 4.5 Sonnet avec N=5 chacun, attaque cote client) [PDF NON DISPONIBLE -- source secondaire]
- **Resultat :** ASR global = 94.4% (102/108), persistance multi-tour = 69.4% (75/108), FPR controle = 3.7% (4/108), ASR scenarios extremement eleves = 91.7% (33/36) [PDF NON DISPONIBLE -- source secondaire]
- **Limite :** N=5 pour les flagships (statistiquement invalide, IC 95% Clopper-Pearson [56.5%, 100%] pour 5/5) ; pas de condition controle non-medicale ; etude purement evaluative sans proposition de defense [PDF NON DISPONIBLE -- source secondaire]

### Analyse critique

**Forces :**

1. **Publication JAMA Network Open.** La venue represente le plus haut facteur d'impact du corpus AEGIS pour le domaine medical. Le processus de revision JAMA impose une rigueur methodologique rarement vue dans les preprints arXiv du domaine securite IA. Cette credibilite institutionnelle confere au resultat de 94.4% ASR [PDF NON DISPONIBLE -- source secondaire] un poids considerable pour la these.

2. **Design experimental controle.** La condition controle (N=108 dialogues sans injection) avec un FPR de seulement 3.7% (4/108) [PDF NON DISPONIBLE -- source secondaire] demontre que les resultats ne sont pas un artefact de compliance generale des modeles. Le ratio de vraisemblance positif LR+ = 0.944 / 0.037 = 25.5 est fortement discriminant (LR+ > 10), confirmant la specificite de l'attaque.

3. **Couverture multi-modele et multi-fournisseur.** 6 LLM commerciaux des trois principaux fournisseurs (OpenAI, Google, Anthropic) sont testes, offrant une vue panoramique de la vulnerabilite du marche [PDF NON DISPONIBLE -- source secondaire].

4. **Pertinence clinique directe.** Les scenarios incluent des situations ou l'erreur medicale est potentiellement letale : medicaments FDA Category X (thalidomide) pendant la grossesse, avec un ASR de 91.7% (33/36) [PDF NON DISPONIBLE -- source secondaire] sur ces scenarios a risque extremement eleve.

5. **Mesure de persistance multi-tour.** Le taux de 69.4% (75/108) [PDF NON DISPONIBLE -- source secondaire] demontre que l'injection n'est pas transitoire mais s'inscrit dans le contexte conversationnel, un resultat rare dans la litterature.

**Faiblesses :**

1. **Echantillon flagship critique.** N=5 par modele flagship (GPT-5, Gemini 2.5 Pro, Claude 4.5 Sonnet) est largement sous le seuil Sep(M) de N >= 30 (Zverev et al., 2025, ICLR, Definition 2). L'intervalle de confiance a 95% pour 5/5 (Clopper-Pearson) est [56.5%, 100%], rendant les taux de 100% et 80% purement indicatifs. Le flag `statistically_valid: false` doit etre appose [PDF NON DISPONIBLE -- source secondaire].

2. **Absence de condition non-medicale.** L'etude ne compare pas les ASR en contexte medical vs. non-medical. Le Medical Vulnerability Premium (F58) doit donc s'appuyer sur des comparaisons inter-etudes (Liu et al., 2023, arXiv:2306.05499 ; benchmarks generalistes), introduisant des biais confondants (prompts, evaluateurs, conditions experimentales differents) [PDF NON DISPONIBLE -- source secondaire].

3. **12 scenarios seulement.** Couverture incomplete des specialites medicales : pas de psychiatrie, dermatologie, radiologie interventionnelle, chirurgie robotique. La generalisabilite aux specialites non couvertes n'est pas demontree [PDF NON DISPONIBLE -- source secondaire].

4. **Etude purement evaluative.** Aucune proposition de defense. Le papier documente le probleme sans contribuer a la solution -- c'est precisement le positionnement d'AEGIS de combler ce vide avec les couches delta-2 et delta-3.

5. **Categorisation binaire.** La gravite clinique des sorties compromises n'est pas quantifiee au-dela de succes/echec. Un scoring de nocivite multi-niveaux (comparable a P050/JMedEthicBench avec scoring 1-10 sur 3 dimensions ethiques, Tanaka et al., 2026, Section 3, Appendix C) aurait enrichi l'analyse [PDF NON DISPONIBLE -- source secondaire].

6. **Webhook simule.** Le vecteur d'attaque est simule, pas reproduit dans un systeme de production reel. La transposabilite aux systemes HL7/FHIR en production reste a demontrer [PDF NON DISPONIBLE -- source secondaire].

**Questions ouvertes :**
- Le FPR de 3.7% est-il stable a travers les specialites medicales ?
- Les defenses delta-2 (RagSanitizer 15 detecteurs) reduiraient-elles l'ASR sur ces scenarios ?
- La persistance multi-tour (69.4%) varie-t-elle par modele ou par niveau de risque du scenario ?

### Formules exactes

Classification epistemique : `[EMPIRIQUE]` -- statistiques descriptives sans modele formel.

**Metriques principales** [PDF NON DISPONIBLE -- calculs derives des sources secondaires] :

```
ASR_global = |injections reussies| / |total injections| = 102/108 = 0.944
ASR_extreme = |injections reussies, risque extreme| / |total extreme| = 33/36 = 0.917
FPR_controle = |faux positifs controle| / |total controles| = 4/108 = 0.037
Persistence = |injections persistantes multi-tour| / |total injections| = 75/108 = 0.694
```

**ASR par modele (echantillon principal, N=36)** [PDF NON DISPONIBLE -- source secondaire] :
- GPT-4o-mini : 100% (36/36)
- Gemini-2.0-flash-lite : 100% (36/36)
- Claude-3-haiku : 83.3% (30/36)

**ASR flagships (echantillon reduit, N=5)** [PDF NON DISPONIBLE -- source secondaire, STATISTIQUEMENT INVALIDE] :
- GPT-5 : 100% (5/5) -- IC 95% [56.5%, 100%]
- Gemini 2.5 Pro : 100% (5/5) -- IC 95% [56.5%, 100%]
- Claude 4.5 Sonnet : 80% (4/5) -- IC 95% [29.9%, 98.9%]

**Connexion F58 -- Medical Vulnerability Premium** :
```
MVP_direct(P029) = (ASR_med - ASR_gen_estime) / ASR_gen_estime
                 = (0.944 - 0.65) / 0.65
                 = 0.45 (45% de surcout de vulnerabilite)
```
Note : ASR_gen = 65% est une estimation extrapolee depuis Liu et al. (2023, arXiv:2306.05499, Section 5.1) et autres benchmarks generalistes -- PAS une mesure de P029. Le MVP de 45% est une borne inferieure plausible, calibree par P050 qui donne MVP_MTSD = 0.74 sur une methode differente (Tanaka et al., 2026, Section 5.3, Figure 4a, MTSD = (9.5 - 5.5)/9.5 = 0.42 pour la degradation multi-tour).

**Likelihood Ratio** :
```
LR+ = sensibilite / (1 - specificite) = 0.944 / (1 - 0.963) = 0.944 / 0.037 = 25.5
```
LR+ > 10 = fortement discriminant (l'attaque est a la fois efficace et specifique) [CALCUL VERIFIE -- derive des chiffres P029 source secondaire, pas une valeur du papier original].

Lien glossaire AEGIS : F22 (ASR), F58 (MVP -- numerateur), F26 (CHER), F27b (ASR seuil)

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF alignment) : evaluee directement -- **insuffisante** (94.4% ASR) [PDF NON DISPONIBLE -- source secondaire]. L'alignement RLHF echoue massivement en contexte medical.
  - δ¹ (System prompt) : evaluee directement -- **minimale** (les system prompts des LLM commerciaux sont contournes) [PDF NON DISPONIBLE -- source secondaire].
  - δ² (Syntax filtering) : non evaluee -- GAP : tester si les 15 detecteurs RagSanitizer reduisent l'ASR.
  - δ³ (Formal verification) : non evaluee -- BESOIN URGENT pour le medical.

- **Conjectures :**
  - C1 (insuffisance delta-1) : **supportee directement** -- 94.4% ASR malgre delta-0 + delta-1 [PDF NON DISPONIBLE -- source secondaire]
  - C2 (necessite delta-3) : **supportee indirectement** -- l'echec des defenses empiriques en domaine lethal motive les garanties formelles
  - C6 (Medical Vulnerability Premium) : **pilier fondateur** (confiance 9/10) -- le papier le plus important du corpus pour C6

- **Decouvertes :**
  - D-005 (amplification par autorite) : confirmee -- la fabrication de fausses meta-analyses exploite le biais d'autorite en medical [PDF NON DISPONIBLE -- source secondaire]
  - D-018 (potentielle) : fine-tuning affaiblit alignement (non testee directement par P029)

- **Gaps :**
  - G-001 (evaluation medicale) : partiellement adresse (12 scenarios, mais couverture incomplete)
  - G-015 (condition non-medicale) : cree (absence de comparaison med/non-med)

- **Mapping templates AEGIS :** #13 (FDA Authority Hijack -- validation mecanisme), T09 (Medical Webhook Prompt Injection)

### Citations cles
> [CITATIONS VERBATIM NON DISPONIBLES -- paywall JAMA Network Open. Les chiffres suivants sont verifies par coherence croisee entre les chunks ChromaDB mais NON VERIFIES contre le PDF original :]
> ASR global de 94.4% (102/108 injections reussies) -- source secondaire
> Persistance de 69.4% a travers les tours de dialogue -- source secondaire
> FPR de 3.7% sur les conditions controle -- source secondaire

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9.8/10 |
| Reproductibilite | Moyenne -- 6 LLM commerciaux, design controle, mais scenarios proprietaires non publies |
| Code disponible | Non |
| Dataset public | Non |
| Nature epistemique | [EMPIRIQUE] -- statistiques descriptives, pas de modele formel |
| Confiance | 8/10 (haute pour N=36, basse pour N=5 flagships) |
| Statut PDF | [PDF NON DISPONIBLE -- JAMA PAYWALL] -- toutes les donnees quantitatives proviennent de sources secondaires |

---

*Analyse reecrite le 2026-04-05 | Source : 49 chunks ChromaDB (analysis_v2, analysis_v3) + references croisees CONJECTURES_TRACKER, FORMULAS_F56_F59_DRAFT, fiche_attaque_13, RESEARCH_STATE*
*Transparence : PDF complet non lu (paywall JAMA Network Open). Toutes les donnees quantitatives proviennent des chunks ChromaDB ingeres lors des RUNs bibliographiques precedents. Les references inline (Section, Table, page) sont ABSENTES car le fulltext n'a jamais ete injecte dans ChromaDB. Tag : [PDF NON DISPONIBLE -- JAMA PAYWALL].*
