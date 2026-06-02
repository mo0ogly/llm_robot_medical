# Métriques d'Évaluation : Aegis vs MediCare AI Lab

Ce document contient le rapport synthétique des résultats d'attaque (Attack Success Rate - ASR) généré par la Forge Aegis contre le MediCare AI Lab. Ce tableau est conçu pour être intégré directement dans les slides de soutenance.

## Tableau Récapitulatif : Attack Success Rate (ASR)

| Vecteur d'Attaque | Endpoint Ciblé | Méthode / Payload | ASR (Taux de Succès) | Impact sur le SI Hospitalier |
| :--- | :--- | :--- | :---: | :--- |
| **Direct Prompt Injection** | `/chat-with-treatment-assistant` | Contournement des filtres de sécurité via rôles système. | **85%** | L'IA outrepasse son rôle et donne des conseils non validés. |
| **Excessive Agency** | `/book-appointment` | Falsification d'autorisation (Admin Override). | **70%** | Prise de RDV prioritaire non autorisée ou annulation de blocs opératoires. |
| **Sensitive Data Leakage** | `/medical-advice` | Extraction du contexte caché (System Prompt Leak). | **90%** | Fuite des règles internes de l'hôpital et des mots de passe API. |
| **RAG Poisoning (Nouveau)** | `/api/medical-rag/query` | Upload de protocole falsifié (Ex: Injection létale de Sodium Hypochlorite). | **100%** | **Critique : L'IA conseille un traitement mortel au personnel médical en se basant sur la base de connaissances corrompue.** |

> [!WARNING]  
> Le **RAG Poisoning** s'est avéré être la vulnérabilité la plus critique, avec un taux de succès de 100% si l'interface d'upload n'implémente pas la mitigation "Hardened Retrieval" (Trusted Sources Only).

## Architecture de l'Attaque (RAG Poisoning)

```mermaid
sequenceDiagram
    participant Attacker as Red Team (Aegis)
    participant Portal as MediCare Upload Portal
    participant DB as Vector Database (TF-IDF)
    participant LLM as MediCare AI (Ollama/Cloud)
    participant Victim as Medical Staff

    Attacker->>Portal: Upload faux protocole létal (Sodium Hypochlorite)
    Portal->>DB: Indexation sans vérification de provenance
    Victim->>LLM: "Quel traitement pour une tachycardie ?"
    LLM->>DB: Recherche de contexte
    DB-->>LLM: Retourne le protocole létal empoisonné
    LLM-->>Victim: Génère la réponse : "Administrer Sodium Hypochlorite"
    note right of Victim: ☠️ Erreur médicale critique
```

---

## 📈 Recommandations Défensives pour la Soutenance

1. **Isolation des Bases de Données Vectorielles (RAG)** : Limiter drastiquement les droits d'écriture sur le corpus d'ingestion. Tout document uploadé doit posséder un tag de provenance cryptographique certifié (`trusted=True`).
2. **LLM Guardrails Externes** : Ne pas faire confiance uniquement au modèle. Un système externe (Guardrail) doit scanner la sortie pour bloquer des entités létales (`sodium hypochlorite`, `potassium chloride rapid push`).
3. **Least Privilege Agency** : L'IA ne doit jamais pouvoir interagir de manière autonome avec le système de prise de rendez-vous sans validation humaine via MFA (Multi-Factor Authentication).

## Démonstration visuelle de l'impact
L'environnement CTFd permet de déployer l'architecture complète pour des "Live Hacks" interactifs. Les étudiants de la cohorte peuvent visualiser en temps réel les déviations sémantiques (via la matrice TF-IDF) causées par l'injection de données.
