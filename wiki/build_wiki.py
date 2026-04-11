#!/usr/bin/env python3
"""
build_wiki.py — Synchronise les sources .md du projet vers wiki/docs/
Execute AVANT mkdocs build pour assembler le wiki a partir des fichiers source.
"""

import os
import shutil
import re
from pathlib import Path

# Racine du projet (parent de wiki/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
WIKI_DOCS = Path(__file__).resolve().parent / "docs"
WIKI_ASSETS = WIKI_DOCS / "assets" / "images"
WIKI_PDF_ASSETS = WIKI_DOCS / "assets" / "pdfs"
WIKI_DOCX_ASSETS = WIKI_DOCS / "assets" / "docx"

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
        WIKI_DOCS / "experiments" / "retex",
        WIKI_DOCS / "experiments" / "reports",
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
    # Transformer les liens literature_for_rag/ en liens vers assets/pdfs/ (accessibles dans le wiki)
    try:
        _rel_pdf = Path(os.path.relpath(WIKI_PDF_ASSETS, dst.parent)).as_posix()
    except ValueError:
        _rel_pdf = "../assets/pdfs"
    content = re.sub(
        r'\[([^\]]*)\]\([^)]*literature_for_rag/([^)]+)\)',
        lambda m: '[' + m.group(1) + '](' + _rel_pdf + '/' + m.group(2) + ')',
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


def generate_publications_page(copied_docx: list[str]) -> None:
    """Genere une page /publications/index.md centralisee.

    Liste organisee par categorie avec liens de telechargement direct vers :
    - Chapitres de these (.docx)
    - Notes academiques (.docx)
    - Pitch et projet doctoral (.docx)
    - S1-ISI5 cours cyber (.docx)
    - PDFs bibliographiques (159)
    - Articles markdown (55)
    - Fiches d'attaque (97)
    - Analyses Keshav (200)

    Tous les liens sont **telechargeables directement** sans acces au repo.
    """
    dst = WIKI_DOCS / "publications" / "index.md"
    dst.parent.mkdir(parents=True, exist_ok=True)

    # Categorize DOCX by filename prefix
    categories: dict[str, list[str]] = {
        "Chapitres de these": [],
        "Projet doctoral & pitch": [],
        "Notes academiques": [],
        "Cours cyber S1-ISI5": [],
        "Addendums & drafts": [],
        "Autres documents": [],
    }
    for name in copied_docx:
        lower = name.lower()
        if lower.startswith("chapitre_"):
            categories["Chapitres de these"].append(name)
        elif "pitch" in lower or "projet_doctoral" in lower:
            categories["Projet doctoral & pitch"].append(name)
        elif "note_academique" in lower or "note_densite" in lower:
            categories["Notes academiques"].append(name)
        elif lower.startswith("s1-isi5"):
            categories["Cours cyber S1-ISI5"].append(name)
        elif "addendum" in lower or "delta0_formal" in lower or "analyse_zhang" in lower:
            categories["Addendums & drafts"].append(name)
        else:
            categories["Autres documents"].append(name)

    # Count PDFs available
    pdf_count = 0
    if WIKI_PDF_ASSETS.exists():
        pdf_count = len(list(WIKI_PDF_ASSETS.glob("*.pdf")))

    lines = [
        "# Publications & Documents de recherche\n\n",
        "!!! abstract \"Tout est telechargeable directement\"\n",
        "    Les chercheurs externes **n'ont pas acces au repository git**. Cette page centralise "
        "**tous les livrables** de la these AEGIS (ENS, 2026) pour un telechargement direct depuis "
        "le wiki : chapitres .docx, PDFs bibliographiques, articles markdown, fiches d'attaque, "
        "analyses Keshav des 130+ papers, rapports experimentaux, cours de mathematiques.\n\n",
        "## Statistiques des ressources publiees\n\n",
        "| Type | Nombre | Format | Acces |\n|------|-------:|--------|-------|\n",
        "| Chapitres de these | " + str(len(categories["Chapitres de these"])) + " | .docx | [→ ci-dessous](#chapitres-de-these) |\n",
        "| Projet doctoral / pitch | " + str(len(categories["Projet doctoral & pitch"])) + " | .docx | [→](#projet-doctoral-pitch) |\n",
        "| Notes academiques | " + str(len(categories["Notes academiques"])) + " | .docx | [→](#notes-academiques) |\n",
        "| Cours cyber S1-ISI5 | " + str(len(categories["Cours cyber S1-ISI5"])) + " | .docx | [→](#cours-cyber-s1-isi5) |\n",
        "| PDFs bibliographiques | " + str(pdf_count) + " | .pdf | [→ Liste complete](#pdfs-bibliographiques) |\n",
        "| Articles markdown | 55+ | .md | [→ Articles](../research/articles/index.md) |\n",
        "| Fiches d'attaque | 97+ | .md | [→ Fiches](../research/fiches-attaque/index.md) |\n",
        "| Analyses Keshav papers | 200+ | .md | [→ Analyst](../staging/analyst/index.md) |\n",
        "| Cours de math (8 modules) | 15 | .md | [→ Mathteacher](../staging/mathteacher/index.md) |\n",
        "| Rapports matheux (formules) | 10 | .md | [→ Matheux](../staging/matheux/index.md) |\n",
        "| Axes scientist | 25 | .md | [→ Scientist](../staging/scientist/index.md) |\n",
        "| Playbooks whitehacker | 7 | .md | [→ Whitehacker](../staging/whitehacker/index.md) |\n",
        "| Analyses cybersec | 7 | .md | [→ Cybersec](../staging/cybersec/index.md) |\n",
        "| Briefings directeur | 3 | .md | [→ RETEX](../experiments/retex/index.md) |\n",
        "\n---\n\n",
    ]

    # DOCX sections with download links
    def _pretty(name: str) -> str:
        stem = name.rsplit(".", 1)[0]
        return stem.replace("_", " ").replace("-", " ")

    def _section(title: str, slug: str, names: list[str], description: str) -> str:
        if not names:
            return ""
        out = "## " + title + "\n\n"
        out += description + "\n\n"
        out += "| Document | Telecharger |\n|----------|:-----------:|\n"
        for n in sorted(names):
            out += "| " + _pretty(n) + " | [:material-download: " + n + "](../assets/docx/" + n + ") |\n"
        out += "\n"
        return out

    lines.append(_section(
        "Chapitres de these",
        "chapitres-de-these",
        categories["Chapitres de these"],
        "Chapitres rediges du manuscrit doctoral. Versions FR, EN, PT selon disponibilite. "
        "Les drafts officiels restent en .docx (formatage fin + commentaires).",
    ))

    lines.append(_section(
        "Projet doctoral & pitch",
        "projet-doctoral-pitch",
        categories["Projet doctoral & pitch"],
        "Documents de cadrage de la these : projet doctoral valide par le directeur, "
        "pitch officiel presente a l'ENS.",
    ))

    lines.append(_section(
        "Notes academiques",
        "notes-academiques",
        categories["Notes academiques"],
        "Notes thematiques standalones produites pendant la recherche (AI for Americans First, "
        "Densite Cognitive Huang, etc.). Chacune est un travail autonome publiable independamment "
        "du manuscrit principal.",
    ))

    lines.append(_section(
        "Cours cyber S1-ISI5",
        "cours-cyber-s1-isi5",
        categories["Cours cyber S1-ISI5"],
        "Support de cours S1-ISI5 *AI and Cybersecurity* produit dans le cadre de l'enseignement. "
        "Multi-versions (FR v6, EN v6, PT v7) + adaptations pedagogiques.",
    ))

    lines.append(_section(
        "Addendums & drafts",
        "addendums-drafts",
        categories["Addendums & drafts"],
        "Addendums de chapitres, drafts formels, analyses comparatives (vs Zhang 2025).",
    ))

    lines.append(_section(
        "Autres documents",
        "autres-documents",
        categories["Autres documents"],
        "Documents divers publies dans le cadre de la these.",
    ))

    # PDFs section
    lines.append("## PDFs bibliographiques\n\n")
    lines.append(
        "**" + str(pdf_count) + " PDFs** des papers P001-P130 du corpus AEGIS + 17 papers "
        "methodologiques (M001-M017 sur les AI scientists) sont disponibles en telechargement "
        "direct.\n\n"
    )
    lines.append(
        "Chaque PDF est accessible via `../assets/pdfs/{filename}.pdf`. "
        "Pour la liste complete avec titre + annee + categorie, consulter la "
        "[bibliographie](../research/bibliography/index.md) ou la "
        "[classification par couche δ](../research/bibliography/by-delta.md).\n\n"
    )
    lines.append("### Recherche semantique\n\n")
    lines.append(
        "Pour une recherche semantique **en langage naturel** dans le fulltext de tous les "
        "PDFs indexes, voir la [Recherche semantique live](../semantic-search/index.md) (necessite "
        "que le backend AEGIS soit lance localement sur :8042).\n\n"
    )

    lines.append("---\n\n")
    lines.append("## Navigation alternative\n\n")
    lines.append(
        "- [Manuscrit — index general](../manuscript/index.md) : plan complet des chapitres avec maturite\n"
        "- [Articles markdown](../research/articles/index.md) : papers + notes au format web\n"
        "- [Fiches d'attaque](../research/fiches-attaque/index.md) : 97 fiches classifiees par SVC + δ\n"
        "- [Analyses Keshav des 130+ papers](../staging/analyst/index.md)\n"
        "- [Cours de mathematiques complet](../staging/mathteacher/index.md)\n"
        "- [Glossaire F01-F72](../glossaire/index.md)\n"
    )

    dst.write_text("".join(lines), encoding="utf-8")


def copy_docx_publications():
    """Copie tous les DOCX du manuscript vers wiki/docs/assets/docx/.

    Les chercheurs n'ont pas acces au git — les 21 chapitres .docx
    (Chapitre II Methodologie, Chapitre VI Africa, Pitch Doctorat Naccache,
    Projet Doctoral v8, Note Academique, S1-ISI5 cyber, etc.) doivent etre
    telechargeables depuis le wiki.

    Source : research_archive/manuscript/*.docx
    Dest : wiki/docs/assets/docx/ (flat, basename conserve)
    Exclusion : fichiers temporaires ~$*.docx
    """
    manuscript_dir = RESEARCH / "manuscript"
    if not manuscript_dir.exists():
        print("  [WARN] research_archive/manuscript/ introuvable")
        return []
    WIKI_DOCX_ASSETS.mkdir(parents=True, exist_ok=True)
    count = 0
    copied = []
    for docx in sorted(manuscript_dir.glob("*.docx")):
        if docx.name.startswith("~$"):
            continue
        target = WIKI_DOCX_ASSETS / docx.name
        try:
            shutil.copy2(docx, target)
            copied.append(docx.name)
            count += 1
        except Exception as e:
            print("  [WARN] Echec copie " + docx.name + ": " + str(e))
    print("  " + str(count) + " DOCX copies vers assets/docx/")
    return copied


def copy_pdfs():
    """Copie TOUS les PDFs de literature_for_rag/ (y compris sous-dossiers) vers wiki/docs/assets/pdfs/.

    Previously used glob('*.pdf') which missed subdirectories like methodology/.
    Now uses rglob('*.pdf') to walk the entire tree. Files keep flat names
    (basename only) to simplify link rewriting — if two PDFs have the same
    name in different subdirs, the second one overwrites the first (rare).
    """
    lit_dir = RESEARCH / "literature_for_rag"
    if not lit_dir.exists():
        print("  [WARN] literature_for_rag/ introuvable")
        return
    WIKI_PDF_ASSETS.mkdir(parents=True, exist_ok=True)
    count = 0
    seen_names = set()
    for pdf in sorted(lit_dir.rglob("*.pdf")):
        if pdf.name in seen_names:
            print("  [WARN] duplicate PDF name (skipping): " + pdf.name)
            continue
        seen_names.add(pdf.name)
        shutil.copy2(pdf, WIKI_PDF_ASSETS / pdf.name)
        count += 1
    print("  " + str(count) + " PDFs copies vers assets/pdfs/")


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
    """Copie les 97 fiches d'attaque .md + genere un index classifie (SVC + delta).

    Les fiches source se trouvent dans deux emplacements possibles :
    - research_archive/doc_references/fiches_attaque/*.md (nouveau)
    - research_archive/fiches_attaque/*.md (ancien)
    Les deux sont fusionnes, avec priorite au nouveau si doublon.
    """
    dst_base = WIKI_DOCS / "research" / "fiches-attaque"
    dst_base.mkdir(parents=True, exist_ok=True)

    candidates = [
        DOC_REFS / "fiches_attaque",
        RESEARCH / "fiches_attaque",
    ]

    seen: dict[str, Path] = {}
    for d in candidates:
        if d.exists():
            for md in d.glob("FICHE_*.md"):
                if md.name not in seen:
                    seen[md.name] = md

    md_files = sorted(seen.values(), key=lambda p: p.name)
    if not md_files:
        (dst_base / "index.md").write_text(
            "# Fiches d'attaque\n\nAucune fiche disponible.\n",
            encoding="utf-8",
        )
        return

    # Copy each file (with link rewriting via copy_md)
    fiches = []
    for md_file in md_files:
        copy_md(md_file, dst_base / md_file.name)
        meta = _parse_fiche_metadata(md_file)
        meta["file"] = md_file.name
        fiches.append(meta)

    # Build classified index
    total = len(fiches)
    with_svc = sum(1 for f in fiches if f["svc"] is not None)
    with_delta = sum(1 for f in fiches if f["target_delta"])
    by_delta: dict[str, list] = {}
    for f in fiches:
        d = f["target_delta"] or "unclassified"
        by_delta.setdefault(d, []).append(f)

    lines = [
        "# Fiches d'attaque completes\n\n",
        "!!! abstract \"En une phrase\"\n",
        "    **" + str(total) + " fiches d'analyse** produites par le pipeline `/fiche-attaque` "
        "(3 agents Sonnet : SCIENTIST + MATH + CYBER-LIBRARIAN). Chaque fiche contient 11 sections "
        "formelles + 2 annexes (threat model, preuves mathematiques, mapping δ⁰-δ³, MITRE ATT&CK, "
        "OWASP LLM, references these).\n\n",
        "## Statistiques\n\n",
        "| Metrique | Valeur |\n|----------|-------:|\n",
        "| Fiches totales | **" + str(total) + "** |\n",
        "| Avec score SVC extrait | " + str(with_svc) + " |\n",
        "| Avec couche δ extraite | " + str(with_delta) + " |\n",
        "\n",
    ]

    # Group by delta (δ⁰ → δ³ → unclassified)
    lines.append("## Classement par couche δ\n\n")
    for d in ("δ⁰", "δ¹", "δ²", "δ³", "unclassified"):
        bucket = by_delta.get(d, [])
        if not bucket:
            continue
        title = "Non classifiees" if d == "unclassified" else d
        lines.append("### " + title + " (" + str(len(bucket)) + " fiches)\n\n")
        lines.append(
            "| # | Titre | SVC | Categorie | Conjecture | Fiche |\n"
            "|:-:|-------|:---:|-----------|:----------:|-------|\n"
        )
        # Sort within bucket by descending SVC, then by num
        def _sort_key(x):
            return (-(x["svc"] or 0), x["num"] or 9999)
        for f in sorted(bucket, key=_sort_key):
            num = "#" + str(f["num"]) if f["num"] is not None else "—"
            svc = "**" + ("%.1f" % f["svc"]) + "**" if f["svc"] is not None else "—"
            cat = "`" + f["category"] + "`" if f["category"] else "—"
            conj = f["conjecture"] or "—"
            link = "[" + (f["title"][:60] + ("…" if len(f["title"]) > 60 else "")) + "](" + f["file"] + ")"
            lines.append(
                "| " + num + " | " + link + " | " + svc + " | " + cat + " | "
                + conj + " | `" + f["file"] + "` |\n"
            )
        lines.append("\n")

    # Full alphabetical list at the end
    lines.append("## Liste alphabetique complete\n\n")
    for f in sorted(fiches, key=lambda x: x["name"]):
        num = "#" + str(f["num"]) if f["num"] is not None else "—"
        lines.append("- " + num + " [" + f["title"] + "](" + f["file"] + ")\n")

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


def copy_experiments():
    """Copie les rapports experimentaux de research_archive/experiments/ vers wiki/docs/experiments/reports/."""
    EXPERIMENTS_SRC = RESEARCH / "experiments"
    if not EXPERIMENTS_SRC.exists():
        return

    reports_dir = WIKI_DOCS / "experiments" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)

    md_files = sorted(EXPERIMENTS_SRC.glob("*.md"))
    for md in md_files:
        copy_md(md, reports_dir / md.name)

    # Generate index
    lines = [
        "# Experiment Reports\n\n",
        "Rapports experimentaux generes par les campagnes AEGIS.\n\n",
        "| Rapport | Description |\n",
        "|---------|-------------|\n",
    ]
    labels = {
        "EXPERIMENT_REPORT_THESIS_001.md": "THESIS-001 — HyDE/XML Bimodality (N=1200, 40 chains)",
        "EXPERIMENT_REPORT_THESIS_002.md": "THESIS-002 — Cross-model 70B (Groq)",
        "EXPERIMENT_REPORT_THESIS_003.md": "THESIS-003 — Qwen family-specific",
        "EXPERIMENT_REPORT_TC001.md": "TC-001 — Triple Convergence v1",
        "EXPERIMENT_REPORT_TC001_v2.md": "TC-001 v2 — Triple Convergence (corrected)",
        "EXPERIMENT_REPORT_TC002.md": "TC-002 — Additive Convergence (antagonistic)",
        "EXPERIMENT_REPORT_CROSS_MODEL.md": "Cross-model validation",
    }
    for md in md_files:
        label = labels.get(md.name, md.stem.replace("_", " "))
        lines.append("| [" + label + "](" + md.name + ") | |\n")

    (reports_dir / "index.md").write_text("".join(lines), encoding="utf-8")
    print("  " + str(len(md_files)) + " rapports experimentaux copies vers experiments/reports/")


def copy_articles():
    """Copie articles/ + manuscript/*.md vers wiki/research/articles/.

    Sources agregees :
    - research_archive/articles/*.md (articles standalone)
    - research_archive/manuscript/*.md (notes academiques + drafts)

    Le dossier articles/ du staging produit principalement 1-2 fichiers,
    mais manuscript/ contient ~20 markdown files importants (notes,
    peer-preservation, theory, retex, academic_notes_2023_2026, etc.)
    """
    dst_base = WIKI_DOCS / "research" / "articles"
    dst_base.mkdir(parents=True, exist_ok=True)

    all_files: dict[str, Path] = {}

    if ARTICLES.exists():
        for md in ARTICLES.glob("*.md"):
            all_files[md.name] = md

    manuscript_dir = RESEARCH / "manuscript"
    if manuscript_dir.exists():
        for md in manuscript_dir.glob("*.md"):
            # Avoid overwriting articles/ with manuscript/ (priority: articles/)
            if md.name not in all_files:
                all_files[md.name] = md

    if not all_files:
        (dst_base / "index.md").write_text(
            "# Articles\n\nAucun article disponible.\n", encoding="utf-8"
        )
        return

    # Copy each file with link rewriting
    for fname in sorted(all_files.keys()):
        src = all_files[fname]
        copy_md(src, dst_base / fname)

    # Build index
    lines = [
        "# Articles de recherche + notes academiques\n\n",
        "!!! abstract \"En une phrase\"\n",
        "    **" + str(len(all_files)) + " documents** markdown agrees depuis `research_archive/articles/` "
        "(papers publiables) et `research_archive/manuscript/` (notes academiques, drafts de chapitres, "
        "theories en cours). Format lecture web — les versions .docx finales sont dans "
        "[Publications](../../publications/index.md).\n\n",
        "## Liste complete\n\n",
    ]

    def _pretty_name(stem: str) -> str:
        return stem.replace("_", " ").replace("-", " ")

    # Categorize by prefix/topic for readability
    categories: dict[str, list] = {
        "Formal & frameworks": [],
        "Notes academiques": [],
        "RETEX & protocols": [],
        "Articles publiables": [],
        "Autres": [],
    }
    for fname in sorted(all_files.keys()):
        stem = Path(fname).stem
        lower = stem.lower()
        if "formal" in lower or "framework" in lower or "protocol" in lower:
            categories["Formal & frameworks"].append(fname)
        elif "note_academique" in lower or "academic_notes" in lower:
            categories["Notes academiques"].append(fname)
        elif "retex" in lower or "critique" in lower or "weakness" in lower:
            categories["RETEX & protocols"].append(fname)
        elif "article" in lower or "linkedin" in lower or "paper" in lower:
            categories["Articles publiables"].append(fname)
        else:
            categories["Autres"].append(fname)

    for cat_name, items in categories.items():
        if not items:
            continue
        lines.append("### " + cat_name + " (" + str(len(items)) + ")\n\n")
        for fname in items:
            stem = Path(fname).stem
            lines.append("- [" + _pretty_name(stem) + "](" + fname + ")\n")
        lines.append("\n")

    (dst_base / "index.md").write_text("".join(lines), encoding="utf-8")


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


def _parse_prompt_metadata(md_path: Path) -> dict:
    """Extrait les metadonnees forge d'un fichier backend/prompts/*.md.

    Format attendu (Audit AEGIS) :
        # Title
        ## AEGIS Audit - SVC Score: X.Y / 6
        ### Classification
        | Field | Value |
        | Category | `injection` |
        | Target Layer | `δ¹` (...) |
        | Conjecture | C1 — ... |
        | Chain ID | — |
        | MITRE ATT&CK | TXXXX |

    Returns dict {num, name, title, svc, target_delta, category,
                  conjecture, chain, mitre, fiche_id}
    """
    meta = {
        "num": None,
        "name": md_path.stem,
        "title": md_path.stem.replace("-", " ").replace("_", " "),
        "svc": None,
        "target_delta": None,
        "category": None,
        "conjecture": None,
        "chain": None,
        "mitre": None,
        "fiche_id": None,
    }
    # Extract numeric prefix: "01-..." -> 1, "98-..." -> 98
    m_num = re.match(r"^(\d+)[-_]", md_path.stem)
    if m_num:
        try:
            meta["num"] = int(m_num.group(1))
        except ValueError:
            pass

    try:
        content = md_path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return meta

    # Title from first H1
    first_h1 = re.search(r"^# (.+)$", content, flags=re.MULTILINE)
    if first_h1:
        meta["title"] = first_h1.group(1).strip()

    # SVC score: "SVC Score: 1.5 / 6" or "SVC global | 3.5 / 6"
    m_svc = re.search(r"SVC[^:|]*[:|]\s*([\d.]+)\s*/\s*6", content)
    if m_svc:
        try:
            meta["svc"] = float(m_svc.group(1))
        except ValueError:
            pass

    # Target Layer: "| Target Layer | `δ¹` (...)" or "Couche ciblee | **δ¹**"
    m_delta = re.search(
        r"(?:Target Layer|Couche ciblee)\s*\|\s*(?:\*\*)?`?(δ[⁰¹²³]+)",
        content,
    )
    if m_delta:
        meta["target_delta"] = m_delta.group(1)
    else:
        # Fallback: any `δ⁰/δ¹/δ²/δ³` in the first 30 lines
        head = "\n".join(content.splitlines()[:30])
        m_delta2 = re.search(r"(δ[⁰¹²³])", head)
        if m_delta2:
            meta["target_delta"] = m_delta2.group(1)

    # Category
    m_cat = re.search(r"Category(?:rie)?\s*\|\s*`?([a-zA-Z_]+)", content)
    if m_cat:
        meta["category"] = m_cat.group(1)

    # Conjecture
    m_conj = re.search(r"Conjecture\s*\|\s*(C\d(?:[^\n|]*)?)", content)
    if m_conj:
        meta["conjecture"] = m_conj.group(1).strip()

    # Chain ID
    m_chain = re.search(r"Chain ID\s*\|\s*`?([a-zA-Z_][\w_]*)`?", content)
    if m_chain and m_chain.group(1) != "—":
        meta["chain"] = m_chain.group(1)

    # MITRE
    m_mitre = re.search(r"MITRE[^|]*\|\s*([^\n|]+)", content)
    if m_mitre:
        meta["mitre"] = m_mitre.group(1).strip().rstrip("|").strip()

    return meta


def _parse_fiche_metadata(md_path: Path) -> dict:
    """Extrait les metadonnees d'une fiche d'attaque FICHE_XX_NAME.md."""
    meta = {
        "num": None,
        "name": md_path.stem,
        "title": md_path.stem.replace("_", " "),
        "svc": None,
        "target_delta": None,
        "category": None,
        "conjecture": None,
    }
    # Extract FICHE_XX
    m_num = re.match(r"^FICHE_(\d+)_", md_path.stem)
    if m_num:
        try:
            meta["num"] = int(m_num.group(1))
        except ValueError:
            pass

    try:
        content = md_path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return meta

    first_h1 = re.search(r"^# (.+)$", content, flags=re.MULTILINE)
    if first_h1:
        meta["title"] = first_h1.group(1).strip()

    m_svc = re.search(r"SVC (?:global|[tT]otal)\s*\|\s*\*?\*?([\d.]+)\s*/\s*6", content)
    if m_svc:
        try:
            meta["svc"] = float(m_svc.group(1))
        except ValueError:
            pass

    m_delta = re.search(
        r"Couche ciblee\s*\|\s*\*?\*?(δ[⁰¹²³]+)",
        content,
    )
    if m_delta:
        meta["target_delta"] = m_delta.group(1)

    m_cat = re.search(r"Categorie\s*\|\s*`?([a-zA-Z_]+)", content)
    if m_cat:
        meta["category"] = m_cat.group(1)

    m_conj = re.search(r"Conjecture\s*\|\s*(C\d(?:[^\n|]*)?)", content)
    if m_conj:
        meta["conjecture"] = m_conj.group(1).strip()

    return meta


def copy_prompts():
    """Copie les 99 templates de prompts et genere un catalogue classe.

    Generates:
    - wiki/docs/prompts/{nom}.md (copie de chaque fichier source)
    - wiki/docs/prompts/index.md (catalogue principal classe par SVC + delta)
    - wiki/docs/prompts/by-delta.md (classification par couche δ⁰-δ³)
    - wiki/docs/prompts/by-svc.md (classification par score SVC decroissant)
    """
    prompts_dir = PROJECT_ROOT / "backend" / "prompts"
    dst_base = WIKI_DOCS / "prompts"
    dst_base.mkdir(parents=True, exist_ok=True)

    # Collect all .md files with metadata parsed
    md_files = sorted(prompts_dir.glob("*.md"))
    prompts = []
    for md_file in md_files:
        # Skip meta files
        if md_file.name in ("INDEX.md", "LLM_PROVIDERS_README.md"):
            continue
        copy_md(md_file, dst_base / md_file.name)
        meta = _parse_prompt_metadata(md_file)
        meta["file"] = md_file.name
        prompts.append(meta)

    # Also build a fiche lookup: num -> fiche filename
    fiches_dir = DOC_REFS / "fiches_attaque"
    fiche_lookup = {}
    if fiches_dir.exists():
        for f in fiches_dir.glob("FICHE_*.md"):
            m = re.match(r"^FICHE_(\d+)_", f.stem)
            if m:
                try:
                    fiche_lookup[int(m.group(1))] = f.stem
                except ValueError:
                    pass

    # Enrich: link each prompt to its fiche if number matches
    for p in prompts:
        if p["num"] is not None and p["num"] in fiche_lookup:
            p["fiche_id"] = fiche_lookup[p["num"]]

    def _row(p):
        num = str(p["num"]) if p["num"] is not None else "?"
        svc = "**" + ("%.1f" % p["svc"]) + "**" if p["svc"] is not None else "—"
        delta = p["target_delta"] or "—"
        cat = "`" + p["category"] + "`" if p["category"] else "—"
        conj = p["conjecture"] or "—"
        chain = "`" + p["chain"] + "`" if p["chain"] else "—"
        title = p["title"]
        link = "[" + p["name"] + "](" + p["file"] + ")"
        fiche_link = (
            "[FICHE " + str(p["num"]) + "](../research/fiches-attaque/" + p["fiche_id"] + ".md)"
            if p["fiche_id"]
            else "—"
        )
        return (
            "| " + num + " | " + title + " | " + svc + " | " + delta + " | " + cat
            + " | " + conj + " | " + chain + " | " + link + " | " + fiche_link + " |\n"
        )

    # ==== 1. Catalogue principal ====
    total = len(prompts)
    with_svc = sum(1 for p in prompts if p["svc"] is not None)
    with_delta = sum(1 for p in prompts if p["target_delta"])
    with_fiche = sum(1 for p in prompts if p["fiche_id"])
    by_delta = {}
    for p in prompts:
        d = p["target_delta"] or "unclassified"
        by_delta.setdefault(d, 0)
        by_delta[d] += 1

    lines = [
        "# Catalogue de prompts d'attaque\n\n",
        "!!! abstract \"En une phrase\"\n",
        "    **" + str(total) + " templates** d'attaque classifies par couche δ⁰-δ³, score SVC "
        "6 dimensions, et famille MITRE. Chaque template est lie a sa fiche d'analyse complete "
        "quand elle existe.\n\n",
        "## Statistiques\n\n",
        "| Metrique | Valeur |\n|----------|-------:|\n",
        "| Templates documentes | **" + str(total) + "** |\n",
        "| Avec score SVC | " + str(with_svc) + " (" + str(int(100 * with_svc / max(total, 1))) + "%) |\n",
        "| Avec couche δ ciblee | " + str(with_delta) + " |\n",
        "| Avec fiche d'analyse complete | " + str(with_fiche) + " |\n",
        "\n### Distribution par couche δ\n\n",
        "| Couche | # templates |\n|:------:|:-----------:|\n",
    ]
    for d in ("δ⁰", "δ¹", "δ²", "δ³", "unclassified"):
        if d in by_delta:
            lines.append("| " + d + " | " + str(by_delta[d]) + " |\n")

    lines.append("\n## Vues alternatives\n\n")
    lines.append("- [Classement par couche δ](by-delta.md)\n")
    lines.append("- [Classement par score SVC](by-svc.md)\n")
    lines.append("- [Fiches d'attaque completes](../research/fiches-attaque/index.md)\n\n")

    lines.append("## Catalogue complet (ordre numerique)\n\n")
    lines.append(
        "| # | Titre | SVC | δ | Categorie | Conjecture | Chain | Fichier | Fiche |\n"
        "|:-:|-------|:---:|:-:|-----------|:----------:|:-----:|---------|:-----:|\n"
    )
    for p in sorted(prompts, key=lambda x: x["num"] if x["num"] is not None else 9999):
        lines.append(_row(p))

    (dst_base / "index.md").write_text("".join(lines), encoding="utf-8")

    # ==== 2. By delta layer ====
    lines = [
        "# Prompts classes par couche δ⁰-δ³\n\n",
        "Classification des " + str(total) + " templates selon la couche de defense ciblee.\n\n",
    ]
    for d in ("δ⁰", "δ¹", "δ²", "δ³"):
        bucket = [p for p in prompts if p["target_delta"] == d]
        if not bucket:
            continue
        lines.append("## " + d + " (" + str(len(bucket)) + " templates)\n\n")
        lines.append(
            "| # | Titre | SVC | Categorie | Conjecture | Chain | Fichier | Fiche |\n"
            "|:-:|-------|:---:|-----------|:----------:|:-----:|---------|:-----:|\n"
        )
        for p in sorted(bucket, key=lambda x: -(x["svc"] or 0)):
            svc = "**" + ("%.1f" % p["svc"]) + "**" if p["svc"] is not None else "—"
            cat = "`" + p["category"] + "`" if p["category"] else "—"
            conj = p["conjecture"] or "—"
            chain = "`" + p["chain"] + "`" if p["chain"] else "—"
            num = str(p["num"]) if p["num"] is not None else "?"
            link = "[" + p["name"] + "](" + p["file"] + ")"
            fiche_link = (
                "[FICHE " + str(p["num"]) + "](../research/fiches-attaque/" + p["fiche_id"] + ".md)"
                if p["fiche_id"]
                else "—"
            )
            lines.append(
                "| " + num + " | " + p["title"] + " | " + svc + " | " + cat + " | "
                + conj + " | " + chain + " | " + link + " | " + fiche_link + " |\n"
            )
        lines.append("\n")

    unclass = [p for p in prompts if not p["target_delta"]]
    if unclass:
        lines.append("## Non classifies (" + str(len(unclass)) + " templates)\n\n")
        lines.append("Ces templates n'ont pas encore de `target_delta` extrait.\n\n")
        for p in unclass:
            num = str(p["num"]) if p["num"] is not None else "?"
            lines.append("- #" + num + " [" + p["title"] + "](" + p["file"] + ")\n")

    (dst_base / "by-delta.md").write_text("".join(lines), encoding="utf-8")

    # ==== 3. By SVC score ====
    lines = [
        "# Prompts classes par score SVC decroissant\n\n",
        "Classement par **Score de Viabilite de Compromission** (Zhang et al. 2025, 6 dimensions).\n\n",
        "!!! note \"Calibration\"\n",
        "    - **Plancher** : #14 Medical Authority, SVC 1.0/6\n",
        "    - **Sous-plancher** : #18 Baseline Humanitarian, SVC 0.5/6 (exclu du catalogue)\n",
        "    - Les templates sans SVC sont en fin de liste.\n\n",
        "| # | SVC | Titre | δ | Categorie | Fichier | Fiche |\n"
        "|:-:|:---:|-------|:-:|-----------|---------|:-----:|\n",
    ]
    scored = [p for p in prompts if p["svc"] is not None]
    unscored = [p for p in prompts if p["svc"] is None]
    for p in sorted(scored, key=lambda x: -x["svc"]):
        svc = "**" + ("%.1f" % p["svc"]) + "**"
        delta = p["target_delta"] or "—"
        cat = "`" + p["category"] + "`" if p["category"] else "—"
        num = str(p["num"]) if p["num"] is not None else "?"
        link = "[" + p["name"] + "](" + p["file"] + ")"
        fiche_link = (
            "[FICHE " + str(p["num"]) + "](../research/fiches-attaque/" + p["fiche_id"] + ".md)"
            if p["fiche_id"]
            else "—"
        )
        lines.append(
            "| " + num + " | " + svc + " | " + p["title"] + " | " + delta + " | "
            + cat + " | " + link + " | " + fiche_link + " |\n"
        )

    if unscored:
        lines.append("\n## Sans score SVC\n\n")
        for p in sorted(unscored, key=lambda x: x["num"] if x["num"] is not None else 9999):
            num = str(p["num"]) if p["num"] is not None else "?"
            lines.append("- #" + num + " [" + p["title"] + "](" + p["file"] + ")\n")

    (dst_base / "by-svc.md").write_text("".join(lines), encoding="utf-8")


def copy_retex():
    """Copie les RETEX (briefings + memory state + audit-these) vers le wiki.

    Ces fichiers constituent le retour d'experience entre runs et sessions :
    - _staging/briefings/DIRECTOR_BRIEFING_RUN*.md : briefings par RUN
    - _staging/memory/MEMORY_STATE.md : etat memoire cumulative
    - _staging/audit-these/*.md : rapports d'audit anti-hallucination
    - _staging/research-director/*.md : scoring reports (si existent)
    """
    if not STAGING.exists():
        return

    retex_dst = WIKI_DOCS / "experiments" / "retex"
    retex_dst.mkdir(parents=True, exist_ok=True)

    # 1. DIRECTOR BRIEFINGS par RUN
    briefings_src = STAGING / "briefings"
    briefings_dst = retex_dst / "briefings"
    briefings_items = []
    if briefings_src.exists():
        briefings_dst.mkdir(parents=True, exist_ok=True)
        for md in sorted(briefings_src.glob("DIRECTOR_BRIEFING_*.md")):
            copy_md(md, briefings_dst / md.name)
            briefings_items.append(md.stem)

    # 2. MEMORY STATE
    memory_src = STAGING / "memory" / "MEMORY_STATE.md"
    memory_dst = retex_dst / "memory-state.md"
    if memory_src.exists():
        copy_md(memory_src, memory_dst)

    # 3. AUDIT-THESE reports
    audit_src = STAGING / "audit-these"
    audit_dst = retex_dst / "audits"
    audit_items = []
    if audit_src.exists():
        audit_dst.mkdir(parents=True, exist_ok=True)
        for md in sorted(audit_src.glob("*.md")):
            copy_md(md, audit_dst / md.name)
            audit_items.append(md.stem)

    # 4. RESEARCH-DIRECTOR scoring reports (optional)
    director_src = STAGING / "research-director"
    director_dst = retex_dst / "scoring-reports"
    director_items = []
    if director_src.exists():
        director_dst.mkdir(parents=True, exist_ok=True)
        for md in sorted(director_src.glob("*.md")):
            copy_md(md, director_dst / md.name)
            director_items.append(md.stem)

    # 5. Generate index page
    index_lines = [
        "# RETEX — Retours d'experience\n\n",
        "!!! abstract \"Retour d'experience inter-sessions\"\n",
        "    Cette section agrege les **briefings**, **scoring reports** et **audits anti-hallucination**\n",
        "    generes par les skills `/bibliography-maintainer` et `/research-director` apres chaque RUN.\n",
        "    Les fichiers sont automatiquement synchronises depuis `research_archive/_staging/` par\n",
        "    `wiki/build_wiki.py` lors de chaque `/wiki-publish update`.\n\n",
        "## Director Briefings\n\n",
        "Briefings synthetiques produits apres chaque RUN par `/bibliography-maintainer` Phase 6.\n\n",
    ]
    if briefings_items:
        for name in briefings_items:
            index_lines.append("- [" + name + "](briefings/" + name + ".md)\n")
    else:
        index_lines.append("_Aucun briefing disponible._\n")

    index_lines.append("\n## Memory State\n\n")
    if memory_src.exists():
        index_lines.append("- [MEMORY_STATE.md](memory-state.md) — etat memoire cumulative\n")
    else:
        index_lines.append("_MEMORY_STATE.md absent._\n")

    index_lines.append("\n## Audits anti-hallucination (`/audit-these`)\n\n")
    if audit_items:
        for name in audit_items:
            index_lines.append("- [" + name + "](audits/" + name + ".md)\n")
    else:
        index_lines.append("_Aucun audit disponible._\n")

    if director_items:
        index_lines.append("\n## Scoring reports `/research-director`\n\n")
        for name in director_items:
            index_lines.append("- [" + name + "](scoring-reports/" + name + ".md)\n")

    index_lines.append("\n## Pipeline d'update\n\n")
    index_lines.append("```mermaid\n")
    index_lines.append("flowchart LR\n")
    index_lines.append("    RUN[\"RUN N\"] --> BIB[\"bibliography-maintainer\"]\n")
    index_lines.append("    BIB --> BRIEF[\"DIRECTOR_BRIEFING_RUNXXX.md\"]\n")
    index_lines.append("    RUN --> DIR[\"research-director\"]\n")
    index_lines.append("    DIR --> SCORE[\"AUDIT_SESSION-*.md\"]\n")
    index_lines.append("    RUN --> AUDIT[\"audit-these\"]\n")
    index_lines.append("    AUDIT --> UNSRC[\"UNSOURCED_CLAIMS_*.md\"]\n")
    index_lines.append("    BRIEF --> WIKI[\"/wiki-publish update\"]\n")
    index_lines.append("    SCORE --> WIKI\n")
    index_lines.append("    UNSRC --> WIKI\n")
    index_lines.append("    WIKI --> PAGE[\"wiki/experiments/retex/\"]\n")
    index_lines.append("```\n")

    (retex_dst / "index.md").write_text("".join(index_lines), encoding="utf-8")


def copy_staging_detailed():
    """Copie TOUS les fichiers .md des agents _staging/ vers le wiki.

    Auparavant cette fonction ne copiait que des index (liste de titres).
    Les chercheurs n'avaient donc acces ni aux 200 analyses Keshav de papers,
    ni aux 15 modules de cours de math (mathteacher), ni aux 10 rapports
    matheux (formules), ni aux axes scientist, ni aux playbooks whitehacker,
    ni aux analyses cybersec. Ce gap est ferme ici.

    Chaque dossier agent devient une section du wiki :
    - wiki/docs/staging/{agent}/{file}.md (copie avec rewriting des liens)
    - wiki/docs/staging/{agent}/index.md (index cliquable avec H1 + file path)

    Agents couverts : analyst, scientist, matheux, mathteacher, cybersec,
    whitehacker, librarian, chunker, collector.
    """
    if not STAGING.exists():
        return

    agent_dirs = {
        "analyst": (
            "Analyses de papiers (Keshav 3-pass)",
            "Analyses detaillees des 130+ papiers du corpus AEGIS. Chaque fichier "
            "`PXXX_analysis.md` contient une lecture en 3 passages (survol, structure, "
            "profondeur critique) avec formules, threat model, et mapping δ⁰-δ³.",
        ),
        "scientist": (
            "Synthese scientifique",
            "Axes de recherche, rapports de decouverte, revues de phase. Produits par "
            "l'agent SCIENTIST du pipeline bibliography-maintainer.",
        ),
        "matheux": (
            "Formules mathematiques (extraction & reviews)",
            "Extraction des formules F01-F72 depuis les papiers, glossaire detaille, "
            "dependances mathematiques, reviews completes par RUN. Produits par l'agent MATHEUX.",
        ),
        "mathteacher": (
            "Cours de mathematiques (8 modules + guide notation + self-assessment)",
            "Cours structure pour accompagner le lecteur non-expert : algebre lineaire, "
            "probabilites, theorie de l'information, metriques, optimisation, embeddings, "
            "attention, erosion multi-tour. Guide de notation + quiz d'auto-evaluation.",
        ),
        "cybersec": (
            "Analyses menaces & defenses",
            "Analyses croisees papiers x threat model, MITRE ATLAS mapping, OWASP LLM "
            "coverage. Produits par l'agent CYBERSEC.",
        ),
        "whitehacker": (
            "Red Team playbooks & exploitation",
            "Playbooks red team, guides d'exploitation, retex d'integration HouYi, "
            "CrowdStrike taxonomy mapping. Produits par l'agent WHITEHACKER.",
        ),
        "librarian": (
            "Rapports de propagation & validation",
            "Rapports d'organisation du corpus, validation des propagations vers "
            "doc_references/, verification des P-IDs.",
        ),
        "chunker": (
            "Chunking pour injection ChromaDB",
            "Preparation des chunks avant injection ChromaDB (~500 tokens, overlap 50), "
            "verifications post-injection (>= 5 chunks par P-ID).",
        ),
        "collector": (
            "Preseed et verifications anti-doublon",
            "Preseed JSON avec metadonnees avant integration corpus, verifications "
            "check_corpus_dedup (arXiv ID + cosine > 0.9).",
        ),
    }

    global_summary_rows = []

    for agent_name, (desc, long_desc) in agent_dirs.items():
        agent_dir = STAGING / agent_name
        if not agent_dir.exists():
            continue
        md_files = sorted(agent_dir.glob("*.md"))
        if not md_files:
            continue

        agent_wiki_dir = WIKI_DOCS / "staging" / agent_name
        agent_wiki_dir.mkdir(parents=True, exist_ok=True)

        # Copy every file with link rewriting
        file_meta = []
        for md_file in md_files:
            copy_md(md_file, agent_wiki_dir / md_file.name)
            # Extract H1 title for index display
            try:
                content = md_file.read_text(encoding="utf-8", errors="replace")
                first_line = content.split("\n", 1)[0] if content else ""
                title = first_line.lstrip("#").strip() if first_line.startswith("#") else md_file.stem
            except Exception:
                title = md_file.stem
            # Count lines as a rough size indicator
            try:
                line_count = sum(1 for _ in md_file.open(encoding="utf-8", errors="replace"))
            except Exception:
                line_count = 0
            file_meta.append({
                "name": md_file.name,
                "title": title,
                "lines": line_count,
            })

        # Generate agent index
        lines = [
            "# " + desc + "\n\n",
            "!!! abstract \"Agent `_staging/" + agent_name + "/`\"\n",
            "    " + long_desc + "\n\n",
            "**" + str(len(md_files)) + " fichiers** disponibles.\n\n",
            "## Liste complete\n\n",
            "| Fichier | Titre | Lignes |\n|---------|-------|-------:|\n",
        ]
        for fm in sorted(file_meta, key=lambda x: x["name"]):
            lines.append(
                "| [`" + fm["name"] + "`](" + fm["name"] + ") | " + fm["title"]
                + " | " + str(fm["lines"]) + " |\n"
            )

        (agent_wiki_dir / "index.md").write_text("".join(lines), encoding="utf-8")

        global_summary_rows.append({
            "agent": agent_name,
            "desc": desc,
            "count": len(md_files),
            "total_lines": sum(fm["lines"] for fm in file_meta),
        })

    # Global staging index with cross-links to each agent subdir
    global_lines = [
        "# Staging — Agents de recherche\n\n",
        "!!! abstract \"Pipeline bibliography-maintainer\"\n",
        "    Le dossier `research_archive/_staging/` contient **l'integralite du travail** "
        "produit par les 9 agents specialises du pipeline `/bibliography-maintainer` "
        "(COLLECTOR → ANALYST → MATHEUX → CYBERSEC → WHITEHACKER → LIBRARIAN → CHUNKER "
        "→ MATHTEACHER → SCIENTIST). Ces fichiers sont normalement invisibles aux "
        "chercheurs externes car ils vivent dans le repo git. Ce wiki **les publie**.\n\n",
        "## Agents et productions\n\n",
        "| Agent | Description | # fichiers | # lignes | Acces |\n"
        "|-------|-------------|:----------:|:--------:|:-----:|\n",
    ]
    total_files = 0
    total_lines = 0
    for row in global_summary_rows:
        total_files += row["count"]
        total_lines += row["total_lines"]
        global_lines.append(
            "| **" + row["agent"] + "** | " + row["desc"] + " | "
            + str(row["count"]) + " | " + format(row["total_lines"], ",").replace(",", " ")
            + " | [→](" + row["agent"] + "/index.md) |\n"
        )
    global_lines.append(
        "| **TOTAL** | — | **" + str(total_files) + "** | **"
        + format(total_lines, ",").replace(",", " ") + "** | — |\n"
    )
    global_lines.append("\n")
    global_lines.append(
        "## Hierarchie du pipeline\n\n"
        "```mermaid\nflowchart LR\n"
        "    COL[\"COLLECTOR\"] --> ANA[\"ANALYST\"]\n"
        "    ANA --> MAT[\"MATHEUX\"]\n"
        "    ANA --> CYB[\"CYBERSEC\"]\n"
        "    ANA --> WH[\"WHITEHACKER\"]\n"
        "    MAT --> MT[\"MATHTEACHER\"]\n"
        "    MAT --> SCI[\"SCIENTIST\"]\n"
        "    CYB --> SCI\n"
        "    WH --> SCI\n"
        "    SCI --> LIB[\"LIBRARIAN\"]\n"
        "    LIB --> CHK[\"CHUNKER\"]\n"
        "    CHK --> DB[(\"ChromaDB<br/>aegis_bibliography\")]\n"
        "    style DB fill:#00bcd4,color:#fff\n"
        "```\n\n"
    )
    global_lines.append(
        "**Acces complet** : chaque agent a sa propre section navigable. Les fichiers "
        "sont disponibles en lecture web **et** telechargement markdown direct.\n"
    )

    (WIKI_DOCS / "staging" / "index.md").write_text(
        "".join(global_lines), encoding="utf-8"
    )


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
    """La page scenarios.md est maintenant maintenue manuellement (contenu riche avec
    exemples, MITRE, couches delta, structure Scenario). Ne pas ecraser si existe."""
    dst = WIKI_DOCS / "redteam-lab" / "scenarios.md"
    if dst.exists() and dst.stat().st_size > 1000:
        return  # Deja ecrit manuellement, on ne touche pas
    # Fallback minimal si le fichier est absent
    content = "# Scenarios d'attaque\n\n(a completer)\n"
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

    print("[2b/10] Copie des PDFs (literature_for_rag -> assets/pdfs)...")
    copy_pdfs()

    print("[2c/10] Copie des DOCX manuscript (assets/docx)...")
    _copied_docx = copy_docx_publications()

    print("[2d/10] Generation page /publications/ centralisee...")
    generate_publications_page(_copied_docx)

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

    print("[8b/10] Copie des rapports experimentaux...")
    copy_experiments()

    print("[9/12] Copie des articles et staging...")
    copy_articles()
    copy_staging()
    copy_staging_detailed()
    copy_retex()
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
