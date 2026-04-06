#!/usr/bin/env python3
"""
build_wiki.py — Synchronise les sources .md du projet vers wiki/docs/
Execute AVANT mkdocs build pour assembler le wiki a partir des fichiers source.
"""

import shutil
import re
from pathlib import Path

# Racine du projet (parent de wiki/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
WIKI_DOCS = Path(__file__).resolve().parent / "docs"
WIKI_ASSETS = WIKI_DOCS / "assets" / "images"

# Sources
RESEARCH = PROJECT_ROOT / "research_archive"
DOC_REFS = RESEARCH / "doc_references"
DISCOVERIES = RESEARCH / "discoveries"
ARTICLES = RESEARCH / "articles"
STAGING = RESEARCH / "_staging"
DOCS = PROJECT_ROOT / "docs"
FIGURES = PROJECT_ROOT / "figures"
PLANS = DOCS / "plans"

# Extensions d'images a copier
IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}

# Fichiers a exclure (trop volumineux ou binaires)
EXCLUDE_PATTERNS = {"full_demo_v3.webp"}


def clean_docs():
    """Nettoie les fichiers generes (pas index.md ni installation.md statiques)."""
    generated_dirs = [
        WIKI_DOCS / "research" / "bibliography" / year
        for year in ("2023", "2024", "2025", "2026")
    ]
    generated_dirs.extend([
        WIKI_DOCS / "research" / "fiches-attaque",
        WIKI_DOCS / "plans",
    ])
    for d in generated_dirs:
        if d.exists():
            shutil.rmtree(d)
            d.mkdir(parents=True, exist_ok=True)


LINK_RENAMES = {
    "THESIS_GAPS.md": "gaps.md",
    "TRIPLE_CONVERGENCE.md": "triple-convergence.md",
    "CONJECTURES_TRACKER.md": "conjectures.md",
    "DISCOVERIES_INDEX.md": "index.md",
}


def copy_md(src: Path, dst: Path, title_override: str = None):
    """Copie un fichier .md en corrigeant les liens relatifs."""
    if not src.exists():
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    content = src.read_text(encoding="utf-8", errors="replace")
    # Corriger les liens vers figures/
    content = re.sub(
        r'(\!\[.*?\]\()(?:\.\./)*figures/',
        r'\1../assets/images/',
        content,
    )
    content = re.sub(
        r'(\!\[.*?\]\()(?:\.\./)*docs/screenshots/',
        r'\1../assets/images/screenshots/',
        content,
    )
    # Corriger les src= dans les balises HTML img
    content = re.sub(
        r'(src=["\'])(?:\.\./)*figures/',
        r'\1../assets/images/',
        content,
    )
    # Corriger les liens internes renommes (discoveries)
    for old_name, new_name in LINK_RENAMES.items():
        content = content.replace("](" + old_name + ")", "](" + new_name + ")")
    # Neutraliser les liens vers literature_for_rag/ (PDFs non inclus dans le wiki)
    content = re.sub(
        r'\[([^\]]*)\]\([^)]*literature_for_rag/([^)]+)\)',
        r'`\2`',
        content,
    )
    if title_override and not content.startswith("# "):
        content = "# " + title_override + "\n\n" + content
    dst.write_text(content, encoding="utf-8")


def copy_images():
    """Copie les images du projet vers wiki/docs/assets/images/."""
    WIKI_ASSETS.mkdir(parents=True, exist_ok=True)
    # figures/
    if FIGURES.exists():
        for f in FIGURES.iterdir():
            if f.suffix.lower() in IMG_EXTS and f.name not in EXCLUDE_PATTERNS:
                shutil.copy2(f, WIKI_ASSETS / f.name)
    # docs/screenshots/
    screenshots = DOCS / "screenshots"
    if screenshots.exists():
        dst_screenshots = WIKI_ASSETS / "screenshots"
        dst_screenshots.mkdir(parents=True, exist_ok=True)
        for f in screenshots.iterdir():
            if f.suffix.lower() in IMG_EXTS:
                shutil.copy2(f, dst_screenshots / f.name)


def copy_mermaid_diagrams():
    """Assemble les diagrammes Mermaid dans une page dediee."""
    mermaid_files = sorted(DOCS.glob("*.mmd"))
    if not mermaid_files:
        return
    dst = WIKI_DOCS / "architecture" / "diagrams.md"
    lines = ["# Diagrammes d'architecture\n\n"]
    for mmd in mermaid_files:
        name = mmd.stem.replace("mermaid_", "").replace("_", " ").title()
        content = mmd.read_text(encoding="utf-8", errors="replace").strip()
        lines.append("## " + name + "\n\n")
        lines.append("```mermaid\n")
        lines.append(content + "\n")
        lines.append("```\n\n")
    dst.write_text("".join(lines), encoding="utf-8")


def copy_bibliography():
    """Copie les papiers de doc_references/ vers research/bibliography/."""
    # Index files
    index_files = {
        "MANIFEST.md": ("research/bibliography/index.md", None),
        "INDEX_BY_DELTA.md": ("research/bibliography/by-delta.md", None),
        "GLOSSAIRE_MATHEMATIQUE.md": ("research/bibliography/glossaire.md", None),
    }
    for src_name, (dst_rel, title) in index_files.items():
        copy_md(DOC_REFS / src_name, WIKI_DOCS / dst_rel, title)

    # Papers by year/category
    for year_dir in sorted(DOC_REFS.iterdir()):
        if not year_dir.is_dir() or not year_dir.name.isdigit():
            continue
        for cat_dir in sorted(year_dir.iterdir()):
            if not cat_dir.is_dir():
                continue
            for md_file in sorted(cat_dir.glob("*.md")):
                rel = Path("research/bibliography") / year_dir.name / cat_dir.name / md_file.name
                copy_md(md_file, WIKI_DOCS / rel)


def copy_fiches_attaque():
    """Copie les fiches d'attaque .md."""
    fiches_dir = DOC_REFS / "fiches_attaque"
    if not fiches_dir.exists():
        return
    dst_base = WIKI_DOCS / "research" / "fiches-attaque"
    md_files = sorted(fiches_dir.glob("*.md"))
    if not md_files:
        # Generer un index vide
        (dst_base / "index.md").write_text(
            "# Fiches d'attaque\n\nAucune fiche .md disponible. Les fiches sont au format .docx.\n",
            encoding="utf-8",
        )
        return

    # Copier chaque fiche
    for md_file in md_files:
        copy_md(md_file, dst_base / md_file.name)

    # Generer index
    lines = ["# Fiches d'attaque\n\n"]
    lines.append("| Fiche | Fichier |\n|-------|--------|\n")
    for md_file in md_files:
        name = md_file.stem.replace("_", " ")
        lines.append("| " + name + " | [" + md_file.name + "](" + md_file.name + ") |\n")
    (dst_base / "index.md").write_text("".join(lines), encoding="utf-8")


def copy_discoveries():
    """Copie les decouvertes."""
    mapping = {
        "DISCOVERIES_INDEX.md": "research/discoveries/index.md",
        "CONJECTURES_TRACKER.md": "research/discoveries/conjectures.md",
        "TRIPLE_CONVERGENCE.md": "research/discoveries/triple-convergence.md",
        "THESIS_GAPS.md": "research/discoveries/gaps.md",
    }
    for src_name, dst_rel in mapping.items():
        copy_md(DISCOVERIES / src_name, WIKI_DOCS / dst_rel)

    # Copier les fichiers supplementaires
    for md in DISCOVERIES.glob("*.md"):
        if md.name not in mapping:
            copy_md(md, WIKI_DOCS / "research" / "discoveries" / md.name)


def copy_articles():
    """Copie les articles de recherche."""
    dst_base = WIKI_DOCS / "research" / "articles"
    md_files = sorted(ARTICLES.glob("*.md")) if ARTICLES.exists() else []
    if md_files:
        for md_file in md_files:
            copy_md(md_file, dst_base / md_file.name)
        # Index
        lines = ["# Articles\n\n"]
        for md_file in md_files:
            name = md_file.stem.replace("_", " ").title()
            lines.append("- [" + name + "](" + md_file.name + ")\n")
        (dst_base / "index.md").write_text("".join(lines), encoding="utf-8")
    else:
        (dst_base / "index.md").write_text(
            "# Articles\n\nAucun article disponible.\n", encoding="utf-8"
        )


def copy_staging():
    """Genere un resume du staging (sans copier tous les 176 fichiers)."""
    dst = WIKI_DOCS / "staging" / "index.md"
    lines = ["# Staging - Agents de recherche\n\n"]
    lines.append("Le dossier `_staging/` contient le travail des 9 agents specialises ")
    lines.append("du pipeline `bibliography-maintainer`.\n\n")
    lines.append("| Agent | Fichiers | Description |\n")
    lines.append("|-------|----------|-------------|\n")

    agent_descriptions = {
        "analyst": "Analyses individuelles des papiers (P001-P089)",
        "scientist": "Axes de recherche et rapports de decouverte",
        "cybersec": "Analyses de menaces et couverture defensive",
        "matheux": "Glossaire detaille et formules mathematiques",
        "whitehacker": "Playbooks red team et guides d'exploitation",
        "librarian": "Rapports d'organisation et validation",
        "collector": "Metadonnees et verification des papiers",
        "chunker": "Preparation des chunks RAG (JSONL)",
        "mathteacher": "Modules educatifs et quiz",
        "audit-these": "Verification structuree de la these",
        "memory": "Logs d'execution et suivi d'etat",
    }

    if STAGING.exists():
        for agent_dir in sorted(STAGING.iterdir()):
            if agent_dir.is_dir():
                count = len(list(agent_dir.glob("*")))
                desc = agent_descriptions.get(agent_dir.name, "Agent specialise")
                lines.append(
                    "| **" + agent_dir.name + "** | " + str(count) + " | " + desc + " |\n"
                )

    dst.write_text("".join(lines), encoding="utf-8")


def copy_prompts():
    """Copie les fiches d'aide des 99 templates de prompts."""
    prompts_dir = PROJECT_ROOT / "backend" / "prompts"
    dst_base = WIKI_DOCS / "prompts"
    dst_base.mkdir(parents=True, exist_ok=True)

    md_files = sorted(prompts_dir.glob("*.md"))
    for md_file in md_files:
        copy_md(md_file, dst_base / md_file.name)

    # Index
    lines = ["# Catalogue de prompts d'attaque\n\n"]
    lines.append("**" + str(len(md_files)) + " templates** documentes dans `backend/prompts/`.\n\n")
    lines.append("Chaque template dispose d'un fichier JSON (payload + metadonnees) ")
    lines.append("et d'un fichier MD (audit SVC, classification, analyse).\n\n")
    lines.append("| # | Template | Fichier |\n")
    lines.append("|---|----------|--------|\n")
    for md_file in md_files:
        num = md_file.stem.split("-")[0] if md_file.stem[0].isdigit() else "?"
        name = md_file.stem
        lines.append("| " + num + " | [" + name + "](" + md_file.name + ") | `" + md_file.name + "` |\n")
    (dst_base / "index.md").write_text("".join(lines), encoding="utf-8")


def copy_staging_detailed():
    """Copie le contenu detaille des agents de staging."""
    if not STAGING.exists():
        return

    agent_dirs = {
        "mathteacher": ("Mathematiques (7 modules)", "staging/mathteacher.md"),
        "scientist": ("Synthese scientifique", "staging/scientist.md"),
        "whitehacker": ("Red Team & exploitation", "staging/whitehacker.md"),
        "cybersec": ("Menaces & defenses", "staging/cybersec.md"),
        "matheux": ("Formules mathematiques", "staging/matheux.md"),
        "analyst": ("Analyses de papiers", "staging/analyst.md"),
    }

    for agent_name, (desc, dst_rel) in agent_dirs.items():
        agent_dir = STAGING / agent_name
        if not agent_dir.exists():
            continue
        md_files = sorted(agent_dir.glob("*.md"))
        if not md_files:
            continue

        dst = WIKI_DOCS / dst_rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        lines = ["# " + desc + " (" + agent_name + ")\n\n"]
        lines.append("**" + str(len(md_files)) + " fichiers** dans `_staging/" + agent_name + "/`\n\n")

        for md_file in md_files:
            # Lire le premier titre
            try:
                first_line = md_file.read_text(encoding="utf-8", errors="replace").split("\n")[0]
                if first_line.startswith("#"):
                    title = first_line.lstrip("#").strip()
                else:
                    title = md_file.stem
            except Exception:
                title = md_file.stem
            lines.append("- **" + title + "** (`" + md_file.name + "`)\n")

        dst.write_text("".join(lines), encoding="utf-8")


def copy_plans():
    """Copie les plans de design."""
    dst_base = WIKI_DOCS / "plans"
    plans_dir = DOCS / "plans"
    if not plans_dir.exists():
        (dst_base / "index.md").write_text(
            "# Plans d'implementation\n\nAucun plan disponible.\n", encoding="utf-8"
        )
        return

    md_files = sorted(plans_dir.glob("*.md"))
    for md_file in md_files:
        copy_md(md_file, dst_base / md_file.name)

    # Index
    lines = ["# Plans d'implementation\n\n"]
    lines.append("Documents de conception de l'architecture AEGIS.\n\n")
    for md_file in md_files:
        name = md_file.stem
        # Extraire la date et le titre
        parts = name.split("-", 3)
        if len(parts) >= 4:
            date = "-".join(parts[:3])
            title = parts[3].replace("-", " ").title()
            lines.append("- [" + title + "](" + md_file.name + ") (" + date + ")\n")
        else:
            lines.append("- [" + name + "](" + md_file.name + ")\n")
    (dst_base / "index.md").write_text("".join(lines), encoding="utf-8")


def copy_root_docs():
    """Copie les docs racine (architecture, redteam, etc.)."""
    # Architecture
    copy_md(
        PROJECT_ROOT / "AI_SYSTEM.md",
        WIKI_DOCS / "architecture" / "index.md",
    )
    copy_md(
        PROJECT_ROOT / "backend" / "README.md",
        WIKI_DOCS / "architecture" / "backend.md",
    )

    # Red Team Lab
    copy_md(DOCS / "REDTEAM_LAB_FR.md", WIKI_DOCS / "redteam-lab" / "index.md")
    copy_md(DOCS / "INTEGRATION_TRACKER.md", WIKI_DOCS / "redteam-lab" / "integration.md")

    # Research index
    guide = RESEARCH / "RESEARCH_ARCHIVE_GUIDE.md"
    if guide.exists():
        copy_md(guide, WIKI_DOCS / "research" / "index.md")
    else:
        (WIKI_DOCS / "research" / "index.md").write_text(
            "# Archive de recherche\n\nGuide non disponible.\n", encoding="utf-8"
        )

    # Research state
    state = RESEARCH / "RESEARCH_STATE.md"
    if state.exists():
        copy_md(state, WIKI_DOCS / "research" / "state.md")

    # Roadmap
    roadmap = PROJECT_ROOT / "ROADMAP.md"
    if roadmap.exists():
        copy_md(roadmap, WIKI_DOCS / "roadmap.md")
    else:
        (WIKI_DOCS / "roadmap.md").write_text(
            "# Roadmap\n\nRoadmap non disponible.\n", encoding="utf-8"
        )


def generate_scenarios_page():
    """Genere la page des scenarios d'attaque."""
    dst = WIKI_DOCS / "redteam-lab" / "scenarios.md"
    content = """# Scenarios d'attaque

## Les 4 scenarios principaux

| # | Scenario | Technique | MITRE ATT&CK |
|---|----------|-----------|--------------|
| 0 | **Baseline** | Fonctionnement normal, dossier HL7 intact | -- |
| 1 | **Poison Lent** | Modification subtile du dossier HL7 via PACS. L'IA recommande une tension de pince letale (injection de prompt indirecte) | T1565.001 |
| 2 | **Ransomware** | Prise de controle directe forcant `freeze_instruments()` -- instruments bloques | T1486 |
| 3 | **Defense Aegis** | Second Agent IA isole qui surveille et declenche un debat multi-rounds | T1059.009 |

## Architecture d'attaque

Le backend AEGIS dispose de **36 chaines d'attaque** et **102 templates** organises en pipeline :

1. **Reconnaissance** -- Analyse du system prompt et des capacites du modele cible
2. **Injection** -- Insertion du payload via le vecteur choisi (DPI, IPI, RAG, agent)
3. **Execution** -- Declenchement de l'action malveillante (tool call, exfiltration, manipulation)
4. **Audit** -- Mesure des metriques formelles (ASR, Sep(M), SVC 6D)

## Metriques formelles

- **ASR** (Attack Success Rate) -- Taux de reussite sur N >= 30 essais
- **Sep(M)** -- Score de separation (Zverev et al., ICLR 2025)
- **SVC** -- Score de Viabilite de Compromission sur 6 dimensions
- **P(detect)** -- Probabilite de detection par les defenses
- **Cosine drift** -- Derive semantique du modele compromis
"""
    dst.write_text(content, encoding="utf-8")


def update_nav_in_mkdocs_yml(loader_class=None):
    """Met a jour la navigation dans mkdocs.yml avec les papiers trouves."""
    mkdocs_yml = Path(__file__).resolve().parent / "mkdocs.yml"
    import yaml

    loader = loader_class or yaml.SafeLoader
    with open(mkdocs_yml, "r", encoding="utf-8") as f:
        config = yaml.load(f, Loader=loader)

    # Construire la section bibliographie dynamique
    bib_nav = [
        {"Bibliographie": "research/bibliography/index.md"},
        {"Par couche delta": "research/bibliography/by-delta.md"},
        {"Glossaire": "research/bibliography/glossaire.md"},
    ]

    for year_dir in sorted((WIKI_DOCS / "research" / "bibliography").iterdir()):
        if not year_dir.is_dir() or not year_dir.name.isdigit():
            continue
        year_items = []
        for cat_dir in sorted(year_dir.iterdir()):
            if not cat_dir.is_dir():
                continue
            cat_items = []
            for md_file in sorted(cat_dir.glob("*.md")):
                rel = "research/bibliography/" + year_dir.name + "/" + cat_dir.name + "/" + md_file.name
                label = md_file.stem
                cat_items.append({label: rel})
            if cat_items:
                cat_name = cat_dir.name.replace("_", " ").title()
                year_items.append({cat_name: cat_items})
        if year_items:
            bib_nav.append({year_dir.name: year_items})

    # On ne reecrit pas le YAML automatiquement pour eviter de casser le formatage.
    # A la place, on genere un fichier nav_generated.yml de reference.
    nav_file = Path(__file__).resolve().parent / "nav_generated.yml"
    try:
        with open(nav_file, "w", encoding="utf-8") as f:
            yaml.dump(bib_nav, f, default_flow_style=False, allow_unicode=True)
        print("[OK] Navigation generee dans nav_generated.yml")
    except Exception as e:
        print("[WARN] Erreur generation nav: " + str(e))


def main():
    print("=== AEGIS Wiki Builder ===\n")

    print("[1/10] Nettoyage des fichiers generes...")
    clean_docs()

    print("[2/10] Copie des images...")
    copy_images()

    print("[3/10] Assemblage des diagrammes Mermaid...")
    copy_mermaid_diagrams()

    print("[4/10] Copie des documents racine...")
    copy_root_docs()

    print("[5/10] Generation de la page scenarios...")
    generate_scenarios_page()

    print("[6/10] Copie de la bibliographie...")
    copy_bibliography()

    print("[7/10] Copie des fiches d'attaque...")
    copy_fiches_attaque()

    print("[8/10] Copie des decouvertes...")
    copy_discoveries()

    print("[9/12] Copie des articles et staging...")
    copy_articles()
    copy_staging()
    copy_staging_detailed()
    copy_plans()

    print("[10/12] Copie des prompts backend...")
    copy_prompts()

    print("[11/12] Generation de la navigation dynamique...")
    try:
        import yaml

        class SafeLoaderIgnoreUnknown(yaml.SafeLoader):
            pass

        SafeLoaderIgnoreUnknown.add_multi_constructor(
            "tag:yaml.org,2002:python/",
            lambda loader, suffix, node: None,
        )
        update_nav_in_mkdocs_yml(SafeLoaderIgnoreUnknown)
    except ImportError:
        print("[WARN] PyYAML non installe, navigation dynamique ignoree")
    except Exception as e:
        print("[WARN] Navigation dynamique non generee: " + str(e))

    # Stats
    total_md = len(list(WIKI_DOCS.rglob("*.md")))
    total_img = len(list(WIKI_ASSETS.rglob("*"))) if WIKI_ASSETS.exists() else 0
    print("\n=== Build termine ===")
    print("Pages: " + str(total_md))
    print("Images: " + str(total_img))
    print("\nPour tester: cd wiki && mkdocs serve")


if __name__ == "__main__":
    main()
