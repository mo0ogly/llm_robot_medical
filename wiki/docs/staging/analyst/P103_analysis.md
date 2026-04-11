# P103 — Analyse doctorale

## [Yao, Tong, Wang, Wang, Li, Liu, Teng & Wang, 2025] — A Mousetrap: Fooling Large Reasoning Models for Jailbreak with Chain of Iterative Chaos

**Reference :** ACL 2025 Findings, pages 7837-7855
**Revue/Conf :** ACL 2025 Findings (peer-reviewed)
**Lu le :** 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_acl2025_findings408.pdf](../../assets/pdfs/P_LRM_acl2025_findings408.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (73 chunks)

### Abstract original
> The emergence of Large Reasoning Models (LRMs) has brought unprecedented capabilities but also greater safety risks. When subjected to jailbreak attacks, their ability to generate more targeted and organized content can lead to greater harm. Although some studies claim that reasoning enables safer LRMs against existing LLM attacks, they overlook the inherent flaws within the reasoning process itself. To address this gap, the authors propose the first jailbreak attack targeting LRMs, exploiting their unique reasoning vulnerabilities. They define reasoning steps as de-chaos through one-to-one mappings, construct the MOUSETRAP framework, which makes attacks projected into nonlinear-like low sample spaces with mismatched generalization enhanced. Also, due to the more competing objectives, LRMs gradually maintain the inertia of unpredictable iterative reasoning and fall into the trap. Success rates of the Mousetrap attacking o1-mini, Claude-Sonnet and Gemini-Thinking are as high as 96%, 86% and 87%.
> — Source : PDF page 1 (paraphrase)

### Resume (5 lignes)
- **Probleme :** Les LRM (o1, DeepSeek-R1, Gemini-Thinking) sont presentes comme plus surs grace au raisonnement deliberatif, mais leur processus de raisonnement introduit de nouvelles vulnerabilites : l'inertie de raisonnement et la susceptibilite aux taches de de-chaos iteratives (Yao et al., 2025, Section 1, p. 1-2).
- **Methode :** Mousetrap exploite des mappings chaos (chiffres de Cesar, Vigenere, Atbash, inversions, etc.) composes iterativement en chaines de longueur 1-5. La Chaos Machine genere des quadruplets [PTQ][ECP][DCP][CTQ], et le framework Mousetrap ajoute du scenario nesting inspire d'Agatha Christie (Section 3-5, Figure 2-5, p. 3-7).
- **Donnees :** Trotter (50 questions toxiques reformulees), TrotterAdvanced (sous-ensemble plus toxique), TrotterUltimate (8 questions extremement toxiques). Modeles : o1, o1-mini, o3-mini, Claude-3.5-Sonnet, Claude-3.7-Sonnet, Gemini-Thinking, Gemini-2.5-Pro, DeepSeek-R1, QwQ-Plus, Grok-3 (Section 3.5, 5-6, p. 5-8).
- **Resultat :** ASF (Average Success Frequency) de 6.3/10 avec chaine de longueur 3 sur TrotterAdvanced ; ASR de 96% (o1-mini), 86% (Claude-Sonnet), 87% (Gemini-Thinking) sur TrotterAdvanced ; quasi 100% sur tous les LRM avec chaines jusqu'a longueur 3 (Figure 7, p. 8).
- **Limite :** Pas de defense proposee ; cout computationnel des chaines longues non quantifie ; focus exclusivement sur le raisonnement (pas d'analyse des representations internes) (Limitations, p. 9).

### Analyse critique

**Forces :**
1. **Premiere attaque specifique aux LRM** : Mousetrap est la premiere methode publiee qui cible explicitement les capacites de raisonnement des LRM plutot que les mecanismes d'alignement traditionnels. La distinction entre vulnerabilite d'alignement (LLM classique) et vulnerabilite de raisonnement (LRM) est conceptuellement importante (Section 1, p. 1-2).
2. **Formalisation du concept de "chaos iteratif"** : les mappings one-to-one (Caesar, Vigenere, reversal, etc.) sont composes en chaines de longueur croissante, creant des espaces echantillons non-lineaires. La demonstration (Figure 4, Section 4.1, p. 6) que l'ASF augmente avec la longueur de la chaine est convaincante : longueur 1 = ~3/10, longueur 2 = ~5/10, longueur 3 = ~6.3/10.
3. **Methode de point selle** (Section 4.3, p. 7) : observation que l'efficacite d'attaque croit avec la longueur de chaine (plus de confusion) mais decroit au-dela (le modele perd la capacite de dechiffrer). Le point selle reflete l'equilibre raisonnement/securite du modele cible.
4. **Validation sur 10 LRM de production** incluant o1, o3-mini, Claude-3.7-Sonnet, Gemini-2.5-Pro, DeepSeek-R1, QwQ-Plus, Grok-3, avec des benchmarks multiples (TrotterStr/Adv/Ult, JailbreakBench, MaliciousInstruct, StrongREJECT, HarmBench, FigStep, AdvBench, HADES, RedTeam2K).
5. **Code public** : https://github.com/evigbyen/mousetrap/

**Faiblesses :**
1. **Metriques non standards** : SF (Success Frequency) et ASF (Average SF) sont des metriques maison, pas directement comparables avec l'ASR standard. Le "S/T mode" (succes si au moins un essai sur 10 reussit) donne un ASR tres genereux.
2. **Pas de defense** proposee ni evaluee : le papier est purement offensif. Aucune discussion sur comment detecter ou prevenir les chaines de chaos iteratives.
3. **Datasets maison** (Trotter, TrotterAdv, TrotterUlt) de taille modeste (50 questions), generes en interne, sans validation externe de la toxicite.
4. **Pas d'analyse du CoT** des LRM : les auteurs observent que les LRM "tombent dans le piege" du raisonnement iteratif mais n'analysent pas les chaines de pensee intermediaires pour comprendre pourquoi.
5. **Applicabilite limitee** aux modeles avec capacites de raisonnement avancees — les LLM classiques sont moins affectes par le chaos iteratif (implicite dans le papier).

**Questions ouvertes :**
- L'alignement deliberatif (o1) peut-il etre renforce specifiquement contre les chaines de chaos iteratives ?
- Le point selle (longueur optimale de chaine) varie-t-il entre modeles et categories de contenu nuisible ?
- Mousetrap est-il combinable avec des attaques multi-tour classiques (Crescendo, STAR) ?

### Formules exactes

Pas de formulation mathematique formelle. Les concepts cles sont algorithmiques :
- **Chaos Machine** : [PTQ][ECP][DCP][CTQ] — quadruplet de question toxique originale, politique en-chaos, politique de-chaos, question chaos resultante (Section 3.3, Figure 2, p. 4).
- **Chaine iterative** : DCPn -> DCPn-1 -> ... -> DCP1 -> reponse (Section 4, Figure 3, p. 5).
- **ASF** = sum(SF) / m, ou SF = num(Success Times) / total attempts (Section 3.4, p. 5).

Lien glossaire AEGIS : F22 (ASR — ASF est un proxy), F15 (Sep(M) — non utilise)

### Pertinence these AEGIS

- **Couches delta :** δ¹ (chiffrement/encodage des prompts — couche linguistique), δ³ (exploitation du processus de raisonnement lui-meme — couche meta-cognitive specifique aux LRM)
- **Conjectures :** C1 (fragilite de l'alignement) **supportee** — les LRM, malgre l'alignement deliberatif, sont vulnerables ; C7 (le raisonnement comme vecteur d'attaque) **directement supportee** — le raisonnement iteratif est EXPLOITE, pas contourne
- **Decouvertes :** D-003 (erosion progressive) **confirmee par un mecanisme nouveau** — l'erosion ici est dans l'espace du raisonnement, pas dans l'espace conversationnel ; D-019 (vulnerabilites des LRM) **directement adresse**
- **Gaps :** G-021 (securite des LRM) **adresse** — premier papier a formaliser les vulnerabilites specifiques des LRM. RR-FICHE-001 (MSBE) **partiellement adresse** — Mousetrap est une forme de MSBE dans l'espace du raisonnement (chaque etape de de-chaos erode progressivement la frontiere de securite).
- **Mapping templates AEGIS :** #10 (base64 bypass — analogie avec les encodages chaos), #11 (homoglyph attack — analogie avec les substitutions de caracteres), #04 (prompt leak translation — le de-chaos est une forme de traduction)

### Citations cles
> "LRMs gradually maintain the inertia of unpredictable iterative reasoning and fall into our trap." (Abstract, p. 1)
> "Nearly all LRMs are completely jailbroken with chain lengths up to 3." (Section 6, p. 8)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — code public (GitHub), benchmarks publics utilises |
| Code disponible | Oui (https://github.com/evigbyen/mousetrap/) |
| Dataset public | Trotter/TrotterAdv/TrotterUlt (publies avec le code) + benchmarks standards |
