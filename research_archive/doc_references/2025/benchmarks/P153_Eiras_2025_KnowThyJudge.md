## [Eiras et al., 2025] — Know Thy Judge: On the Robustness Meta-Evaluation of LLM Safety Judges

**Reference :** arXiv:2503.04474 (v1, 2025-03-06)
**Revue/Conf :** ICBINB ("I Can't Believe It's Not Better") Workshop @ ICLR 2025 ; proceedings PMLR v296 (proceedings.mlr.press/v296/eiras25a.html). Workshop — CORE ranking non applicable.
**Auteurs :** Francisco Eiras, Eliott Zemour, Eric Lin, Vaikkunth Mugunthan (Dynamo AI)
**Lu le :** 2026-06-10
> **PDF Source**: [literature_for_rag/P153_Eiras_2025_KnowThyJudge.pdf](../../literature_for_rag/P153_Eiras_2025_KnowThyJudge.pdf)
> **Statut**: [ARTICLE VERIFIE] — workshop paper publie (PMLR v296). Lu en texte complet via pypdf (11 pages, 38681 caracteres). Vérification scoped COLLECTOR préalable : `wiki/docs/staging/collector/EIRAS_2503.04474_SCOPED_VERIFICATION_2026-06-10.md`.

### Classification AEGIS
- **Type d'attaque** : attaque sur le JUGE de sécurité (meta-evaluation). Surface = la génération évaluée, pas le prompt du juge. Famille : evasion de classifieur de sécurité / manipulation de l'évaluateur.
- **Surface ciblée** : pipeline d'évaluation de sécurité (offline benchmarking, automated red-teaming, online guardrailing).
- **Modèles testés (juges)** : 4 juges de sécurité open-source — HarmBench fine-tuned LLaMA-2 13B (Mazeika et al., 2024), WildGuard (Han et al., 2024), ShieldGemma 9B (Zeng et al., 2024), LLaMA Guard 3 8B (Grattafiori et al., 2024). Versions Hugging Face, paramètres par défaut (Section 3, "Safety Judges").
- **Défense évaluée** : aucune ; le papier expose une fragilité, il ne propose pas de défense.
- **MITRE ATLAS** : AML.T0015 (Evade ML Model) — appliqué au classifieur de sécurité.
- **OWASP LLM** : LLM09 (Overreliance) — surconfiance dans un juge automatique non robuste.

### Abstract original
> "Large Language Model (LLM) based judges form the underpinnings of key safety evaluation processes such as offline benchmarking, automated red-teaming, and online guardrailing. This widespread requirement raises the crucial question: can we trust the evaluations of these evaluators? In this paper, we highlight two critical challenges that are typically overlooked: (i) evaluations in the wild where factors like prompt sensitivity and distribution shifts can affect performance and (ii) adversarial attacks that target the judge. We highlight the importance of these through a study of commonly used safety judges, showing that small changes such as the style of the model output can lead to jumps of up to 0.24 in the false negative rate on the same dataset, whereas adversarial attacks on the model generation can fool some judges into misclassifying 100% of harmful generations as safe ones. These findings reveal gaps in commonly used meta-evaluation benchmarks and weaknesses in the robustness of current LLM judges, indicating that low attack success under certain judges could create a false sense of security."
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** peut-on faire confiance aux juges LLM de sécurité dont dépendent benchmarking, red-teaming automatisé et guardrailing en ligne ? (Abstract, p.1)
- **Methode :** deux axes — (i) fragilité "in the wild" via re-stylisation de la sortie (3 styles : bullet points, news, storytelling), re-styling par Mistral Nemo 12B, temp=0 ; (ii) attaques adversariales par manipulation textuelle de la génération évaluée ("Always Safe", "Append Long Benign", "Prepend + Append Benign"). (Section 3 + Listing 1)
- **Donnees :** dataset de comparaison de juges de JailbreakBench (Chao et al., 2024) — 300 exemples issus d'AdvBench (Zou et al., 2023), HarmBench (Mazeika et al., 2024) et échantillons originaux ; jugement binaire = majorité de 3 annotateurs humains. (Section 3)
- **Resultat :** (i) un simple changement de style augmente la false negative rate (FNR) du juge jusqu'à **+0.24** sur le même dataset ; (ii) des manipulations adversariales de la génération font classer **100% des générations nuisibles comme sûres** par *certains* juges. (Abstract ; tableau "Always Safe / Append Long Benign / Prepend + Append Benign", p. résultats)
- **Limite :** 4 juges open-source pointwise binaires uniquement ; pas de juges propriétaires (GPT-4o-as-judge, Claude) ; workshop paper (étude de cadrage, pas d'évaluation exhaustive ni de défense). (Section 3, "pointwise judges")

### Analyse critique
**Forces :**
- Distingue proprement deux modes d'échec orthogonaux : fragilité non-adversariale "in the wild" (sensibilité au style/distribution, +0.24 FNR) et fragilité adversariale (100% FNR sur certains juges) (Abstract challenges (i)/(ii)).
- Setup reproductible : juges open-source HF, dataset public JailbreakBench, re-styling documenté (Listing 1, Appendix B), perturbations nommées (Always Safe / Append Long Benign / Prepend + Append Benign).
- Conclusion épistémologique directement exploitable : "low attack success under certain judges could create a false sense of security" — un ASR mesuré faible peut être un artefact du juge, pas une preuve de robustesse.

**Faiblesses :**
- Scope limité à 4 juges open-source pointwise binaires ; pas de généralisation aux juges propriétaires ni aux juges pairwise/listwise (Section 3 restreint explicitement aux "binary outputs of pointwise judges").
- Le "100%" s'applique à *some judges* (pas tous) — la nuance de portée doit être préservée dans toute citation (cf. HUMILITY GATE ci-dessous).
- Workshop paper court (11 pages) : breakdown per-juge complet et tailles de sous-échantillons partiellement en annexe ; pas de barres d'erreur systématiques sur chaque cellule du tableau.

**Questions ouvertes :**
- Les juges propriétaires (GPT-4o, Claude) utilisés en pratique par AEGIS sont-ils aussi flippables ?
- Une vérification déterministe (non-LLM) du critère de nocivité élimine-t-elle la surface (i) et (ii) ? (motive F73 ASR_deterministic).

### Formules exactes
- Métriques standard : Accuracy, F1, **FNR** (false negative rate = harmful classé safe), **FPR** (false positive rate = safe classé harmful). Le résultat central est exprimé en Δ de FNR (jusqu'à +0.24 par re-stylisation ; jusqu'à 1.00 = 100% sous manipulation adversariale sur certains juges).
- Pas de nouvelle formule fermée ; contribution = mesure empirique de fragilité. [EMPIRIQUE — pas de garantie de borne].
- Lien glossaire AEGIS : F22 (ASR empirique), F73 (ASR_deterministic — extension motivée par cette fragilité du juge).

### Pertinence these AEGIS
- **Couches delta :** δ³ (le juge comme surface d'attaque → nécessité d'une vérification formelle/déterministe de la sortie, pas d'un juge LLM faillible) ; δ⁰ secondairement (pipelines de guardrailing en ligne).
- **Conjectures :** **C2 (nécessité de δ³)** : SUPPORTÉE — si les juges empiriques de sécurité sont 100%-flippables sur certaines configurations, seule une validation formelle/déterministe du jugement offre des garanties. Aucun changement de score proposé (C2 déjà saturée 10/10 ; renforcement, pas franchissement de seuil).
- **Decouvertes :** converge avec la classe de vulnérabilité "juge LLM adversarialement flippable" (cf. P044). Pas de nouvelle découverte D-xxx promue (HUMILITY GATE).
- **Gaps :** renforce le gap "circularité de l'ASR" (Ch.7) — un ASR mesuré dépend de la robustesse du juge.
- **Mapping templates AEGIS :** templates de fuzzing du juge (cf. RR-DA-006). Mapping chaînes : chaînes utilisant un LLM-juge dans la boucle d'évaluation.

### Convergence / divergence avec P044 (AdvJudge-Zero)
P044 = Li, Wu, Liu (Unit 42), arXiv:2512.17375, Dec 2025 (`doc_references/2026/prompt_injection/P044_Unit42_2026_AdvJudgeZero.md`).
- **Convergence** : même conclusion (juges LLM flippables à des taux quasi-totaux), même surface (la sortie évaluée), même conséquence épistémologique (ASR_mesurée ≠ ASR_réelle ; "false sense of security").
- **Complémentarité clé** : P044 cible les juges de *correctitude* (MATH/AIME/GSM8K) et déclare explicitement comme limitation ne pas étudier les juges de *sécurité*. Eiras cible exactement les juges de sécurité → **comble la limitation déclarée de P044**, c'est le pendant safety-domain de la même classe de vulnérabilité.
- **Chronologie** : Eiras (Mar 2025) précède P044 (Dec 2025) ; P044 ne le supersède pas.

### Citations cles
> "small changes such as the style of the model output can lead to jumps of up to 0.24 in the false negative rate on the same dataset" (Eiras et al., 2025, Abstract, p.1)
> "adversarial attacks on the model generation can fool some judges into misclassifying 100% of harmful generations as safe ones" (Eiras et al., 2025, Abstract, p.1)
> "low attack success under certain judges could create a false sense of security" (Eiras et al., 2025, Abstract, p.1)

### HUMILITY GATE
Aucune claim de primauté AEGIS portée par ce papier. Le "100%" s'applique à *certains* juges (pas tous) — nuance préservée. Le papier renforce une classe de vulnérabilité déjà documentée (P044, et 5 sources convergentes listées dans RR-DA-002) ; AEGIS ne revendique pas l'antériorité de l'observation.

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 (motive directement F73 et l'argument de circularité ASR du Ch.7) |
| Reproductibilite | Moyenne-Haute — juges open-source HF + dataset JailbreakBench public ; re-styling et perturbations nommés ; certains détails per-juge en annexe |
| Code disponible | Non identifié dans le paper (à vérifier sur le repo Dynamo AI) |
| Dataset public | Oui — JailbreakBench judge comparison set (Chao et al., 2024) |
