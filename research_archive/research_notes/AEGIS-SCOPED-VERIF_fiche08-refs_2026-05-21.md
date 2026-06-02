# Verification scoped des references — Fiche #08 (dettes de l'audit anti-confabulation)

- Date : 2026-05-21
- Mode : bibliography-maintainer scoped (verification ciblee, STEP 0 anti-doublon + HUMILITY GATE), sans mutation du corpus
- Source des dettes : research_notes/AEGIS-AUDIT-FICHE-08_anti-confabulation.md, section 4
- Methode : WebSearch (role COLLECTOR) + cross-check MANIFEST + `check_corpus_dedup.py`

## Resultat anti-doublon (STEP 0)

`python backend/tools/check_corpus_dedup.py 2404.13208 2310.03693 2311.16119 2406.05946`

Les quatre ressortent `[NEW]` par le check arXiv. Attention : 2406.05946 est en realite deja dans le corpus en P018 (le check arXiv l'a manque car la ligne MANIFEST de P018 ne contient pas l'arXiv ID). Cross-check titre confirme P018 = ce papier. C'est la limitation documentee du check arXiv (fallback titre obligatoire).

## Constat critique — erreur d'attribution Wei vs Qi

Le papier "Safety Alignment Should Be Made More Than Just a Few Tokens Deep" est de Qi Xiangyu, Ashwinee Panda, Kaifeng Lyu, Xiao Ma, Subhrajit Roy, Ahmad Beirami, Prateek Mittal, Peter Henderson (ICLR 2025, Oral ; arXiv:2406.05946). Il est deja dans le corpus en P018 (Qi et al.) et liste dans le CLAUDE.md comme "Qi et al. (2025) — ICLR 2025, Shallow Alignment (Outstanding Paper)".

La fiche #08 et le journal (AEGIS-DECISION-LOG-001, sections 2.2 et 3.4) attribuent ce papier a "Wei et al. (ICLR 2025)". C'est une erreur d'attribution. La propriete P2 (shallowness) de δ⁰ doit etre citee (Qi et al., 2025, ICLR, arXiv:2406.05946 = corpus P018), pas Wei et al. Ce n'est pas une publication inventee (le papier existe), mais l'erreur avait passe la verification precedente du journal.

## Verdict par reference

| Reference (fiche) | Statut verifie | Action |
|-------------------|----------------|--------|
| "Wei et al. (ICLR 2025) — Safety Alignment ... Tokens Deep" | [SOURCE] mais MAUVAISE ATTRIBUTION | Re-attribuer a Qi et al., 2025, ICLR, arXiv:2406.05946 = corpus P018 |
| Wallace et al. (2024) | [SOURCE] confirme. "The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions", Wallace, Xiao, Leike, Weng, Heidecke, Beutel (OpenAI), arXiv:2404.13208 | Pas dans le corpus ([NEW]). Le P(detection) >= 0.98 n'est pas un chiffre du papier : rester [ESTIMATION]. Candidat ajout P-ID |
| CrowdStrike (Mars 2026), taxonomie IM/PT | [SOURCE — qualite inferieure] confirme. "Taxonomy of Prompt Injection Methods" (crowdstrike.com), axes IM (Injection Method) / PT, categorie "Overt Instruction" | Citer comme source editeur (non peer-reviewed). Mapping #08 = Overt coherent |
| Lee et al. (JAMA 2025), 94.4% ASR | [SOURCE] confirme = corpus P029. "Vulnerability of LLMs to Prompt Injection When Providing Medical Advice", JAMA Network Open 2025, DOI 10.1001/jamanetworkopen.2025.49963. 94.4% des essais, 91.7% scenarios extreme-harm, FDA Category X (thalidomide) | Confirmer l'auteur principal (corpus P029 = "Unknown et al." ; le resume web dit "Lee et al."). Contexte = conseil medical, pas chirurgical : marquer [PROJECTION] si transpose |
| Schulhoff et al. (2024) | [SOURCE] confirme mais ANNEE FAUSSE = 2023. "Ignore This Title and HackAPrompt...", EMNLP 2023 (Best Theme Paper), arXiv:2311.16119. Taxonomie de 29 techniques (triade CIA) | Corriger 2024 -> 2023. Pas dans le corpus. Voir HUMILITY GATE ci-dessous |
| Jannadi (Compilation, Jan 2026) | [SOURCE — qualite inferieure] confirme. Article Medium de Khmaiess Jannadi, "Prompt Injection Attacks in LLMs: Vulnerabilities, Exploitation Techniques, and Defense Strategies" | La partie OWASP est etayee ; la "convergence OWASP/NIST/MITRE/CISA" n'est pas clairement etablie par l'article : [A VERIFIER] ou attenuer. Citer comme blog |
| NDSS 2025 (Safety Misalignment) | [SOURCE] confirme = corpus P023. "Safety Misalignment Against Large Language Models", NDSS 2025, Gong, Ran, He, Cong, Wang, Wang. Couvre system-prompt mod, fine-tuning (SFT le plus puissant), model editing, SSRA/SSRD | Auteurs corpus P023 = "Unknown et al." a mettre a jour (Gong et al.) |
| "100 exemples malveillants / GSM8K benin degradent δ⁰" attribue a NDSS 2025 | MAUVAISE ATTRIBUTION | Ce resultat est de Qi et al., 2023, "Fine-tuning Aligned Language Models Compromises Safety...", arXiv:2310.03693 (le chiffre canonique est ~10 exemples adversariaux ; le 100 concerne plutot le fine-tuning benin). Re-attribuer + verifier le nombre exact. Pas dans le corpus ([NEW]) |

## HUMILITY GATE — claim Schulhoff

Affirmation de la fiche : "la coercition par menace n'apparait dans aucune taxonomie comme technique viable". Mot-cle de primaute ("aucune") -> gate declenche.

Verification : ni la taxonomie HackAPrompt (29 techniques, triade CIA ; Schulhoff et al., 2023, arXiv:2311.16119) ni la taxonomie CrowdStrike (IM/PT, 185+ techniques) ne listent la coercition par menace comme technique viable. Aucune contre-preuve trouvee. Conformement au gate, reformuler en : "dans les taxonomies consultees (Schulhoff et al., 2023 ; CrowdStrike, 2026), la coercition par menace n'apparait pas comme technique viable", avec scope et date, sans primaute absolue.

## Lacunes de qualite du corpus identifiees (a corriger via le pipeline complet)

- P018 : ligne MANIFEST sans arXiv ID. Ajouter arXiv:2406.05946 (sinon le check anti-doublon continuera de le manquer).
- P023 : auteurs = "Unknown et al." -> Gong, Ran, He, Cong, Wang, Wang (NDSS 2025).
- P029 : auteurs = "Unknown et al." -> confirmer l'auteur principal (JAMA Network Open 2025, DOI 10.1001/jamanetworkopen.2025.49963).

## Candidats a l'ajout au corpus (NEW, dedup-clean)

- Wallace et al., 2024, arXiv:2404.13208 (Instruction Hierarchy).
- Qi et al., 2023, arXiv:2310.03693 (fine-tuning compromet l'alignement — base de P3/δ⁰).
- Schulhoff et al., 2023, arXiv:2311.16119 (taxonomie HackAPrompt).

Ces ajouts relevent du pipeline complet (P-ID, analyse, injection ChromaDB) et ne sont pas effectues en mode scoped.

## Hors perimetre — ASR a mesurer

Les ASR en dette (#08 avec et sans system prompt ; #01, #02, #03, #06, #07, #10, #11) ne sont pas des references : ils relevent d'une campagne experimentale (experimentalist / run_formal_campaign, N >= 30, protocole δ⁰/δ¹ pour #07 et #08). Voir tache de cadrage dediee.
