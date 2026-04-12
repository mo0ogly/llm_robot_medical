## [Weissman, Mankowitz, Kanter, 2025] — Unregulated Large Language Models Produce Medical Device-Like Output

**Reference :** DOI:10.1038/s41746-025-01544-y (PubMed PMID: 40055537)
**Revue/Conf :** npj Digital Medicine (Nature portfolio), volume 8, publie 2025-03-07 — Q1 SCImago, IF ~15
**Lu le :** 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)
> **PDF Source**: [literature_for_rag/P131_weissman2025_npjdm.pdf](../../../literature_for_rag/P131_weissman2025_npjdm.pdf) (a injecter)
> **Statut**: [ARTICLE VERIFIE] — peer-reviewed Nature portfolio, motivation / cadrage reglementaire (PAS une implementation)
> **Auteurs**: Weissman Gary E., Mankowitz Toni, Kanter Genevieve P. (University of Pennsylvania Perelman School of Medicine)

### Abstract original
> "Large language models (LLMs) show considerable promise for clinical decision support (CDS) but none is currently authorized by the Food and Drug Administration (FDA) as a CDS device. We evaluated whether two popular LLMs could be induced to provide device-like CDS output. We found that LLM output readily produced device-like decision support across a range of scenarios, suggesting a need for regulation if LLMs are formally deployed for clinical use."
> — Source : npj Digital Medicine, Abstract, p.1

### Resume (5 lignes)
- **Probleme :** Les LLMs montrent une promesse considerable pour le Clinical Decision Support (CDS) mais aucun n'est actuellement autorise par la FDA comme dispositif CDS (Weissman et al., 2025, Abstract)
- **Methode :** Evaluation de deux LLMs populaires sur un ensemble de scenarios cliniques avec differentes strategies de mitigation (prompts, disclaimers) (Weissman et al., 2025, Abstract)
- **Donnees :** Range of clinical scenarios (N exact a verifier en texte complet), deux LLMs non-nommes dans l'abstract
- **Resultat :** "LLM output readily produced device-like decision support across a range of scenarios" (Weissman et al., 2025, Abstract, p.1)
- **Limite :** Diagnostic du probleme sans proposition de solution technique — etude de motivation, pas d'implementation

### Analyse critique
**Forces :**
- Premier paper peer-reviewed Nature portfolio (Q1) qui lie directement insuffisance des prompts et necessite de methodes nouvelles pour contraindre les outputs LLM en contexte reglementaire FDA
- Cadrage reglementaire explicite rare dans la litterature prompt-injection (Weissman et al., 2025, Abstract)
- Citation clef utilisable comme argument d'autorite : "effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose" (Weissman et al., 2025, Abstract, p.1)

**Faiblesses :**
- L'abstract ne precise pas N scenarios, N runs, ni la definition operationnelle de "device-like"
- Les deux LLMs testes ne sont pas nommes dans l'abstract (a verifier en texte complet)
- Pas de proposition de solution technique — constat sans construction

**Questions ouvertes :** nom des deux LLMs, protocole experimental exact, criteres FDA operationnalises.

### Formules exactes
N/A — etude qualitative / reglementaire, pas de formules mathematiques dans l'abstract.

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (insuffisance alignement actuel) + motivation publique peer-reviewed pour **δ³** (methodes beyond prompts)
- **Conjectures :** **C2 (necessite δ³)** renforce significativement via autorite Nature ; **C6 (vulnerabilite medicale)** renforce a 10/10 — insuffisance des prompts medicaux empiriquement documentee
- **Decouvertes :** peut ancrer decouverte "prompts insuffisants en contexte FDA CDS" avec citation npj DM comme evidence principale
- **Gaps :** renforce **G-001** (implementation δ³ medicale) — le probleme est documente Nature, la solution manque ; eclaire **G-003** (red-teaming medical systematique) via precedent methodologique multi-scenarios
- **Integration VERIFICATION_DELTA3_20260411 :** citation d'autorite principale pour la reformulation du §1 delta-3.md justifiant que "new methods beyond prompts are needed" pour contraindre les outputs LLM medicaux

### Citations cles
> "LLM output readily produced device-like decision support across a range of scenarios" (Weissman et al., 2025, npj Digital Medicine, Abstract, p.1)
> "effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose" (Weissman et al., 2025, npj Digital Medicine, Abstract, p.1)

### Analyse Keshav
Voir fichier analyst source: `research_archive/_staging/analyst/P132_analysis.md` (renumerote P132 -> P131 a l'integration LIBRARIAN 2026-04-11).

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 — source peer-reviewed Q1 pour justification δ³ medical |
| Reproductibilite | Moyenne — protocole a verifier en texte complet |
| Code disponible | Non (etude clinique, pas framework) |
| Dataset public | A verifier en texte complet |
| Domaine | Medical (clinical decision support, FDA regulation) |
| Nature | [ARTICLE VERIFIE] — motivation / cadrage reglementaire, PAS implementation |
