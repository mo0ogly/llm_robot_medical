# Internacionalizacao (FR / EN / BR)

!!! abstract "Trilingue obrigatoria"
    AEGIS suporta **3 idiomas** via `react-i18next` :

    - **FR** Frances (padrao de pesquisa)
    - **EN** Ingles (publicacao academica)
    - **BR** Portugues brasileiro (capitulo VI quater Africa)

    **Regra CLAUDE.md** : todo texto visivel **DEVE** passar por `t('key')`. **NUNCA** string
    hardcoded na UI.

## 1. Estrutura

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
    └── ...                        — todos usam useTranslation()
```

## 2. Uso nos componentes

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

**NUNCA** :

```jsx
// PROIBIDO
<h1>Analyse du scenario</h1>
<button>Switch to English</button>
```

## 3. Exemplo de strings

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

## 4. Regras de traducao

### Termos tecnicos — NAO traduzir

| Termo | FR | EN | BR |
|-------|----|----|-----|
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

### Elementos a traduzir

- Titulos de secoes, descricoes, help modals
- Mensagens de erro e warnings
- Labels de botoes, tooltips, formularios
- Placeholders
- Legendas de graficos

## 5. Wiki MkDocs — plugin i18n

O wiki usa `mkdocs-static-i18n` com 3 locales :

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

### Padrao de arquivos

```
wiki/docs/
├── index.md           # FR (padrao)
├── index.en.md        # EN
├── index.pt.md        # BR (locale 'pt', exibido 'BR')
├── installation.md
├── installation.en.md
└── installation.pt.md
```

**Nota** : o locale e `pt` (nao `br`) porque `mkdocs-static-i18n` usa os codigos ISO 639-1.
O nome exibido e `BR`.

## 6. Help modals trilingues

`frontend/src/components/redteam/ScenarioHelpModal.jsx` fornece um help modal para cada
scenario com traducao automatica :

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

## 7. Regras CLAUDE.md

!!! warning "Regras absolutas"
    - **Todo texto visivel** deve passar por `t('key')`
    - **NUNCA** `return <div>Hello world</div>` sem traducao
    - Quando um componente muda : atualizar `fr.json` + `en.json` + `br.json` JUNTOS
    - Os termos tecnicos ficam em **ingles** nos 3 idiomas
    - Os help modals devem ser trilingues desde a criacao

## 8. Validacao

```bash
# Verificar que nenhuma string esta hardcoded
grep -rn "return <[^>]*>\"[A-Z]" frontend/src/components/

# Verificar que os 3 locales tem as mesmas chaves
python backend/tools/check_i18n_keys.py

# Expected output:
# fr.json: 1847 keys
# en.json: 1847 keys
# br.json: 1847 keys
# [OK] All locales consistent.
```

## 9. Audit regex (CLAUDE.md hook)

Um **hook pre-commit** bloqueia as strings hardcoded :

```bash
# .claude/hooks/i18n_check.cjs
# Recusa os commits contendo :
# - return <[^>]*>"[A-Z][a-z]
# - <button[^>]*>[A-Z]
# - <h[1-6]>[A-Z]
# - placeholder="[A-Z]
```

## 10. Limites e vantagens

<div class="grid" markdown>

!!! success "Vantagens"
    - **3 idiomas** cobertos desde o inicio
    - **Trilingue** FR / EN / BR para tese ENS internacional
    - **Fallback automatico** para FR se locale ausente
    - **Plugin i18n** integrado no wiki MkDocs
    - **Regra enforcada** por hook pre-commit
    - **Help modals trilingues** para os 48 scenarios

!!! failure "Limites"
    - **Manutencao cara** : cada string = 3 arquivos a atualizar
    - **Traducoes automaticas** (DeepL, GPT) as vezes imprecisas em termos tecnicos
    - **Contexto ausente** : os tradutores nao veem a UI
    - **JSON fragil** : virgula ausente quebra o arquivo inteiro
    - **Ordem inconsistente** : as chaves podem divergir entre arquivos
    - **Sem versionamento** : sem deteccao de strings obsoletas

</div>

## 11. Recursos

- :material-code-tags: [frontend/src/i18n/](https://github.com/pizzif/poc_medical/tree/main/frontend/src/i18n)
- :material-translate: [react-i18next docs](https://react.i18next.com/)
- :material-book: [mkdocs-static-i18n](https://ultrabug.github.io/mkdocs-static-i18n/)
- :material-file-code: [ScenarioHelpModal.jsx](https://github.com/pizzif/poc_medical/blob/main/frontend/src/components/redteam/ScenarioHelpModal.jsx)
