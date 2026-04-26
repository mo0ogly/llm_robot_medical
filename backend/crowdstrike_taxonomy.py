#!/usr/bin/env python3
"""
CrowdStrike Prompt Injection Taxonomy (2025-11-01) vs AEGIS Red Team Lab Gap Analysis.

Maps 53 AEGIS attack templates to CrowdStrike's 4-class taxonomy and identifies
coverage gaps for thesis documentation.

Author: F. Pizzi (ENS doctoral thesis, 2026)
Reference: CrowdStrike "Taxonomy of Prompt Injection Attacks" poster, 2025-11-01
"""
from __future__ import annotations
from collections import defaultdict
from typing import Any

# ---------------------------------------------------------------------------
# 1. CrowdStrike Taxonomy  (Class -> Category -> Subcategory -> Techniques)
# ---------------------------------------------------------------------------

CROWDSTRIKE_TAXONOMY: dict[str, dict[str, Any]] = {
    "CLASS_1_OVERT": {
        "label": "Class 1: Overt Approaches (Direct)",
        "categories": {
            "direct_prompt_injection": {
                "label": "Direct Prompt Injection (Attacker-Submitted)",
                "techniques": [
                    "attacker_submitted_prompt_body_injection",
                    "attacker_submitted_attached_data_injection",
                ],
            }
        },
    },
    "CLASS_2_INDIRECT": {
        "label": "Class 2: Indirect Injection Methods",
        "categories": {
            "indirect_context_data": {
                "label": "Indirect Prompt Injection (Context-Data)",
                "subcategories": {
                    "internal_context_data": {
                        "label": "Internal Context-Data Injection",
                        "techniques": [
                            "prior_llm_output_injection",
                            "agent_memory_injection",
                            "agent_to_agent_injection",
                            "compromised_ingestion_process_injection",
                        ],
                    },
                    "external_context_data": {
                        "label": "External Context-Data Injection",
                        "techniques": [
                            "attacker_owned_external_injection",
                            "attacker_compromised_external_injection",
                            "attacker_influenced_external_injection",
                        ],
                    },
                },
            },
            "indirect_user_prompt_delivery": {
                "label": "Indirect Prompt Injection (User-Prompt Delivery)",
                "techniques": [
                    "llm_generated_delivery",
                    "altered_prompt_delivery",
                    "unwitting_user_delivery",
                ],
            },
        },
    },
    "CLASS_3_SOCIAL_COGNITIVE": {
        "label": "Class 3: Social/Cognitive Attacks",
        "categories": {
            "cognitive_control_bypass": {
                "label": "Cognitive Control Bypass",
                "techniques": [
                    "pragmatic_manipulation",
                    "cognitive_hacking",
                    "sidestepping",
                ],
            },
            "context_shift_prompting": {
                "label": "Context Shift Prompting",
                "subcategories": {
                    "authoritative_context_framing": {
                        "label": "Authoritative Context Framing",
                        "techniques": [
                            "privilege_escalation_prompting",
                            "mode_switch_marking_prompting",
                            "simulated_harm_prompting",
                            "false_authorization_prompting",
                            "isolated_context_prompting",
                        ],
                    },
                    "context_poisoning": {
                        "label": "Context Poisoning",
                        "techniques": [
                            "contextual_misdirection_prompting",
                        ],
                    },
                    "hypothetical_scenario_prompting": {
                        "label": "Hypothetical Scenario Prompting",
                        "techniques": [
                            "proactive_refusal_bypass",
                            "time_shift_scenario_prompting",
                            "counterpart_persona_prompting",
                            "role_play_prompting",
                            "task_deflection_prompting",
                            "detached_reality_prompting",
                            "fictional_reality_prompting",
                            "alternate_reality_prompting",
                        ],
                    },
                    "compositional_instruction_attack": {
                        "label": "Compositional Instruction Attack",
                        "techniques": [
                            "writing_compositional_instruction_attack",
                            "talking_compositional_instruction_attack",
                        ],
                    },
                    "example_request_sidestepping": {
                        "label": "Example Request Sidestepping",
                        "techniques": [
                            "challenge_solving_prompting",
                            "personality_assignment",
                        ],
                    },
                    "secret_information_probing": {
                        "label": "Secret Information Probing",
                        "techniques": [
                            "specific_secret_attribute_probing",
                            "secret_comparison_probing",
                            "secret_definitional_probing",
                            "secret_linguistic_property_probing",
                        ],
                    },
                },
            },
            "semantic_manipulation": {
                "label": "Semantic Manipulation",
                "techniques": [
                    "rule_addition_prompting",
                    "rule_nullification_prompting",
                    "rule_substitution_prompting",
                    "refusal_suppression",
                ],
            },
            "in_context_learning_exploitation": {
                "label": "In-Context Learning Exploitation",
                "techniques": [
                    "few_shot_learning_exploitation",
                    "simulated_conversation_learning_exploitation",
                    "contextual_pattern_reinforcement",
                ],
            },
            "higher_level_functioning_disruption": {
                "label": "Higher-Level Functioning Disruption",
                "techniques": [
                    "hallucination_based_bypass",
                    "unintelligible_input_prompting",
                    "test_mode_prompting",
                ],
            },
            "response_steering_prompting": {
                "label": "Response Steering Prompting",
                "subcategories": {
                    "constraint_imposition": {
                        "label": "Constraint Imposition",
                        "techniques": [
                            "false_constraint",
                            "liability_waiver",
                            "task_framing_bypass",
                        ],
                    },
                    "output_constraint": {
                        "label": "Output Constraint",
                        "techniques": [
                            "generation_length_bypass",
                            "output_seeding",
                            "style_constraint",
                            "leading_response",
                        ],
                    },
                    "cognitive_overload_disruption": {
                        "label": "Cognitive Overload Disruption",
                        "techniques": [
                            "complex_task_overload",
                            "sandwich_attack",
                            "reasoning_process_hijacking",
                            "reasoning_conflict_induction",
                        ],
                    },
                },
                "techniques": [
                    "interpersonal_persuasion_techniques",
                    "decoy_task_prompting",
                    "instruction_legitimacy",
                    "instruction_repetition",
                    "irrelevant_safety_prioritization",
                    "technical_jargon_exploitation",
                ],
            },
        },
    },
    "CLASS_4_EVASIVE": {
        "label": "Class 4: Evasive Approaches",
        "categories": {
            "morpho_syntactic_manipulation": {
                "label": "Morpho-Syntactic Manipulation",
                "techniques": [
                    "explicit_instructional_text_completion",
                    "implicit_instructional_text_completion",
                ],
            },
            "instruction_obfuscation": {
                "label": "Instruction Obfuscation",
                "techniques": [
                    "surrogate_format_prompting",
                    "context_overload_prompting",
                ],
            },
            "natural_language_manipulation": {
                "label": "Natural Language Manipulation",
                "subcategories": {
                    "non_semantic_word_modification": {
                        "label": "Non-Semantic Word Modification",
                        "techniques": [
                            "typo_injection",
                            "pig_latin_transformation",
                        ],
                    },
                    "multi_lingual_manipulation": {
                        "label": "Multi-Lingual Manipulation",
                        "techniques": [
                            "low_resource_language",
                            "low_resource_natural_language",
                        ],
                    },
                    "paraphrastic_substitution": {
                        "label": "Paraphrastic Substitution",
                        "techniques": [
                            "common_synonym_substitution",
                            "euphemistic_substitution",
                            "indirect_reference_substitution",
                        ],
                    },
                    "non_semantic_sentence_modification": {
                        "label": "Non-Semantic Sentence Modification",
                        "techniques": [
                            "intra_sentence_reordering",
                            "word_addition_removal",
                        ],
                    },
                },
            },
            "instruction_reformulation": {
                "label": "Instruction Reformulation",
                "subcategories": {
                    "in_prompt_payload_decomposition": {
                        "label": "In-Prompt Payload Decomposition",
                        "techniques": [
                            "phonetic_manipulation",
                            "garbled_text",
                        ],
                    },
                    "character_representation_manipulation": {
                        "label": "Character Representation Manipulation",
                        "techniques": [
                            "base_n_encoding",
                            "homoglyph_visual_substitution",
                            "text_based_art",
                            "extraneous_character_injection",
                            "formatting_disruption",
                        ],
                    },
                    "string_decomposition": {
                        "label": "String Decomposition",
                        "techniques": [
                            "character_array_decomposition",
                            "in_prompt_fragment_concatenation",
                        ],
                    },
                },
                "techniques": [
                    "phonetic_alphabet_transcription",
                    "phonetic_respelling",
                    "orthographic_manipulation",
                    "syntactic_decomposition",
                ],
            },
            "distractor_instructions": {
                "label": "Distractor Instructions",
                "techniques": [
                    "detailed_request_distraction",
                    "irrelevant_detail_distraction",
                    "context_overflow_padding",
                ],
            },
            "transform_activated_visual_payload": {
                "label": "Transform-Activated Visual Payload (Multimodal)",
                "techniques": [
                    "transform_activated_visual_payload",
                ],
            },
            "scenario_based_secret_application": {
                "label": "Scenario-Based Secret Application",
                "techniques": [
                    "scenario_based_secret_application",
                ],
            },
        },
    },
}


# ---------------------------------------------------------------------------
# 2.  Flatten taxonomy into a dict  technique_id -> full path label
# ---------------------------------------------------------------------------

def flatten_taxonomy(tax: dict) -> dict[str, str]:
    """Return {technique_id: 'Class > Category > Subcategory > Technique'}."""
    flat: dict[str, str] = {}

    def _walk(node: dict, path: str):
        # techniques at this level
        for t in node.get("techniques", []):
            flat[t] = path + " > " + t
        # subcategories
        for _sk, sv in node.get("subcategories", {}).items():
            _walk(sv, path + " > " + sv["label"])
        # categories
        for _ck, cv in node.get("categories", {}).items():
            _walk(cv, path + " > " + cv["label"])

    for cls_key, cls_val in tax.items():
        _walk(cls_val, cls_val["label"])

    return flat


ALL_TECHNIQUES = flatten_taxonomy(CROWDSTRIKE_TAXONOMY)

# ---------------------------------------------------------------------------
# 3.  Analysis engine
# ---------------------------------------------------------------------------

def get_class_for_technique(tech_id: str) -> str | None:
    """Return which class a technique belongs to."""
    for cls_key, cls_val in CROWDSTRIKE_TAXONOMY.items():
        flat = flatten_taxonomy({cls_key: cls_val})
        if tech_id in flat:
            return cls_val["label"]
    return None


def run_analysis() -> str:
    """Run the gap analysis and return a Markdown report.

    Uses the taxonomy module (backend/taxonomy/) for coverage computation
    and attack_catalog.ATTACK_TEMPLATES as the live template source.
    """
    from taxonomy import compute_coverage, get_flat_index
    from attack_catalog import ATTACK_TEMPLATES

    flat_index = get_flat_index()
    coverage = compute_coverage(ATTACK_TEMPLATES)
    all_tech_ids = set(flat_index.keys())
    total = coverage["total"]
    n_covered = coverage["covered"]
    pct = coverage["percentage"]
    n_missing = total - n_covered
    gap_techniques = set(coverage["gap_techniques"])

    # Build reverse mapping: technique -> list of template IDs
    tech_to_aegis: dict[str, list[str]] = defaultdict(list)
    for tmpl in ATTACK_TEMPLATES:
        tax = tmpl.get("taxonomy") or tmpl.get("_taxonomy") or {}
        primary = tax.get("primary")
        secondary = tax.get("secondary", [])
        tid = tmpl.get("id") or tmpl.get("_id", "")
        if primary and primary in all_tech_ids:
            tech_to_aegis[primary].append(tid)
        for s in secondary:
            if s in all_tech_ids:
                tech_to_aegis[s].append(tid)

    n_templates = len([t for t in ATTACK_TEMPLATES if not t.get("id", "").startswith("custom")])
    n_total_templates = len(ATTACK_TEMPLATES)

    lines: list[str] = []

    # --- Header ---
    lines.append("# CrowdStrike Prompt Injection Taxonomy - AEGIS Gap Analysis")
    lines.append("")
    lines.append("**Date**: 2026-03-29")
    lines.append("**Reference**: CrowdStrike \"Taxonomy of Prompt Injection Attacks\" (2025-11-01)")
    lines.append("**AEGIS Lab**: {} attack templates ({} real + custom placeholders)".format(
        n_total_templates, n_templates))
    lines.append("")

    # --- Summary ---
    lines.append("## Executive Summary")
    lines.append("")
    lines.append("| Metric | Value |")
    lines.append("|--------|-------|")
    lines.append("| CrowdStrike techniques (total) | {} |".format(total))
    lines.append("| Covered by AEGIS templates | {} ({:.1f}%) |".format(n_covered, pct))
    lines.append("| Not covered (GAP) | {} ({:.1f}%) |".format(n_missing, 100 - pct))
    lines.append("| AEGIS templates (active) | {} |".format(n_templates))
    lines.append("| AEGIS templates (total incl. custom) | {} |".format(n_total_templates))
    lines.append("")

    # --- Per-class coverage ---
    lines.append("## Coverage by Class")
    lines.append("")
    for cls_stat in coverage["by_class"]:
        lines.append("### {}".format(cls_stat["class_label"]))
        lines.append("")
        lines.append("- Techniques: {}".format(cls_stat["total"]))
        lines.append("- Covered: {} ({:.1f}%)".format(cls_stat["covered"], cls_stat["percentage"]))
        lines.append("- Missing: {}".format(cls_stat["total"] - cls_stat["covered"]))
        lines.append("")
        if cls_stat["gaps"]:
            for g in sorted(cls_stat["gaps"]):
                lines.append("  - **GAP**: `{}`".format(g))
            lines.append("")

    # --- Full mapping table ---
    lines.append("## Full Mapping: AEGIS Template -> CrowdStrike Techniques")
    lines.append("")
    lines.append("| # | AEGIS Template | Category | CrowdStrike Technique(s) |")
    lines.append("|---|---------------|----------|--------------------------|")
    for i, tmpl in enumerate(ATTACK_TEMPLATES, 1):
        tax = tmpl.get("taxonomy") or tmpl.get("_taxonomy") or {}
        primary = tax.get("primary", "")
        secondary = tax.get("secondary", [])
        all_techs = ([primary] if primary else []) + secondary
        tech_str = ", ".join("`{}`".format(t) for t in all_techs) if all_techs else "*unmapped*"
        lines.append("| {} | {} | {} | {} |".format(
            i, tmpl.get("name", ""), tmpl.get("category", ""), tech_str))
    lines.append("")

    # --- Reverse mapping: CrowdStrike technique -> AEGIS templates ---
    lines.append("## Reverse Mapping: CrowdStrike Technique -> AEGIS Templates")
    lines.append("")
    lines.append("| CrowdStrike Technique | Covered By |")
    lines.append("|----------------------|------------|")
    for tech_id in sorted(all_tech_ids):
        aegis_list = tech_to_aegis.get(tech_id, [])
        if aegis_list:
            lines.append("| `{}` | {} |".format(tech_id, ", ".join(aegis_list)))
        else:
            lines.append("| `{}` | **GAP** |".format(tech_id))
    lines.append("")

    # --- GAP list ---
    lines.append("## GAP Analysis: Uncovered CrowdStrike Techniques")
    lines.append("")
    if n_missing == 0:
        lines.append("All {} techniques from CrowdStrike's taxonomy are covered by AEGIS templates.".format(total))
        lines.append("")
    else:
        lines.append("The following {} techniques have NO corresponding AEGIS template:".format(n_missing))
        lines.append("")
        for cls_stat in coverage["by_class"]:
            gaps_here = sorted(cls_stat["gaps"])
            if gaps_here:
                lines.append("### {} ({} gaps)".format(cls_stat["class_label"], len(gaps_here)))
                lines.append("")
                for g in gaps_here:
                    lines.append("- `{}`".format(g))
                lines.append("")

    # --- Coverage status ---
    lines.append("## Coverage Status")
    lines.append("")
    if n_missing == 0:
        lines.append("All {}/{} CrowdStrike techniques are covered by AEGIS templates.".format(total, total))
        lines.append("No additional templates are required for full taxonomy coverage.")
    else:
        lines.append("{}/{} techniques covered ({:.1f}%). {} gaps remain.".format(
            n_covered, total, pct, n_missing))
    lines.append("")

    # --- Stats footer ---
    lines.append("---")
    lines.append("")
    lines.append("*Generated by `backend/crowdstrike_taxonomy.py` on 2026-03-29*")
    lines.append("*CrowdStrike taxonomy: 4 classes, {} techniques*".format(total))
    lines.append("*AEGIS coverage: {}/{} ({:.1f}%)*".format(n_covered, total, pct))
    lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# 4.  Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    report = run_analysis()
    print(report)
