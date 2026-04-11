# Internationalization (FR / EN / BR)

!!! abstract "Mandatory trilingual"
    AEGIS supports **3 languages** via `react-i18next`:

    - **FR** French (research default)
    - **EN** English (academic publication)
    - **BR** Brazilian Portuguese (chapter VI quater Africa)

    **CLAUDE.md rule**: any visible text **MUST** go through `t('key')`. **NEVER** a hardcoded
    string in the UI.

## 1. Structure

```
frontend/src/
├── i18n/
│   ├── index.js                   — react-i18next config
│   ├── locales/
│   │   ├── fr.json                — ~277 KB FR strings
│   │   ├── en.json                — ~277 KB EN strings
│   │   └── br.json                — ~277 KB BR strings
│   └── detector.js                — browser language detection
└── components/
    └── ...                        — all use useTranslation()
```

## 2. Usage in components

```jsx
import { useTranslation } from 'react-i18next';

function AnalysisPanel() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('analysis.title')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        {t('common.switch_to_english')}
      </button>
    </div>
  );
}
```

**NEVER**:

```jsx
// FORBIDDEN
<h1>Analyse du scenario</h1>
<button>Switch to English</button>
```

## 3. Example strings

```json
// fr.json
{
  "analysis": {
    "title": "Analyse du scenario",
    "subtitle": "Resultat de la campagne",
    "metrics": {
      "asr": "Taux de reussite d'attaque",
      "sep_m": "Score de separation Sep(M)",
      "svc": "Score de viabilite de compromission"
    }
  }
}

// en.json
{
  "analysis": {
    "title": "Scenario Analysis",
    "subtitle": "Campaign Result",
    "metrics": {
      "asr": "Attack Success Rate",
      "sep_m": "Separation Score Sep(M)",
      "svc": "Compromise Viability Score"
    }
  }
}

// br.json
{
  "analysis": {
    "title": "Analise do cenario",
    "subtitle": "Resultado da campanha",
    "metrics": {
      "asr": "Taxa de sucesso do ataque",
      "sep_m": "Pontuacao de separacao Sep(M)",
      "svc": "Pontuacao de viabilidade de compromisso"
    }
  }
}
```

## 4. Translation rules

### Technical terms — DO NOT translate

| Term | FR | EN | BR |
|------|----|----|----|
| Prompt injection | Prompt injection | Prompt injection | Prompt injection |
| System prompt | System prompt | System prompt | System prompt |
| RLHF | RLHF | RLHF | RLHF |
| Jailbreak | Jailbreak | Jailbreak | Jailbreak |
| Red team | Red team | Red team | Red team |
| ASR | ASR | ASR | ASR |
| Sep(M) | Sep(M) | Sep(M) | Sep(M) |
| δ⁰ δ¹ δ² δ³ | δ⁰ δ¹ δ² δ³ | δ⁰ δ¹ δ² δ³ | δ⁰ δ¹ δ² δ³ |
| Da Vinci Xi | Da Vinci Xi | Da Vinci Xi | Da Vinci Xi |
| HL7 / FHIR | HL7 / FHIR | HL7 / FHIR | HL7 / FHIR |

### Elements to translate

- Section titles, descriptions, help modals
- Error messages and warnings
- Button labels, tooltips, forms
- Placeholders
- Graph legends

## 5. MkDocs wiki — i18n plugin

The wiki uses `mkdocs-static-i18n` with 3 locales:

```yaml
# wiki/mkdocs.yml
plugins:
  - i18n:
      docs_structure: suffix
      fallback_to_default: true
      languages:
        - locale: fr
          default: true
          name: FR
          build: true
        - locale: en
          name: EN
          build: true
        - locale: pt
          name: BR
          build: true
```

### File pattern

```
wiki/docs/
├── index.md           # FR (default)
├── index.en.md        # EN
├── index.pt.md        # BR (locale 'pt', displayed as 'BR')
├── installation.md
├── installation.en.md
└── installation.pt.md
```

**Note**: the locale is `pt` (not `br`) because `mkdocs-static-i18n` uses ISO 639-1 codes.
The displayed name is `BR`.

## 6. Trilingual help modals

`frontend/src/components/redteam/ScenarioHelpModal.jsx` provides a help modal for each
scenario with automatic translation:

```jsx
const helpContent = t(`scenarios.${scenarioId}.help`, { returnObjects: true });

return (
  <Modal>
    <h2>{helpContent.title}</h2>
    <p>{helpContent.description}</p>
    <ul>
      {helpContent.steps.map((step, i) => <li key={i}>{step}</li>)}
    </ul>
  </Modal>
);
```

## 7. CLAUDE.md rules

!!! warning "Absolute rules"
    - **Any visible text** must go through `t('key')`
    - **NEVER** `return <div>Hello world</div>` without translation
    - When a component changes: update `fr.json` + `en.json` + `br.json` TOGETHER
    - Technical terms stay in **English** across the 3 languages
    - Help modals must be trilingual from creation

## 8. Validation

```bash
# Check that no string is hardcoded
grep -rn "return <[^>]*>\"[A-Z]" frontend/src/components/

# Check that the 3 locales have the same keys
python backend/tools/check_i18n_keys.py

# Expected output:
# fr.json: 1847 keys
# en.json: 1847 keys
# br.json: 1847 keys
# [OK] All locales consistent.
```

## 9. Regex audit (CLAUDE.md hook)

A **pre-commit hook** blocks hardcoded strings:

```bash
# .claude/hooks/i18n_check.cjs
# Rejects commits containing:
# - return <[^>]*>"[A-Z][a-z]
# - <button[^>]*>[A-Z]
# - <h[1-6]>[A-Z]
# - placeholder="[A-Z]
```

## 10. Limitations and strengths

<div class="grid" markdown>

!!! success "Strengths"
    - **3 languages** covered from the start
    - **Trilingual** FR / EN / BR for the international ENS thesis
    - **Automatic fallback** to FR if locale is missing
    - **i18n plugin** integrated in the MkDocs wiki
    - **Rule enforced** by pre-commit hook
    - **Trilingual help modals** for the 48 scenarios

!!! failure "Limitations"
    - **Costly maintenance**: each string = 3 files to update
    - **Automatic translations** (DeepL, GPT) sometimes imprecise on technical terms
    - **Missing context**: translators do not see the UI
    - **Fragile JSON**: missing comma breaks the entire file
    - **Inconsistent order**: keys may diverge between files
    - **No versioning**: no detection of stale strings

</div>

## 11. Resources

- :material-code-tags: [frontend/src/i18n/](https://github.com/pizzif/poc_medical/tree/main/frontend/src/i18n)
- :material-translate: [react-i18next docs](https://react.i18next.com/)
- :material-book: [mkdocs-static-i18n](https://ultrabug.github.io/mkdocs-static-i18n/)
- :material-file-code: [ScenarioHelpModal.jsx](https://github.com/pizzif/poc_medical/blob/main/frontend/src/components/redteam/ScenarioHelpModal.jsx)
