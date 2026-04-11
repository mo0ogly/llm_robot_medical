# δ notation — the AEGIS Unicode rule

!!! danger "Absolute rule — CLAUDE.md"
    **ALWAYS use the Unicode characters `δ⁰ δ¹ δ² δ³`**.
    **NEVER** the ASCII form `delta-0 / delta-1 / delta-2 / delta-3` in documentation.

    **Exception**: in **Python/JSX source code** where ASCII is required (dictionary
    keys, variable identifiers, file names) — only there.

## 1. Why this rule?

A **theoretical framework** without stable notation is a **dead** framework. The AEGIS thesis
uses the `δ⁰–δ³` notation everywhere:

- In the title of Chapter IV of the manuscript: *"Separation Taxonomy δ⁰, δ¹, δ², δ³"*
- In the formulas: `Sep(M) = |P_data(violation) - P_instr(violation)|`
- In the cited papers: P018 *"Shallow alignment"* → `δ⁰ layer`
- In the agent outputs: `mapping_delta: "δ⁰,δ¹"`

**Mixing** `delta-0` and `δ⁰` in the same doc creates **semantic confusion** and makes
grep / search / replace **impossible**.

## 2. The exact characters

| Notation | Unicode | Copy-paste | Description |
|:--------:|---------|:----------:|-------------|
| **δ** | U+03B4 | `δ` | Greek small letter delta |
| **⁰** | U+2070 | `⁰` | Superscript zero |
| **¹** | U+00B9 | `¹` | Superscript one |
| **²** | U+00B2 | `²` | Superscript two |
| **³** | U+00B3 | `³` | Superscript three |

### Complete sequences

```
δ⁰  → U+03B4 U+2070   RLHF alignment
δ¹  → U+03B4 U+00B9   System prompt / Instruction hierarchy
δ²  → U+03B4 U+00B2   Syntactic shield (RagSanitizer)
δ³  → U+03B4 U+00B3   Structural enforcement (validate_output)
```

## 3. Correct / incorrect examples

<div class="grid" markdown>

!!! success "CORRECT"
    - *"Layer **δ⁰** corresponds to RLHF alignment."*
    - *"**Conjecture 1**: δ¹ is insufficient to guarantee Integrity(S)."*
    - `mapping_delta: "δ⁰,δ²"` in YAML frontmatter
    - *"**ASIDE** (Zhou et al. 2025) operates on **δ¹** via orthogonal rotation."*

!!! failure "INCORRECT"
    - ~~*"The delta-0 layer corresponds to RLHF alignment."*~~
    - ~~*"Conjecture 1: delta1 is insufficient."*~~
    - ~~`mapping_delta: "delta0,delta2"`~~
    - ~~*"ASIDE operates on DELTA_1 via rotation."*~~
    - ~~`δ^0`~~ (LaTeX superscript, not Unicode)
    - ~~`δ_0`~~ (subscript, not superscript)

</div>

## 4. Mandatory exceptions — source code

**Only** these cases authorize ASCII `delta0/1/2/3`:

### JSON keys / Python identifiers

```python
# backend/prompts/101-apt-context-poisoning.json
{
    "target_delta": "delta1",  # ASCII required (JSON key convention)
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

### File / directory names

```
backend/prompts/
├── delta0_baseline_rlhf.json
├── delta1_system_prompt_override.json
├── delta2_homoglyph_bypass.json
└── delta3_output_enforcement_test.json
```

### Python functions / variables

```python
def test_delta2_bypass_homoglyph():
    ...

scenario_id = "delta2_bypass_base64"
```

**Mnemonic rule**: if you are typing in a **.py / .jsx / .json**, ASCII is OK. If you are
typing in a **.md / docx / slides**, Unicode is **required**.

## 5. How to type δ on your keyboard

### Windows

| Method | Sequence |
|--------|----------|
| Alt code | Hold `Alt` + type `0948` on the numeric keypad |
| WinCompose | Install [WinCompose](https://github.com/SamHocevar/wincompose), then `Compose + d + *` |
| Char Map | `charmap.exe` → Greek → δ |
| Copy-paste | From this page: `δ⁰ δ¹ δ² δ³` |

### Mac

- `⌥ + j` → `∆` (not the right one!)
- Emoji picker `⌃ + ⌘ + Space` → search for "delta"
- Copy-paste recommended

### Linux

- Ctrl + Shift + U then `03b4` then `Space` → δ
- Or `xdotool type δ⁰`

### VS Code / editors

Recommended snippet in `.vscode/snippets/delta.code-snippets`:

```json
{
  "Delta 0": { "prefix": "d0", "body": "δ⁰", "description": "RLHF" },
  "Delta 1": { "prefix": "d1", "body": "δ¹", "description": "System prompt" },
  "Delta 2": { "prefix": "d2", "body": "δ²", "description": "Syntactic shield" },
  "Delta 3": { "prefix": "d3", "body": "δ³", "description": "Output enforcement" }
}
```

## 6. Automated verification

**Audit script**: `backend/tools/check_delta_notation.py`

```bash
# Detect ASCII usages in the docs
grep -rn "delta-[0-3]\|delta[0-3]" research_archive/manuscript/*.md wiki/docs/*.md

# Expected output: only auto-generated files
# If you see a manual reference, fix it
```

**Rule**: before each commit, audit-these checks notation consistency on:

- `research_archive/manuscript/*.md`
- `research_archive/discoveries/*.md`
- `wiki/docs/**/*.md`

If an anomaly is detected, `audit-these` **blocks the commit** with a warning.

## 7. Order and meaning

!!! info "Robustness order: δ⁰ < δ¹ < δ² < δ³"
    - **δ⁰**: the **weakest** — probabilistic, learned, shallow
    - **δ¹**: contextual — behavioral, poisonable
    - **δ²**: syntactic — partially deterministic, 100% bypass documented
    - **δ³**: the **strongest** — external, formal, model-independent

    See [delta-layers/index.md](delta-layers/index.md) for the full framework.

## 8. Usage in publications

The final manuscript uses the notation everywhere:

> *"We propose a four-layer separation framework for LLM-integrated medical systems. Layer
> **δ⁰** represents the alignment learned by RLHF, layer **δ¹** the system prompt hierarchy,
> layer **δ²** the syntactic shield (regex + Unicode normalization), and layer **δ³** the
> structural output enforcement (validate_output vs Allowed(i) specification). Our **Conjecture 2**
> states that only **δ³** can guarantee Integrity(S) deterministically."*

## 9. Why it is not just cosmetic

1. **Search**: `grep "δ⁰"` finds all passages. `grep "delta0"` pollutes with code.
2. **Originality**: the notation is a **signal** of the formal contribution — a reader
   immediately sees that it is a new framework, not re-marketing.
3. **International**: Unicode superscripts are **language-neutral** — no FR/EN/PT
   translation required.
4. **Citation**: cited papers use δ⁰ in mathematical notation, AEGIS aligns its
   terminology with the literature.

## 10. Resources

- :material-keyboard: [WinCompose (Windows)](https://github.com/SamHocevar/wincompose)
- :material-shield: [Complete δ⁰–δ³ framework](delta-layers/index.md)
- :material-file-document: [CLAUDE.md - project rules](contributing/index.md)
- :material-magnify: [INDEX_BY_DELTA.md - 130 papers classification](research/bibliography/by-delta.md)
