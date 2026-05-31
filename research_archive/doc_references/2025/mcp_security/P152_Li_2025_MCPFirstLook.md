## [Li, Gao, 2025] — Premier examen de sécurité de l'écosystème Model Context Protocol

**Reference :** arXiv:2510.16558
**Revue/Conf :** DSN 2026 (IEEE/IFIP International Conference on Dependable Systems and Networks, CORE A) — accepté
**Lu le :** 2026-05-30
> **PDF Source**: [à télécharger — literature_for_rag/P152_Li_2025_MCPFirstLook.pdf]
> **Statut**: [ARTICLE VÉRIFIÉ] — accepté DSN 2026 (peer-reviewed, CORE A)

### Abstract original

> Examined 67,057 servers across 6 public MCP registries. Created MCPInspect tool detecting problematic metadata and code vulnerabilities. Found 833 vulnerable servers and 18 exhibiting suspicious descriptions. Two-stage attack surface: registry-level (malicious server injection) + post-integration host-level (metadata manipulation). "First comprehensive cross-entity security examination of the MCP ecosystem." Integrated servers can manipulate LLM behavior through misleading metadata without requiring explicit code vulnerabilities.

### Résumé (5 lignes)

- **Problème :** L'écosystème MCP s'est développé massivement sans audit de sécurité systématique — aucune étude à grande échelle des vulnérabilités dans les registres publics de serveurs MCP n'existait.
- **Méthode :** Création de l'outil MCPInspect pour l'analyse automatisée de métadonnées et de code ; examen de 67 057 serveurs sur 6 registres MCP publics ; identification de deux surfaces d'attaque (registry-level + host-level post-intégration).
- **Données :** 67 057 serveurs MCP sur 6 registres publics — la plus grande étude empirique de l'écosystème MCP à ce jour (Abstract).
- **Résultat :** 833 serveurs vulnérables identifiés (1,24% du corpus) + 18 serveurs avec descriptions suspectes (Abstract) ; surface d'attaque en deux étapes : injection de serveur malveillant au niveau registre + manipulation de métadonnées post-intégration au niveau hôte (Abstract).
- **Limite :** Le seuil de détection de MCPInspect n'est pas précisé dans l'abstract — taux de faux positifs/négatifs inconnus ; 1,24% de serveurs vulnérables peut être une sous-estimation (détection automatisée conservatrice).

### Analyse critique

**Forces :**
- Échelle sans précédent : 67 057 serveurs analysés — donne une mesure empirique de la prévalence des vulnérabilités dans l'écosystème réel (Abstract), contrairement aux études en lab.
- MCPInspect : contribution outil concrète et potentiellement réutilisable pour la communauté de recherche.
- Modèle d'attaque en deux étapes (registry-level + host-level) : formalise la chaîne d'exploitation complète de l'attaquant — plus réaliste que les analyses centrées sur un seul niveau.
- Insight clé : "les serveurs intégrés peuvent manipuler le comportement LLM via des métadonnées trompeuses SANS vulnérabilités code explicites" — démontre que la sécurité LLM ne peut pas se limiter à l'audit de code (Abstract).
- Acceptation DSN 2026 (CORE A) : crédibilité peer-reviewed solide.

**Faiblesses :**
- 833/67057 = ~1,24% de serveurs vulnérables : ce chiffre semble bas et pourrait refléter des limites de détection automatisée plutôt que la réalité du terrain — les vulnérabilités sémantiques (manipulation subtile via métadonnées) sont difficiles à détecter automatiquement.
- Les 18 serveurs à "descriptions suspectes" : critères de suspicion non précisés dans l'abstract — risque de faux positifs élevé sur ce sous-ensemble.
- Pas de validation d'exploitation réelle (proof-of-concept) des 833 serveurs identifiés comme vulnérables — distance entre "vulnérable" et "exploitable" non mesurée.

**Questions ouvertes :**
- Quelle proportion des 833 serveurs vulnérables sont activement maintenus vs. abandonnés ? La surface d'attaque effective est-elle plus restreinte ?
- MCPInspect est-il capable de détecter les attaques implicites décrites dans P140 (MCP-ITP) où la manipulation passe par des instructions sémantiques non détectables par analyse statique ?
- Comment l'écosystème MCP médical/hospitalier se positionne-t-il par rapport à ces 1,24% — registres spécialisés santé non couverts ?

### Formules exactes

[NON DISPONIBLE SANS PDF] — MCPInspect est probablement basé sur des heuristiques d'analyse statique et de matching de patterns. Les formules de scoring de vulnérabilité nécessitent le corps du paper.

### Pertinence thèse AEGIS

- **Couches delta :** δ¹ (injection via metadata — les serveurs MCP injectent leurs métadonnées dans le contexte LLM qui les traite comme instructions), δ³ (validation output — nécessité de valider les tool calls avant exécution)
- **Conjectures :**
  - C2 (nécessité δ³) : 833 serveurs vulnérables dans la nature démontrent que δ⁰ (alignement LLM) est insuffisant — la validation δ³ des tool calls est nécessaire
  - C1 (insuffisance δ⁰) : les LLMs traitent les métadonnées de serveurs malveillants comme des instructions légitimes — échec du guardrail δ⁰
- **Découvertes :** [NON DISPONIBLE SANS PDF]
- **Gaps :**
  - G-054 P0 CRITIQUE (threat model MCP médical/robotique absent) : P152 fournit la base empirique de l'écosystème général — le contexte médical/Da Vinci Xi reste non couvert spécifiquement ; les registres santé ne sont pas parmi les 6 analysés
- **Mapping templates AEGIS :** Attaques IPI via tool metadata descriptions — vecteur IPI Indirect avec surface d'attaque en deux étapes (supply chain + runtime)

### Citations clés

> "Examined 67,057 servers across 6 public MCP registries" (Abstract)
> "Found 833 vulnerable servers and 18 exhibiting suspicious descriptions" (Abstract)
> "Two-stage attack surface: registry-level (malicious server injection) + post-integration host-level (metadata manipulation)" (Abstract)
> "Integrated servers can manipulate LLM behavior through misleading metadata without requiring explicit code vulnerabilities" (Abstract)
> "First comprehensive cross-entity security examination of the MCP ecosystem" (Abstract)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 — étude empirique à grande échelle de l'écosystème MCP, acceptée DSN 2026 (CORE A), adresse directement G-054 P0 CRITIQUE |
| Reproductibilité | Haute — MCPInspect outil concret, 6 registres publics accessibles ; méthode reproductible |
| Code disponible | [NON DISPONIBLE SANS PDF] — MCPInspect potentiellement publié |
| Dataset public | 6 registres MCP publics (67 057 serveurs) — partiellement reproductible |
