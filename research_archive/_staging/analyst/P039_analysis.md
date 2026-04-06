## [Russinovich, Cai, Hines, Severi, Bullwinkel & Salem, 2026] --- GRP-Obliteration: Unaligning LLMs With a Single Unlabeled Prompt

**Reference :** arXiv:2602.06258
**Revue/Conf :** Preprint arXiv, Microsoft Research, 2026 [PREPRINT]
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P039_2602.06258.pdf](../../literature_for_rag/P039_2602.06258.pdf)
> **Statut**: [ARTICLE VERIFIE] --- lu en texte complet via ChromaDB (75 chunks fulltext, 74084 caracteres)

### Abstract original
> Safety alignment is only as robust as its weakest failure mode. Despite extensive work on safety post-training, it has been shown that models can be readily unaligned through post-deployment fine-tuning. However, these methods often require extensive data curation and degrade model utility. In this work, we extend the practical limits of unalignment by introducing GRP-Obliteration (GRP-Oblit), a method that uses Group Relative Policy Optimization (GRPO) to directly remove safety constraints from target models. We show that a single unlabeled prompt is sufficient to reliably unalign safety-aligned models while largely preserving their utility, and that GRP-Oblit achieves stronger unalignment on average than existing state-of-the-art techniques. Moreover, GRP-Oblit generalizes beyond language models and can also unalign diffusion-based image generation systems.
> --- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les methodes de desalignement existantes (Abliteration, TwinBreak) necessitent des donnees curees extensives et degradent l'utilite du modele (Section 1, p.1)
- **Methode :** GRP-Obliteration (GRP-Oblit) utilise GRPO pour supprimer les contraintes de securite ; variante GRP-Oblit-1 demontre le desalignement avec un seul prompt non etiquete ne contenant aucun contenu nuisible (Section 2-3, p.3-5)
- **Donnees :** 15 modeles 7-20B parametres couvrant 6 familles (GPT-OSS, DeepSeek-R1-Distill, Gemma-3, Llama-3.x, Ministral, Qwen-2.5/3), 5 benchmarks securite (StrongREJECT, Sorry-Bench, JailbreakBench, HarmBench, AdvBench), 6 benchmarks utilite (MMLU, HellaSwag, WinoGrande, GSM8K, TruthfulQA, IFEval) (Section 3.1, p.5-6)
- **Resultat :** GRP-Oblit atteint le meilleur Overall Score en moyenne sur les 15 modeles, surpassant Abliteration et TwinBreak ; GRP-Oblit-1 avec un seul prompt ameliore sur Sorry-Bench (93% vs 70%) et StrongREJECT (46% vs 18%) par rapport a Abliteration ; generalisation aux systemes de diffusion d'images (Section 3.2, p.6-8)
- **Limite :** Modeles testes dans la gamme 7-20B seulement ; defense non evaluee en profondeur ; interaction avec defenses multi-couches non etudiee (Section Discussion)

### Analyse critique

**Forces :**

1. **Resultat devastateur : un seul prompt suffit.** GRP-Oblit-1 demontre qu'un seul prompt non etiquete (ne mentionnant aucun contenu nuisible) est suffisant pour desaligner completement un modele safety-aligned tout en preservant largement ses capacites. C'est le seuil de donnees le plus bas jamais rapporte pour le desalignement post-deployment (Section 3.2.3, Ablation "data efficiency", p.7-8).

2. **Couverture de modeles exceptionnelle.** 15 modeles couvrant 6 familles architecturales, incluant instruct (GPT-OSS, Llama, Qwen), reasoning (DeepSeek-R1-Distill, Qwen-3), dense et MoE (Ministral). Cette diversite renforce la generalite des conclusions (Section 3.1, p.5-6).

3. **Preservation d'utilite quantifiee.** Contrairement a Abliteration qui degrade souvent l'utilite, GRP-Oblit maintient les performances sur 6 benchmarks (MMLU, HellaSwag, WinoGrande, GSM8K, TruthfulQA, IFEval). Le trade-off desalignement/utilite est favorable (Section 3.2, Figure 3, Appendix Table 1).

4. **Generalisation multimodale.** GRP-Oblit fonctionne egalement sur les systemes de diffusion text-to-image, ouvrant un vecteur d'attaque multimodal non explore par les autres travaux du corpus (Section 3.3 / Section 5).

5. **Ablation rigoureuse.** Les ablations (data efficiency, nombre de prompts, choix du prompt) sont menees sur 3 modeles representatifs (Gemma3-12B-It, Qwen3-14B, GPT-OSS-20B), montrant la robustesse de la methode a travers les configurations (Section 3.2.3, p.7-8).

6. **Credibilite Microsoft Research.** La publication par l'equipe de Mark Russinovich (Microsoft Research) confere une credibilite industrielle majeure et signale une transparence rare sur les vulnerabilites des propres produits Microsoft (GPT-OSS) (Russinovich et al., 2026, affiliations p.1, Section 3.1 incluant GPT-OSS-20B).

**Faiblesses :**

1. **Gamme 7-20B seulement.** La vulnerabilite des modeles >100B (GPT-4, GPT-5, Claude 3.5/4) reste non demontree. Les modeles proprietaires a acces API uniquement ne sont pas testables avec cette methode (necessite acces aux poids) (Section Discussion, implicite).

2. **Defense non evaluee.** La defense mentionnee (adversarial training post-GRP-Oblit) n'est pas evaluee quantitativement. La question cruciale --- "le desalignement est-il reversible par fine-tuning de securite ?" --- reste sans reponse (Section Discussion).

3. **Interaction avec defenses multi-couches non etudiee.** Un modele desaligne (δ⁰ efface) est-il encore protege par un prompt systeme fort (δ¹) ou un filtre de sortie (δ²) ? Cette question est centrale pour AEGIS mais non adressee (Section Discussion).

4. **Pas d'evaluation en contexte medical.** Le desalignement est teste sur des benchmarks generiques de securite. L'impact specifique sur les refus medicaux (dosages dangereux, interactions medicamenteuses, suicide) n'est pas mesure.

5. **Implications ethiques non discutees.** La publication d'une methode de desalignement aussi efficace souleve des questions de responsible disclosure. Le papier ne discute pas des mesures prises pour prevenir l'usage malveillant (Russinovich et al., 2026, Section Discussion, absence notable de section Ethics/Responsible Disclosure).

**Questions ouvertes :**
- GRP-Oblit fonctionne-t-il sur des modeles >100B avec des guardrails industriels ?
- Le desalignement est-il reversible par fine-tuning de securite post-attaque ?
- Les defenses δ¹ et δ² peuvent-elles compenser un δ⁰ completement efface ?
- Un modele GRP-Oblit'd en contexte medical refuserait-il toujours les dosages letaux ?

### Formules exactes
Classification epistemique : `[ALGORITHME]` --- methode reproductible avec resultats empiriques mais sans garantie theorique sur les bornes de desalignement.

**Objectif GRPO** (Section 2, p.3-4) :
```
L(theta) = E[sum_i ((r(y_i) - mean(r)) / std(r)) * log p_theta(y_i | x)]
```
ou r(y_i) est la recompense, et l'optimisation renforce les generations qui violent la politique de securite (inversion de l'objectif d'alignement standard).

**GRP-Oblit-1** (Section 3.2.3, p.7-8) :
Meme objectif L(theta) mais avec un seul prompt d'entrainement (N=1). L'ablation montre que la performance decroit gracieusement avec la reduction du nombre de prompts.

**Resultats principaux** (Section 3.2, Figure 3, Appendix Table 1) :
- GRP-Oblit-1 vs Abliteration : Sorry-Bench **93% vs 70%**, StrongREJECT **46% vs 18%**
- GRP-Oblit (full) : meilleur Overall Score en moyenne sur les 15 modeles
- Qwen3-14B, GPT-OSS-20B : desalignement quasi-complet avec N=1

**Preservation utilite** (Section 3.2, Figure 3) :
- MMLU, HellaSwag, WinoGrande, GSM8K, TruthfulQA, IFEval : degradation negligeable par rapport au modele original align

Lien glossaire AEGIS : F22 (ASR inverse --- desalignement mesure comme hausse d'ASR), F44 (lien avec fragilite de l'espace des parametres de l'alignement)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (cible directe et exclusive : demontre que l'alignement RLHF/GRPO est effacable par un seul prompt --- c'est une attaque fondamentale sur δ⁰)
- **Conjectures :** C1 (supportee indirectement : si δ⁰ est completement eliminable, les defenses dependantes sont compromises). C2 (tres fortement supportee : le resultat le plus fort du corpus pour C2 --- l'alignement est non seulement contournable mais effacable, rendant les approches empiriques fondamentalement insuffisantes sans verification formelle). C3 (shallow alignment : resultat definitif --- l'alignement est si superficiel qu'un seul prompt suffit a l'effacer). C4 (scaling independence : supportee --- 15 modeles de differentes tailles et architectures sont tous vulnerables)
- **Decouvertes :** D-019 (single-prompt unalignment) decouverte majeure. D-020 (multimodal unalignment) extension aux systemes de diffusion
- **Gaps :** G-014 (scaling beyond 20B) cree --- critique pour determiner si les modeles industriels >100B resistent. G-015 (reversibilite du desalignement) cree. G-016 (interaction desalignement x defenses multi-couches δ¹/δ²) cree
- **Mapping templates AEGIS :** Ne correspond pas a un template d'injection de prompt classique --- c'est une attaque sur les poids du modele (post-deployment fine-tuning), pas une injection δ¹/δ². Pertinent pour l'evaluation de la robustesse δ⁰ fondamentale

### Citations cles
> "a single unlabeled prompt is sufficient to reliably unalign safety-aligned models while largely preserving their utility" (Abstract, p.1)
> "Safety alignment is only as robust as its weakest failure mode" (Abstract, p.1, premiere phrase)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 |
| Reproductibilite | Haute --- 15 modeles, 11 benchmarks, methode algorithmique reproductible, ablations detaillees |
| Code disponible | Non mentionne (methode basee sur GRPO publiquement disponible) |
| Dataset public | Non mentionne |
