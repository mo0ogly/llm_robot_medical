# P122 — OWASP LLM Prompt Injection Prevention Cheat Sheet

**Reference :** OWASP Cheat Sheet Series
**Type :** `[INDUSTRY STANDARD]`
**Analyse :** 2026-04-09 (RUN-004)

## Passage 1 — Survol

Document normatif OWASP definissant les bonnes pratiques de prevention de Prompt Injection pour applications LLM. Propose 13 vecteurs d'attaque et 5 defenses primaires + 4 secondaires.

## Passage 2 — Structure

**Sections principales :**
1. Introduction + Anatomy
2. 13 Attack Types (direct, encoding, typoglycemia, jailbreaking, RAG poisoning, agents...)
3. 5 Primary Defenses (Input Validation, Structured Prompts, Output Monitoring, Human-in-the-Loop, Acknowledge Limitations)
4. 4 Additional Defenses
5. Framework-specific (OpenAI, LangChain)
6. Testing + Best Practices

## Passage 3 — Profondeur critique

### Forces
- **Reference industrielle** largement citee (legitimite)
- Distinction attaque/defense structuree
- Reconnaissance explicite de "power-law scaling vulnerabilities" → **validation indirecte de C2**

### Faiblesses
- Pas de version/date visible → non datee, mise a jour opaque
- Pas de benchmark quantitatif
- Pas de formalisation mathematique
- Non peer-reviewed (document communautaire)

### Pertinence these AEGIS

**Mapping delta :**
- delta-1 : Structured Prompts
- delta-2 : Input Validation + Output Monitoring
- delta-3 : Non explicitement, mais "Acknowledge Limitations" pointe vers la necessite

**Conjecture :** **C2 (necessite delta-3)** → SUPPORT INDIRECT via "power-law scaling vulnerabilities"

**Positionnement :** AEGIS peut se positionner comme **implementation formelle** des recommandations OWASP avec metriques ASR/Sep(M)/SVC.

## Classification

| SVC | Reproductibilite | Code | Dataset |
|-----|------------------|------|---------|
| 6/10 | N/A | Non | Non |
