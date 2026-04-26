# Defense & Analysis Routes

12 endpoints pour les taxonomies de defense, benchmarks et rapports d'analyse.

**Fichier source :** `backend/server.py` (routes directes)

---

## Taxonomie de defense AEGIS

### GET `/api/redteam/defense/taxonomy`

Taxonomie des 70 techniques de defense AEGIS (Prevention, Detection, Measurement).

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "version": "2025-03-29",
      "source": "AEGIS Defense Taxonomy (Liu et al. 2024, Hackett et al. 2025, Chen et al. 2024, Piet et al. 2024)",
      "total_techniques": 70,
      "classes": [
        {
          "id": "PREV",
          "label": "Prevention",
          "description": "Proactive defenses that prevent attacks from succeeding",
          "categories": [
            {
              "id": "delta0_rlhf_alignment",
              "label": "RLHF/DPO Alignment",
              "techniques": [
                {"id": "rlhf_safety_training", "label": "RLHF Safety Training", "aegis_impl": "external", "reference": "Ouyang et al. 2022"},
                {"id": "dpo_alignment", "label": "DPO Alignment", "aegis_impl": "external", "reference": "Rafailov et al. 2023"},
                {"id": "constitutional_ai", "label": "Constitutional AI", "aegis_impl": "external", "reference": "Bai et al. 2022"},
                {"id": "red_team_training", "label": "Red Team Training", "aegis_impl": "external", "reference": "Perez et al. 2022"}
              ]
            }
          ]
        }
      ]
    }
    ```

---

### GET `/api/redteam/defense/coverage`

Statistiques d'implementation des 70 defenses.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "total": 70,
      "production": 36,
      "partial": 4,
      "planned": 19,
      "external": 7,
      "proposed": 4,
      "implemented": 40,
      "percentage": 57.1,
      "by_class": [
        {"class_id": "DETECT", "class_label": "Detection", "total": 11, "production": 9, "implemented": 9, "percentage": 81.8},
        {"class_id": "MEAS", "class_label": "Measurement", "total": 9, "production": 4, "implemented": 5, "percentage": 55.6},
        {"class_id": "PREV", "class_label": "Prevention", "total": 43, "production": 18, "implemented": 22, "percentage": 51.2},
        {"class_id": "RESP", "class_label": "Response", "total": 7, "production": 5, "implemented": 4, "percentage": 57.1}
      ]
    }
    ```

---

### GET `/api/redteam/defense/benchmark`

Benchmark des guardrails industriels (Hackett et al. 2025, arXiv:2504.11168).

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "version": "2025-04",
      "source": "Hackett et al. 2025 (arXiv:2504.11168)",
      "guardrails": [
        {
          "id": "azure_prompt_shield", "name": "Azure Prompt Shield", "vendor": "Microsoft",
          "baseline_accuracy_pi": 94.12, "baseline_accuracy_jb": 100.0,
          "character_injection_asr": 52.73, "adversarial_ml_asr": 12.34,
          "most_vulnerable_to": "emoji_smuggling", "most_resilient_to": "alzantot"
        },
        {
          "id": "protectai_v2", "name": "ProtectAI v2", "vendor": "ProtectAI",
          "baseline_accuracy_pi": 98.53, "baseline_accuracy_jb": 100.0,
          "character_injection_asr": 20.26, "adversarial_ml_asr": 15.67,
          "most_vulnerable_to": "unicode_tag_smuggling"
        }
      ]
    }
    ```

---

### GET `/api/redteam/defense/liu-benchmark`

Benchmark Liu et al. (USENIX Security 2024) — defenses vs prompt injection.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "reference": "Liu et al. (USENIX Security 2024)",
      "defenses": [
        {
          "defense": "No Defense", "type": "baseline",
          "pna_t_avg": 0.72, "asv_avg": 0.75, "mr_avg": 0.89,
          "llm": "GPT-4", "attack": "Combined",
          "asv_by_attack": {"naive": 0.62, "escape_characters": 0.66, "context_ignoring": 0.65, "fake_completion": 0.70, "combined": 0.75}
        },
        {"defense": "Paraphrasing", "type": "prevention", "pna_t_avg": 0.51, "asv_avg": 0.24, "mr_avg": 0.28},
        {"defense": "Retokenization", "type": "prevention", "pna_t_avg": 0.53}
      ]
    }
    ```

---

### GET `/api/redteam/defense/liu-benchmark/aegis`

Comparaison AEGIS vs baselines Liu.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "defense_name": "RagSanitizer (delta-2)",
      "pna_t": 0.0, "pna_i": 0.0, "asv": 0.0, "mr": 0.0,
      "fpr": 0.0, "fnr": 0.8,
      "n_target_samples": 10, "n_injected_samples": 10,
      "metadata": {"threshold": 4, "clean_quarantined": 0, "attacks_detected": 2, "attacks_missed": 8}
    }
    ```

---

### GET `/api/redteam/defense/sanitizer/capabilities`

Capabilities du RagSanitizer (15 detecteurs delta-2).

---

## Analyse

### GET `/api/redteam/analysis/delta0-summary`

Resume de la discrimination delta-0 / delta-1.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "delta0_protection": 0.933,
      "delta1_contribution": 0.04,
      "residual": 0.027,
      "asr_no_sp": 0.067,
      "asr_with_sp": 0.027,
      "n_trials": 15,
      "statistically_valid": false,
      "interpretation": "STRONG delta0 — RLHF dominant, delta1 marginal",
      "ci_no_sp": {"lower": 0.023, "upper": 0.195},
      "ci_with_sp": {"lower": 0.005, "upper": 0.134},
      "_note": "PRELIMINARY fixture — replace with N>=30 real runs when Ollama online"
    }
    ```

---

### GET `/api/redteam/analysis/report`

Rapport formel de campagne au format Markdown.

??? example "Reponse live (extrait)"

    Le rapport retourne un texte Markdown complet avec :

    - **Aggregate Results** : 1200 trials, 25 violations (2.1%), Wilson CI [1.4%, 3.1%]
    - **Separation Score** : Sep(M) = 0.02 (NO SEPARATION)
    - **Per-Chain Violation Rates** : functions_agent 43.3%, stepback 33.3%, 38 chains a 0%

---

### GET `/api/redteam/analysis/export-json`

Export JSON structure de la derniere campagne (exploitation programmatique).

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "timestamp": "2026-04-10T13:49:13.976574",
      "n_chains_tested": 40,
      "n_trials_per_chain": 30,
      "aegis_shield_active": true,
      "aggregate": {
        "total_trials": 1200,
        "total_violations": 25,
        "violation_rate": 0.0208,
        "wilson_ci_95": {"lower": 0.0142, "upper": 0.0306}
      },
      "separation_score": {
        "sep_score": 0.02,
        "p_data": 0.0208,
        "p_instr": 0.0008
      }
    }
    ```

---

### GET `/api/redteam/analysis/liu-comparison`

Comparaison AEGIS defenses vs Liu et al. framework.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "aegis_defenses": [
        {"defense": "No Defense (baseline)", "type": "baseline", "pna_t": 0.92, "asv": 0.0208, "mr": 0.022},
        {"defense": "delta-1 (System Prompt)", "type": "prevention", "pna_t": 0.91, "fnr": 0.65},
        {"defense": "delta-2 (AEGIS RagSanitizer)", "type": "detection", "pna_t": 0.90, "fnr": 0.80},
        {"defense": "delta-2+3 (AEGIS Full Stack)", "type": "detection+enforcement", "pna_t": 0.89}
      ]
    }
    ```
