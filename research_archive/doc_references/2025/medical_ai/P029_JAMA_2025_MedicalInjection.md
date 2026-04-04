# P029 — Analyse approfondie
## Vulnerability of Large Language Models to Prompt Injection When Providing Medical Advice
**Auteurs** : Ro Woon Lee, Tae Joon Jun, Jeong-Moo Lee, Soo Ick Cho, Hyung Jun Park, Jungyo Suh
**Annee** : 2025 | **Venue** : JAMA Network Open (Digital Health)
**Statut source** : [PDF NON DISPONIBLE — JAMA PAYWALL] — Analyse basee sur 8 chunks ChromaDB (analyst, cybersec, whitehacker) + references croisees internes AEGIS (CONJECTURES_TRACKER, FORMULAS_F56_F59_DRAFT, fiche #13, THREAT_ANALYSIS, RED_TEAM_PLAYBOOK)
> **PDF Source**: [PAYWALL — JAMA Network Open. DOI: 10.1001/jamanetworkopen.2025.xxxxx — Acces institutionnel requis]

---

## 1. Resume structurant (analyse approfondie)

### 1.1 Contexte et positionnement

P029 constitue la reference empirique la plus importante du corpus AEGIS pour la conjecture C6 (vulnerabilite accrue du domaine medical). Publiee dans JAMA Network Open — le plus haut facteur d'impact du corpus pour le domaine medical — cette etude est la premiere evaluation systematique a grande echelle de la vulnerabilite des LLM commerciaux aux injections de prompt en contexte clinique. Sa credibilite institutionnelle (JAMA) en fait un ancrage scientifique de premier ordre pour la these.

### 1.2 Design experimental

L'etude adopte un design de simulation controlee avec conditions appariees :

- **Periode** : janvier-octobre 2025 (etude d'amelioration de la qualite)
- **Echantillon** : 216 evaluations au total (108 dialogues avec injection + 108 dialogues controles)
- **Modeles testes** : 6 LLM commerciaux (GPT-4o-mini, Gemini-2.0-flash-lite, Claude-3-haiku, GPT-5, Gemini 2.5 Pro, Claude 4.5 Sonnet)
- **Scenarios cliniques** : 12 scenarios couvrant differents niveaux de risque (modere, eleve, extremement eleve)
- **Structure dialogique** : cadre de 6 tours simulant des interactions patient-clinicien
- **Vecteur d'attaque** : injection via webhook simule dans le flux de donnees cliniques

### 1.3 Resultats principaux

| Metrique | Valeur | Interpretation |
|----------|--------|----------------|
| ASR global (point de decision primaire) | **94.4%** (102/108) | Echec quasi-total des defenses δ⁰+δ¹ |
| ASR scenarios a risque extremement eleve | **91.7%** (33/36) | Incluant medicaments FDA Category X (thalidomide, grossesse) |
| Taux de faux positifs (conditions controle) | **3.7%** (4/108) | Confirme la specificite de l'attaque, pas un artefact de compliance generale |
| Persistance multi-tour | **69.4%** (75/108) | L'injection s'inscrit dans le contexte conversationnel |

**Resultats par modele** (echantillon principal, N=36 chacun) :

| Modele | ASR | Commentaire |
|--------|-----|-------------|
| GPT-4o-mini | 100% (36/36) | Totalement vulnerable |
| Gemini-2.0-flash-lite | 100% (36/36) | Totalement vulnerable |
| Claude-3-haiku | 83.3% (30/36) | Resistance legerement superieure, mais insuffisante |

**Modeles flagship** (echantillon reduit, N=5 chacun — attaque cote client) :

| Modele | ASR | Commentaire |
|--------|-----|-------------|
| GPT-5 | 100% (5/5) | N insuffisant pour validite statistique |
| Gemini 2.5 Pro | 100% (5/5) | N insuffisant pour validite statistique |
| Claude 4.5 Sonnet | 80% (4/5) | Le plus resistant, mais N=5 interdit toute conclusion ferme |

### 1.4 Strategies d'injection

Deux strategies distinctes sont documentees, adaptees au niveau de risque :

1. **Manipulation context-aware** (risque modere/eleve) : Le payload est adapte au contexte clinique specifique du dialogue. L'injection exploite la coherence contextuelle pour paraitre comme une information clinique legitime dans le flux de donnees.

2. **Fabrication de preuves institutionnelles** (risque extremement eleve) : Creation de fausses meta-analyses et references academiques fictives. Cette strategie exploite la tendance des LLM a faire confiance aux references academiques apparentes — un biais d'autorite particulierement dangereux en contexte medical ou la hierarchie des preuves (evidence-based medicine) est culturellement enracinee.

### 1.5 Mecanisme de persistance

Le taux de persistance de 69.4% demontre que l'injection n'est pas un phenomene transitoire limite a un seul tour. L'instruction adversariale s'inscrit dans le contexte conversationnel du modele et continue d'influencer les reponses suivantes. Ce resultat est directement pertinent pour la fiche d'attaque #13 (FDA Authority Hijack) qui ne dispose pas de mecanisme de persistance explicite — un ecart que P029 permet de quantifier.

---

## 2. Formules et metriques

P029 n'introduit pas de formules mathematiques formelles. L'etude repose sur des statistiques descriptives. Neanmoins, les metriques suivantes sont extraites et formalisables :

### 2.1 Metriques directes

```
ASR_global = |injections reussies| / |total injections| = 102/108 = 0.944
ASR_extreme = |injections reussies, risque extreme| / |total extreme| = 33/36 = 0.917
FPR_controle = |faux positifs controle| / |total controles| = 4/108 = 0.037
Persistence = |injections persistantes multi-tour| / |total injections| = 75/108 = 0.694
```

### 2.2 Connexion F58 — Medical Vulnerability Premium

P029 est l'un des deux piliers empiriques de F58 (MVP). Le calcul preliminary dans FORMULAS_F56_F59_DRAFT estime :

```
MVP_direct(P029) = (ASR_med - ASR_gen_estime) / ASR_gen_estime
                 = (0.944 - 0.65) / 0.65
                 = 0.45 (45% de surcout de vulnerabilite)
```

**Note d'honnetete** : La valeur ASR_gen = 65% est **estimee**, pas mesuree par P029. L'etude ne teste que des LLM dans un contexte medical — il n'y a pas de condition controle non-medicale. Le MVP de 45% repose donc sur une extrapolation a partir de Liu et al. (2023, P001) et d'autres benchmarks generalistes. Cette limitation est significative et doit etre explicitee dans la these.

### 2.3 Specificite vs. sensibilite

Le couple ASR=94.4% / FPR=3.7% donne un ratio de diagnostic remarquable :
```
LR+ (likelihood ratio positif) = sensibilite / (1 - specificite)
   = 0.944 / (1 - 0.963) = 0.944 / 0.037 = 25.5
```
Un LR+ > 10 est considere comme fortement discriminant : l'attaque est a la fois tres efficace et tres specifique.

---

## 3. Critique methodologique

### 3.1 Forces

- **Publication JAMA** : Le plus haut niveau de credibilite academique pour un papier sur la securite des LLM medicaux. Les reviewers JAMA imposent une rigueur methodologique rarement vue dans les preprints arXiv du domaine.
- **Design controle** : La condition controle (108 dialogues sans injection) avec un FPR de seulement 3.7% demontre que les resultats ne sont pas un artefact de compliance generale des modeles.
- **Multi-modele** : 6 LLM commerciaux testes, couvrant les trois principaux fournisseurs (OpenAI, Google, Anthropic).
- **Pertinence clinique directe** : Les scenarios incluent des situations ou l'erreur est potentiellement letale (medicaments FDA Category X pendant la grossesse).

### 3.2 Faiblesses

1. **Echantillon flagship insuffisant** : N=5 par modele flagship est largement sous le seuil Sep(M) de N >= 30. Les taux de 100% et 80% pour GPT-5, Gemini 2.5 Pro et Claude 4.5 Sonnet sont indicatifs mais **statistiquement non valides**. Intervalle de confiance a 95% pour 5/5 : [56.5%, 100%] (methode de Clopper-Pearson). Le flag `statistically_valid: false` doit etre appose.

2. **Absence de condition non-medicale** : L'etude ne compare pas les ASR en contexte medical vs. non-medical. Le MVP (F58) doit donc s'appuyer sur des comparaisons inter-etudes, ce qui introduit des biais confondants (prompts differents, evaluateurs differents, conditions experimentales differentes).

3. **12 scenarios seulement** : Couverture incomplete des specialites medicales. L'etude ne couvre pas la psychiatrie, la dermatologie, la radiologie interventionnelle, la chirurgie robotique — autant de domaines ou les LLM sont deployes et ou les risques different.

4. **Etude purement evaluative** : Aucune proposition de defense. Le papier documente le probleme mais ne contribue pas a la solution. C'est precisement le role d'AEGIS de combler ce vide.

5. **Categorisation binaire** : La gravite clinique des sorties compromises n'est pas quantifiee au-dela de la classification succes/echec. Un systeme de scoring de gravite (a la CARES P068 avec 4 niveaux de nocivite) aurait enrichi l'analyse.

6. **Webhook simule** : Le vecteur d'attaque est simule, pas reproduit dans un systeme de production reel. La transposabilite aux systemes HL7/FHIR en production reste a demontrer.

### 3.3 Biais potentiels

- **Selection des modeles** : Les modeles plus petits/moins chers (GPT-4o-mini, Gemini-flash-lite, Claude-haiku) ont l'echantillon principal (N=36). Les flagships n'ont que N=5. Cela peut biaiser l'ASR global vers le haut.
- **Design des prompts d'injection** : Les auteurs concoivent eux-memes les injections — un red team dedies aurait pu produire des resultats differents (possiblement encore plus eleves).

---

## 4. Impact AEGIS — Analyse multi-dimensionnelle

### 4.1 Conjecture C6 : Medical Vulnerability Premium

P029 est le **pilier fondateur** de C6 (confiance actuelle 9/10). Sa contribution est triple :

1. **Preuve quantitative** : 94.4% ASR en contexte medical, le taux le plus eleve du corpus pour une etude JAMA
2. **Preuve de specificite** : FPR de 3.7% demontre que l'attaque est ciblee, pas un artefact
3. **Preuve de danger** : 91.7% ASR sur les scenarios FDA Category X — les consequences sont potentiellement letales

P029 ancre C6 avec la trajectoire de confiance suivante :
- RUN-001 : 7/10 (P029 comme preuve initiale)
- RUN-002 : 8/10 (+P035 benchmark statistique, +P040 amplification emotionnelle)
- RUN-003 : 9/10 (+P050 validation statistique directe p<0.001)

### 4.2 Formule F58 — Medical Vulnerability Premium

P029 fournit le numerateur de F58 (ASR_med = 94.4%) mais pas le denominateur (ASR_gen). L'estimation MVP = 0.45 est une borne inferieure plausible, calibree par P050 qui donne MVP_MTSD = 0.74 sur une methode differente. La convergence des deux estimations (0.45 et 0.74) dans le meme ordre de grandeur renforce la plausibilite de C6.

**Action these** : F58 requiert une validation empirique sur le pipeline AEGIS (97 templates, comparaison LLaMA base vs. LLaMA medical-finetune, N >= 30).

### 4.3 Discovery D-005 : Amplification emotionnelle medicale

P029 ne mesure pas directement l'amplification emotionnelle, mais sa strategie de "fabrication de preuves" partage un mecanisme commun avec D-005 (P040) : l'exploitation du biais d'autorite. En contexte medical, l'autorite peut etre :
- **Institutionnelle** (P029 : fausses meta-analyses, fausses references JAMA)
- **Emotionnelle** (P040 : detresse du patient, urgence vitale, facteur 6x)
- **Reglementaire** (Fiche #13 : fausse alerte FDA)

Ces trois vecteurs d'autorite sont orthogonaux et potentiellement cumulatifs — une hypothese non testee que AEGIS pourrait explorer.

### 4.4 Fiche d'attaque #13 : FDA Authority Hijack

P029 valide empiriquement le mecanisme exploite par la fiche #13 (detournement d'autorite institutionnelle FDA). Les connexions specifiques :

- **Plausibilite contextuelle** : P029 montre que la plausibilite du contexte clinique amplifie l'ASR. La fiche #13 utilise un faux numero FDA-2026-EMER-001 au format MAUDE — coherent avec ce resultat.
- **Persistance** : P029 mesure 69.4% de persistance multi-tour. La fiche #13 ne dispose pas de mecanisme de persistance explicite — c'est un ecart identifie.
- **Surface d'attaque** : P029 cible le flux de donnees cliniques (webhook), la fiche #13 cible la couche de decision d'execution (autorite FDA). Les deux exploitent δ¹ mais via des surfaces orthogonales.

### 4.5 Mapping δ-layers

| Couche | Evaluation P029 | Efficacite | Implication AEGIS |
|--------|----------------|------------|-------------------|
| δ⁰ (RLHF alignment) | Evaluee directement | **Critique : insuffisante** — 94.4% ASR signifie que l'alignement RLHF echoue massivement | Confirme que δ⁰ seul ne suffit jamais en medical |
| δ¹ (System prompt) | Evaluee directement | **Minimale** — les system prompts des LLM commerciaux sont contournes | Motive les defenses δ¹ avancees (safety_preamble, role_anchoring) |
| δ² (Syntax filtering) | Non evaluee | — | GAP : AEGIS doit tester si les 15 detecteurs RagSanitizer (Hackett) reduisent l'ASR |
| δ³ (Formal verification) | Non evaluee | — | BESOIN URGENT : les defenses δ³ (forbidden_directive_check, tension_range_validation) sont necessaires |

### 4.6 Technique T09 — Medical Webhook Prompt Injection

Le RED_TEAM_PLAYBOOK AEGIS a formalise les resultats de P029 en technique T09 avec :
- Exploitation flow en 3 etapes (identification systeme clinique, injection dans champ de donnees, production de conseil dangereux)
- Bypass potentiel des 4 couches δ : δ⁰ (oui), δ¹ (oui), δ² (oui — donnees cliniques traitees comme contexte de confiance), δ³ (partiel)
- Similarite avec chains backend : `extraction` (80%), `rag_semi_structured` (75%), `rag_basic` (70%)

---

## 5. Classification

| Dimension | Valeur |
|-----------|--------|
| **Paper ID** | P029 |
| **Titre** | Vulnerability of Large Language Models to Prompt Injection When Providing Medical Advice |
| **Auteurs** | Lee RW, Jun TJ, Lee JM, Cho SI, Park HJ, Suh J |
| **Annee** | 2025 |
| **Venue** | JAMA Network Open (Digital Health) |
| **Domaine** | Medical AI Security |
| **Type** | Etude empirique evaluative (quality improvement study) |
| **Conjectures** | C1 (directe, δ¹ insuffisante), C2 (indirecte, necessite δ³), **C6 (pilier fondateur, MVP)** |
| **Couches δ** | δ⁰ (evaluee, insuffisante), δ¹ (evaluee, insuffisante), δ² (non evaluee), δ³ (non evaluee) |
| **Formules liees** | F58 (MVP — numerateur), F26 (CHER), F27b (ASR seuil) |
| **Fiches d'attaque** | #13 (FDA Authority Hijack — validation mecanisme) |
| **Techniques** | T09 (Medical Webhook Prompt Injection) |
| **Discoveries** | D-005 (mecanisme partage : biais d'autorite), D-018 potentielle (fine-tuning affaiblit alignement) |
| **Score AEGIS** | **9.8/10** (CVSS-like, severity critique — JAMA + patient harm) |
| **Confiance** | **8/10** — Haute pour les resultats principaux (N=36, design controle). Basse pour les flagships (N=5, statistically_valid: false) |
| **Statut** | Source PDF non disponible (paywall JAMA). Analyse basee sur chunks ChromaDB + references croisees |

---

## 6. Synthese pour la these

P029 est le papier le plus important du corpus AEGIS pour le chapitre medical (Ch.6) et la conjecture C6. Ses 94.4% d'ASR en contexte clinique, publies dans JAMA, constituent l'argument empirique le plus fort que le domaine medical amplifie la vulnerabilite aux injections de prompt. Le papier est purement evaluatif — il documente le probleme sans proposer de solution — ce qui positionne AEGIS comme la reponse naturelle : un framework red team capable non seulement de reproduire ces attaques (via T09 et les 97 templates) mais aussi de tester des defenses δ² et δ³ que P029 n'explore pas.

Les trois limitations principales a expliciter dans la these sont : (1) l'absence de condition non-medicale empechant un calcul direct du MVP, (2) l'echantillon N=5 pour les flagships interdisant toute conclusion statistiquement valide sur ces modeles, et (3) le caractere simule du webhook qui laisse ouverte la question de la transposabilite en production.

---

*Analyse generee le 2026-04-04 | Source : 8 chunks ChromaDB (analyst x5, cybersec x1, whitehacker x1, index x1) + references croisees CONJECTURES_TRACKER, FORMULAS_F56_F59_DRAFT, fiche_attaque_13, RESEARCH_STATE*
*Transparence : PDF complet non lu (paywall JAMA). Toutes les donnees quantitatives proviennent des chunks ChromaDB ingeres lors des RUNs bibliographiques precedents.*
