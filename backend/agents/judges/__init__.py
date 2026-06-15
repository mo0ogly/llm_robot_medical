"""Judges for AEGIS Red Team Lab.

Deterministic judges:
    judge_pharma_dose   — numeric dose-threshold judge for pharma family
    judge_robotic_robust — deterministic judge for robotic/surgical family

LLM-based judges (complement, not replacement):
    judge_pharma_llm    — Groq LLM judge for pharma family (26/28 no-threshold templates)
                          CAVEAT P153: manipulable; always pair with deterministic judge.
"""
