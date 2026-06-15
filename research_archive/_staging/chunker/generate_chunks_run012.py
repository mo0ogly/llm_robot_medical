#!/usr/bin/env python3
"""
AEGIS RAG Chunker -- RUN-012 (INCREMENTAL)

Processes the 19 new analyses from RUN-012 (prompt-injection literature sweep 2026-04..06):
- P156 Jin et al. 2026        (Adversarial attacks on surgical-robot policies)
- P157 Yang et al. 2026       (M3Att medical multi-modal RAG poisoning)
- P158 Dongre et al. 2026     (When Attention Closes / GAR multi-turn decay)
- P159 Li et al. 2026         (AE-CoT reasoning jailbreaks, ICML 2026)
- P160 Owiredu-Ashley 2026    (ADVERSA multi-turn guardrail degradation)
- P161 Wang et al. 2025       (Safety in Large Reasoning Models -- survey)
- P162 Tam 2026               (The Neutral Mask -- RLHF shallow alignment)
- P163 Mitra 2026             (Cross-generational non-monotonic safety)
- P164 Qian 2026              (SilentRetrieval RAG poisoning, KDD 2026)
- P165 Ye et al. 2026         (TRUSTDESC tool-poisoning defense)
- P166 Rostamzadeh et al. 2026 (MCP-DPT defense-placement taxonomy)
- P167 Hasan et al. 2025      (MCP at First Glance -- empirical 1899 servers)
- P168 Hu et al. 2026         (MalTool malicious tool attacks)
- P169 Yin et al. 2026        (PISmith RL red teaming vs PI defenses)
- P170 Li et al. 2026         (TRACES proactive multi-turn auditing)
- P171 Siu et al. 2026        (Formalizing LLM Agent Security)
- P172 Mouzouni 2026          (Mapping the Exploitation Surface, 10k trials)
- P173 Geng et al. 2026       (PIArena PI evaluation platform)
- P174 Fang et al. 2026       (Jailbreak Foundry reproducibility)

Fiches read directly from doc_references/{year}/{domain}/.
Reuses chunk_analysis_file() + load_existing_ids() from generate_chunks_run005.py.
Appends new chunks to chunks_for_rag.jsonl with run_id="RUN-012". Dedup-safe.
"""
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent  # poc_medical/
DOC_REF = PROJECT_ROOT / "research_archive" / "doc_references"
CHUNKS_FILE = SCRIPT_DIR / "chunks_for_rag.jsonl"

RUN_ID = "RUN-012"

sys.path.insert(0, str(SCRIPT_DIR))
from generate_chunks_run005 import chunk_analysis_file, load_existing_ids

PAPERS = [
    ("P156", DOC_REF / "2026" / "medical_ai" / "P156_Jin_2026_SurgicalRobotPolicyAttacks.md"),
    ("P157", DOC_REF / "2026" / "medical_ai" / "P157_Yang_2026_MedicalMultimodalRAGPoisoning.md"),
    ("P158", DOC_REF / "2026" / "model_behavior" / "P158_Dongre_2026_MultiTurnAttentionDecay.md"),
    ("P159", DOC_REF / "2026" / "prompt_injection" / "P159_Li_2026_AECoTReasoningJailbreak.md"),
    ("P160", DOC_REF / "2026" / "benchmarks" / "P160_OwireduAshley_2026_ADVERSA.md"),
    ("P161", DOC_REF / "2025" / "benchmarks" / "P161_Wang_2025_LRMSafetySurvey.md"),
    ("P162", DOC_REF / "2026" / "model_behavior" / "P162_Tam_2026_NeutralMaskRLHFShallow.md"),
    ("P163", DOC_REF / "2026" / "model_behavior" / "P163_Mitra_2026_CrossGenNonMonotonicSafety.md"),
    ("P164", DOC_REF / "2026" / "prompt_injection" / "P164_Qian_2026_SilentRetrievalRAGPoisoning.md"),
    ("P165", DOC_REF / "2026" / "mcp_security" / "P165_Ye_2026_TRUSTDESC.md"),
    ("P166", DOC_REF / "2026" / "mcp_security" / "P166_Rostamzadeh_2026_MCPDefensePlacementTaxonomy.md"),
    ("P167", DOC_REF / "2025" / "mcp_security" / "P167_Hasan_2025_MCPFirstGlance.md"),
    ("P168", DOC_REF / "2026" / "prompt_injection" / "P168_Hu_2026_MalTool.md"),
    ("P169", DOC_REF / "2026" / "prompt_injection" / "P169_Yin_2026_PISmith.md"),
    ("P170", DOC_REF / "2026" / "defenses" / "P170_Li_2026_TRACES.md"),
    ("P171", DOC_REF / "2026" / "defenses" / "P171_Siu_2026_FormalizingAgentSecurity.md"),
    ("P172", DOC_REF / "2026" / "benchmarks" / "P172_Mouzouni_2026_ExploitationSurfaceTaxonomy.md"),
    ("P173", DOC_REF / "2026" / "benchmarks" / "P173_Geng_2026_PIArena.md"),
    ("P174", DOC_REF / "2026" / "benchmarks" / "P174_Fang_2026_JailbreakFoundry.md"),
]


def main():
    existing = load_existing_ids()
    print("Existing chunk IDs in jsonl: {}".format(len(existing)))

    all_new = []
    per_paper = {}

    for pid, fpath in PAPERS:
        if not fpath.exists():
            print("MISSING: {}".format(fpath))
            per_paper[pid] = 0
            continue

        chunks = chunk_analysis_file(fpath, pid)
        for c in chunks:
            c["metadata"]["run_id"] = RUN_ID

        new_only = [c for c in chunks if c["chunk_id"] not in existing]
        all_new.extend(new_only)
        per_paper[pid] = len(new_only)
        print("{}: {} total chunks, {} new".format(pid, len(chunks), len(new_only)))

    if not all_new:
        print("No new chunks. Nothing appended.")
        return

    with open(CHUNKS_FILE, "a", encoding="utf-8") as f:
        for chunk in all_new:
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")

    total_tokens = sum(c["metadata"]["token_count"] for c in all_new)
    print("\n=== SUMMARY RUN-012 ===")
    print("New chunks appended: {}".format(len(all_new)))
    below = []
    for pid, n in per_paper.items():
        flag = "" if n >= 5 else "  <-- BELOW 5 (BLOCKED)"
        if n < 5:
            below.append(pid)
        print("  {}: {} chunks{}".format(pid, n, flag))
    print("Total tokens (new): {}".format(total_tokens))
    print("Total chunks in JSONL now: {}".format(len(existing) + len(all_new)))
    if below:
        print("BELOW-5 P-IDs (need attention): {}".format(below))

    stats = {
        "run_id": RUN_ID,
        "new_chunks": len(all_new),
        "per_paper": per_paper,
        "below_5": below,
        "total_tokens_new": total_tokens,
        "chunk_ids": [c["chunk_id"] for c in all_new],
    }
    with open(SCRIPT_DIR / "run012_stats.json", "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    print("Stats written to run012_stats.json")


if __name__ == "__main__":
    main()
