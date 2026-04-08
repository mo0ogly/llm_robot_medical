# RETEX — Autonomie du Pipeline Analyse → Campagne

> **Date** : 2026-04-08
> **Contexte** : Session enchainees — 22 agents, 420 runs experimentaux, 26 papiers integres
> **Objectif** : Identifier les ruptures d'autonomie et les corriger

---

## 1. Cartographie des Ruptures Actuelles

### Le pipeline actuel a 7 points de rupture humaine

```
[1] User donne des URLs Perplexity
        ↓
    COLLECTOR telecharge + injecte ChromaDB
        ↓
    ANALYST produit analyses
        ↓
[2] User dit "lance le pipeline"
        ↓
    MATHEUX + CYBERSEC + WHITEHACKER
        ↓
[3] User dit "ok enchaine"
        ↓
    LIBRARIAN + MATHTEACHER + SCIENTIST + CHUNKER
        ↓
[4] User dit "lance l'experience"
        ↓
    run_triple_convergence.py / run_thesis_campaign.py
        ↓
[5] User dit "qu'est-ce que ca donne ?"
        ↓
    Lecture manuelle du JSON + interpretation
        ↓
[6] User dit "et maintenant ?"
        ↓
    Diagnostic manuel + decision de relancer / ajuster / passer a autre chose
        ↓
[7] User dit "mets dans la these"
        ↓
    Ecriture manuelle dans le manuscrit
```

### Objectif : reduire a 2 points de rupture

```
[1] User donne un objectif de recherche (conjecture, gap, question)
        ↓
    ═══════════════════════════════════════════
    ║  TOUT LE RESTE EST AUTOMATIQUE          ║
    ║  biblio → analyse → protocole →         ║
    ║  campagne → analyse resultats →         ║
    ║  rebouclage si besoin → manuscrit       ║
    ═══════════════════════════════════════════
        ↓
[2] User valide le verdict final avant publication
```

---

## 2. Les 7 Ruptures — Diagnostic et Fix

### R1 — URLs manuelles (Perplexity)

**Probleme** : L'utilisateur doit aller sur Perplexity, formuler des requetes, copier des URLs, les coller dans le chat.

**Diagnostic** : Le COLLECTOR n'a pas de capacite de recherche autonome. Il attend des URLs.

**Fix** :
```
AVANT : User → Perplexity → URLs → COLLECTOR
APRES : SCIENTIST identifie un gap → genere une requete →
        COLLECTOR fait WebSearch directement → filtre les resultats →
        telecharge les PDFs → injecte ChromaDB
```

**Implementation** :
- Ajouter un mode `COLLECTOR --auto-search` qui prend une requete structuree en input
- Le SCIENTIST genere la requete quand il identifie un gap non couvert
- Le COLLECTOR utilise WebSearch (arXiv API, Semantic Scholar API) pour trouver les papiers
- Anti-doublon automatique avant attribution de P-ID

**Gain** : Supprime la rupture R1 completement. Le user n'a plus besoin de Perplexity.

---

### R2 — "Lance le pipeline" (gating manuel entre phases)

**Probleme** : Apres la Phase 2a (ANALYST), le user doit dire "ok enchaine" pour lancer Phase 2b.

**Diagnostic** : Le research-director n'a pas de gate automatique. Il attend l'approbation humaine entre chaque phase.

**Fix** :
```
AVANT : ANALYST termine → User dit "ok" → Phase 2b
APRES : ANALYST termine → fichier PHASE_2A_COMPLETE cree →
        research-director detecte le signal → lance Phase 2b automatiquement
```

**Implementation** :
- Chaque phase cree un fichier signal a la fin : `_staging/signals/PHASE_XX_COMPLETE`
- Le research-director lit ces signaux au demarrage et enchaine
- Mode `--auto-chain` dans bibliography-maintainer pour tout enchainer sans pause

**Gain** : Supprime R2 et R3. Le pipeline tourne de bout en bout.

---

### R3 — "Lance l'experience" (gap → campagne manuel)

**Probleme** : Le SCIENTIST identifie un gap G-011 (Triple Convergence) mais c'est le user qui decide de lancer `run_triple_convergence.py`.

**Diagnostic** : Il n'y a pas d'agent EXPERIMENT-PLANNER qui convertit un gap en protocole executable.

**Fix** :
```
AVANT : SCIENTIST → gap G-011 → User dit "lance TC" → run_triple_convergence.py
APRES : SCIENTIST → gap G-011 ACTIONNABLE → EXPERIMENT-PLANNER →
        protocole TC-001.json → pre-check 5 runs → lancement automatique
```

**Implementation** :
- Agent EXPERIMENT-PLANNER (skill a creer)
- Input : THESIS_GAPS.md (gaps avec statut A EXECUTER)
- Output : protocol_GXXX.json dans experiments/
- Logique :
  1. Filtrer gaps A EXECUTER
  2. Pour chaque gap, identifier le script existant ou en creer un
  3. Adapter les parametres au modele (regle RETEX : 3B/7B/70B)
  4. Pre-check : 5 runs rapides → si ASR baseline < 5% → ajuster → si OK → lancer N=30
  5. Enregistrer dans campaign_manifest.json

**Gain** : Supprime R4. Les experiences se lancent automatiquement quand un gap est pret.

---

### R4 — "Qu'est-ce que ca donne ?" (analyse manuelle des resultats)

**Probleme** : Le JSON de resultats est produit mais personne ne l'analyse automatiquement. C'est le user qui demande.

**Diagnostic** : Il n'y a pas d'agent EXPERIMENTALIST qui analyse les resultats statistiques.

**Fix** :
```
AVANT : run_*.py → results.json → User lit → "c'est INCONCLUSIVE"
APRES : run_*.py → results.json → EXPERIMENTALIST →
        EXPERIMENT_REPORT.md (verdict + diagnostic + actions)
```

**Implementation** :
- Agent EXPERIMENTALIST (skill a creer)
- Input : experiments/*.json (nouveaux fichiers)
- Process :
  1. Detecter les nouveaux fichiers de resultats (timestamp > dernier check)
  2. Calculer : ASR par condition, IC 95% Wilson, p-values, taille d'effet
  3. Comparer aux success_criteria du campaign_manifest.json
  4. Verdict : SUPPORTED / REFUTED / INCONCLUSIVE
  5. Si INCONCLUSIVE : diagnostic automatique + protocol_v2
- Output : EXPERIMENT_REPORT_GXXX.md
- Declencheur : hook dans research-director, ou cron sur le dossier experiments/

**Gain** : Supprime R5. Les resultats sont analyses en temps reel.

---

### R5 — "Et maintenant ?" (decision manuelle post-resultat)

**Probleme** : Apres un resultat INCONCLUSIVE, c'est le user qui decide quoi faire.

**Diagnostic** : La boucle iterative n'est pas implementee.

**Fix** :
```
AVANT : INCONCLUSIVE → User decide → ajuste → relance
APRES : INCONCLUSIVE → EXPERIMENTALIST diagnostic →
        protocol_v2 genere automatiquement →
        EXPERIMENT-PLANNER relance avec parametres ajustes →
        max 3 iterations → si toujours INCONCLUSIVE → escalade humaine
```

**Implementation** :
- Dans l'EXPERIMENTALIST, ajouter la logique de rebouclage :
  ```python
  if verdict == "INCONCLUSIVE":
      iteration = current_iteration + 1
      if iteration > MAX_ITERATIONS:
          signal("ESCALADE_HUMAINE", gap_id)
      else:
          adjustments = diagnose(results)  # IC trop large → N+, variance → temp 0, etc.
          create_protocol_v2(adjustments)
          launch_campaign(protocol_v2)
  ```

**Regles de rebouclage** (deja dans redteam-forge.md) :
- IC trop large → augmenter N (30 → 60 → 100)
- Variance trop elevee → temperature 0, seed fixee
- Modele trop petit → escalader vers modele plus grand
- Max 3 iterations par campagne

**Gain** : Supprime R6. La boucle est fermee.

---

### R6 — "Mets dans la these" (manuscrit manuel)

**Probleme** : Les resultats valides ne sont pas integres automatiquement dans le manuscrit.

**Fix** :
```
AVANT : Resultat SUPPORTED → User dit "ecris dans la these" → ecriture manuelle
APRES : Resultat SUPPORTED → THESIS-WRITER →
        identifie le chapitre → insere les chiffres avec refs →
        audit-these verifie → manuscrit mis a jour
```

**Implementation** :
- Agent THESIS-WRITER (skill a creer)
- Input : EXPERIMENT_REPORT (verdict SUPPORTED) + CONJECTURES_TRACKER
- Process :
  1. Identifier le chapitre concerne (mapping conjecture → chapitre)
  2. Generer le paragraphe avec chiffres exacts, IC 95%, p-values
  3. Inserer dans manuscript/chapitre_X.md
  4. Lancer audit-these pour verifier coherence
- Regle : ne cite QUE des resultats avec p < 0.05 et N >= 30
- Regle : ne modifie PAS les chapitres a maturite > 90% sans approbation

**Gain** : Supprime R7. Le manuscrit se construit automatiquement.

---

### R7 — Resultat surprenant non exploite

**Probleme** : TC-001 a produit un finding publiable ("les 3B resistent par incapacite") mais personne ne l'a exploite automatiquement.

**Fix** :
```
AVANT : Finding surprenant → User remarque → "c'est interessant"
APRES : EXPERIMENTALIST detecte anomalie (ASR hors IC attendu) →
        genere une research_request automatique →
        COLLECTOR lance une recherche ciblee →
        nouveau cycle biblio → potentiellement nouveau gap/conjecture
```

**Implementation** :
- Dans l'EXPERIMENTALIST, ajouter :
  ```python
  if result_outside_expected_ci(results):
      request = {
          "type": "RESEARCH_REQUEST",
          "priority": "HAUTE",
          "query": f"unexpected {anomaly} in {context}",
          "trigger": experiment_id
      }
      append_to("research_requests.json", request)
      signal("UNEXPECTED_FINDING", experiment_id)
  ```

**Gain** : Les resultats surprenants declenchent automatiquement de nouvelles pistes.

---

## 3. Architecture Cible — Pipeline Autonome Complet

```
USER : "Valide la conjecture C4 experimentalement"
  |
  v
RESEARCH-DIRECTOR (PDCA)
  |
  ├─ PLAN ──────────────────────────────────────────────────┐
  │   1. Lit CONJECTURES_TRACKER → C4 = 9/10, non validee  │
  │   2. Lit THESIS_GAPS → G-009 (Sep(M) N>=30)            │
  │   3. Lit campaign_manifest → SEPM-001 DONE              │
  │   4. Decision : manque cross-model validation            │
  │   5. Genere research_request si biblio insuffisante      │
  │                                                          │
  ├─ DO ────────────────────────────────────────────────────┐
  │   6. COLLECTOR cherche papiers complementaires (auto)    │
  │   7. ANALYST analyse (auto)                              │
  │   8. Pipeline 2b-3-4-5 (auto, pas de gate humaine)       │
  │   9. EXPERIMENT-PLANNER genere protocole                 │
  │  10. Pre-check 5 runs → OK → lance N=30                 │
  │                                                          │
  ├─ CHECK ─────────────────────────────────────────────────┐
  │  11. EXPERIMENTALIST analyse resultats                   │
  │  12. Verdict : SUPPORTED / REFUTED / INCONCLUSIVE        │
  │  13. Si INCONCLUSIVE → rebouclage (max 3 iterations)     │
  │  14. Si SURPRISING → research_request automatique        │
  │                                                          │
  ├─ ACT ───────────────────────────────────────────────────┐
  │  15. CONJECTURES_TRACKER mis a jour                      │
  │  16. THESIS_GAPS mis a jour (gap ferme/ouvert)           │
  │  17. THESIS-WRITER integre dans manuscrit                │
  │  18. audit-these verifie                                 │
  │  19. DIRECTOR BRIEFING genere                            │
  └──────────────────────────────────────────────────────────┘
  |
  v
USER : "C4 est validee experimentalement (p=0.003, N=30, Sep(M)=0.42)"
       → Approuve ou demande ajustement
```

## 4. Lecons Specifiques de Cette Session

### L1 — Le COLLECTOR sans WebSearch est un goulot

Cette session : le user a du aller sur Perplexity 5 fois, copier des URLs, les formater en preseed JSON. Le COLLECTOR n'a fait que telecharger et injecter.

**Temps perdu** : ~30 min de travail humain pour quelque chose qu'un agent avec WebSearch ferait en 5 min.

**Fix immediat** : Ajouter un mode `COLLECTOR --discover "prompt injection medical 2025-2026"` qui utilise WebSearch + arXiv API pour trouver les papiers, filtrer les doublons, et generer le preseed automatiquement.

### L2 — Le gating Phase 2a → 2b est inutile

Le user a dit "ok enchaine" 3 fois cette session. Chaque fois c'etait pour approuver le passage a la phase suivante — jamais pour modifier quoi que ce soit.

**Fix immediat** : Mode `--auto-chain` dans bibliography-maintainer. Le user peut toujours interrompre avec Ctrl+C, mais le defaut est l'enchainement automatique.

### L3 — TC-001 a perdu 2h parce que le pre-check n'existait pas

Le premier run (v1) a pris 2h pour produire un resultat INCONCLUSIVE. Si on avait fait 5 runs de pre-check, on aurait vu en 5 min que le 3B ne decode pas les attaques combinees.

**Fix deja fait** : Regle pre-check dans doctoral-research.md et redteam-forge.md.

### L4 — L'analyse des resultats TC-001 a ete faite manuellement

J'ai lu le JSON, interprete les chiffres, produit le rapport. L'EXPERIMENTALIST aurait fait ca automatiquement.

**Fix** : Creer la skill EXPERIMENTALIST (priorite P1).

### L5 — Le finding publiable ("3B resistent par incapacite") n'a pas ete exploite

C'est un resultat original — les petits modeles ne decodent pas les attaques combinees, ce qui les fait paraitre robustes. Personne n'a declenche une recherche biblio pour voir si ce phenomene est documente.

**Fix** : L'EXPERIMENTALIST doit avoir un detecteur de resultats surprenants qui genere des research_requests.

### L6 — Les resultats n'apparaissaient pas dans l'UX

Les fichiers JSON etaient dans le mauvais repertoire et le mauvais format. 30 min de debug pour ajouter le double-save.

**Fix deja fait** : Tous les scripts de campagne sauvent dans 2 emplacements (research + UX).

### L7 — Les doublons ont gaspille des slots

P088 et P105 = doublons de P036. P106 = inexploitable (PDF absent). 3 slots sur 20 gaspilles (15%).

**Fix deja fait** : Regles anti-doublon et post-injection dans doctoral-research.md.

---

## 5. Plan d'Implementation — 3 Skills a Creer

### Skill 1 : EXPERIMENTALIST (priorite P0)

```
.claude/skills/experimentalist/SKILL.md
Trigger : nouveau fichier dans experiments/*.json
Input : results.json + campaign_manifest.json
Output : EXPERIMENT_REPORT_*.md + mise a jour conjectures
Agents : 1 (Sonnet)
Temps : 2-3 min par analyse
```

### Skill 2 : EXPERIMENT-PLANNER (priorite P1)

```
.claude/skills/experiment-planner/SKILL.md
Trigger : gap avec statut A EXECUTER dans THESIS_GAPS.md
Input : THESIS_GAPS.md + campaign_manifest.json + scripts disponibles
Output : protocol_*.json + pre-check + lancement
Agents : 1 (Sonnet)
Temps : 5 min par protocole
```

### Skill 3 : THESIS-WRITER (priorite P2)

```
.claude/skills/thesis-writer/SKILL.md
Trigger : conjecture VALIDATED dans CONJECTURES_TRACKER.md
Input : EXPERIMENT_REPORT + conjectures + analyses
Output : paragraphes inseres dans manuscript/
Agents : 1 (Opus pour qualite redactionnelle)
Temps : 10-15 min par section
```

### Améliorations aux skills existantes

```
bibliography-maintainer : ajouter --auto-chain (pas de gate humaine)
research-director : ajouter hooks post-campagne + post-resultat
COLLECTOR : ajouter --discover (WebSearch autonome)
```

---

## 6. Metriques d'Autonomie

### Aujourd'hui : Niveau 3 (semi-autonome)

| Metrique | Valeur |
|----------|--------|
| Interventions humaines par cycle | 7 |
| Temps humain par cycle | ~45 min |
| Temps machine par cycle | ~90 min |
| Ratio humain/machine | 0.5 (mauvais) |

### Cible : Niveau 5 (autonome supervise)

| Metrique | Cible |
|----------|-------|
| Interventions humaines par cycle | **2** (lancement + validation) |
| Temps humain par cycle | **5 min** |
| Temps machine par cycle | ~120 min (plus de travail, meme vitesse) |
| Ratio humain/machine | **0.04** (excellent) |

### Comment mesurer le progres

1. Compter les "ok", "lance", "enchaine", "et maintenant" du user par session
2. Chaque occurrence = une rupture d'autonomie
3. Cible : 0 occurrence sauf "lance le cycle" au debut et "approuve" a la fin
