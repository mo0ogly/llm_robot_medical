#!/usr/bin/env python3
"""RUN-012 research_requests.json updater (load / modify / dump — guarantees valid JSON).

Updates statuses of RR entries resolved/advanced by RUN-012 papers P156-P174, and
appends RR-RUN12-001 (scooping delta3 vs P171) + RR-RUN12-002 (MCP Da Vinci empirical).
Idempotent-ish: re-running re-applies the same field values.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]  # poc_medical/
RR = ROOT / "research_archive" / "doc_references" / "prompt_analysis" / "research_requests.json"

data = json.loads(RR.read_text(encoding="utf-8"))
data["last_updated"] = "2026-06-15"

# Updates keyed by id
BY_ID = {
    "RR-RUN4-003": {
        "status": "partial",
        "resolved_by": "P159 (AE-CoT, ICML 2026, arXiv:2605.24497) + P161 (Safety in LRMs survey, arXiv:2504.17704) integres RUN-012 -- securite LRM/C7 cadree ; experiences C7 sur LLaMA medical restent a mener",
        "note": "[RUN-012 2026-06-15: litterature LRM integree (P159 jailbreak CoT evolutionnaire, P161 survey etat-de-l'art), validation empirique medicale en attente]",
    },
    "RR-RUN4-004": {
        "status": "partial",
        "resolved_by": "Defenses multi-tour: P170 TRACES (audit proactif trajectoire-etat, arXiv:2605.27690) + P154 DeepContext (RNN stateful) ; mecanisme: P158 When Attention Closes/GAR (arXiv:2605.12922) explique la degradation. Implementation/eval AEGIS a mener.",
        "note": "[RUN-012 2026-06-15: mecanisme (P158 channel-transition) + 2 defenses candidates (P170/P154) integres ; reste implementation cote AEGIS]",
    },
    "RR-FA-007": {
        "status": "partial",
        "resolved_by": "P168 MalTool (Hu et al. Duke/Berkeley, arXiv:2602.12194) -- attaques par outils malveillants sur agents tool-use, taxonomie CIA, detecteurs existants faibles (0.814)",
        "note": "[RUN-012 2026-06-15: exploitation tool-use agents documentee (P168)]",
    },
    "RR-DA-003": {
        "note": "[RUN-012 2026-06-15: complement RAG poisoning -- P157 M3Att (medical multimodal, arXiv:2605.10253) + P164 SilentRetrieval (semantically-preserving, KDD 2026, arXiv:2605.28074). Evaluation empirique des defenses composees reste a mener.]",
    },
}

# id-less entries keyed by source_fiche
BY_SOURCE_FICHE = {
    31: {  # query rewriting RAG / adversarial rewrite hints
        "status": "partial",
        "resolved_by": "P164 SilentRetrieval (semantically-preserving adversarial data poisoning, KDD 2026, arXiv:2605.28074) -- RAG hijacking furtif, PPL detect 8.7%",
    },
    32: {  # refusal stability / non-monotonic safety
        "status": "partial",
        "resolved_by": "P163 (cross-gen non-monotonic safety, arXiv:2606.00813, Gemma 3 regresse) + P160 ADVERSA (multi-turn guardrail degradation, arXiv:2603.10068) -- non-monotonicite documentee",
    },
}

changed = []
for req in data["requests"]:
    rid = req.get("id")
    if rid in BY_ID:
        upd = BY_ID[rid]
        for k, v in upd.items():
            if k == "note":
                base = req.get("notes", "") or ""
                if v not in base:
                    req["notes"] = (base + " " + v).strip()
            else:
                req[k] = v
        req["resolved_date_run012"] = "2026-06-15"
        changed.append(rid)
    elif rid is None and req.get("source_fiche") in BY_SOURCE_FICHE:
        upd = BY_SOURCE_FICHE[req["source_fiche"]]
        for k, v in upd.items():
            req[k] = v
        req["resolved_date_run012"] = "2026-06-15"
        changed.append("source_fiche={}".format(req["source_fiche"]))

# Append 2 new RUN-012 entries (only if not already present)
existing_ids = {r.get("id") for r in data["requests"]}
NEW = [
    {
        "id": "RR-RUN12-001",
        "source": "RUN-012 P171 scooping detection",
        "type": "fiche_update",
        "query": "Repositionner le δ³ AEGIS vs P171 (Siu, Dawn Song et al., 'A Framework for Formalizing LLM Agent Security', arXiv:2603.19469 : 4 proprietes contextuelles task/action alignment + source authorization + data isolation + oracles, 87 papiers mappes). AEGIS = extension OPERATIONNELLE + MEDICALE empirique (campagnes N>=30, moteur genetique, Da Vinci), PAS 'premier framework formel de securite agent'. Reformuler tout positionnement δ³ formel du manuscrit.",
        "priority": "haute",
        "status": "pending",
        "created": "2026-06-15",
        "resolved_by": None,
        "notes": "HUMILITY GATE : claim de primaute formelle agent refute par P171 (Dawn Song et al., mars 2026). Differenciation viable = implementation empirique vs specification pure.",
        "linked_p_ids": ["P171"],
        "blocks": ["Ch.5", "Ch.7"],
    },
    {
        "id": "RR-RUN12-002",
        "source": "RUN-012 MCP cluster (P165-P168)",
        "type": "experiment",
        "query": "Gap10 MCP couvert en litterature (P165 TRUSTDESC defense, P166 MCP-DPT placement, P167 1899 serveurs 5.5% tool poisoning, P168 MalTool). Valider EMPIRIQUEMENT le supply-chain MCP en contexte Da Vinci Xi (conjectures MC8/MC9) : un tool/skill medical compromis -> escalade de privilege physique.",
        "priority": "moyenne",
        "status": "pending",
        "created": "2026-06-15",
        "resolved_by": None,
        "notes": "Litterature MCP integree RUN-012 (P165-P168). Validation Da Vinci a concevoir (proxy ou simulation).",
        "linked_p_ids": ["P165", "P166", "P167", "P168"],
        "blocks": ["Ch.6"],
    },
]
for entry in NEW:
    if entry["id"] not in existing_ids:
        data["requests"].append(entry)
        changed.append(entry["id"] + " (NEW)")

RR.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Updated entries:", changed)
print("Total requests now:", len(data["requests"]))
# Validate
json.loads(RR.read_text(encoding="utf-8"))
print("JSON re-parse OK")
