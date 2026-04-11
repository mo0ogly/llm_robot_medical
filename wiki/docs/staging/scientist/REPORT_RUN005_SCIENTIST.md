# REPORT RUN-005 -- Agent SCIENTIST
## Synthese transverse, mise a jour conjectures, decouvertes et gaps
## These doctorale AEGIS -- ENS 2026

**Date** : 2026-04-07
**Mode** : INCREMENTAL
**Papiers couverts** : 15 (P087-P102, excl. P088 doublon P036)
**Sources** : REPORT_RUN005_MATHEUX.md, REPORT_RUN005_CYBERSEC.md, REPORT_RUN005_WHITEHACKER.md
**Axes thematiques** : LRM Safety (P087-P094) + Multi-Step Boundary Erosion (P097-P102)

---

## 1. Resume executif

RUN-005 est le lot le plus impactant depuis RUN-002 pour la these AEGIS. Les 15 papiers convergent vers deux conclusions majeures :

1. **C7 (paradoxe raisonnement/securite) passe de 8/10 a 9.5/10** avec 8 papiers convergents et une preuve mecanistique (P094). Le paradoxe est desormais STRUCTURAL : le signal de securite est un sous-espace basse dimension (P094) concentre dans ~50 tetes d'attention (P102) qui se dilue avec le raisonnement. C'est le resultat le plus fort du RUN-005.

2. **Les attaques multi-tour (MSBE) ont atteint la maturite operationnelle** avec 7 papiers (P095-P101). Le drift de la direction de refus est monotone (P097 STAR), les prompts sont entierement benins (P099 Crescendo, P100 ActorBreaker), et la degradation est passive sous contexte long (P098). Nouvel Axe 10 cree.

3. **La Triple Convergence (D-001) est massivement renforcee** : Pilier 1 est maintenant explique a 3 niveaux (empirique, causal P094, architectural P102). 0/15 papiers adressent delta-3. L'argument pour delta-3 est soutenu par 73+ papiers.

---

## 2. Fichiers mis a jour

| Fichier | Action | Changements cles |
|---------|--------|-----------------|
| `discoveries/CONJECTURES_TRACKER.md` | MIS A JOUR | C7 : 8/10 -> 9.5/10 (8 papiers, preuve mecanistique P094). Section RUN-005 ajoutee. C8 : coherence verifiee, stable a 6/10. |
| `discoveries/DISCOVERIES_INDEX.md` | MIS A JOUR | 5 nouvelles decouvertes (D-017 a D-021). D-004 confiance montee a 9.5/10. Total : 21 decouvertes. |
| `discoveries/THESIS_GAPS.md` | MIS A JOUR | 10 nouveaux gaps (G-032 a G-041). Reconciliation CYBERSEC/WHITEHACKER. 4 gaps existants renforces. |
| `discoveries/TRIPLE_CONVERGENCE.md` | MIS A JOUR | Section RUN-005 ajoutee. Pilier 1 : 3 mecanismes fondamentaux (concentration sparse, dilution basse-dim, auto-corruption). Pilier 2 etendu via multi-tour. |
| `_staging/scientist/AXES_DE_RECHERCHE.md` | MIS A JOUR | Axe 9 enrichi (15 papiers, nuance P091). Axe 10 NOUVEAU (MSBE, 7 papiers). v3.0 -> v4.0. |
| `_staging/scientist/REPORT_RUN005_SCIENTIST.md` | CREE | Ce rapport. |

---

## 3. Impact sur les conjectures

| Conjecture | Score avant | Score apres | Variation | Justification |
|-----------|-------------|-------------|-----------|---------------|
| **C1** | 10/10 | 10/10 | Stable (sature) | P092 (self-jailbreaking), P098 (degradation passive), P102 (concentration sparse). |
| **C2** | 10/10 | 10/10 | Stable (sature) | 0/15 papiers avec delta-3. Total : 0/73+. |
| **C3** | 10/10 | 10/10 | Stable (sature) | P102 : preuve architecturale (~50 tetes). |
| **C4** | 9/10 | 9/10 | Stable | P097 STAR : drift monotone mesurable. Pas d'experience Sep(M) N>=30. |
| **C5** | 8.5/10 | 8.5/10 | Stable | Pas de nouvelle evidence directe. |
| **C6** | 9.5/10 | 9.5/10 | Stable | Pas de nouveau papier medical specifique. |
| **C7** | 8/10 | **9.5/10** | **+1.5** | 8 papiers, preuve mecanistique P094, explication architecturale P102. |
| **C8** | 6/10 | 6/10 | Stable | Pas d'evidence directe. |

### Analyse detaillee de C7

C7 est la conjecture la plus impactee par RUN-005. La convergence de 8 papiers independants couvrant des mecanismes complementaires (CoT hijacking P087, stacked ciphers P089, self-jailbreaking P092, attention dilution P094, safety head concentration P102) transforme C7 d'une conjecture empirique en un fait avec explication structurelle.

**Nouvelle formulation proposee** : Le raisonnement etendu des LRM cree un espace de complexite que le mecanisme de verification de securite -- concentre dans un sous-espace basse dimension de quelques tetes d'attention (P102, Huang et al. 2025, Figure 1a) -- ne peut couvrir. Le paradoxe est STRUCTURAL : la meme architecture qui permet le raisonnement dilue le signal de securite (P094, Zhao et al. 2026, Table 1).

**Nuance integree (P091, Krishna et al. 2025)** : Le paradoxe est conditionnel au type d'attaque. Tree-of-attacks +32pp pire contre LRM, MAIS XSS -29.8pp meilleur. C7 s'applique aux attaques semantiques/logiques mais PAS aux syntactiques/techniques.

---

## 4. Nouvelles decouvertes (D-017 a D-021)

| ID | Decouverte | Source | Confiance |
|----|-----------|--------|-----------|
| D-017 | Self-jailbreaking sans adversaire | P092 | 9/10 |
| D-018 | Test-time compute scaling offensif | P093 | 8/10 |
| D-019 | Signal de securite basse dimension dilutable | P094 | 10/10 |
| D-020 | Compliance partielle accumulatif multi-tour | P095, P096 | 9/10 |
| D-021 | Knowledge repository adversarial auto-evolutif | P096 | 8/10 |

### D-019 : decouverte la plus impactante

P094 (Zhao et al. 2026) est le papier le plus fort de ce lot (SVC 10/10). La preuve par activation probing causal que le signal de securite est basse dimension et se dilue monotoniquement avec la longueur du CoT constitue l'explication mecanistique la plus convaincante du paradoxe raisonnement/securite. Co-auteur Anthropic (Mrinank Sharma). Code et materiaux publies. Confiance 10/10 justifiee par : (1) preuve causale et pas seulement correlationnelle, (2) ASR le plus eleve du corpus (99% Gemini 2.5 Pro), (3) venue forte (co-auteur Anthropic), (4) reproductible.

---

## 5. Nouveaux gaps (G-032 a G-041)

| Gap | Priorite | Source | Type |
|-----|----------|--------|------|
| G-032 : Defense CoT Hijacking dilution | 1 | CYBERSEC + WHITEHACKER | ACTIONNABLE |
| G-033 : Self-jailbreaking frontier models | 2 | CYBERSEC | ACTIONNABLE |
| G-034 : AHD vs. multi-tour | 2 | CYBERSEC + WHITEHACKER | A CONCEVOIR |
| G-035 : Defense anti-systemes auto-ameliorants | 2 | CYBERSEC | A CONCEVOIR |
| G-036 : Interaction contexte long x multi-tour | 3 | CYBERSEC + WHITEHACKER | A CONCEVOIR |
| G-037 : Behavioral detection multi-turn | 2 | CYBERSEC + WHITEHACKER | ACTIONNABLE |
| G-038 : Supervision processus <think> | 2 | WHITEHACKER | ACTIONNABLE |
| G-039 : Formalisation dilution signal securite | 3 | MATHEUX | A CONCEVOIR |
| G-040 : Lien Sep(M) / direction de refus | 3 | MATHEUX | A CONCEVOIR |
| G-041 : Defense stacked ciphers adaptatifs | 2 | WHITEHACKER | ACTIONNABLE |

### Reconciliation des numerotations

Les rapports CYBERSEC et WHITEHACKER utilisaient independamment G-032 a G-037/G-038. La reconciliation a ete faite en :
1. Fusionnant les gaps identiques (G-032 CoT hijacking, G-034 AHD, G-037 behavioral detection) confirmes par les deux agents
2. Attribuant des numeros uniques aux gaps specifiques a chaque agent (G-038 think supervision, G-041 stacked ciphers pour WHITEHACKER)
3. Ajoutant les gaps MATHEUX (G-039, G-040) non couverts par les autres agents

---

## 6. Impact sur la Triple Convergence (D-001)

La Triple Convergence est MASSIVEMENT renforcee par RUN-005 :

- **Pilier 1 (delta-0 effacable)** : Maintenant explique a 4 niveaux : empirique (P039), formel (P052 martingale), causal (P094 dilution probing), architectural (P102 concentration sparse). 3 mecanismes fondamentaux identifies : concentration sparse, dilution basse-dim, auto-corruption.

- **Pilier 2 (delta-1 empoisonnable)** : Etendu au multi-tour (P095-P100). L'erosion est systematique, monotone (P097 STAR), et fonctionne avec des prompts benins (P099, P100).

- **Pilier 3 (delta-2 bypassable)** : Confirme et etendu. Les prompts benins (P099, P100) contournent tous les filtres content-based. La detection doit devenir comportementale.

- **delta-3 seul survivant** : 0/15 papiers RUN-005 adressent delta-3. Total cumule : 0/73+ papiers du corpus.

---

## 7. Synthese transverse : convergence LRM + MSBE

Les deux axes thematiques de RUN-005 convergent vers une meme conclusion via P094 (CoT Hijacking) :

```
AXE LRM (P087-P094)           CONVERGENCE            AXE MSBE (P095-P101)
                                  |
Raisonnement etendu      P094 : le CoT long      Multi-tour accumule
dilue le signal de        dilue la direction      les compliances
securite basse-dim        de refus par           partielles et erode
(P094 causal)             dilution d'attention    le refus (P097 STAR)
                                  |
P102 : securite               MEME               P098 : degradation
concentree dans               MECANISME           passive sous contexte
~50 tetes                  (dilution du           long sans attaque
                           sous-espace de
                           securite)
```

**Conclusion unifiee** : Le mecanisme fondamental est le meme — le signal de securite RLHF est un artefact basse dimension fragile qui se dilue sous toute forme d'extension du contexte, que ce soit par raisonnement (axe LRM) ou par multi-tour (axe MSBE). La defense doit donc etre hors du mecanisme d'attention : c'est l'argument le plus fort pour delta-3 deterministe.

---

## 8. Recommandations prioritaires

### Pour la these (manuscrit)
1. **Promouvoir C7** de conjecture a fait etabli dans le Chapitre 4, avec la nuance P091 (conditionnel au type d'attaque)
2. **Integrer Axe 10 (MSBE)** comme nouveau chapitre ou sous-section du chapitre erosion
3. **Mettre a jour le formal framework** avec les 3 mecanismes de fragilite delta-0 (concentration, dilution, auto-corruption)

### Pour les experiences AEGIS
1. **Tester T37 (CoT Hijacking puzzles)** sur LLaMA 3.2 via Ollama -- ASR le plus eleve du corpus, black-box, facile
2. **Tester T39 (Long-Context passive)** -- trivial a implementer, mesure la degradation fondamentale
3. **Implementer Crescendo (T40)** comme 37e chaine d'attaque
4. **Creer attaque composee T39+T40** -- tester G-036
5. **Tester AHD (P102) contre STAR/Crescendo** -- question ouverte critique G-034
6. **Ajouter cipher detection** au RagSanitizer -- contre SEAL P089

### Pour le pipeline bibliographique
1. **Chercher replications independantes** de P094 (dilution probing) et P092 (self-jailbreaking)
2. **Chercher defenses specifiques** contre CoT hijacking (G-032) et multi-turn MSBE (G-037)
3. **Monitorer P102 (AHD)** -- si des tests multi-tour apparaissent, ils impactent G-034

---

## 9. Statistiques RUN-005

| Metrique | Valeur |
|---------|--------|
| Papiers analyses | 15 (excl. P088 doublon) |
| Formules ajoutees (MATHEUX) | 8 (9.1-9.8), total 45 |
| Techniques ajoutees (WHITEHACKER) | 13 (T31-T43) |
| Exploitations ajoutees (WHITEHACKER) | 10 (E25-E34) |
| Nouvelles decouvertes | 5 (D-017 a D-021) |
| Nouveaux gaps | 10 (G-032 a G-041) |
| Conjectures modifiees | 1 (C7 : 8/10 -> 9.5/10) |
| Axes de recherche | +1 (Axe 10 MSBE), Axe 9 enrichi |
| Score corpus total | 102 papiers, 21 decouvertes, 41 gaps, 8 conjectures |

---

## 10. Cross-validation

### Coherence inter-rapports
Les 3 rapports (MATHEUX, CYBERSEC, WHITEHACKER) convergent sur :
- C7 est la conjecture la plus impactee (les 3 recommandent 9.5/10)
- P094 est le papier le plus fort du lot (SVC 10/10 unanime)
- P102 fournit l'explication structurelle (les 3 identifient ~50 tetes)
- P092 est le phenomene le plus conceptuellement nouveau (self-jailbreaking)
- 0/15 papiers adressent delta-3 (confirmation unanime)

### Divergences resolues
- Numerotation des gaps (G-032 a G-038 en doublon) : reconciliee en G-032 a G-041
- CYBERSEC classe P102 comme "defense pure" tandis que WHITEHACKER le classe aussi comme "exploitation" (ablation). Les deux sont corrects : P102 est attaque ET defense.

---

*Agent SCIENTIST -- RUN-005 complete*
*5 fichiers discoveries/ mis a jour + AXES_DE_RECHERCHE.md v4.0 + ce rapport*
*Derniere mise a jour: 2026-04-07*
