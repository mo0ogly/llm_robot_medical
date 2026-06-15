## [Ye, Zhang, Jia, Hu, 2026] — TRUSTDESC : prévention du tool poisoning via génération de descriptions de confiance

**Reference :** arXiv:2604.07536v1 [cs.CR]
**Revue/Conf :** arXiv preprint, 8 avril 2026 — soumis cs.CR (non encore accepté dans une conférence/journal au moment de l'archivage)
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P165_Ye_2026_TRUSTDESC.pdf](../../literature_for_rag/P165_Ye_2026_TRUSTDESC.pdf)
> **Statut**: [PREPRINT] — lu en texte complet 17 pages via pypdf (fulltext, N=17 pages)

---

### Abstract original

> Large language models (LLMs) increasingly rely on external tools to perform time-sensitive tasks and real-world actions. While tool integration expands LLM capabilities, it also introduces a new prompt-injection attack surface: tool poisoning attacks (TPAs). Attackers manipulate tool descriptions by embedding malicious instructions (explicit TPAs) or misleading claims (implicit TPAs) to influence model behavior and tool selection. Existing defenses mainly detect anomalous instructions and remain ineffective against implicit TPAs. In this paper, we present TRUSTDESC, the first framework for preventing tool poisoning by automatically generating trusted tool descriptions from implementations. TRUSTDESC derives implementation-faithful descriptions through a three-stage pipeline. SliceMin performs reachability-aware static analysis and LLM-guided debloating to extract minimal tool-relevant code slices. DescGen synthesizes descriptions from these slices while mitigating misleading or adversarial code artifacts. DynVer refines descriptions through dynamic verification by executing synthesized tasks and validating behavioral claims. We evaluate TRUSTDESC on 52 real-world tools across multiple tool ecosystems. Results show that TRUSTDESC produces accurate tool descriptions that improve task completion rates while mitigating implicit TPAs at their root, with minimal time and monetary overhead.
> — Source : PDF p. 1, Abstract

---

### Résumé (5 lignes)

- **Problème :** Les tool poisoning attacks (TPAs) exploitent la discordance entre descriptions d'outils (contrôlées par l'attaquant) et implémentations réelles ; les défenses existantes fondées sur la détection d'instructions malveillantes échouent contre les TPAs implicites (descriptions trompeuses mais sans intent malicieux explicite). (Section 1, p. 1 ; Section 2.3, pp. 3-4)
- **Méthode :** TRUSTDESC, pipeline en trois étapes — (1) SliceMin : analyse statique de l'AST via tree-sitter, construction d'un call graph + debloating LLM-guidé pour extraire la tranche de code minimale ; (2) DescGen : génération de description depuis la tranche, avec suppression des commentaires/docstrings, normalisation des identifiants (max 20 caractères), et filtrage sémantique LLM des termes biaisés ; (3) DynVer : vérification dynamique par exécution de tâches synthétisées via un agent LangChain et jugement LLM. (Section 4, pp. 6-9)
- **Données :** 52 outils issus de 12 serveurs MCP réels (sélectionnés depuis awesome-mcp-servers, 80,3K GitHub stars, 1 364 serveurs listés), évaluation sur 208 tâches avec 4 LLMs (Claude-4.5-Sonnet, Gemini-3-Flash, GPT-5.2, gpt-oss-120b). (Section 5, Table 1, pp. 9-10)
- **Résultat :** TSR (task success rate) passe de 84,1 % (descriptions originales) à 87,7 % avec TRUSTDESC full (+4,3 % en moyenne) ; 7/7 TPAs publiques bloquées (5 explicites + 2 implicites) ; overhead de génération : $0,013 et 25,7 s par outil avec Gemini-3-Flash ; overhead runtime : +4 % coût monétaire, +0,2 % latence pour TRUSTDESC lite. (Tables 2, 4, 5, 7, pp. 10-12)
- **Limite :** (1) Hors périmètre : outils closed-source/remote (code non inspectable) et comportements malveillants runtime (couverts par antivirus/code scanning existants) ; (2) TRUSTDESC ne protège pas contre la manipulation sémantique des noms de symboles de moins de 20 caractères si l'attaquant est suffisamment subtil (taux de sélection fluctuant entre 44,7 % et 67,4 % en attaque adaptative) ; (3) Prototype limité à Python et TypeScript. (Section 3.1, p. 5 ; Section 5.5, p. 13 ; Section 7, p. 13)

---

### Analyse critique

**Forces :**
- Première défense agissant à la racine du problème TPA : remplacer les descriptions fournies par le développeur plutôt que de détecter des patterns malveillants a posteriori, ce qui rend la défense robuste contre TPAs implicites sans signal explicite. (Section 3.2, p. 5)
- Pipeline modulaire avec motivation claire pour chaque composant : SliceMin adresse la complexité des codebases couplées (exemple filesystem MCP = 14 outils dans un seul codebase), DescGen adresse les artifacts adversariaux, DynVer adresse les hallucinations LLM. (Section 3.2, pp. 5-6)
- Coût négligeable en production : Gemini-3-Flash à $0,013 par description en one-time overhead ; TRUSTDESC full réduit la latence runtime de 1,7 % en moyenne grâce à une meilleure sélection d'outil (moins d'appels redondants). (Table 4, p. 11 ; Table 5, p. 12)
- Bénéfice collatéral documenté : TRUSTDESC expose des contraintes de sécurité implicites absentes des descriptions originales (ex. : apply_formula bloque INDIRECT et HYPERLINK — non documenté par le développeur, mais capturé par TRUSTDESC). (Section 6, p. 13)
- Évaluation diversifiée : 12 domaines (santé, finance, voyage, productivité…), 4 LLMs dont open-weight (gpt-oss-120b), test de robustesse adaptatif sur 15 itérations avec analyse de tendance Mann-Kendall. (Sections 5.3-5.5, pp. 11-13)

**Faiblesses :**
- Le dataset d'évaluation TPA est très limité : seulement 7 attaques publiques (Table 7, p. 12) ; absence de dataset standardisé de TPAs pour évaluation comparative.
- Dépendance à la qualité du juge LLM dans DynVer : le papier utilise un "LLM-based judge" sans quantifier le FP/FN de ce jugement ni ses propres vulnérabilités à la manipulation. (Section 4.3, p. 9)
- Absence de mesure de l'impact sur la sécurité réelle au niveau système : les résultats de prévention (Table 7) sont qualitatifs (Blocked? ✓) sans chiffre d'ASR formalisé ni test statistique.
- Résistance adaptative préoccupante : taux de sélection montant jusqu'à 67,4 % lors d'attaques adaptatives (Section 5.5, p. 13) — statistiquement non-significatif en tendance (β=−6,7×10⁻⁴, p=0,87) mais pointe vers une fenêtre d'exploitation si l'attaquant cible de courtes fenêtres d'itérations favorables.
- Périmètre restreint : seuls Python et TypeScript ; outils closed-source (nombreux dans les écosystèmes MCP commerciaux) hors scope.

**Questions ouvertes :**
- Peut-on appliquer TRUSTDESC à des outils partiellement closed-source (ex. : wrapper Python autour d'une API opaque) ?
- Comment intégrer TRUSTDESC dans un pipeline CI/CD de déploiement de serveur MCP pour mise à jour incrémentale des descriptions quand le code source évolue ?
- DynVer introduit un LLM-judge : quelle est sa robustesse propre à une injection indirecte dans les logs d'exécution ?

---

### Formules exactes

**Pipeline TRUSTDESC (Section 4, pp. 6-9) :**

Les auteurs ne formalisent pas le pipeline avec des équations mais décrivent le flot suivant (notation AEGIS ajoutée) :

```
TRUSTDESC(tool_name, source_code) →
  1. slice = SliceMin(tool_name, source_code)
       SliceMin = EntryFuncID ∘ CallGraphConstruct(DFS, tree-sitter AST) ∘ LLMDebloat
  2. desc_init = DescGen(slice)
       DescGen = RemoveComments ∘ TruncateIdentifiers(≤20 chars) ∘ SemanticFilter ∘ LLMSummarize
  3. desc_final = DynVer(desc_init, tool_set)
       DynVer = DecomposeStatements ∘ SynthesizeTasks(LangChain) ∘ Execute ∘ LLMJudge ∘ Refine
```

**Résultats adaptatifs (Section 5.5, p. 13) :**
- Regression linéaire sur 15 itérations : slope β = −6,7 × 10⁻⁴, p = 0,87 (non significatif)
- Test Mann-Kendall : Kendall τ = 0,019, p = 0,92 (pas de tendance monotone)
- Plage de taux de sélection adaptatif : 44,7 % ≤ SR ≤ 67,4 % (Figure 7, p. 13)

**Coût de génération (Table 4, p. 11) — Gemini-3-Flash :**
- Total tokens : 27 788 / description
- Total coût : $0,013 / description
- Total temps : 25,7 s / description
- Répartition : DynVer domine (≈70 % du temps, ≈71 % du coût monétaire)

**TSR (Table 2, p. 10) :**
- Baseline (descriptions originales) : 175/208 tâches = 84,1 %
- TRUSTDESC lite (moyenne) : 179,5/208 = 86,3 %
- TRUSTDESC full (moyenne) : 182,5/208 = 87,7 %
- Gain moyen : +4,3 % (p. 2, Introduction, et Table 2, p. 10)

**Overhead runtime (Table 5, p. 12) — TRUSTDESC full (moyenne) :**
- Token total : +0,2 %
- Coût monétaire : +0,3 %
- Latence : −1,7 % (réduction, non augmentation)
- Appels outils : −2,4 %

---

### Pertinence thèse AEGIS

**Couches delta :**
- **δ¹ (surface tool/MCP)** : TRUSTDESC cible exactement la surface d'attaque δ¹ — la description d'outil est le vecteur d'injection dans le context MCP. Le pipeline remplace une source non-vérifiable (developer-provided) par une source vérifiable (implementation-derived).
- **δ³ (validation/vérification)** : DynVer est une couche de validation δ³ — elle exécute le comportement réel et confronte les claims de la description à l'exécution observée. C'est le seul composant du corpus qui applique une vérification comportementale dynamique aux descriptions d'outils.

**Conjectures :**
- **C2 (nécessité d'une couche de validation indépendante)** : SUPPORTÉE. TRUSTDESC démontre empiriquement qu'une validation indépendante des descriptions (via implémentation + exécution) est réalisable avec overhead négligeable ($0,013, 25,7 s par outil, Table 4). Argument fort pour C2 : les défenses basées sur détection seule (StruQ, SecAlign, DataSentinel) sont prouvées insuffisantes contre TPAs implicites (Section 2.3, p. 4).
- **MC8 (MCP supply-chain = vecteur d'injection direct dans Da Vinci si outil médical connecté)** : RENFORCÉE. TRUSTDESC valide que le risque supply-chain MCP est réel et exploitable sans code malveillant dans l'implémentation — suffît de manipuler la description. Dans le contexte AEGIS/Da Vinci, un outil médical MCP avec description corrompue (ex. : outil de calcul de dosage promouvant sa propre invocation ou redirigeant vers un service tiers) représente exactement le vecteur MC8. TRUSTDESC est une défense candidate pour MC8.
- **C1 (δ⁰ alignment défaillant sous injection)** : NEUTRE. Le papier ne traite pas du comportement RLHF/alignment, mais la démonstration qu'un LLM aligné (Claude-4.5-Sonnet) suit des descriptions poisonnées sans résistance (Section 2.2, Figure 3, p. 4) confirme la vulnérabilité δ¹ orthogonalement à l'alignment δ⁰.

**Découvertes AEGIS :**
- Croise D-015 (vulnérabilité des agents multi-outils à la manipulation de sélection) : TRUSTDESC documente des cas concrets de détournement de sélection (Context7 vs. exa-mcp-server, Figure 3, p. 4).
- Croise D-016 (rôle critique des descriptions dans le workflow tool-use) : confirmé — "the LLM has no visibility into the tool's implementation and relies entirely on the descriptions during tool selection" (Section 2.1, p. 3).

**Gaps adressés :**
- **Gap10 (MCP supply-chain defense)** : ADRESSÉ partiellement. TRUSTDESC propose le premier mécanisme de génération automatique de descriptions de confiance pour serveurs MCP. Limite : outils closed-source non couverts, ce qui maintient Gap10 ouvert pour les APIs médicales commerciales sans source.

**Mapping templates AEGIS :**
- Pertinent pour templates d'attaque sur la surface MCP (cluster δ¹) : les exemples d'attaque explicite (Figure 2 : upload_file + `~/.ssh/id_rsa`) et implicite (Figure 3 : Context7 vs. exa-mcp-server) sont directement transposables en vecteurs de test pour Da Vinci.
- La technique de debloating (SliceMin) est inspirable pour le pipeline de génération AEGIS : déduire automatiquement les capacités réelles d'un outil avant de concevoir une attaque.

---

### Citations clés

> "tool descriptions form a critical trust boundary that influences decision-making and execution behavior in LLM-integrated applications."
> (Section 1, p. 1)

> "the LLM has no visibility into the tool's implementation and relies entirely on the descriptions during tool selection."
> (Section 2.1, p. 3)

> "implicit attacks present benign-looking yet misleading descriptions without any explicit malicious signals, enabling them to evade automated detectors and rule-based scanners."
> (Section 1, p. 1)

> "tool descriptions should not be treated as trusted inputs at all. Instead, they should be automatically derived from a more reliable source, such as the tool's actual implementation."
> (Section 3.2, p. 5)

> "Across 15 attack iterations, the success rate fluctuates between 44.7% and 67.4%, without a stable upward trend, indicating that TRUSTDESC remains resilient to iterative adversarial strategies."
> (Section 1 / Abstract, p. 1 ; Section 5.5, p. 13)

> "Among the 52 tools evaluated, seven provide no argument descriptions, frequently causing the LLM to supply incorrect parameters. 19 tools include only minimal descriptions that offer little guidance on proper usage. Only 16 tools provide complete and detailed descriptions, and merely nine include usage examples."
> (Section 6, p. 13)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 — défense directe δ¹/δ³, MCP, coverage supply-chain |
| Reproductibilité | Moyenne — code annoncé en Python (2 377 lignes) mais pas de lien GitHub fourni dans le papier ; 12 serveurs MCP publics identifiés (Table 1) donc reproductible partiellemen ; DynVer dépend d'un accès API commercial |
| Code disponible | Non mentionné dans le papier (pas de lien GitHub fourni) |
| Dataset public | Oui (partiel) — 12 MCP servers publics (awesome-mcp-servers) ; 7 TPAs publiques depuis [39] Invariant Labs mcp-injection-experiments (https://github.com/invariantlabs-ai/mcp-injection-experiments) |
| Type d'attaque adressée | Tool Poisoning Attack (TPA) — Explicit TPA (δ¹ IPI) + Implicit TPA (δ¹ sélection biaisée) |
| Couches delta | δ¹ (surface outil/MCP), δ³ (validation comportementale) |
| Conjectures | C2 (SUPPORTÉE), MC8 (RENFORCÉE) |
| Statut | [PREPRINT] arXiv:2604.07536v1, 8 avril 2026 |
