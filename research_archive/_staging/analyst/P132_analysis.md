# P132 — Unregulated Large Language Models Produce Medical Device-Like Output

**Reference** : DOI:10.1038/s41746-025-01544-y (PubMed PMID: 40055537)
**Revue/Conf** : npj Digital Medicine (Nature portfolio, Q1 SCImago, IF ~15)
**Tag** : [ARTICLE VERIFIE] — peer-reviewed npj Digital Medicine 2025-03-07
**Lu le** : 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)

> **PDF Source** : A injecter dans literature_for_rag/P132_weissman2025_npjdm.pdf (preseed COLLECTOR)
> **Auteurs** : Weissman G. E., Mankowitz T., Kanter G. P. (University of Pennsylvania Perelman School of Medicine)

## Passage 1 — Survol (~100 mots)

**Claim principale** : Les LLMs "unregulated" (non-certifies FDA) peuvent etre facilement induits a produire des outputs "device-like" de type Clinical Decision Support (CDS), ce qui constitue un probleme reglementaire majeur puisqu'aucun LLM n'est actuellement autorise par la FDA comme dispositif CDS (Weissman, Mankowitz, Kanter, 2025, npj DM, Abstract, p.1). **Originalite** : premier papier publie dans une revue Nature portfolio qui lie directement (i) insuffisance des prompts comme moyen de controle et (ii) necessite de methodes nouvelles pour contraindre les outputs LLM dans un contexte reglementaire FDA. **Decision** : lecture complete obligatoire pour ancrer la justification reglementaire de δ³ medical.

## Passage 2 — Structure (~200 mots)

**Probleme** : les LLMs montrent une "promesse considerable" pour le CDS, mais aucun n'est actuellement autorise comme dispositif CDS par la FDA (Weissman et al., 2025, Abstract). La question est : peut-on les empecher de produire des outputs device-like via des methodes simples (disclaimers, system prompts) ?

**Hypothese testee** : des prompts et disclaimers suffisent-ils a empecher deux LLMs populaires de produire des outputs device-like ?

**Methode** : evaluation de deux LLMs populaires sur un ensemble de scenarios cliniques, avec test de differentes strategies de mitigation (prompts, disclaimers). Les auteurs mesurent si le LLM produit du contenu classifiable comme CDS par les criteres FDA. (Details methodologiques exacts a verifier en texte complet — l'abstract ne specifie pas N scenarios ni N runs)

**Resultats** : les auteurs trouvent que "LLM output readily produced device-like decision support across a range of scenarios" (Weissman et al., 2025, Abstract, p.1) — autrement dit, les prompts sont insuffisants.

**Limite avouee par les auteurs** (citation quasi-directe de l'abstract) : l'abstract conclut explicitement que "effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose" — ce qui est simultanement la conclusion et la limite (l'etude ne propose PAS de solution technique, seulement le diagnostic du probleme).

## Passage 3 — Profondeur critique (~200 mots)

**Forces** :
- **Revue Nature portfolio Q1** : poids academique considerable, peer-review complet. Contraste avec la litterature arXiv-only dominante sur la securite LLM (Weissman et al., 2025, npj DM)
- **Cadrage reglementaire explicite** : rare dans la litterature prompt-injection. Les auteurs raisonnent en termes de regulation FDA de dispositifs medicaux, pas seulement en termes academiques de jailbreaking
- **Citation clef pour AEGIS** : la conclusion qu'il faut des "new methods beyond prompts" est une **confirmation publique du besoin δ³ medical**. Cette citation publiee dans une revue Nature est un argument d'autorite utilisable dans le manuscrit AEGIS

**Faiblesses / questions ouvertes** :
- L'abstract ne precise pas N scenarios, N runs, quelle est la definition operationnelle de "device-like"
- Pas de proposition de solution technique — les auteurs constatent mais ne construisent pas
- Les deux LLMs testes ne sont pas nommes dans l'abstract — a verifier en texte complet (probablement GPT-4 et Claude ou similaire)
- **Verification integrite** : publie officiellement (PMID 40055537, npj DM), pas de retractation connue au 2026-04-11

## Mapping δ⁰-δ³ AEGIS

- **δ⁰ (RLHF alignment)** : l'article implique que l'alignement actuel est insuffisant (les LLMs continuent a produire du CDS device-like meme avec disclaimers)
- **δ¹ (contexte sanitization)** : non adresse
- **δ² (detection runtime)** : non adresse
- **δ³ (validation formelle de sortie)** : **pas une implementation**, mais **motivation publique forte et peer-reviewed**. Weissman et al. documentent le probleme auquel δ³ AEGIS repond

## Pertinence these AEGIS

- **Conjectures C1-C8 impactees** :
  - **C2 (necessite δ³)** — renforce significativement via autorite Nature portfolio. Premier peer-reviewed journal qui cible explicitement le besoin reglementaire FDA → methode formelle pour contraindre les outputs LLM
  - **C6 (vulnerabilite medicale)** — renforce a 10/10 : l'insuffisance des prompts medicaux est maintenant empiriquement documentee dans npj DM
- **Gaps G-XXX** :
  - **G-003 (red-teaming medical systematique)** — fournit un precedent methodologique pour l'evaluation systematique multi-scenarios
  - **G-001 (implementation δ³ medicale)** — renforce l'importance du gap : le probleme est documente Nature, la solution manque
- **Decouvertes D-XXX** : peut ancrer une nouvelle decouverte D-XXX "prompts insuffisants en contexte FDA CDS" avec la citation npj DM comme evidence principale

## Citations cles

> "LLM output readily produced device-like decision support across a range of scenarios" (Weissman et al., 2025, npj Digital Medicine, Abstract, p.1)

> "effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose" (Weissman et al., 2025, npj Digital Medicine, Abstract, p.1)

## Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 — source peer-reviewed Q1 pour justification δ³ medical |
| Reproductibilite | Moyenne — protocole a verifier en texte complet |
| Code disponible | Non (etude clinique, pas framework) |
| Dataset public | A verifier en texte complet |
| Domaine | Medical (clinical decision support, FDA regulation) |
| Nature | [ARTICLE VERIFIE] — motivation / cadrage reglementaire, PAS implementation |
