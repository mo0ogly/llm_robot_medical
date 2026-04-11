# Internationalisation (FR / EN / BR)

!!! abstract "Trilingue obligatoire"
    AEGIS supporte **3 langues** via `react-i18next` :

    - **FR** Francais (defaut recherche)
    - **EN** Anglais (publication academique)
    - **BR** Portugais bresilien (chapitre VI quater Africa)

    **Regle CLAUDE.md** : tout texte visible **DOIT** passer par `t('key')`. **JAMAIS** de string
    hardcodee en UI.

## 1. Structure

```
frontend/src/
├── i18n/
│   ├── index.js                   — config react-i18next
│   ├── locales/
│   │   ├── fr.json                — ~277 KB strings FR
│   │   ├── en.json                — ~277 KB strings EN
│   │   └── br.json                — ~277 KB strings BR
│   └── detector.js                — browser language detection
└── components/
    └── ...                        — tous utilisent useTranslation()
```

## 2. Usage dans les composants

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

**JAMAIS** :

```jsx
// INTERDIT
<h1>Analyse du scenario</h1>
<button>Switch to English</button>
```

## 3. Exemple de strings

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

## 4. Regles de traduction

### Termes techniques — NE PAS traduire

| Terme | FR | EN | BR |
|-------|----|----|----|
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

### Elements a traduire

- Titres de sections, descriptions, help modals
- Messages d'erreur et warnings
- Labels de boutons, tooltips, formulaires
- Placeholders
- Legendes de graphes

## 5. Wiki MkDocs — plugin i18n

Le wiki utilise `mkdocs-static-i18n` avec 3 locales :

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

### Pattern de fichiers

```
wiki/docs/
├── index.md           # FR (defaut)
├── index.en.md        # EN
├── index.pt.md        # BR (locale 'pt', affiche 'BR')
├── installation.md
├── installation.en.md
└── installation.pt.md
```

**Note** : le locale est `pt` (pas `br`) car `mkdocs-static-i18n` utilise les codes ISO 639-1.
Le nom affiche est `BR`.

## 6. Help modals trilingues

`frontend/src/components/redteam/ScenarioHelpModal.jsx` fournit un help modal pour chaque
scenario avec traduction automatique :

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

## 7. Regles CLAUDE.md

!!! warning "Regles absolues"
    - **Tout texte visible** doit passer par `t('key')`
    - **JAMAIS** de `return <div>Hello world</div>` sans traduction
    - Quand un composant change : mettre a jour `fr.json` + `en.json` + `br.json` ENSEMBLE
    - Les termes techniques restent en **anglais** dans les 3 langues
    - Les help modals doivent etre trilingues des la creation

## 8. Validation

```bash
# Verifier qu'aucune string n'est hardcodee
grep -rn "return <[^>]*>\"[A-Z]" frontend/src/components/

# Verifier que les 3 locales ont les memes cles
python backend/tools/check_i18n_keys.py

# Expected output:
# fr.json: 1847 keys
# en.json: 1847 keys
# br.json: 1847 keys
# [OK] All locales consistent.
```

## 9. Audit regex (CLAUDE.md hook)

Un **hook pre-commit** bloque les strings hardcodees :

```bash
# .claude/hooks/i18n_check.cjs
# Refuse les commits contenant :
# - return <[^>]*>"[A-Z][a-z]
# - <button[^>]*>[A-Z]
# - <h[1-6]>[A-Z]
# - placeholder="[A-Z]
```

## 10. Limites et avantages

<div class="grid" markdown>

!!! success "Avantages"
    - **3 langues** couvertes des le depart
    - **Trilingue** FR / EN / BR pour these ENS internationale
    - **Fallback automatique** vers FR si locale manquante
    - **Plugin i18n** integre dans wiki MkDocs
    - **Regle enforcee** par hook pre-commit
    - **Help modals trilingues** pour les 48 scenarios

!!! failure "Limites"
    - **Maintenance couteuse** : chaque string = 3 fichiers a MAJ
    - **Traductions automatiques** (DeepL, GPT) parfois imprecises sur termes techniques
    - **Context manquant** : les traducteurs ne voient pas l'UI
    - **JSON fragile** : virgule manquante casse tout le fichier
    - **Ordre inconsistant** : les cles peuvent diverger entre fichiers
    - **Pas de versioning** : pas de detection des strings obsoletes

</div>

## 11. Ressources

- :material-code-tags: [frontend/src/i18n/](https://github.com/pizzif/poc_medical/tree/main/frontend/src/i18n)
- :material-translate: [react-i18next docs](https://react.i18next.com/)
- :material-book: [mkdocs-static-i18n](https://ultrabug.github.io/mkdocs-static-i18n/)
- :material-file-code: [ScenarioHelpModal.jsx](https://github.com/pizzif/poc_medical/blob/main/frontend/src/components/redteam/ScenarioHelpModal.jsx)
