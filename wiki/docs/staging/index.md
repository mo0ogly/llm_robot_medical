# Staging --- Agents de recherche

<p class='agent-badge agent-badge--scientist'>PIPELINE &middot; BIBLIOGRAPHY-MAINTAINER</p>

!!! abstract "Pipeline bibliography-maintainer"
    Le dossier `research_archive/_staging/` contient **l'integralite du travail** produit par les agents specialises du pipeline `/bibliography-maintainer`. Ces fichiers vivent dans le repo git et sont normalement invisibles aux chercheurs externes. Ce wiki **les publie**.

<div class="stat-grid">
  <div class="stat-card"><span class="stat-value">13</span><span class="stat-label">Agents publies</span></div>
  <div class="stat-card"><span class="stat-value">272</span><span class="stat-label">Fichiers</span></div>
  <div class="stat-card"><span class="stat-value">52 913</span><span class="stat-label">Lignes</span></div>
  <div class="stat-card"><span class="stat-value">9</span><span class="stat-label">Phases pipeline</span></div>
</div>

## Agents et productions

<div class="grid cards" markdown>

- <span class="agent-badge agent-badge--analyst">ANALYST</span> **Analyses de papiers (Keshav 3-pass)**

    140 fichiers &middot; 13 659 lignes.

    [:material-arrow-right: Ouvrir](analyst/index.md)

- <span class="agent-badge agent-badge--scientist">SCIENTIST</span> **Synthese scientifique**

    33 fichiers &middot; 6 442 lignes.

    [:material-arrow-right: Ouvrir](scientist/index.md)

- <span class="agent-badge agent-badge--matheux">MATHEUX</span> **Formules mathematiques (extraction & reviews)**

    14 fichiers &middot; 5 449 lignes.

    [:material-arrow-right: Ouvrir](matheux/index.md)

- <span class="agent-badge agent-badge--mathteacher">MATHTEACHER</span> **Cours de mathematiques (8 modules + guide notation + self-assessment)**

    16 fichiers &middot; 7 747 lignes.

    [:material-arrow-right: Ouvrir](mathteacher/index.md)

- <span class="agent-badge agent-badge--cybersec">CYBERSEC</span> **Analyses menaces & defenses**

    9 fichiers &middot; 4 952 lignes.

    [:material-arrow-right: Ouvrir](cybersec/index.md)

- <span class="agent-badge agent-badge--whitehacker">WHITEHACKER</span> **Red Team playbooks & exploitation**

    8 fichiers &middot; 7 297 lignes.

    [:material-arrow-right: Ouvrir](whitehacker/index.md)

- <span class="agent-badge agent-badge--librarian">LIBRARIAN</span> **Rapports de propagation & validation**

    10 fichiers &middot; 1 561 lignes.

    [:material-arrow-right: Ouvrir](librarian/index.md)

- <span class="agent-badge agent-badge--chunker">CHUNKER</span> **Chunking pour injection ChromaDB**

    6 fichiers &middot; 1 781 lignes.

    [:material-arrow-right: Ouvrir](chunker/index.md)

- <span class="agent-badge agent-badge--collector">COLLECTOR</span> **Preseed et verifications anti-doublon**

    8 fichiers &middot; 584 lignes.

    [:material-arrow-right: Ouvrir](collector/index.md)

- <span class="agent-badge agent-badge--briefings">BRIEFINGS</span> **Briefings directeur (livrable Phase 6)**

    8 fichiers &middot; 1 282 lignes.

    [:material-arrow-right: Ouvrir](briefings/index.md)

- <span class="agent-badge agent-badge--audit-these">AUDIT THESE</span> **Audits scientifiques (claims, versions)**

    18 fichiers &middot; 1 688 lignes.

    [:material-arrow-right: Ouvrir](audit-these/index.md)

- <span class="agent-badge agent-badge--audit-pdca">AUDIT PDCA</span> **Audits PDCA des sessions wiki**

    1 fichiers &middot; 184 lignes.

    [:material-arrow-right: Ouvrir](audit-pdca/index.md)

- <span class="agent-badge agent-badge--memory">MEMORY</span> **Etat persistant inter-session**

    1 fichiers &middot; 287 lignes.

    [:material-arrow-right: Ouvrir](memory/index.md)

</div>

## Hierarchie du pipeline

```mermaid
flowchart LR
    COL["COLLECTOR"] --> ANA["ANALYST"]
    ANA --> MAT["MATHEUX"]
    ANA --> CYB["CYBERSEC"]
    ANA --> WH["WHITEHACKER"]
    MAT --> MT["MATHTEACHER"]
    MAT --> SCI["SCIENTIST"]
    CYB --> SCI
    WH --> SCI
    SCI --> LIB["LIBRARIAN"]
    LIB --> CHK["CHUNKER"]
    CHK --> DB[("ChromaDB<br/>aegis_bibliography")]
    style DB fill:#00bcd4,color:#fff
```

**Acces complet** : chaque agent a sa propre section navigable. Les fichiers sont disponibles en lecture web **et** telechargement markdown direct.
