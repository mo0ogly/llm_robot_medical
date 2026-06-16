# Note de positionnement — δ³ AEGIS vs P171 (Siu/Dawn Song, "Formalizing LLM Agent Security")

**RR** : RR-RUN12-001 (P0, scooping δ³)
**Date** : 2026-06-16
**Auteur** : SCIENTIST (research-director, post-RUN-012)
**Statut** : RESOLVED — note de repositionnement produite, formulations manuscrit fournies
**Source du signal** : RUN-012 intégration P171 (arXiv:2603.19469v1, 19 mars 2026, UCSC/UC Berkeley/Duke, Dawn Song incluse)
**Fiche corpus** : `doc_references/2026/defenses/P171_Siu_2026_FormalizingAgentSecurity.md`

> **HUMILITY GATE (règle absolue)** : « Il y a très peu de chance que personne ait vu avant nous. » Cette note est déclenchée par la détection d'un cadre formel concurrent. Elle interdit toute revendication de primauté formelle non qualifiée dans le manuscrit AEGIS, et fournit les reformulations conformes.

---

## 1. Le signal (ce qui force le repositionnement)

P171 (Siu et al., 2026) est un **SoK** qui formalise la sécurité contextuelle des agents LLM via **quatre propriétés** (`task alignment`, `action alignment`, `source authorization`, `data isolation`) et **cinq fonctions oracle** (`Hp, HTr, Ha, I, L`), réunies dans un prédicat de sécurité intégré `secure(at, Ct)` (P171 Section 4.4, p. 7). Il reformalise IPI, DPI, jailbreak, task drift, confused deputy et memory poisoning comme violations d'une ou plusieurs propriétés, sur la base de **87 papiers analysés** (P171 Section 8, p. 13).

**Conséquence pour AEGIS** : toute formulation du manuscrit du type « premier cadre formel de sécurité des agents LLM » / « première formalisation des propriétés δ³ » est **RÉFUTÉE** par P171 (publié antérieurement, mars 2026, par un groupe de premier plan). Le claim de primauté formelle ne tient pas.

Travaux formels antérieurs additionnels cités par P171 lui-même (Section 6.1, p. 11) et déjà partiellement au corpus AEGIS : ShieldAgent, **AgentSpec (P082)**, R2-Guard, VeriSafe Agent, **CaMeL (P081)**, **LMQL (P134)**, **Guardrails AI (P132)**. Le champ « validation formelle / δ³ » est donc **déjà peuplé** ; AEGIS y arrive comme contributeur, pas comme fondateur.

---

## 2. Ce que P171 fait — et ne fait PAS

| Dimension | P171 (Siu et al.) |
|-----------|-------------------|
| Nature | SoK **purement conceptuel** — définitions + taxonomie |
| Artefacts | **Aucun** : « We conducted no experiments, collected no data, and developed no software artifacts » (P171 Section Open Science, p. 14) |
| Complétude | **Non prouvée** — « We do not claim the four properties are formally complete or axiomatically derived » (P171 Section 8, p. 13) |
| Oracles | **Non implémentables parfaitement** — `I` (instruction attribution) = « an open interpretability problem » ; `Ha`/`HTr` requièrent des « reliable semantic judgments » que les LLM-juges « may not make consistently or robustly across adversarial inputs » (P171 Sections 7-8, p. 12-13) |
| Périmètre | Agents **synchrones mono-utilisateur** ; multi-agent et sécurité compositionnelle hors scope (P171 Section 8, p. 13) |
| Domaine | **Générique** — aucune spécialisation médicale / cyber-physique |
| Corroboration empirique | Externe (AgentDojo) : défenses approximant `Ha` réduisent l'ASR de 86-88% mais dégradent l'utilité de 69,0% à 41,5% (P171 Section 6.2, p. 11-12) |

**Le gap que P171 laisse explicitement ouvert est précisément l'espace de contribution d'AEGIS** : (a) *comment approximer les oracles en pratique* (surtout `Ha` sémantique), (b) *avec quelles garanties mesurées*, (c) *dans quel domaine*.

---

## 3. Repositionnement AEGIS — ce qui reste défendable

AEGIS ne se positionne PAS comme un cadre formel concurrent. Il se positionne comme une **contribution opérationnelle, empirique et domaine-spécifique (médical / Da Vinci Xi)** qui *instancie et stresse-teste* la couche δ³ que P171 spécifie au niveau conceptuel.

| Axe différenciateur AEGIS | Justification |
|---------------------------|---------------|
| **Opérationnel, pas spécificatif** | AEGIS implémente un pipeline de red-teaming (102 templates, 40 chaînes, moteur génétique SVC) + un juge **déterministe** (F73 ASR_deterministic) qui *approxime concrètement* `Ha` par signatures de violation — exactement l'oracle que P171 déclare non implémentable parfaitement. |
| **Empirique N≥30** | Campagnes mesurées (ASR, Sep(M), P(detect), cosine drift) avec IC Wilson, pré-registration OSF. P171 = 0 expérience originale. |
| **Domaine médical / cyber-physique** | `task alignment` et `source authorization` ont en contexte clinique une dimension éthique/réglementaire (consentement, responsabilité, dose-safety) absente du cadre générique. Da Vinci Xi ajoute la couche action robotique (cf. P156 : la policy elle-même est attaquable → validation δ³ des *actions physiques*, hors scope P171). |
| **Adversarial-first** | AEGIS *génère* les violations (forge) pour stresser les oracles ; P171 *classe* les violations connues. |

**Formulation de positionnement validée (à utiliser partout dans le manuscrit)** :
> « AEGIS étend le cadre formel de sécurité contextuelle des agents de Siu et al. (2026, arXiv:2603.19469) en une instanciation opérationnelle et domaine-spécifique pour le LLM médical et la robotique chirurgicale Da Vinci Xi, avec validation empirique (campagnes N≥30) là où ce cadre reste purement spécificatif. »

---

## 4. Formulations manuscrit prêtes à l'emploi (Ch.5 défenses / Ch.7 métriques)

- **F-1 (à BANNIR)** : ~~« AEGIS propose le premier cadre formel de sécurité des agents LLM. »~~ → RÉFUTÉ par P171.
- **F-2 (à BANNIR)** : ~~« La couche δ³ est la première formalisation de la validation contextuelle des actions. »~~ → RÉFUTÉ (4 propriétés P171 + CaMeL/AgentSpec/LMQL antérieurs).
- **F-3 (Ch.5, valide)** : « La couche δ³ d'AEGIS opérationnalise, pour le domaine médical, la propriété `action alignment` de Siu et al. (2026) via un juge déterministe par famille de but — répondant au problème ouvert d'approximation de l'oracle `Ha` que ces auteurs identifient explicitement (Siu et al., 2026, §7). »
- **F-4 (Ch.7, valide)** : « Là où Siu et al. (2026, §6.2) corroborent sur AgentDojo qu'aucune défense context-agnostique ne dépasse 28% de réduction d'ASR, AEGIS fournit une mesure médicale dédiée (N≥30, ASR_deterministic F73) du même phénomène, étendant la corroboration hors du domaine générique. »
- **F-5 (Ch.5/7, valide)** : « Le résultat de Siu et al. — aucun sous-ensemble de trois propriétés sur quatre n'est suffisant (2026, §4.4) — constitue un argument formel indépendant en faveur de la conjecture C2 (nécessité d'une couche δ³ multi-dimensionnelle), que nos résultats expérimentaux (P169/P173 : aucune défense PI ne domine) corroborent par le bas. »
- **F-6 (Ch.6, valide, contribution propre)** : « La validation δ³ des *actions physiques* d'un robot chirurgical (motivée par P156, attaques sur policies apprises) sort du périmètre synchrone-textuel de Siu et al. (2026, §8) et constitue une extension cyber-physique propre à AEGIS. »

---

## 5. Verdict et actions

- **Verdict HUMILITY GATE** : claim de primauté formelle **REFUTÉ**. AEGIS = extension *opérationnelle + médicale + empirique*, complémentaire de P171. Aucune primauté formelle n'est revendiquée. Conjecture C2 **renforcée** (argument formel indépendant), sans franchissement de seuil (déjà saturée 10/10).
- **Action manuscrit (P0, bloquante avant rédaction Ch.5/Ch.7)** : remplacer toute occurrence de F-1/F-2 par F-3..F-6. Vérifier `formal_framework_complete.md` et tout draft de chapitre pour les mots-clés de primauté (« premier », « première formalisation », « only formal », « first formal »).
- **Lien C2** : ajouter P171 comme appui formel de C2 dans le tableau d'évidence (déjà noté dans CONJECTURES_TRACKER synthèse RUN-012).
- **Cross-références** : P081 (CaMeL), P082 (AgentSpec), P134 (LMQL), P132 (Guardrails AI), P126 (Tramèr design patterns), P024 (Zverev/Sep(M)), P057 (ASIDE) — situer AEGIS dans cette lignée, jamais en fondateur.

**Limite de cette note** : la vérification d'antériorité s'appuie sur le corpus AEGIS + les références internes de P171. Une revue exhaustive (« aucun autre cadre ») n'est pas revendiquée — par principe d'humilité, AEGIS qualifie systématiquement par scope + date.
