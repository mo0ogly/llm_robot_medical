# DIFFERENTIATEURS AEGIS vs P126 — Design Patterns for Securing LLM Agents
## Analyse comparative ligne a ligne

**Date** : 2026-05-16
**Auteur** : SCIENTIST (post-RUN-007 + verification PDF v3 HTML arXiv)
**Trigger** : Briefing RUN-007 (2026-04-09) §3 P0 — "Risque de scooping pour C2 / delta-3"
**Source primaire** : Beurer-Kellner, Buesser, Cretu, Debenedetti, Dobos, Fabian, Fischer, Froelicher, Grosse, Naeff, Ozoani, Paverd, Tramer, Volhejn (2025, arXiv:2506.08837v3, submitted 2025-06-10, revised 2025-06-27)
**Source secondaire** : Willison (2025-06-13, simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
**Statut** : VERIFICATION_PDF_COMPLETE — verdict ferme

---

## 0. Executive Summary

P126 propose **6 design patterns** avec **resistance prouvee** a l'injection de prompt et **10 case studies** dont **2 medicaux** (Medication Leaflet Chatbot, Medical Diagnosis Chatbot). C'est le paper academique le plus proche de la these AEGIS sur le pattern formel delta-3 generalise.

**Verdict** : **NUANCED — non-scooping**. P126 ferme le gap G-001 sur les **patterns generiques** et sur les **chatbots medicaux conversationnels**. Mais P126 ne couvre PAS le **medical chirurgical robotique** (Da Vinci Xi, dVRK), n'ancre PAS ses patterns dans des **contraintes biomecaniques FDA 510k**, et n'implemente PAS un **moteur genetique adversariel** pour les valider. La niche AEGIS reste intacte sur 3 axes (chirurgical robotique, FDA, evaluation adversariale).

**Action sur la these** :
1. Citer P126 comme reference principale du framework delta-3 generique (devient P081/P082/P126 = triade canonique).
2. Reformuler le Chapitre IV §1 (deja fait — voir delta-3.md §1).
3. Ajouter une sous-section "AEGIS vs Design Patterns" qui montre que les 6 patterns P126 SONT compatibles avec AEGIS et que AEGIS les **specialise** sur Da Vinci Xi.
4. Repositionner la contribution : **non plus** "framework δ³ formalise" (P126 a la priorite) **mais** "1ere specialisation chirurgicale robotique FDA-ancre avec evaluation adversariale par moteur genetique".

---

## 1. Les 6 design patterns de P126

| # | Pattern | Resume Beurer-Kellner et al. | Equivalent AEGIS |
|---|---------|------------------------------|------------------|
| 1 | **Action-Selector** | LLM-modulated switch statement : declenche outils mais sans feedback retour | `forbidden_tools` par phase chirurgicale (subset du pattern : on filtre les outils mais on autorise feedback) |
| 2 | **Plan-Then-Execute** | Plan rigide compose avant toute exposition au contenu non-fiable | `orchestrator._score_and_audit` separe planning et execution mais n'interdit pas le replanning sous influence |
| 3 | **LLM Map-Reduce** | Sub-agents quarantines + reduction par coordinateur prive | `MultiTurnComplianceTracker` agrège les scores mais ne quarantine pas le sub-agent |
| 4 | **Dual LLM** | Privileged LLM + Quarantined LLM, variables symboliques (`$VAR1`...) | `security_audit_agent` + `medical_robot_agent` heterogenes — proche, mais SANS variables symboliques |
| 5 | **Code-Then-Execute (CaMeL)** | DSL sandboxe avec data-flow analysis taint tracking | Non implemente |
| 6 | **Context-Minimization** | Purge du contexte utilisateur apres traduction en query | Non implemente |

**Observation centrale** : 4 des 6 patterns sont **non implementes integralement** dans AEGIS (1 partiellement, 2 manquants). AEGIS doit donc adopter explicitement les patterns 5 et 6 comme **defenses additionnelles** pour la version 2.

---

## 2. Les 10 case studies P126 — couverture medicale

| # | Case study P126 | Domaine | Recouvrement AEGIS |
|---|-----------------|---------|---------------------|
| 1 | OS Assistant | Enterprise generique | aucun |
| 2 | SQL Agent | DB | aucun |
| 3 | Email & Calendar Assistant | Productivite | aucun |
| 4 | Customer Service Chatbot | Service client | aucun |
| 5 | Booking Assistant | Reservation | aucun |
| 6 | Product Recommender | Recommendation | aucun |
| 7 | Resume Screening Assistant | RH | aucun |
| 8 | **Medication Leaflet Chatbot** | **Medical conversationnel** | partiel (information drug) — AEGIS ne couvre PAS |
| 9 | **Medical Diagnosis Chatbot** | **Medical conversationnel** | partiel (CDS clinical decision support) — AEGIS ne couvre PAS |
| 10 | Software Engineering Agent | DevOps | aucun |

**Constat** : P126 couvre les **chatbots medicaux conversationnels** (cas 8, 9) mais **ne touche PAS** :
1. Le **medical chirurgical robotique** (Da Vinci Xi, dVRK ROS2)
2. Les **dispositifs medicaux FDA class II/III** avec contraintes biomecaniques (tension 50-800 g, depth-of-insertion)
3. L'**injection via HL7 OBX** ou directives chirurgicales structurees SNOMED-CT
4. L'**evaluation adversariale par moteur genetique** (port Liu et al. 2023)

C'est exactement la niche AEGIS preservee — voir G-063.

---

## 3. Comparaison ligne a ligne : 8 axes

| Axe | P126 (Design Patterns) | AEGIS (cette these) | Differentiateur |
|-----|-----------------------|---------------------|-----------------|
| Domaine cible | Agents LLM generiques + 2 cas medical conversationnel | **Robot chirurgical Da Vinci Xi + agent CDS** | AEGIS = chirurgical robotique exclusif |
| Specification formelle | "Provable resistance" via patterns architecturaux | `AllowedOutputSpec` biomecanique : `tension_g in [50,800]`, `forbidden_tools` par phase | AEGIS = contraintes biomecaniques specifiques |
| Ancrage reglementaire | Aucun | **FDA 510k Da Vinci Xi K183303** + SNOMED-CT + HL7 v2.5 OBX | AEGIS = ancrage reglementaire concret |
| Implementation | Patterns architecturaux + 10 case studies narratifs | **Systeme end-to-end** : backend FastAPI + frontend React + Ollama LLaMA 3.2 + moteur genetique | AEGIS = implementation operationnelle |
| Evaluation | Case studies qualitatifs (threat model + mitigations narratives) | **Campagnes N>=30** (THESIS-001 a THESIS-003) + Sep(M) + SVC + 6000 runs ASIDE | AEGIS = validation empirique statistiquement valide |
| Catalogue d'attaques | Non publie (le paper est sur les defenses) | **99 templates AEGIS + 48 scenarios medicaux** | AEGIS = catalogue red-team massif |
| Adaptativite adversaire | Non discutee | **Moteur genetique calibre Liu et al. 2023** : NSGA-II, 6 dimensions SVC, mutation + crossover | AEGIS = adversaire adaptatif |
| Compositionnalite | Patterns isoles | **Triple Convergence D-001** : delta-0 + delta-1 + delta-2 + delta-3 evalues conjointement | AEGIS = composition formelle |

---

## 4. Patterns P126 manquants dans AEGIS — actions correctives

### 4.1 Pattern Code-Then-Execute (P126 §5, CaMeL P081) — A INTEGRER

**Constat** : AEGIS n'a pas de DSL sandboxe avec data-flow taint tracking. C'est un manque defensif important.

**Action recommandee** : porter CaMeL (P081) comme couche delta-3 supplementaire dans le `medical_robot_agent`. Le DSL pourrait etre defini comme :
```
surgical_dsl ::= action(name: tool_name, params: spec_params)
                | sequence(action1, action2)
                | guard(invariant, action)

invariant ::= biomechanical(name, range)
            | phase_check(allowed_phases)
            | hl7_obx_signature(expected_hash)
```
Le DSL est genere par le `security_audit_agent` (privileged) et execute par un sandbox deterministe.

**Effort estime** : 4 sprints (architecture + implementation + validation).

### 4.2 Pattern Context-Minimization (P126 §6) — A EVALUER

**Constat** : AEGIS conserve le contexte multi-tours integral pour permettre le `MultiTurnComplianceTracker` (G-037 ferme 2026-04-10). Le pattern Context-Minimization de P126 propose de PURGER le prompt utilisateur apres traduction.

**Tension** : la purge briserait la detection multi-turn AEGIS (CRESCENDO_ALERT). Solution : adopter le pattern UNIQUEMENT sur les couches en aval de la detection multi-tour, pas en amont.

**Action recommandee** : ajouter `context_minimization_post_detection` comme phase delta-3 dans le pipeline. Le tracker multi-tour reste en amont avec contexte complet, la purge intervient avant l'execution finale.

**Effort estime** : 1 sprint.

### 4.3 Pattern Dual LLM avec variables symboliques (P126 §4) — A RENFORCER

**Constat** : AEGIS utilise deux modeles heterogenes (security_audit_agent + medical_robot_agent) mais sans formalisation de variables symboliques `$VAR1`...`$VARn` qui transportent du contenu opaque entre les deux LLMs.

**Action recommandee** : ajouter une couche d'abstraction `SymbolicVariable(name, hash, kind)` qui transporte des resultats opaques (rapports de diagnostic, recommandations, etc.) du quarantined LLM vers le privileged LLM. Cela renforce la separation des trust boundaries.

**Effort estime** : 2 sprints.

---

## 5. Repositionnement these — propositions de texte

### 5.1 Reformulation contribution Chapitre I §3 (introduction)

**Avant** (preseed) :
> "AEGIS est la premiere implementation formelle d'un framework delta-3 pour les agents LLM medicaux."

**Apres** :
> "AEGIS prolonge la lignee des design patterns formels pour la securite des agents LLM (Beurer-Kellner et al., 2025, P126 ; Debenedetti et al., 2025, P081 CaMeL ; Yin et al., 2025, P082 AgentSpec) en proposant la **premiere specialisation chirurgicale robotique** de ces patterns, ancree dans les contraintes biomecaniques FDA 510k du Da Vinci Xi, avec evaluation adversariale par moteur genetique calibre (port Liu et al. 2023)."

### 5.2 Ajout section Related Work §3.4

> "Beurer-Kellner et al. (2025, arXiv:2506.08837) proposent six design patterns avec resistance prouvee a l'injection de prompt, illustres par dix case studies dont deux medicaux (Medication Leaflet Chatbot, Medical Diagnosis Chatbot). Aucune des dix etudes ne traite du robot chirurgical autonome ni des contraintes biomecaniques FDA, niche que la these AEGIS couvre exclusivement. AEGIS adopte les patterns 4 (Dual LLM) et 5 (Code-Then-Execute, derive de CaMeL P081) comme defenses complementaires, en les specialisant via `AllowedOutputSpec` biomecanique et `forbidden_tools` par phase chirurgicale."

---

## 6. Synthese pour le briefing director

| Element | Verdict | Justification |
|---------|---------|---------------|
| Scooping integral de la these | **NON** | P126 couvre delta-3 generique + 2 chatbots medicaux conversationnels, pas le chirurgical robotique FDA |
| Scooping partiel (claim "4e implementation") | **OUI** | Deja reformule dans delta-3.md §1 le 2026-04-11 |
| Patterns a integrer | **2 sur 6** | Code-Then-Execute (4 sprints) + Context-Minimization post-detection (1 sprint) |
| Conjectures impactees | **C2 +1, C3 +1** | Voir briefing RUN-007 §1 |
| Decouverte D-018 | **VALIDABLE** | "Design patterns sont la solution formelle a PI pour les agents generiques" — P126 le prouve. AEGIS ajoute la specialisation chirurgicale FDA. |
| Gap G-001 | **PARTIELLEMENT_FERME** generique, **OUVERT** medical chirurgical | Reformule deja dans gaps.md ligne 15 |
| Gap G-063 (nouveau) | **CONFIRME** | Voir CHAPITRE_IV_DELTA3_G063.md (livrable parallele) |

---

## 7. Citations a integrer dans la these

```bibtex
@article{beurerkellner2025designpatterns,
    title = {Design Patterns for Securing LLM Agents against Prompt Injections},
    author = {Beurer-Kellner, Luca and Buesser, Beat and Cre{\c{t}}u, Ana-Maria and
              Debenedetti, Edoardo and Dobos, Daniel and Fabian, Daniel and
              Fischer, Marc and Froelicher, David and Grosse, Kathrin and
              Naeff, Daniel and Ozoani, Ezinwanne and Paverd, Andrew and
              Tram{\`e}r, Florian and Volhejn, V{\'a}clav},
    journal = {arXiv preprint arXiv:2506.08837},
    year = {2025},
    note = {v3, revised 2025-06-27},
    doi = {10.48550/arXiv.2506.08837},
    p_id = {P126}
}
```

**Citation inline standard these** :
`(Beurer-Kellner et al., 2025, arXiv:2506.08837, v3, Section 3 design patterns)`

**Pour les case studies medicaux** :
`(Beurer-Kellner et al., 2025, arXiv:2506.08837, v3, Section 4 case studies : Medication Leaflet Chatbot, Medical Diagnosis Chatbot)`

---

## 8. References

- Beurer-Kellner et al. (2025), arXiv:2506.08837v3, https://arxiv.org/abs/2506.08837
- HTML version v3 (full text) : https://arxiv.org/html/2506.08837v3
- Tramer's homepage : https://floriantramer.com/publications/designpatterns25/
- Willison commentary (2025-06-13) : https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/
- P081 CaMeL (predecessor) : Debenedetti et al. 2025, ICML Outstanding Paper candidate
- P082 AgentSpec (sibling) : Yin et al. ICSE 2026
- P084 LlamaFirewall (code-domain) : Chennabasappa et al. 2025, Meta AI, arXiv:2505.03574
