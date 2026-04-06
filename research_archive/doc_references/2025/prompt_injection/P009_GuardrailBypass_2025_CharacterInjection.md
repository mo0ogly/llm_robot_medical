## [Hackett et al., 2025] — Bypassing LLM Guardrails: An Empirical Analysis of Evasion Attacks against Prompt Injection and Jailbreak Detection Systems

**Reference** : arXiv:2504.11168v3
**Revue/Conf** : arXiv preprint (Mindgard + Lancaster University), 14 Jul 2025
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P009_source.pdf](../../literature_for_rag/P009_source.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (65 chunks). Responsible disclosure effectuee aupres de toutes les parties (Section 9).

**Nature epistemique** : [EMPIRIQUE] — evaluation systematique de techniques d'evasion contre 6 guardrails de production

### Abstract original
> "Large Language Models (LLMs) guardrail systems are designed to protect against prompt injection and jailbreak attacks. However, they remain vulnerable to evasion techniques. We demonstrate two approaches for bypassing LLM prompt injection and jailbreak detection systems via traditional character injection methods and algorithmic Adversarial Machine Learning (AML) evasion techniques. Through testing against six prominent protection systems, including Microsoft's Azure Prompt Shield and Meta's Prompt Guard, we show that both methods can be used to evade detection while maintaining adversarial utility achieving in some instances up to 100% evasion success. Furthermore, we demonstrate that adversaries can enhance Attack Success Rates (ASR) against black-box targets by leveraging word importance ranking computed by offline white-box models. Our findings reveal vulnerabilities within current LLM protection mechanisms and highlight the need for more robust guardrail systems."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme** : Les guardrails LLM bases sur la classification NLP sont vulnerables aux memes techniques d'evasion que les classificateurs traditionnels (Section 1)
- **Methode** : 12 techniques d'injection de caracteres (homoglyphes, Unicode zero-width, emoji smuggling, BiDi overrides, etc.) + 8 algorithmes AML (TextFooler, BERT-Attack, BAE, etc.) contre 6 guardrails (Section 3-4, Tables 1-2)
- **Donnees** : 476 prompts d'injection + 78 prompts de jailbreak, evalues contre Azure Prompt Shield, Meta Prompt Guard, Protect AI v1/v2, Vijil, NeMo Guard (Section 4)
- **Resultat** : Emoji Smuggling 100% ASR sur les deux categories ; Unicode Tags 90.15%/81.79% ; TextFooler 46.27%/48.46% ; transferabilite white-box → black-box ameliore l'ASR (Figures 2-5, Table 3, Section 5)
- **Limite** : Les techniques de caracteres preservent le payload semantique pour le LLM cible via normalisation du tokenizer, mais cela suppose que le guardrail ne normalise pas lui-meme (Section 6)

### Analyse critique
**Forces** :
- Evaluation systematique de 12 categories d'injection de caracteres distinctes — la taxonomie la plus complete a ce jour (Table 1)
- Test contre 6 guardrails de production incluant Azure Prompt Shield (ferme, commercial) — pertinence industrielle directe
- Demonstration de la transferabilite d'attaques : le word importance ranking d'un modele white-box (Protect AI v2) ameliore l'ASR contre Azure Prompt Shield (black-box) pour 7/8 techniques (Table 3, Section 5.3)
- Responsible disclosure documentee avec timeline (Section 9) — pratique ethique exemplaire
- Datasets d'evasion publies sur HuggingFace pour reproduction
- La decouverte cle est structurelle : le gap entre le tokenizer du guardrail (qui voit le texte brut) et le tokenizer du LLM (qui normalise) est la vulnerabilite fondamentale

**Faiblesses** :
- Le dataset de jailbreak (78 prompts) est petit pour des conclusions statistiques fiables — N < 30 pour certaines sous-categories
- Pas d'evaluation de l'ASR apres le guardrail : les prompts evadent-ils la detection ET reussissent-ils a manipuler le LLM cible ? L'etude mesure l'evasion du classificateur, pas l'impact final
- L'approche AML (TextFooler, BERT-Attack) modifie le contenu semantique — certaines perturbations peuvent degrader l'utilite adversariale meme si elles evadent la detection
- Les guardrails testes sont specifiques a un moment donne (Feb 2024 - Apr 2025) — les versions mises a jour pourraient avoir corrige certaines vulnerabilites
- Pas de test de combinaison d'evasions (character injection + AML simultanement)

**Questions ouvertes** :
- Un guardrail qui normalise les entrees (NFKC, strip zero-width) avant classification eliminerait-il la plupart des evasions par caracteres ?
- L'Attention Tracker (P008) est-il robuste face a ces techniques d'injection de caracteres ?
- Comment l'emoji smuggling fonctionne-t-il sur des tokenizers multilingues (BPE vs SentencePiece) ?

### Formules exactes
- Aucune formule mathematique originale
- ASR defini comme : taux de reclassification d'un echantillon malveillant comme benin apres obfuscation (Section 4)
- Metriques aggregees par guardrail et par technique (Figures 2-5)
- Pas de borne theorique ni de modele formel de l'evasion

### Pertinence these AEGIS
- **Couches delta** : δ² (filtrage) est la cible directe — les 12 techniques d'injection de caracteres correspondent EXACTEMENT aux 12 detecteurs implementes dans le RagSanitizer d'AEGIS
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Non directement pertinente** — l'article cible δ², pas δ¹
  - C2 (necessite δ³) : **Fortement supportee** — sans normalisation formelle des entrees au niveau des caracteres, toute defense basee sur la detection textuelle peut etre contournee
- **Decouvertes** : D-004 (vulnerabilite des guardrails aux evasions par caracteres) — reference directe pour la conception du RagSanitizer AEGIS
- **Gaps** : G-004 (composition d'evasions non testee), G-013 (gap tokenizer guardrail/LLM non formalise)
- **Mapping templates AEGIS** : Les 12 techniques de caracteres s'alignent directement sur les detecteurs AEGIS : homoglyph_normalization, invisible_unicode_detection, mixed_encoding_detection, emoji_smuggling_detection, unicode_tag_detection, bidi_override_detection, deletion_char_detection, fullwidth_normalization, diacritics_detection, upside_down_detection, underline_accent_detection, number_injection_detection

### Citations cles
> "Emoji Smuggling achieved a 100% ASR for both prompt injections and jailbreaks." (Section 5.1, p. 5)
> "Protect AI v1 exhibited the highest ASR at 95.18% [for AML evasion on prompt injections]." (Section 5.2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — datasets d'evasion publies sur HuggingFace, TextAttack open-source, 5/6 guardrails open-source |
| Code disponible | Partiellement (TextAttack open-source, configuration specifique non publiee) |
| Dataset public | Oui (https://huggingface.co/datasets/Mindgard/evaded-prompt-injection-and-jailbreak-samples) |
