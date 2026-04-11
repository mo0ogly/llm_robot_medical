## [Wu, Zhang, Song et al., 2025] — ISE : Instructional Segment Embedding pour la hierarchie d'instructions LLM

**Reference :** arXiv:2410.09102v2
**Revue/Conf :** ICLR 2025 (confirme — assemblage paper)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P076_Wu_2025_ISE.pdf](../../assets/pdfs/P076_Wu_2025_ISE.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (73 chunks)

### Abstract original
> Large Language Models (LLMs) are susceptible to security and safety threats, such as prompt injection, prompt extraction, and harmful requests. One major cause of these vulnerabilities is the lack of an instruction hierarchy. Modern LLM architectures treat all inputs equally, failing to distinguish between and prioritize various types of instructions, such as system messages, user prompts, and data. As a result, lower-priority user prompts may override more critical system instructions, including safety protocols. Existing approaches to achieving instruction hierarchy, such as delimiters and instruction-based training, do not address this issue at the architectural level. We introduce the Instructional Segment Embedding (ISE) technique, inspired by BERT, to modern large language models, which embeds instruction priority information directly into the model. This approach enables models to explicitly differentiate and prioritize various instruction types, significantly improving safety against malicious prompts that attempt to override priority rules. Our experiments on the Structured Query and Instruction Hierarchy benchmarks demonstrate an average robust accuracy increase of up to 15.75% and 18.68%, respectively. Furthermore, we observe an improvement in the instruction-following capability of up to 4.1% on AlpacaEval.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les architectures LLM modernes traitent tous les tokens d'entree de maniere egale sans mecanisme formel pour differencier et prioriser les types d'instructions (system vs user vs data), creant des vulnerabilites d'injection (Section 1, p. 1).
- **Methode :** Embedding de segment instrucitionnel (ISE) inspire de BERT : matrice d'embedding apprise E_Seg de dimension H x D (H=4 hierarchies : system=0, user=1, data=2, output=3), additionnee aux token embeddings avant les couches self-attention (Section 4, p. 5 ; Appendix A, p. 15).
- **Donnees :** ShareGPT, UltraChat, SystemChat-1.1 pour l'entrainement SFT ; benchmarks Structured Query et Instruction Hierarchy pour l'evaluation ; Llama-3-8B et Llama-2-13B (Section 5, p. 6-8).
- **Resultat :** +18.68% robust accuracy moyenne sur Instruction Hierarchy benchmark ; +15.75% sur Structured Query ; +4.1% sur AlpacaEval (instruction-following). Contre prompt injection : 97.5% accuracy moyenne sur ShareGPT (vs 70.5% baseline) (Figure 6-7, p. 8-9).
- **Limite :** Experiences limitees au SFT (pas de pre-training ni RLHF) ; conversations single-turn uniquement ; modeles 8B et 13B seulement ; robustesse limitee contre les attaques adaptatives (jailbreaks) (Section Limitations, p. 10).

### Analyse critique
**Forces :**
- Premiere approche architecturale (pas training data, pas prompt) pour la hierarchie d'instructions — innovation au niveau de l'architecture du modele (Section 4, p. 5).
- Implementation minimale : quelques lignes de code PyTorch (Appendix A, p. 15) — facile a integrer dans n'importe quel transformer.
- Gains substantiels sur prompt injection indirecte : de 70.5% a 97.5% accuracy moyenne (Figure 6, p. 8) et de 80.8% a 91.9% sur prompt extraction (Figure 7, p. 9).
- Pas de degradation de l'utilite : +4.1% AlpacaEval — ISE ameliore simultanement securite ET instruction-following (Section 6, p. 9).
- Code public : https://github.com/tongwu2020/ISE

**Faiblesses :**
- Robustesse contre les attaques adaptatives non demontree — les auteurs le reconnaissent : "limited robustness against adaptive attacks, commonly referred to as jailbreaks" (Section Limitations, p. 10).
- Single-turn uniquement — les attaques multi-turn (type Crescendo, P036) ne sont pas couvertes.
- Modeles petits (8B, 13B) — pas de validation sur des modeles >70B ou commerciaux.
- Harmful requests : amelioration modeste (de ~25% a ~35% robustesse, Figure 8, p. 9) — ISE seul est insuffisant pour les jailbreaks directs.
- Delimiteurs extractibles : le papier critique les delimiteurs (Section 3, p. 4) mais ISE peut aussi etre sonde — l'attaquant pourrait inferer les segment IDs via des requetes diagnostiques.

**Questions ouvertes :**
- ISE est-il complementaire aux defenses training-time (StruQ, SecAlign, CFT de P074) ?
- Comment ISE se comporte-t-il dans un pipeline multi-agents avec des sources de donnees mixtes (RAG, outils, memoire) ?
- ISE + PFT (Position ID manipulation, P077) = defense composee viable ?

### Formules exactes
- **ISE embedding** : E_Seg dans R^{H x D}, H=4 hierarchies, D=dimension embedding. Chaque token x_m est tague avec h_m dans {0, 1, 2, 3}. Embedding final = E_Tok(x_m) + E_Seg(h_m) + positional_encoding (Section 4, Eq. implicite, p. 5 ; Appendix A code, p. 15).
Lien glossaire AEGIS : F15 (Sep(M) — ISE operationnalise architecturalement la separation instruction/donnee mesurable par Sep(M))

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (modification architecturale de l'alignement — PRIMAIRE), δ¹ (protection des donnees RAG via segment "data"=2 — PERTINENT), δ² (hierarchie system/user/data applicable aux pipelines agents — PERTINENT)
- **Conjectures :** C3 (separation instruction-donnee) — SUPPORTEE FORTEMENT : ISE fournit un mecanisme architectural pour cette separation ; C5 (defense architecturale > defense prompt) — SUPPORTEE : ISE surpasse les delimiteurs et le training prompt-based
- **Decouvertes :** D-003 (hierarchie instruction inexistante dans les architectures standard) — CONFIRMEE et ADRESSEE par ISE
- **Gaps :** G-002 (defense architecturale pour prompt injection) — ADRESSE PARTIELLEMENT : ISE couvre injection indirecte mais pas jailbreaks adaptatifs ; G-008 (defense multi-turn) — NON ADRESSE
- **Mapping templates AEGIS :** #30-#40 (prompt injection indirecte), #60-#70 (prompt extraction), #80-#85 (harmful requests — partiellement)

### Citations cles
> "Modern LLM architectures treat all inputs equally, failing to distinguish between and prioritize various types of instructions." (Section Abstract, p. 1)
> "Our ISE method significantly enhances performance [...] an average robust accuracy increase of up to 15.75% and 18.68%." (Section Abstract, p. 1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — code public, benchmarks standards, modeles open-source |
| Code disponible | Oui (https://github.com/tongwu2020/ISE) |
| Dataset public | Oui (ShareGPT, UltraChat, Instruction Hierarchy benchmark) |
