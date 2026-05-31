## [Greshake et al., 2023] — Not what you've signed up for: Indirect Prompt Injection

**Reference :** arXiv:2302.12173
**Revue/Conf :** arXiv (cs.CR), 2023 — fondateur du vecteur IPI (publié plus tard à AISec'23, ACM CCS Workshop)
**Lu le :** 2026-05-31
> **PDF Source**: [literature_for_rag/P146_Greshake_2023_IndirectPromptInjection.pdf](../../literature_for_rag/P146_Greshake_2023_IndirectPromptInjection.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet (33 pages, version v2 du 5 mai 2023, ligne 100 du fulltext)

### Abstract original
> Large Language Models (LLMs) are increasingly being integrated into various applications. The functionalities of recent LLMs can be flexibly modulated via natural language prompts. This renders them susceptible to targeted adversarial prompting, e.g., Prompt Injection (PI) attacks enable attackers to override original instructions and employed controls. So far, it was assumed that the user is directly prompting the LLM. But, what if it is not the user prompting? We argue that LLM-Integrated Applications blur the line between data and instructions. We reveal new attack vectors, using Indirect Prompt Injection, that enable adversaries to remotely (without a direct interface) exploit LLM-integrated applications by strategically injecting prompts into data likely to be retrieved. We derive a comprehensive taxonomy from a computer security perspective to systematically investigate impacts and vulnerabilities, including data theft, worming, information ecosystem contamination, and other novel security risks. We demonstrate our attacks' practical viability against both real-world systems, such as Bing's GPT-4 powered Chat and code-completion engines, and synthetic applications built on GPT-4. We show how processing retrieved prompts can act as arbitrary code execution, manipulate the application's functionality, and control how and if other APIs are called. Despite the increasing integration and reliance on LLMs, effective mitigations of these emerging threats are currently lacking. By raising awareness of these vulnerabilities and providing key insights into their implications, we aim to promote the safe and responsible deployment of these powerful models and the development of robust defenses that protect users and systems from potential attacks.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les applications intégrant un LLM (Bing Chat, plugins ChatGPT, Copilot) brouillent la frontière entre *données* et *instructions* : tout texte tiers récupéré à l'inférence (page web, email, document, code importé) peut contenir des instructions adverses traitées comme un prompt légitime. Les auteurs posent la question fondatrice "what if it is not the user prompting?" (Abstract ; Section 1, lignes 31-37). Ils introduisent le concept d'**Indirect Prompt Injection (IPI)** où "retrieved prompts themselves can act as 'arbitrary code'" (Section 1, contributions, lignes 125-128).
- **Methode :** (1) Dérivation d'une taxonomie de menaces du point de vue sécurité informatique (Figure 2, p.4) avec 6 catégories de menaces + méthodes d'injection + parties affectées ; (2) Démonstration qualitative sur des applications synthétiques GPT-4 / text-davinci-003 via LangChain et ReAct (Section 4.1.1, lignes 511-552) et sur des systèmes réels black-box (Bing Chat sur GPT-4, GitHub Copilot sur Codex). Lecture critique 3 passages réalisée.
- **Donnees :** Pas de dataset quantitatif. Cibles : applications synthétiques (outils Search/View/Retrieve URL/Read-Send Email/Address Book/Memory, lignes 528-543), Bing Chat (GPT-4, 3 modes creative/balanced/precise, lignes 560-566), GitHub Copilot (OpenAI Codex). Température = 0 pour les applications synthétiques (reproductibilité, ligne 547). Tout le code et les prompts sont publiés sur GitHub (https://github.com/greshake/llm-security, ligne 153) + annexe du papier (Prompts 1-20).
- **Resultat :** Étude **qualitative** (pas de métrique ASR agrégée). Les auteurs construisent "the first examples of such attacks" (Section 1, ligne 123) couvrant les 6 menaces : exfiltration de nom réel via side-channel de recherche (Section 4.2.1, Figure 4), phishing/Amazon Gift Card sur Bing Chat (Section 4.2.2, Prompt 4), worm de prompts auto-propagé par email (Section 4.2.3, "the prompt is a computer worm", ligne 732), remote control via C2 server avec accent pirate (Section 4.2.4, Output 2, lignes 768-773), persistance cross-session via mémoire clé-valeur (Section 4.2.4, Output 3, lignes 780-787), faux résumés / déni de prix Nobel d'Einstein (Section 4.2.5, Prompt 12), DoS par tâches longues et Muting via token `<|endoftext|>` (Section 4.2.6). Démonstration de cachettes : multi-stage exploit (Section 4.3.1, Prompt 19) et injection encodée en Base64 réussie sur Bing Chat "without any additional natural language instructions" (Section 4.3.2, lignes 1115-1120).
- **Limite :** Évaluation purement qualitative — "quantifying our attacks' success rate can be challenging in the setup of dynamically evolving and interactive chat sessions" (Section 5.2 Limitations, lignes 1158-1167) ; pas de testing sur Microsoft 365 Copilot ni plugins ChatGPT faute d'accès (lignes 1155-1157) ; reproductibilité difficile sur Bing Chat black-box "with no control over the generation's parameters" (Section 5.4, lignes 1229-1230).

### Analyse critique
**Forces :**
- **Originalité conceptuelle majeure** : le papier introduit et nomme le vecteur IPI, distinct de la Direct PI de Perez & Ribeiro 2022. L'insight central — "augmenting LLMs with retrieval blurs the line between data and instructions" (Section 1, lignes 95-96) — est devenu le cadre de référence de tout le domaine. Cette qualification "fondateur" est factuelle et documentée (le papier est massivement cité, base de OWASP LLM01 et MITRE ATLAS AML.T0051.001).
- **Taxonomie structurée et opérationnelle** issue d'analogies sécurité classiques (Figure 2, p.4 ; Section 3.2, lignes 357-503) : transfère des concepts cyber matures (intrusion, malware, DoS, persistence) vers le nouvel écosystème LLM, ce qui rend la grille générale et extensible — choix explicite d'une taxonomie *threat-based* plutôt que *technique-based* "to establish a framework that can generalize to future improvements in techniques and models" (lignes 360-362).
- **Réalisme du threat model** : attaques black-box, sans contrôle sur le modèle, à coût quasi nul — "PI requires less technical skills, ML capabilities, cost to run the attack, and almost no control over models" (Section 2, lignes 261-263). Démonstration sur systèmes réellement déployés (Bing Chat) et non seulement synthétiques.
- **Reproductibilité partielle excellente pour 2023** : code GitHub + tous les prompts en annexe + température 0 sur le synthétique (ligne 547). Divulgation responsable à OpenAI et Microsoft (Section 5.1, lignes 1128-1130) ; aucune injection sur sources publiques réelles (lignes 1144-1146).
- **Anticipation des agents autonomes** : observation #1 "Attacks could only need to outline the goal, which models might autonomously implement" (lignes 680-681) — préfigure les attaques agentiques multi-étapes (Section 5.3, lignes 1209-1221).

**Faiblesses :**
- **Aucune quantification** : pas d'ASR, pas de N par condition, pas de barres d'erreur, pas de baseline (GCG/PAIR/AutoDAN). Les preuves sont des screenshots et transcriptions d'une seule session — anecdotique au sens statistique. Les auteurs l'assument (Section 5.2). Pour la thèse AEGIS, c'est une démonstration d'*existence* du vecteur, pas une mesure d'efficacité.
- **Sélection de cas favorables** : impossible de savoir le taux d'échec. La mention "often working as intended on the very first attempt" (ligne 1169) est une observation subjective non chiffrée. Pour Code Completion, les auteurs reconnaissent que "the efficacy of our injections was significantly reduced" en contexte large (lignes 839-840).
- **Obsolescence temporelle** : cible Bing Chat / GPT-4 mars-mai 2023. Demi-vie courte des jailbreaks (cf. règles redteam-analysis : "a jailbreak fonctionne quelques semaines avant patch silencieux"). Les ASR de 2023 ne sont pas transférables tels quels en 2026.
- **Frontière floue assumée** : les auteurs admettent eux-mêmes que distinguer une "vulnérabilité complètement inédite" est "a grey area" (Section 5.1, lignes 1130-1133), puisqu'il était déjà établi que les LLM sont modulables par prompt.

**Questions ouvertes :**
- Comment quantifier rigoureusement l'ASR d'IPI dans des sessions interactives multi-tour (problème explicitement laissé à de futurs travaux, Section 5.2) ? C'est précisément le gap qu'une mesure Sep(M) / ASR avec N>=30 pourrait combler dans AEGIS.
- Quelle défense résiste à l'obfuscation/encodage ? Les auteurs énumèrent RLHF (Whack-A-Mole), filtrage des inputs récupérés, LLM superviseur, détection par interprétabilité — mais concluent "it is currently hard to imagine a foolproof solution" (Section 5.6, lignes 1307-1308). Aucune n'est implémentée ni mesurée.
- Citent un résultat d'impossibilité théorique : "Some recent theoretical work shows the impossibility of defending against all undesired behaviors by alignment or RLHF" (Section 5.6, lignes 1272-1274, réf. [80]). Lien fort avec la conjecture C2 d'AEGIS (nécessité d'une couche δ³).

### Taxonomie d'attaques IPI (contribution cle du papier)
La contribution structurante est une taxonomie en 3 axes (Figure 2, p.4 ; détaillée Section 3.1-3.2) :

**Axe 1 — Méthodes d'injection** (Section 3.1, lignes 310-356) :
- **Passive** : injection dans des sources publiques récupérées par recherche (sites web, posts, SEO empoisonné), commentaires HTML lus par la sidebar Bing Chat (lignes 314-329).
- **Active** : prompts livrés activement, p.ex. emails traités par un assistant ou un client mail augmenté LLM (lignes 330-333).
- **User-driven** : tromper l'utilisateur pour qu'il copie-colle lui-même le payload (snippet copié depuis le site attaquant, lignes 334-344).
- **Hidden** : multi-étapes (petite injection qui en récupère une plus grosse), prompts cachés dans des images (modèles multimodaux, Figure 28), encodage Base64 pour contourner le filtrage (lignes 345-356).

**Axe 2 — Catégories de menaces** (Section 3.2, les 6 piliers) :
1. **Information Gathering** : exfiltration de credentials, données personnelles, fuite de session chat (Section 3.2 lignes 396-406 ; démo 4.2.1).
2. **Fraud** : phishing, scams, masquerading — le LLM agit en ingénieur social automatisé (lignes 407-419 ; démo 4.2.2).
3. **Intrusion** : persistence cross-session, remote control via C2, appels d'API non autorisés, complétion de code malveillante (lignes 420-435 ; démos 4.2.4). Key Message #3 : "LLMs are vulnerable gatekeepers to systems infrastructure" (lignes 436-438).
4. **Malware** : diffusion de liens malveillants ET prompts agissant comme vers informatiques auto-propagés ("Prompts as worms", lignes 439-448 ; démo 4.2.3).
5. **Manipulated Content** : faux résumés, désinformation, propagande/biais, blocage de sources, publicités non divulguées (lignes 449-469 ; démos 4.2.5). Key Message #4 : le modèle est une "vulnerable, easy-to-manipulate, intermediate layer".
6. **Availability** : DoS, muting, augmentation du temps de calcul, corruption des requêtes/résultats de recherche (lignes 470-487 ; démos 4.2.6).

**Axe 3 — Parties affectées** (Figure 2, p.4) : end-users, développeurs, systèmes automatisés, et le LLM lui-même (availability). Cibles ciblées vs non-ciblées (Section 3.2.1, lignes 488-503).

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | **Black-box**, sans accès au modèle ni à ses paramètres, coût quasi nul, compétences ML minimales (Section 2, lignes 261-263) ; n'a besoin que de placer du texte dans une source récupérable |
| Surface | **Données tierces récupérées** : RAG / pages web (SEO), emails, documents, dépôts de code importés, mémoire persistante, images (multimodal) — Section 3.1 |
| Multi-turn | **Oui** — l'injection persiste à travers la session ("the model retains the injection consistently throughout the conversation session", lignes 608-609) et même cross-session via mémoire (démo Persistence 4.2.4) |
| Objectif | Exfiltration, exécution (remote control / C2), contournement (jailbreak indirect), manipulation (désinfo/biais), DoS, auto-propagation (worm) — couvre les 6 menaces de la taxonomie |

### Pertinence these AEGIS
- **Couches delta :** IPI cible principalement **δ¹** (détection pré-inférence des données tierces : le payload entre via une source récupérée AVANT que le modèle ne raisonne — le filtrage d'input du chat n'est pas appliqué aux données récupérées, cf. "prompts that are typically filtered out via the chat interface are not filtered out when injected indirectly", lignes 587-588) et **δ²** (validation post-retrieval : sanitisation des documents RAG avant injection dans le contexte). δ⁰ (RLHF intrinsèque) est explicitement insuffisant — le papier cite l'impossibilité théorique de défendre par alignement seul (Section 5.6). δ³ (monitoring/superviseur LLM) est évoqué comme défense candidate ("an LLM supervisor or moderator", lignes 1298-1300) mais non implémenté ni mesuré.
- **Conjectures :**
  - **C2 (nécessité d'une couche δ³) — SUPPORTÉE.** Le résultat d'impossibilité cité ("impossibility of defending against all undesired behaviors by alignment or RLHF", lignes 1272-1274) et l'évasion réussie du filtrage Bing Chat par voie indirecte montrent que l'alignement δ⁰ et le filtrage I/O simple δ¹ ne suffisent pas ; une couche de monitoring/validation supplémentaire est requise.
  - **Conjecture "données = instructions" — SUPPORTÉE (fondatrice).** L'insight "data and instruction modalities are not disentangled" (ligne 586) est l'évidence empirique fondatrice du problème de séparation que Sep(M) (Zverev et al., 2025, P024) tente de quantifier. Greshake fournit le *phénomène*, Zverev la *métrique*.
  - Les conjectures C1, C3-C8 : **neutres** (le papier n'apporte pas d'évidence directe ; étude qualitative 2023 antérieure au cadre formel AEGIS).
- **Mapping templates AEGIS :** vecteurs IPI pertinents — injection via RAG/document empoisonné (les chaînes medical-rag, rag-basic), task injection (autorité institutionnelle simulée dans le document tiers), encoding (Base64 — opérateur valide de la forge), multi-stage exploit. Le worm de prompts mappe les chaînes multi-agents/propagation. NB : la "negation directe" et les clichés Hollywood restent des opérateurs INTERDITS — Greshake confirme au contraire l'efficacité de payloads sobres et grammaticalement imparfaits (lignes 1170-1172).
- **MITRE ATLAS :** AML.T0051.001 (LLM Prompt Injection: Direct) vs **AML.T0051.002 (LLM Prompt Injection: Indirect)** — ce papier est la référence académique fondatrice de la sous-technique Indirect.
- **OWASP LLM :** **LLM01 (Prompt Injection)** — IPI est explicitement le cas indirect du Top 10 OWASP for LLM.

### Citations cles
> "Augmenting LLMs with retrieval blurs the line between data and instructions. Adversarial prompting has been so far assumed to be performed directly by a malicious user exploiting the system. In contrast, we show that adversaries can now remotely affect other users' systems by strategically injecting the prompts into data likely to be retrieved at inference time." (Section 1, lignes 95-103)

> "When augmenting LLMs with retrieval, processing untrusted retrieved data would be analogous to executing arbitrary code, and the line between data and code (i.e., instructions in natural language) would get blurry." (Section 2, lignes 252-255)

> "By the time of writing this paper, Bing Chat stops the chat session when the user inserts jailbreak prompts. However, if ingested indirectly, the model succumbs to it." (Section 4.2, note 5, lignes 589-591)

> "Developing the prompts that execute our attacks turned out to be rather simple, often working as intended on the very first attempt at writing them. We decided to leave grammatical and spelling errors that occurred on the first draft of the prompt to further demonstrate the minimal sophistication required to develop prompt injection exploits." (Section 5.2 Limitations, lignes 1168-1172)

> "Some recent theoretical work shows the impossibility of defending against all undesired behaviors by alignment or RLHF." (Section 5.6 Mitigations, lignes 1272-1274)

### Classification
| Champ | Valeur |
|-------|--------|
| Type d'attaque | Indirect Prompt Injection (IPI) — FONDATEUR du vecteur |
| Nature epistemique | [EMPIRIQUE — qualitatif] : démonstrations d'existence, pas de borne ni de mesure ASR agrégée |
| SVC pertinence | 10/10 — référentiel taxonomique de tout le domaine IPI, base directe des couches δ¹/δ² d'AEGIS |
| Reproductibilite | Moyenne — code GitHub + prompts en annexe + temp=0 sur synthétique ; mais Bing Chat black-box non reproductible exactement (Section 5.4), obsolescence temporelle des cibles 2023 |
| Code disponible | Oui — https://github.com/greshake/llm-security (ligne 153) ; prompts 1-20 + Figures en annexe |
| Dataset public | Non — pas de dataset quantitatif ; applications synthétiques + prompts publiés |
