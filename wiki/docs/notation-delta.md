# Notation δ — la regle Unicode AEGIS

!!! danger "Regle absolue — CLAUDE.md"
    **TOUJOURS utiliser les caracteres Unicode `δ⁰ δ¹ δ² δ³`**.
    **JAMAIS** la forme ASCII `delta-0 / delta-1 / delta-2 / delta-3` dans la documentation.

    **Exception** : dans le **code source Python/JSX** ou l'ASCII est obligatoire (cles de
    dictionnaire, identifiants de variables, noms de fichiers) — uniquement.

## 1. Pourquoi cette regle ?

Un **cadre theorique** sans notation stable est un cadre **mort**. La these AEGIS utilise la
notation `δ⁰–δ³` partout :

- Dans le titre du chapitre IV du manuscrit : *"Taxonomie de Separation δ⁰, δ¹, δ², δ³"*
- Dans les formules : `Sep(M) = |P_data(violation) - P_instr(violation)|`
- Dans les papiers cites : P018 *"Shallow alignment"* → `couche δ⁰`
- Dans les outputs des agents : `mapping_delta: "δ⁰,δ¹"`

**Melanger** `delta-0` et `δ⁰` dans la meme doc cree de la **confusion semantique** et rend le
grep / search / replace **impossible**.

## 2. Les caracteres exacts

| Notation | Unicode | Copy-paste | Description |
|:--------:|---------|:----------:|-------------|
| **δ** | U+03B4 | `δ` | Greek small letter delta |
| **⁰** | U+2070 | `⁰` | Superscript zero |
| **¹** | U+00B9 | `¹` | Superscript one |
| **²** | U+00B2 | `²` | Superscript two |
| **³** | U+00B3 | `³` | Superscript three |

### Sequences completes

```
δ⁰  → U+03B4 U+2070   RLHF alignment
δ¹  → U+03B4 U+00B9   System prompt / Instruction hierarchy
δ²  → U+03B4 U+00B2   Syntactic shield (RagSanitizer)
δ³  → U+03B4 U+00B3   Structural enforcement (validate_output)
```

## 3. Exemples corrects / incorrects

<div class="grid" markdown>

!!! success "CORRECT"
    - *"La couche **δ⁰** correspond a l'alignement RLHF."*
    - *"**Conjecture 1** : δ¹ est insuffisante pour garantir Integrity(S)."*
    - `mapping_delta: "δ⁰,δ²"` dans YAML frontmatter
    - *"**ASIDE** (Zhou et al. 2025) opere sur **δ¹** via rotation orthogonale."*

!!! failure "INCORRECT"
    - ~~*"La couche delta-0 correspond a l'alignement RLHF."*~~
    - ~~*"Conjecture 1 : delta1 est insuffisante."*~~
    - ~~`mapping_delta: "delta0,delta2"`~~
    - ~~*"ASIDE opere sur DELTA_1 via rotation."*~~
    - ~~`δ^0`~~ (exposant LaTeX, pas Unicode)
    - ~~`δ_0`~~ (indice, pas exposant)

</div>

## 4. Exceptions obligatoires — code source

**Seuls** ces cas autorisent l'ASCII `delta0/1/2/3` :

### Cles JSON / identifiants Python

```python
# backend/prompts/101-apt-context-poisoning.json
{
    "target_delta": "delta1",  # ASCII obligatoire (JSON key convention)
    ...
}

# backend/agents/prompts.py
DEFENSE_LAYERS = {
    "delta0": "RLHF alignment",
    "delta1": "System prompt hardening",
    "delta2": "Syntactic shield",
    "delta3": "Output enforcement",
}
```

### Noms de fichiers / directories

```
backend/prompts/
├── delta0_baseline_rlhf.json
├── delta1_system_prompt_override.json
├── delta2_homoglyph_bypass.json
└── delta3_output_enforcement_test.json
```

### Fonctions / variables Python

```python
def test_delta2_bypass_homoglyph():
    ...

scenario_id = "delta2_bypass_base64"
```

**Regle mnemonique** : si tu tapes dans un **.py / .jsx / .json**, ASCII est OK. Si tu tapes
dans un **.md / docx / slides**, Unicode **obligatoire**.

## 5. Comment taper δ sur ton clavier

### Windows

| Methode | Sequence |
|---------|----------|
| Alt code | Maintenir `Alt` + taper `0948` sur pave numerique |
| WinCompose | Installer [WinCompose](https://github.com/SamHocevar/wincompose), puis `Compose + d + *` |
| Char Map | `charmap.exe` → Greek → δ |
| Copy-paste | Depuis cette page : `δ⁰ δ¹ δ² δ³` |

### Mac

- `⌥ + j` → `∆` (pas le bon !)
- Emoji picker `⌃ + ⌘ + Espace` → rechercher "delta"
- Copy-paste recommande

### Linux

- Ctrl + Shift + U puis `03b4` puis `Espace` → δ
- Ou `xdotool type δ⁰`

### VS Code / éditeurs

Snippet recommande dans `.vscode/snippets/delta.code-snippets` :

```json
{
  "Delta 0": { "prefix": "d0", "body": "δ⁰", "description": "RLHF" },
  "Delta 1": { "prefix": "d1", "body": "δ¹", "description": "System prompt" },
  "Delta 2": { "prefix": "d2", "body": "δ²", "description": "Syntactic shield" },
  "Delta 3": { "prefix": "d3", "body": "δ³", "description": "Output enforcement" }
}
```

## 6. Verification automatisee

**Script d'audit** : `backend/tools/check_delta_notation.py`

```bash
# Detecter les usages ASCII dans la doc
grep -rn "delta-[0-3]\|delta[0-3]" research_archive/manuscript/*.md wiki/docs/*.md

# Expected output: seulement les fichiers genere (auto-gen)
# Si tu vois une reference manuelle, la corriger
```

**Regle** : avant chaque commit, audit-these verifie la coherence de notation sur :

- `research_archive/manuscript/*.md`
- `research_archive/discoveries/*.md`
- `wiki/docs/**/*.md`

Si une anomalie est detectee, `audit-these` **bloque le commit** avec un warning.

## 7. Ordre et signification

!!! info "Ordre de robustesse : δ⁰ < δ¹ < δ² < δ³"
    - **δ⁰** : le plus **faible** — probabiliste, appris, shallow
    - **δ¹** : contextuel — comportemental, empoisonnable
    - **δ²** : syntaxique — deterministe partiel, 100% bypass documente
    - **δ³** : le plus **fort** — externe, formel, independant du modele

    Voir [delta-layers/index.md](delta-layers/index.md) pour le cadre complet.

## 8. Usage dans les publications

Le manuscrit final utilise la notation partout :

> *"We propose a four-layer separation framework for LLM-integrated medical systems. Layer
> **δ⁰** represents the alignment learned by RLHF, layer **δ¹** the system prompt hierarchy,
> layer **δ²** the syntactic shield (regex + Unicode normalization), and layer **δ³** the
> structural output enforcement (validate_output vs Allowed(i) specification). Our **Conjecture 2**
> states that only **δ³** can guarantee Integrity(S) deterministically."*

## 9. Pourquoi ce n'est pas juste cosmetique

1. **Recherche**: `grep "δ⁰"` trouve tous les passages. `grep "delta0"` pollue avec le code.
2. **Originalite**: la notation est un **signal** de la contribution formelle — un lecteur voit
   immediatement que c'est un cadre nouveau, pas du re-marketing.
3. **International**: les exposants Unicode sont **langue-neutre** — pas de traduction FR/EN/PT
   requise.
4. **Citation**: les papiers cites utilisent δ⁰ en notation mathematique, AEGIS aligne sa
   terminologie sur la litterature.

## 10. Ressources

- :material-keyboard: [WinCompose (Windows)](https://github.com/SamHocevar/wincompose)
- :material-shield: [Cadre δ⁰–δ³ complet](delta-layers/index.md)
- :material-file-document: [CLAUDE.md - regles projet](contributing/index.md)
- :material-magnify: [INDEX_BY_DELTA.md - classification 130 papers](research/bibliography/by-delta.md)
