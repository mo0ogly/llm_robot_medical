## [Hackett et al., 2025] — Bypassing LLM Guardrails: An Empirical Analysis of Evasion Attacks against Prompt Injection and Jailbreak Detection Systems

**Reference :** ACL 2025, LLM Security Workshop (LLMSEC), pages 101-114
**Revue/Conf :** ACL 2025 Workshop LLMSEC (peer-reviewed)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P049_hackett_bypassing_guardrails.pdf](../../assets/pdfs/P049_hackett_bypassing_guardrails.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (65 chunks)

### Abstract original
> Large Language Models (LLMs) guardrail systems are designed to protect against prompt injection and jailbreak attacks. However, they remain vulnerable to evasion techniques. We demonstrate two approaches for bypassing LLM prompt injection and jailbreak detection systems via traditional character injection methods and algorithmic Adversarial Machine Learning (AML) evasion techniques. Through testing against six prominent protection systems, including Microsoft's Azure Prompt Shield and Meta's Prompt Guard, we show that both methods can be used to evade detection while maintaining adversarial utility achieving in some instances up to 100% evasion success. Furthermore, we demonstrate that adversaries can enhance Attack Success Rates (ASR) against black-box targets by leveraging word importance ranking computed by offline white-box models. Our findings reveal vulnerabilities within current LLM protection mechanisms and highlight the need for more robust guardrail systems.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les systemes de guardrails LLM (classification de prompt injection/jailbreak) sont potentiellement vulnerables aux techniques d'evasion adversariale, comme les systemes de classification classiques en AML.
- **Methode :** Deux approches : (1) injection de caracteres (12 techniques : zero-width chars, homoglyphes, diacritiques, etc., Table 1, p. 3), et (2) evasion AML algorithmique (8 techniques : TextFooler, Bert-Attack, BAE, PWWS, etc., Table 2, p. 4). Test de transferabilite des rankings d'importance de mots entre modeles white-box et black-box (Section 5.3, p. 8).
- **Donnees :** 6 systemes de guardrails : Azure Prompt Shield (black-box), ProtectAI v1 et v2, Meta Prompt Guard, NeMo Guard Jailbreak Detect, Vijil Prompt Injection. Datasets : prompt injections et jailbreaks (Section 4, p. 4-5).
- **Resultat :** Character injection : jusqu'a 100% d'evasion sur certains guardrails. AML evasion : TextFooler le plus efficace avec ASRs moyens de 46.27% (PI) et 48.46% (jailbreaks) (Section 5.2, p. 7-8). NeMo Guard le plus vulnerable (65.22% ASR moyen jailbreak), Meta Prompt Guard le plus robuste (2.76% ASR PI) (Section 5.2, p. 7-8). Transferabilite white-box -> black-box demontree (Table 3, p. 8).
- **Limite :** Uniquement Azure Prompt Shield comme cible black-box ; mecanismes de transferabilite non expliques ; impact des perturbations sur l'efficacite des prompts originaux non rigoureusement mesure (Limitations, p. 9).

### Analyse critique
**Forces :**
- Premiere etude empirique systematique de l'evasion des guardrails LLM, comblant un manque identifie dans la litterature (Section 1, p. 1-2).
- 6 systemes de guardrails commerciaux et open-source testes, couvrant la diversite du marche (Section 2, p. 2-3).
- Demonstration que les techniques d'evasion AML classiques (concues pour les classifieurs textuels) sont transferables aux guardrails LLM (Section 5.2, p. 7-8).
- Resultat operationnellement critique : certains guardrails sont contournables a 100% par de simples injections de caracteres invisibles (zero-width, homoglyphes) (Section 5.1, p. 6-7).
- Transferabilite demonstree : les rankings d'importance de mots calcules sur des modeles white-box ameliorent les attaques contre des cibles black-box (Table 3, p. 8).

**Faiblesses :**
- Scope limite a un seul target black-box (Azure Prompt Shield) ; la generalisabilite a d'autres systemes commerciaux (Anthropic, Google) n'est pas evaluee (Limitations, p. 9).
- Les techniques de perturbation peuvent degrader l'utilite adversariale des prompts : les auteurs reconnaissent que l'evaluation de l'efficacite des prompts perturbes n'est pas rigoureuse (Limitations, p. 9).
- Pas de defense proposee : l'etude est purement offensive, sans recommandation concrete de mitigation.
- L'evasion par caracteres invisibles est une technique connue en cybersecurite (Unicode attacks), la transposition aux guardrails LLM est attendue mais merite d'etre documentee.
- Pas de test multi-tour ni d'evasion progressive.
- Disclosure responsable effectuee (Section 9, p. 9) mais les reponses des vendeurs ne sont pas detaillees.

**Questions ouvertes :**
- Les guardrails basees sur des LLMs (vs classificateurs fine-tuned) sont-elles plus robustes aux evasions AML ?
- Des defenses de type normalisation Unicode ou retokenization (mentionnees dans P048) pourraient-elles mitiger l'evasion par caracteres ?
- Comment combiner detection statique (classificateurs) et detection semantique (LLM-based) pour une robustesse accrue ?

### Formules exactes
Pas de formalisation mathematique originale. Les metriques utilisees sont :
- ASR (Evasion Success Rate) : fraction des prompts malveillants qui evitent la detection (Section 4, p. 4-5)
- Word Importance Ranking : gradient-based, word removal, word saliency (Section 3.2, p. 3-4)
- Techniques AML : TextFooler, Bert-Attack, BAE, PWWS, TextBugger, Alzantot, Pruthi, DeepWordBug (Table 2, p. 4)

Lien glossaire AEGIS : F22 (ASR), F63 (evasion rate)

### Pertinence these AEGIS
- **Couches delta :** δ² (les guardrails testes sont des filtres syntaxiques/classificateurs — exactement la couche δ² du modele AEGIS), δ³ (la faiblesse des guardrails renforce l'argument pour une verification formelle)
- **Conjectures :** C1 (fortement supportee — les defenses δ² par classification sont contournables), C2 (fortement supportee ��� l'absence de garanties formelles dans les guardrails est demontree), C5 (supportee — les guardrails δ² doivent etre combines avec d'autres couches)
- **Decouvertes :** D-006 (vulnerabilite des guardrails aux evasions AML classiques), D-011 (transferabilite white-box -> black-box pour les rankings d'importance)
- **Gaps :** G-007 (robustesse des guardrails aux perturbations adversariales), G-013 (combinaison detection statique + semantique), G-015 (pas d'evaluation medicale)
- **Mapping templates AEGIS :** Les 12 techniques de character injection et 8 techniques AML sont directement integrables comme operateurs de mutation dans le moteur genetique AEGIS

### Citations cles
> "Both methods can be used to evade detection while maintaining adversarial utility achieving in some instances up to 100% evasion success" (Abstract, p. 1)
> "NeMo Guard Jailbreak Detect exhibited the highest susceptibility to jailbreak evasion with an average ASR of 65.22%" (Section 5.2, p. 7-8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — techniques standard (TextFooler, etc.), guardrails publics ; code non mentionne explicitement |
| Code disponible | Non mentionne |
| Dataset public | Oui (prompts PI et jailbreak standard utilises) |
