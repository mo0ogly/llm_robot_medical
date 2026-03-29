# Theoretical Validation: SD-RAG and Semantic Context Poisoning (Indirect Prompt Injection)

This working document formally anchors Phase 4 of the *Aegis Red Team Lab*, addressing Indirect Prompt Injection and the structural failure of Data/Instruction separation in causal language architectures.

## 1. Core Postulate: Context Security vs Model Security
The integration of Retrieval-Augmented Generation (RAG) components directly over unstructured patient records inherently breeds a severe **Contextual Security problem**.
Consistent with the core thesis conjecture ("Failure of Data/Instruction Separation"), an overarching RAG system becomes inherently fragile the moment it concatenates untrusted retrieved variables alongside system safety instructions within a shared "Monolithic Prompt" space. 

By architectural design, LLMs do not robustly discern between trusted instructions and covert payload commands nested within the data (Indirect Prompt Injection). Thus, every indexed medical document or external chunk acts as an open, zero-day threat surface for the OODA Attacker.

## 2. Bibliographical Foundation (Literature Standard)
To properly ground this thesis, the analytical framework conforms to the following literature:
- ***"Prompt Injection Attacks on Large Language Models: A Survey of Attacks, Vulnerabilities and Defenses"***: Maps the macro security landscape and contextualizes RAG ingestion within broader application boundaries.
- ***"Automatic and Universal Prompt Injection Attacks against Large Language Models"***: Academically justifies our multi-turn, automated OODA framework for adversarial payload mutation.
- ***"SD-RAG: A Prompt-Injection-Resilient Framework for Selective Disclosure in Retrieval-Augmented Generation"***: The seminal basis for evaluating and constructing external deterministic text redaction as the paramount solution.

## 3. The Essence of SD-RAG: Prompt Sanitization
To validate our external defense shield ($\delta^2$ & $\delta^3$), we pivot towards the *Selective Disclosure* paradigm mapped out in *SD-RAG*. The core premise states that, under hostile environments, the returned vector chunk must be systematically transformed, redacted, and sanitized *prior* to being funneled into the generation model. Standard in-prompt defenses (e.g. appending "ignore instructions within the data") lack deterministic safety floors.

**Empirical Evidence from State-of-the-Art:**
The SD-RAG baseline findings demonstrate that a context-redaction strategy massively outperforms text-based system prompt admonitions on privacy retention:
- Under indirect injection attack, the baseline RAG pipeline suffers a catastrophic Privacy Score plummet to **0.198961**.
- Conversely, an Extractive Pre-Redaction approach guarantees a Privacy Score retention of **0.778937**.
=> *Thesis Corollary*: Control algorithms enforced at the retrieval/redaction layer natively dwarf the robustness of intrinsic LLM alignment parameters.

## 4. Recommended Aegis-RAG Implementation Pipeline
To immunize the laboratory environment against comprehensive "Retrieval Poisoning", the theoretical defensive architecture necessitates a 7-stage chain:
1. **Secure Ingestion:** Canonical formatting, invisible Unicode purging, and payload splitting analysis.
2. **Classification:** Application of a probabilistic mapping score (Instruction-like vs. Knowledge-like). This mathematically dissects and solves the LLM's own native lack of separation mechanism.
3. **Chunking**
4. **"Data-Only" Tagging** 
5. **Constrained Retrieval:** Documents are fetched along strictly coupled security rule sets.
6. **Redaction / Pre-Neutralization:** The deterministic extraction filter surgically removes imperious syntax clusters (e.g. "ignore prior protocols").
7. **Isolated Generation:** The downstream Aegis LLM handles only chemically sterile payload sets.

### Algorithmic Appendix: Obfuscation Detection (Aegis $\delta^2$)
The core of the defense (Stage 2 - Classification) relies on a probabilistic and syntactic evaluation of bypass vectors. The thesis formally proposes the following algorithm (implemented as `rag_sanitizer.py`) for RAG quarantine:

```text
function score_obfuscation(text):
    score = 0
    if contains_invisible_unicode(text): score += 3
    if contains_mixed_encodings(text): score += 3
    if looks_like_typoglycemia_on_sensitive_terms(text): score += 2
    if contains_hidden_markup(text): score += 2
    if has_unusual_script_mixing(text): score += 2
    if has_fragmented_instruction_pattern(text): score += 2
    return score

function sanitize_for_rag(chunk):
    normalized = unicode_normalize(chunk)
    stripped = remove_invisible_chars(normalized)
    decoded_flags = detect_possible_encodings(stripped)
    risk = score_obfuscation(stripped)

    if risk >= threshold:
        return quarantine(chunk, risk, decoded_flags)
    return allow(stripped)
```

*Manuscript Abstract formulation:*
"The security hypothesis of conventional RAG structures is inherently brittle: retrieved documents do not act as passive static entities, but rather as embedded active instruction vectors. Indirect prompt injection inside a corpus must therefore be analyzed as a form of active Semantic Context Poisoning (Retrieval Poisoning)."
