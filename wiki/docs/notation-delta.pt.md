# Notacao δ — a regra Unicode AEGIS

!!! danger "Regra absoluta — CLAUDE.md"
    **SEMPRE usar os caracteres Unicode `δ⁰ δ¹ δ² δ³`**.
    **NUNCA** a forma ASCII `delta-0 / delta-1 / delta-2 / delta-3` na documentacao.

    **Excecao** : no **codigo fonte Python/JSX** em que ASCII e obrigatorio (chaves de
    dicionario, identificadores de variaveis, nomes de arquivos) — somente.

## 1. Por que essa regra ?

Um **framework teorico** sem notacao estavel e um framework **morto**. A tese AEGIS usa a
notacao `δ⁰–δ³` em todo lugar :

- No titulo do capitulo IV do manuscrito : *"Taxonomie de Separation δ⁰, δ¹, δ², δ³"*
- Nas formulas : `Sep(M) = |P_data(violation) - P_instr(violation)|`
- Nos papers citados : P018 *"Shallow alignment"* → `camada δ⁰`
- Nos outputs dos agents : `mapping_delta: "δ⁰,δ¹"`

**Misturar** `delta-0` e `δ⁰` no mesmo doc cria **confusao semantica** e torna o
grep / search / replace **impossivel**.

## 2. Os caracteres exatos

| Notacao | Unicode | Copy-paste | Descricao |
|:-------:|---------|:----------:|-----------|
| **δ** | U+03B4 | `δ` | Greek small letter delta |
| **⁰** | U+2070 | `⁰` | Superscript zero |
| **¹** | U+00B9 | `¹` | Superscript one |
| **²** | U+00B2 | `²` | Superscript two |
| **³** | U+00B3 | `³` | Superscript three |

### Sequencias completas

```
δ⁰  → U+03B4 U+2070   RLHF alignment
δ¹  → U+03B4 U+00B9   System prompt / Instruction hierarchy
δ²  → U+03B4 U+00B2   Syntactic shield (RagSanitizer)
δ³  → U+03B4 U+00B3   Structural enforcement (validate_output)
```

## 3. Exemplos corretos / incorretos

<div class="grid" markdown>

!!! success "CORRETO"
    - *"A camada **δ⁰** corresponde ao alinhamento RLHF."*
    - *"**Conjecture 1** : δ¹ e insuficiente para garantir Integrity(S)."*
    - `mapping_delta: "δ⁰,δ²"` no YAML frontmatter
    - *"**ASIDE** (Zhou et al. 2025) opera sobre **δ¹** via rotacao ortogonal."*

!!! failure "INCORRETO"
    - ~~*"A camada delta-0 corresponde ao alinhamento RLHF."*~~
    - ~~*"Conjecture 1 : delta1 e insuficiente."*~~
    - ~~`mapping_delta: "delta0,delta2"`~~
    - ~~*"ASIDE opera sobre DELTA_1 via rotacao."*~~
    - ~~`δ^0`~~ (exponente LaTeX, nao Unicode)
    - ~~`δ_0`~~ (indice, nao exponente)

</div>

## 4. Excecoes obrigatorias — codigo fonte

**Somente** esses casos autorizam o ASCII `delta0/1/2/3` :

### Chaves JSON / identificadores Python

```python
# backend/prompts/101-apt-context-poisoning.json
{
    "target_delta": "delta1",  # ASCII obrigatorio (JSON key convention)
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

### Nomes de arquivos / diretorios

```
backend/prompts/
├── delta0_baseline_rlhf.json
├── delta1_system_prompt_override.json
├── delta2_homoglyph_bypass.json
└── delta3_output_enforcement_test.json
```

### Funcoes / variaveis Python

```python
def test_delta2_bypass_homoglyph():
    ...

scenario_id = "delta2_bypass_base64"
```

**Regra mnemonica** : se voce digita em um **.py / .jsx / .json**, ASCII esta OK. Se voce digita
em um **.md / docx / slides**, Unicode **obrigatorio**.

## 5. Como digitar δ em seu teclado

### Windows

| Metodo | Sequencia |
|--------|-----------|
| Alt code | Segurar `Alt` + digitar `0948` no teclado numerico |
| WinCompose | Instalar [WinCompose](https://github.com/SamHocevar/wincompose), depois `Compose + d + *` |
| Char Map | `charmap.exe` → Greek → δ |
| Copy-paste | Desta pagina : `δ⁰ δ¹ δ² δ³` |

### Mac

- `⌥ + j` → `∆` (nao e o certo !)
- Emoji picker `⌃ + ⌘ + Espaco` → procurar "delta"
- Copy-paste recomendado

### Linux

- Ctrl + Shift + U depois `03b4` depois `Espaco` → δ
- Ou `xdotool type δ⁰`

### VS Code / editores

Snippet recomendado em `.vscode/snippets/delta.code-snippets` :

```json
{
  "Delta 0": { "prefix": "d0", "body": "δ⁰", "description": "RLHF" },
  "Delta 1": { "prefix": "d1", "body": "δ¹", "description": "System prompt" },
  "Delta 2": { "prefix": "d2", "body": "δ²", "description": "Syntactic shield" },
  "Delta 3": { "prefix": "d3", "body": "δ³", "description": "Output enforcement" }
}
```

## 6. Verificacao automatizada

**Script de audit** : `backend/tools/check_delta_notation.py`

```bash
# Detectar os usos ASCII na doc
grep -rn "delta-[0-3]\|delta[0-3]" research_archive/manuscript/*.md wiki/docs/*.md

# Expected output: somente os arquivos gerados (auto-gen)
# Se voce ve uma referencia manual, corriga-a
```

**Regra** : antes de cada commit, audit-these verifica a coerencia da notacao em :

- `research_archive/manuscript/*.md`
- `research_archive/discoveries/*.md`
- `wiki/docs/**/*.md`

Se uma anomalia e detectada, `audit-these` **bloqueia o commit** com um warning.

## 7. Ordem e significado

!!! info "Ordem de robustez : δ⁰ < δ¹ < δ² < δ³"
    - **δ⁰** : o mais **fraco** — probabilistico, aprendido, shallow
    - **δ¹** : contextual — comportamental, envenenavel
    - **δ²** : sintatico — deterministico parcial, 100% bypass documentado
    - **δ³** : o mais **forte** — externo, formal, independente do modelo

    Veja [delta-layers/index.md](delta-layers/index.md) para o framework completo.

## 8. Uso nas publicacoes

O manuscrito final usa a notacao em todo lugar :

> *"We propose a four-layer separation framework for LLM-integrated medical systems. Layer
> **δ⁰** represents the alignment learned by RLHF, layer **δ¹** the system prompt hierarchy,
> layer **δ²** the syntactic shield (regex + Unicode normalization), and layer **δ³** the
> structural output enforcement (validate_output vs Allowed(i) specification). Our **Conjecture 2**
> states that only **δ³** can guarantee Integrity(S) deterministically."*

## 9. Por que nao e apenas cosmetico

1. **Pesquisa**: `grep "δ⁰"` encontra todas as passagens. `grep "delta0"` polui com o codigo.
2. **Originalidade**: a notacao e um **sinal** da contribuicao formal — um leitor ve
   imediatamente que e um framework novo, nao re-marketing.
3. **Internacional**: os exponentes Unicode sao **lingua-neutros** — sem traducao FR/EN/PT
   requerida.
4. **Citacao**: os papers citados usam δ⁰ em notacao matematica, AEGIS alinha sua
   terminologia com a literatura.

## 10. Recursos

- :material-keyboard: [WinCompose (Windows)](https://github.com/SamHocevar/wincompose)
- :material-shield: [Framework δ⁰–δ³ completo](delta-layers/index.md)
- :material-file-document: [CLAUDE.md - regras do projeto](contributing/index.md)
- :material-magnify: [INDEX_BY_DELTA.md - classificacao 130 papers](research/bibliography/by-delta.md)
