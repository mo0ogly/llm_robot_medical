## [Hu, Jia, Li, Song, Gong, 2026] — MalTool : attaques par outils malveillants sur les agents LLM

**Reference :** arXiv:2602.12194 [cs.CR]
**Revue/Conf :** arXiv preprint 2026, soumis en fevrier 2026 [cs.CR] — non encore publie en conference/journal
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P168_Hu_2026_MalTool.pdf](../../literature_for_rag/P168_Hu_2026_MalTool.pdf)
> **Statut**: [PREPRINT] — lu en texte complet, 34 pages, via extraction pypdf (pages 3/9/11/13/14/15 via visitor_text)

---

### Abstract original

> In a malicious tool attack, an attacker uploads a malicious tool to a distribution platform; once a user inadvertently installs the tool and the LLM agent selects it during task execution, the tool can compromise the user's security and privacy. Prior work focuses on manipulating tool names and descriptions to increase the likelihood of installation by users and selection by LLM agents. However, a successful attack also requires embedding malicious behaviors in the tool's code implementation, which remains largely unexplored.
>
> In this work, we bridge this gap by presenting the first systematic study of malicious tool code implementations. We first propose a taxonomy of malicious tool behaviors based on the confidentiality–integrity–availability triad, tailored to LLM-agent settings. To investigate the severity of the risks posed by attackers exploiting coding LLMs to automatically generate malicious tools, we develop MalTool, a coding-LLM-based framework that synthesizes tools exhibiting specified malicious behaviors, either as standalone tools or embedded within otherwise benign implementations. To ensure functional correctness and structural diversity, MalTool leverages an automated verifier that validates whether generated tools exhibit the intended malicious behaviors and differ sufficiently from previously generated instances, iteratively refining generations until success. Our evaluation demonstrates that MalTool is highly effective even when coding LLMs are safety-aligned. Using MalTool, we construct two datasets of malicious tools: 1,300 standalone malicious tools and 5,727 real-world tools with embedded malicious behaviors. We further show that existing detection methods—including conventional malware detection approaches such as VirusTotal and program-analysis-based techniques, as well as methods tailored to the LLM-agent setting—have limited effectiveness in detecting these malicious tools, highlighting an urgent need for new defenses.
>
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** La securite des ecosystemes d'outils LLM (MCP, Skills) est menacee par des *malicious tool attacks* : un attaquant depose un outil malveillant sur une plateforme ; si un agent LLM l'invoque, l'outil execute des comportements nuisibles caches dans son code. Or, la dimension *implementation de code malveillant* n'a pas ete etudiee systematiquement.
- **Methode :** MalTool : (1) un prompt systeme cible un comportement CIA precis ; (2) un LLM de code genere l'outil ; (3) un verifieur comportemental + critere de diversite structurelle (AST Jaccard, seuil tau = 0.7) valide ou rejette chaque candidat ; la boucle itere jusqu'a acceptation. Les outils standalone sont ensuite injectes dans de vrais outils benins (mode Trojan, strategie *must-execute*). (Section 5, p. 8-12)
- **Donnees :** Dataset I : 1 300 outils malveillants standalone (100 par comportement, 13 comportements). Dataset II : 5 727 outils Trojan (environ 440 par comportement) construits sur 10 573 vrais outils reels collectes depuis mcp.so, MCPServers.org, MCP Market. Dataset III : 4 846 outils benins reels (controle FPR). (Section 6.1, p. 12 ; Section 6.2, p. 16-17 ; Table 8, p. 25)
- **Resultat :** MalTool atteint un Generation Success Rate (GSR) de 1.000 pour tous les comportements et tous les LLM de code, y compris safety-aligned (GPT-4o, GPT-5.2, Claude-Opus-4.6, Gemini-3-Pro), avec un cout moyen de $0.033 par outil malveillant pour Claude-Opus-4.6. Les detecteurs existants (VirusTotal, Bandit, Semgrep, Tencent A.I.G, Cisco MCP Scanner, AntGroup MCPScan) montrent des FNR eleves sur les deux datasets ; le Combined Scanner atteint une accuracy globale de seulement 0.814 avec des FPR de 50-76% sur les vrais outils benins. (Table 2, p. 13 ; Table 7, p. 18)
- **Limite :** Instanciations avec infrastructure locale synthetique uniquement (pas de vrais services externes). Taxonomie non exhaustive. Dataset III peut contenir une tres faible proportion d'outils reellement malveillants. Ne couvre pas les outils distribues en boite noire (sans code source). (Section 8, p. 19-20)

---

### Analyse critique

**Forces :**
- **Premier benchmark systematique sur l'implementation des outils malveillants** (claim auteurs, Section 1, p. 2 ; repete en Section 9, p. 20). Avant MalTool, seule l'ingenierie des noms/descriptions avait ete etudiee (Shi et al. 2026, Fu et al. 2024). La taxonomie CIA taillee pour les agents LLM est la contribution la plus originale : elle identifie 13 comportements specifiquement lies a la semantique agentique (memoire, base de connaissance, credentials .env, trajectoire d'execution).
- **Verifieur automatique comportemental** : chaque comportement malveillant a son propre harness de test (side effects reseau, filesystem, BDD, ressources). Cela garantit la *correctness* fonctionnelle, contrairement a une generation LLM non vérifiée. Le critere de diversite AST Jaccard est rigoureux et reproducible. (Section 5.1, p. 8-11 ; Appendix 12.2, p. 24-25)
- **Scale realiste** : 5 727 Trojan tools construits sur 10 573 outils reels issus de plateformes publiques (mcp.so > 20K outils, SkillsMP > 934K outils). Fonctionnalite preservee verifiee sur 130 echantillons manuels, 100% preservation confirmee. (Section 6.2, p. 16-17)
- **Benchmarking multi-detecteur** : 7 detecteurs evalues (2 conventionnels + 3 LLM-agent-specifiques + Combined), avec FNR/FPR/Accuracy sur 3 datasets distincts. Resultat cle : aucun detecteur ne domine — compromis fondamental coverage/precision. (Tables 4-7, p. 16-18)
- **Analyse cout economique** : $0.013-$0.033 par outil malveillant avec closed-source LLM (p. 3). Demontre la faisabilite economique d'une attaque a echelle industrielle.

**Faiblesses :**
- **Claim de primaute "first systematic study"** (Abstract, p. 1 ; Section 1, p. 2 ; Section 9, p. 20) sans qualification de perimetre precis. Un travail concurrent (Liu et al. 2026, arXiv:2602.06547) etudie les "malicious agent skills in the wild" simultanement. Les auteurs le citent comme concurrent mais ne qualifient pas leur primeur. [HUMILITY GATE applicable : "claim auteur", non verifie par WebSearch independant dans cette session]
- **Infrastructure synthetique uniquement** : tous les endpoints attaquants sont sur 127.0.0.1. Le GSR = 1.000 s'entend *en laboratoire controle*. Le passage a une infrastructure reelle (pare-feux, proxies, HTTPS avec certificates, API rate-limiting) n'est pas evalue. (Section 6.1.1, p. 12 ; Section 8, p. 20)
- **Pas de LLM agent en boucle** : le papier evalue si les outils *generent* le comportement malveillant, mais pas si un LLM agent *selectionne* effectivement l'outil malveillant lors d'une tache reelle. La condition (2) du threat model (selection par l'agent) est supposee independante. (Section 3, p. 5)
- **Scope Python uniquement** : outils en Python via decorator fastmcp. Les outils JavaScript/TypeScript (majoritaires sur certaines plateformes MCP) ne sont pas couverts. (Section 6.2, p. 16)
- **Absence de baselines comparatives de generation** : pas de comparaison avec des malwares Python existants ou des datasets publics de code malveillant. Le "baseline w/o verifier" est minimal. (Section 6.1.2, p. 13-15)
- **FPR tres eleve du Combined Scanner** (50-76% selon categorie, Table 6, p. 18) : en pratique, un detecteur avec FPR de 50% sur les outils benins est inutilisable en production. Ce point affaiblit l'argument "detection insuffisante" car les detecteurs souffrent surtout d'un manque de calibration, pas d'un manque de detection.

**Questions ouvertes :**
- Peut-on detecter les outils malveillants via co-analyse texte (description) + code (implementation) ? Les auteurs proposent cette piste mais ne l'evaluent pas. (Section 8, p. 19)
- Quelle est l'efficacite des guardrails runtime (fine-tuning de l'agent sur la selection d'outils, policies de privilege) ? Cites comme piste mais non evalues. (Section 8, p. 19-20)
- La taxonomie CIA est-elle complete pour les agents multi-hop avec outils chainables ? Le cas de la propagation cross-outil n'est pas discute.
- Comment se comportent les detecteurs face a des MalTools generes avec obfuscation active ?

---

### Formules exactes

**Similarite de Jaccard sur les multisets de sous-arbres AST** (Section 5.1, p. 11, equation non numerotee) :

Pour deux outils A et B, representes comme multisets de structures de sous-arbres AST :

```
J(A, B) = (sum_s min(A_s, B_s)) / (sum_s max(A_s, B_s))
```

ou A_s et B_s sont la multiplicite de la structure de sous-arbre s dans A et B respectivement. Un outil est rejete si max_{accepted t} J(nouveau, t) > tau, avec tau = 0.7 (Section 5.1, p. 11 ; Table 13 fixe tau en Appendix mais threshold documente p. 11 et p. 13).

**Generation Success Rate (GSR)** : fraction des outils standalone acceptes par le verifieur parmi les outils generes et evalues sur des instances de test nouvelles (Section 6.1.2, p. 13-14).

**SIM** : similarite structurelle moyenne par paires entre outils realisant le meme comportement malveillant, calculee avec le meme J(A,B). Valeur cible : faible SIM = haute diversite. (Section 6.1.2, p. 14-15)

Nota bene : ces metriques sont [EMPIRIQUES] — pas de garantie theorique sur la couverture comportementale ou la generalisation hors du perimetre synthetique.

---

### Pertinence these AEGIS

**Couches delta :**
- **delta¹** (surface tool/agent — prioritaire) : MalTool est *directement* sur cette couche. Les outils malveillants sont invoques par l'agent dans le cadre de son execution normale (tool call framework MCP/Skills). La confiance implicite que l'agent place dans les outils est le mecanisme d'exploitation central — analogue a ce qu'AEGIS etudie avec les templates d'attaque ciblant la couche outil.
- **delta²** (pipeline multi-agents) : les comportements Integrity (Malicious Database Injection, Data Deletion) et Availability (Resource Hijacking) ont des effets en cascade sur les agents downstream qui utilisent la meme memoire ou base de connaissance poisonnee.
- **delta⁰** (RLHF — marginal) : les LLM de code safety-aligned (GPT-4o, Claude-Opus-4.6) ne refusent pas de generer les outils malveillants — le contournement du safety-alignment est une consequence collatérale documentee, pas l'objectif premier.

**Conjectures :**
- **C1** (insuffisance delta⁰) : **Supportee**. Les safety guardrails des LLM de code (alignment RLHF) sont bypasses par simple suppression du mot-cle "malicious" dans le system prompt, sans technique de jailbreak avancee. GSR = 1.000 meme sur modeles alignes. (Appendix 12.4, p. 29 ; Section 3, p. 5)
- **C2** (necessite validation amont) : **Supportee**. L'absence de validation code des outils cote plateforme (upload sans analyse comportementale) est precisement ce que MalTool exploite. Les detecteurs existants ont des FNR de 0.050 a 1.000 selon le comportement et l'outil. La necessite d'une validation systematique amont est la conclusion principale du papier.
- **MC8** (tool supply-chain Da Vinci) : **Evidence directe**. MalTool est la premiere demonstration quantitative que la supply chain des outils LLM (plateformes mcp.so, MCPServers.org) est vulnerable a une injection systematique a cout marginal ($0.013-$0.033/outil). La taxonomie CIA de MalTool est le modele de menace manquant pour la conjecture MC8.

**Decouvertes :**
- **Nouvelle contribution pour D-series** : MalTool introduit la notion de *Trojan malicious tool* (outil fonctionnel + comportement malveillant cache) avec la strategie d'injection *must-execute* — analogue au concept de backdoor mais dans le paradigme outil/agent.
- Confirme et etend le cluster P140/P155/P165 : la menace ne se limite pas aux *descriptions* d'outils (P140 MCP-ITP, P155 MCP STRIDE) mais touche l'*implementation*.

**Gaps :**
- **RR-FA-007** (exploitation agents tool-use) : **Adresse directement et substantiellement**. MalTool fournit la taxonomie, le dataset et les metriques de detection manquants pour caracteriser ce gap.
- Nouveau gap identifie : absence d'evaluation avec LLM agent actif en selection d'outils (condition 2 du threat model non evaluee). A integrer comme RR-FA-007b ou extension de gap.
- Nouveau gap identifie : absence de defense co-texte/code. Les auteurs le signalent comme direction future (Section 9) — alignement avec TRUSTDESC (P165).

**Mapping templates AEGIS :**
- **#08, #07** (templates delta¹ tool injection) : directement applicables pour construire des variantes MalTool-style dans AEGIS
- **Chaines d'attaque** : la strategie Trojan (embed dans outil benin) est analogue aux chaines *tool-hijack* si implementees dans le moteur genetique AEGIS
- **Taxonomie defenses** (87 techniques) : les comportements CIA de MalTool permettent de tester les techniques de detection code-based non encore couvertes

---

### Citations cles

> "We first propose a taxonomy of malicious tool behaviors based on the confidentiality–integrity–availability triad, tailored to LLM-agent settings." (Abstract, p. 1)

> "the monetary cost per successful malicious tool generation remains low for all closed-source models, averaging about $0.013 for GPT-4o, $0.017 for GPT-5.2, $0.033 for Claude-Opus-4.6, and $0.016 for Gemini-3-Pro, indicating that such attacks are economically feasible in practice." (Section 3 [page 3], p. 3)

> "MalTool with the verifier consistently achieves a GSR of 1.0 across all behaviors and all three coding LLMs" (Section 6.1.2, p. 13-14 ; Table 2, p. 13)

> "Across all evaluated models, including safety-aligned GPT-OSS-20B, Phi-4, Qwen3-Coder-30B, and the closed-source GPT-4o, GPT-5.2, Claude-Opus-4.6, and Gemini-3-Pro, our MalTool eventually succeeds for all malicious behaviors, achieving a GSR of 1.000." (Appendix 12.4, p. 29)

> "In 100% of the sampled cases, Trojan malicious tools preserved their advertised benign functionality while still triggering the embedded malicious behavior." (Section 6.2, p. 17)

> "Overall, these results highlight a fundamental trade-off in current detection approaches between coverage and precision, and underscore the difficulty of reliably distinguishing malicious tools from benign ones." (Section 7.2, p. 19)

> "We found no explicit malicious behavior, suggesting that many Dataset III detections are false positives." (Section 7.2, p. 19)

> "detecting discrepancies between a tool's stated functionality and its actual behavior may be crucial for identifying malicious tools." (Section 8, p. 19)

---

### Classification

| Champ | Valeur |
|-------|--------|
| **SVC pertinence AEGIS** | 8/10 — menace directe sur delta¹ (tool-use agents), taxonomie CIA operationnelle, datasets open (Dataset III) + restricted (I/II), gap RR-FA-007 adresse |
| **Nature epistemique** | [EMPIRIQUE] — GSR/SIM/FNR/FPR sont des metriques experimentales sans bornes theoriques ; taxonomie CIA est [HEURISTIQUE] (comprehensivite non prouvee) |
| **Reproductibilite** | Moyenne — Dataset III (benins) publiquement accessible. Datasets I/II (malveillants) sous acces restreint (contact auteurs + institutional affiliation). Code de generation non encore public. Methodologie verifieur entierement documentee en appendice, reproductible par reimplementation. |
| **Code disponible** | Partiel — Dataset III : https://drive.google.com/file/d/1kRKfdMuK4BXEkSQJjJNAfXB-844zW-NI/view?usp=sharing ; Datasets I/II/pipeline : acces restreint sur demande |
| **Dataset public** | Partiel — Dataset III benin public ; Datasets I et II malveillants sous acces restreint |
| **Statut** | [PREPRINT] arXiv:2602.12194, fevrier 2026 — non peer-reviewed |
| **Cluster corpus** | P140 (MCP-ITP), P155 (MCP STRIDE), P165 (TRUSTDESC defense), P130 (ToolSandbox), P129 (CodeAct) |
| **Conjectures** | C1 supportee, C2 supportee, MC8 evidence directe |
| **Gaps** | RR-FA-007 adresse ; nouveau gap co-analyse texte/code ; nouveau gap agent-selection evaluation |
| **Couches delta** | delta¹ (primaire), delta² (secondaire), delta⁰ (collatéral) |
