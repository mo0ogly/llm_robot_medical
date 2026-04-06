# Scenarios d'attaque

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
