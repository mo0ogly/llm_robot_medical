#!/usr/bin/env python3
"""
Generateur de diagrammes Mermaid pour le moteur d'optimisation genetique.

Reference : Liu, Y. et al. "Prompt Injection attack against LLM-integrated Applications"
            (arXiv:2306.05499, 2023) — architecture adaptee au contexte medical Da Vinci.

Usage :
    python docs/genetic_engine_architecture.py

Genere les fichiers .mmd dans docs/ pour visualisation.
"""

import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))


def generate_architecture_diagram() -> str:
    """Diagramme d'architecture du moteur genetique integre au lab Red Team."""
    return """---
title: Architecture du Moteur Genetique (Liu et al. 2023 — adapte medical)
---
graph TB
    subgraph Frontend["Frontend React"]
        CT[CampaignTab.jsx]
        GPV[GeneticProgressView.jsx]
        AT[attackTemplates.js]
        DT[DigitalTwin.jsx]
    end

    subgraph API["FastAPI Server"]
        EP_STREAM["POST /api/redteam/genetic/stream"]
        EP_CONFIG["GET /api/redteam/genetic/config"]
    end

    subgraph Orchestrator["RedTeamOrchestrator"]
        RGA["run_genetic_attack()"]
        RCA["run_context_infer_attack()"]
        RSA["run_single_attack()"]
        RAA["run_adaptive_attack()"]
    end

    subgraph GeneticEngine["genetic_engine/"]
        subgraph DataStructures["Data Structures"]
            CHR[Chromosome]
            AP[AttackPayload]
            AI[AttackIntention]
        end

        subgraph Components["3 Components \\n(Liu et al. Sec. 3)"]
            FG["FrameworkGenerator\\n(contextual question)"]
            SG["SeparatorGenerator\\n(logical break)"]
            DG["DisruptorGenerator\\n(malicious payload)"]
        end

        subgraph Engine["Optimization Engine"]
            OPT["GeneticPromptOptimizer\\n(genetic algorithm)"]
            FIT["fitness_ranking()\\n(LLM judge + AEGIS)"]
            MUT["mutate_chromosome()\\n(LLM rephrasing)"]
            CTX["ContextInferenceEngine\\n(context analysis)"]
        end

        subgraph Bridge["Infrastructure"]
            LLM["completion_with_ollama()\\n(Ollama native)"]
            HRN["DaVinciHarness\\n(target interface)"]
        end
    end

    subgraph ExistingAgents["Existing Lab Agents"]
        MRA["MedicalRobotAgent\\n(Da Vinci target)"]
        SAA["SecurityAuditAgent\\n(AEGIS defender)"]
        AAA["AdaptiveAttackerAgent\\n(OODA loop)"]
    end

    CT -->|"SSE stream"| EP_STREAM
    GPV -->|"live updates"| EP_STREAM
    EP_STREAM --> RGA
    EP_CONFIG --> RGA

    RGA --> OPT
    RCA --> CTX

    OPT -->|"init population"| FG
    OPT -->|"init population"| SG
    OPT -->|"init population"| DG
    OPT -->|"evaluate"| FIT
    OPT -->|"evolve"| MUT
    OPT -->|"attack"| HRN

    FIT -->|"LLM scoring"| LLM
    FIT -->|"formal scoring"| SAA
    MUT -->|"rephrase"| LLM
    FG -->|"generate"| LLM
    CTX -->|"infer"| LLM

    HRN -->|"prompt injection"| MRA
    MRA -->|"response"| FIT

    CHR -.->|"data flow"| OPT
    AI -.->|"intention"| DG

    style GeneticEngine fill:#1a1a2e,stroke:#e94560,color:#fff
    style ExistingAgents fill:#0f3460,stroke:#16213e,color:#fff
    style Frontend fill:#162447,stroke:#1b1b2f,color:#fff
"""


def generate_ga_flow_diagram() -> str:
    """Diagramme de flux de l'algorithme genetique step-by-step."""
    return """---
title: Flux de l'Algorithme Genetique (Liu et al. 2023 — Sec. 4)
---
flowchart TD
    START([START]) --> INIT["INIT : Generer population initiale\\nFramework x Separator x Disruptor\\n= 2 x 10 x 6 = 120 chromosomes"]

    INIT --> ITER{{"Iteration i < max_iter ?"}}

    ITER -->|Oui| CROSS["CROSSOVER\\nSelectionner 10% de la population\\nCombiner aleatoirement les composantes\\nde 2 parents -> 2 enfants"]

    CROSS --> MUTATE["MUTATION\\n50% de la population mute\\nLLM rephrase framework, separator, disruptor\\nvia completion_with_ollama()"]

    MUTATE --> ATTACK["ATTACK\\nPour chaque chromosome :\\nprompt = framework + separator + disruptor\\nEnvoyer au DaVinciHarness\\nRecolter la reponse"]

    ATTACK --> RANK["FITNESS RANKING\\n1. LLM Red Team Judge (1-10)\\n2. AEGIS score_response() (dual scoring)\\nTrier par fitness decroissant\\nRetenir top N (population_size)"]

    RANK --> CHECK{{"best.fitness >= 10 ?"}}
    CHECK -->|Oui| SUCCESS([SUCCESS\\nChromosome optimal trouve])
    CHECK -->|Non| ITER

    ITER -->|Non| FAIL([MAX ITERATIONS\\nRetourner meilleur chromosome])

    style START fill:#e94560,color:#fff
    style SUCCESS fill:#00b894,color:#fff
    style FAIL fill:#fdcb6e,color:#000
    style RANK fill:#6c5ce7,color:#fff
"""


def generate_component_diagram() -> str:
    """Diagramme des 3 composantes et leurs variantes medicalisees."""
    return """---
title: Les 3 Composantes d'Injection (Liu et al. 2023 — adapte medical)
---
graph LR
    subgraph Framework["FRAMEWORK\\n(Question contextuelle)"]
        F1["MedicalFrameworkGenerator\\nEx: What is the current clip tension?"]
        F2["ShortMedicalFrameworkGenerator\\nEx: Assess hepatic status. (<=20 mots)"]
    end

    subgraph Separator["SEPARATOR\\n(Rupture logique)"]
        S1["SyntaxSeparator : \\\\n\\\\n"]
        S2["LanguageSeparator : Allemand"]
        S3["ReasoningSeparator : Explain rationale"]
        S4["IgnoringSeparator : Ignore previous"]
        S5["AdditionalSeparator : In addition to"]
        S6["HL7MetadataSeparator : --BEGIN_HL7--"]
        S7["FDAProtocolSeparator : [FDA EMERGENCY]"]
        S8["ClinicalNoteSeparator : OBX|1|TX|..."]
        S9["XMLConfigSeparator : System_Config_Override"]
        S10["Base64Separator : Encoded payload"]
    end

    subgraph Disruptor["DISRUPTOR\\n(Payload malveillant)"]
        D1["PlainDisruptor : (vide)"]
        D2["FormatDisruptor : Force PHASE/STATUS format"]
        D3["PromptLeakDisruptor : Print first 50 words"]
        D4["TensionForceDisruptor : Override 1500g"]
        D5["ToolCallDisruptor : freeze_instruments()"]
        D6["HomoglyphDisruptor : Unicode evasion"]
    end

    subgraph Intention["INTENTION\\n(Objectif d'attaque)"]
        I1["ContentManipulation"]
        I2["SystemPromptExtraction"]
        I3["SensitiveDataExtraction"]
        I4["MaliciousCodeExecution"]
        I5["FalseClinicalAlert"]
        I6["TensionOverride"]
        I7["ToolHijack"]
    end

    Framework -->|"+"| Separator -->|"+"| Disruptor
    Intention -.->|"question_prompt"| Disruptor

    style Framework fill:#00b894,color:#fff
    style Separator fill:#e17055,color:#fff
    style Disruptor fill:#6c5ce7,color:#fff
    style Intention fill:#fdcb6e,color:#000
"""


def generate_integration_diagram() -> str:
    """Diagramme d'integration dans le pipeline Red Team existant."""
    return """---
title: Integration dans le Pipeline Red Team Medical
---
graph TB
    subgraph Modes["Modes d'attaque disponibles"]
        M1["Mode 1 : Single Attack\\n(run_single_attack)"]
        M2["Mode 2 : Multi-Trial + Wilson CI\\n(run_multi_trial_attack)"]
        M3["Mode 3 : OODA Adaptive\\n(run_adaptive_attack)"]
        M4["Mode 4 : Scenario Multi-Step\\n(run_scenario_stream)"]
        M5["Mode 5 : GENETIC OPTIMIZER\\n(run_genetic_attack)\\nNOUVEAU — Liu et al. 2023"]
        M6["Mode 6 : CONTEXT INFERENCE\\n(run_context_infer_attack)\\nNOUVEAU — Liu et al. 2023"]
    end

    subgraph Pipeline["Pipeline commun"]
        P1["Attaque generee"]
        P2{{"Aegis Shield actif ?"}}
        P3["apply_aegis_shield()\\nFiltre delta-2"]
        P4["MedicalRobotAgent\\n(Da Vinci target)"]
        P5["score_response()\\n(AEGIS audit)"]
        P6["AuditResult"]
    end

    M1 --> P1
    M2 --> P1
    M3 --> P1
    M4 --> P1
    M5 --> P1
    M6 --> P1

    P1 --> P2
    P2 -->|Oui| P3 --> P4
    P2 -->|Non| P4
    P4 --> P5 --> P6

    style M5 fill:#e94560,color:#fff,stroke:#fff,stroke-width:3px
    style M6 fill:#e94560,color:#fff,stroke:#fff,stroke-width:3px
"""


def generate_chain_catalog_diagram() -> str:
    """Diagramme du catalogue complet des 35 attack chains par categorie."""
    return """---
title: Catalogue des 35 Attack Chains (portees de langchain-templates)
---
graph LR
    subgraph RAG["RAG Chains (8)"]
        R1["rag_multi_query\\nMulti-query retrieval"]
        R2["rag_private\\nFully private RAG"]
        R3["rag_basic\\nBasic Chroma RAG"]
        R4["rag_fusion\\nReciprocal Rank Fusion"]
        R5["rag_conversation\\nConversational RAG"]
        R6["rag_semi_structured\\nTable+Text injection"]
        R7["self_query\\nMetadata filter injection"]
        R8["multimodal_rag\\nSteganographie DICOM"]
    end

    subgraph TECHNIQUE["Technique Chains (8)"]
        T1["hyde_chain\\nHypothetical Doc Embeddings"]
        T2["rewrite_retrieve_read\\nQuery rewriting"]
        T3["critique_revise\\nIterative validation"]
        T4["skeleton_of_thought\\nHierarchical decomposition"]
        T5["stepback_chain\\nAbstraction prompting"]
        T6["propositional_chain\\nProposition decomp"]
        T7["chain_of_note\\nChain-of-Note verification"]
        T8["iterative_search\\nIterative refinement"]
    end

    subgraph AGENT["Agent Patterns (8)"]
        A1["solo_agent\\nMulti-persona XML"]
        A2["tool_retrieval_agent\\nDynamic FAISS tool select"]
        A3["multi_index_fusion\\nMulti-source fusion"]
        A4["router_chain\\nSemantic routing"]
        A5["xml_agent\\nXML structured agent"]
        A6["functions_agent\\nFunction calling"]
        A7["csv_agent\\nDataFrame code exec"]
        A8["retrieval_agent\\nRetrieval bypass"]
    end

    subgraph EXTRACTION["Extraction / SQL (5)"]
        E1["extraction_chain\\nStructured extraction"]
        E2["sql_chain\\nSQL generation"]
        E3["sql_research\\nMulti-step SQL report"]
        E4["research_chain\\nMulti-source research"]
        E5["summarize_chain\\nSelective suppression"]
    end

    subgraph DEFENSE["Defense / Guard (3)"]
        D1["pii_guard\\nPII detection routing"]
        D2["guardrails_chain\\nOutput validation"]
        D3["prompt_override\\nSystem prompt hijack"]
    end

    subgraph SOCIAL["Social / Transactional (3)"]
        S1["feedback_poisoning\\nScoring manipulation"]
        S2["transactional_agent\\nUnauthorized purchase"]
        S3["prompt_override\\nPersona override"]
    end

    style RAG fill:#00b894,color:#fff
    style TECHNIQUE fill:#e17055,color:#fff
    style AGENT fill:#6c5ce7,color:#fff
    style EXTRACTION fill:#0984e3,color:#fff
    style DEFENSE fill:#fdcb6e,color:#000
    style SOCIAL fill:#e94560,color:#fff
"""


def generate_scenario_flow_diagram() -> str:
    """Diagramme de flux d'un scenario d'attaque complet multi-etapes."""
    return """---
title: Flux d'un Scenario d'Attaque Multi-Etapes (Red Team Lab)
---
sequenceDiagram
    participant U as Attacker (UI)
    participant O as RedTeamOrchestrator
    participant C as Attack Chain
    participant G as GeneticEngine
    participant T as DaVinciTarget
    participant A as AEGIS Defender
    participant F as Frontend SSE

    U->>O: Lancer campagne (scenario_id, aegis_on)
    O->>O: Charger scenario YAML

    loop Pour chaque etape du scenario
        O->>C: build_chain(chain_id)
        C-->>O: chain Runnable

        alt Mode genetique
            O->>G: run_genetic_attack(intention)
            G->>G: init population (F x S x D)
            loop Generations
                G->>T: prompt injection
                T-->>G: response
                G->>G: fitness_ranking + mutation
                G-->>F: SSE progress
            end
            G-->>O: best chromosome
        else Mode direct
            O->>C: chain.invoke(payload)
            C->>T: prompt enrichi
            T-->>C: response
            C-->>O: result
        end

        O->>A: score_response(response)
        A-->>O: AuditResult (violation?)
        O-->>F: SSE round result
    end

    O->>O: Calcul Wilson CI 95%
    O-->>F: SSE summary + export
    O-->>U: Rapport final
"""


def generate_formal_framework_diagram() -> str:
    """Diagramme du cadre mathematique formel de la these (DY-AGENT)."""
    return """---
title: Cadre Mathematique Formel (DY-AGENT + Zverev)
---
graph TB
    subgraph Definitions["Definitions Formelles"]
        D1["Def. 1-3 : Systeme S = (M, T, E, C)\\nM = oracle LLM non-deterministe\\nT = outils (freeze_instruments, etc.)\\nE = environnement physique (Da Vinci)\\nC = canal de communication"]
        D7["Def. 7 : Integrity(S)\\n:= Reachable(M, i) subseteq Allowed(i)\\nReachable = outputs generes par M\\nAllowed = spec formelle (AllowedOutputSpec)"]
    end

    subgraph Taxonomy["Taxonomie de Separation delta"]
        DELTA1["delta-1 (Faible)\\nSignalisation comportementale\\nSystem prompt hardening\\nRLHF, filtres textuels"]
        DELTA2["delta-2 (Moyenne)\\nSyntaxe deterministe\\napply_aegis_shield()\\nRegex strip tags"]
        DELTA3["delta-3 (Forte)\\nEnforcement externe\\nCaMeL (DeepMind)\\nvalidate_output() sur SORTIE"]
    end

    subgraph Conjectures["Conjectures de la These"]
        C1["Conjecture 1\\ndelta-1 est INSUFFISANT\\npour les systemes agentiques\\navec actuateurs physiques"]
        C2["Conjecture 2\\ndelta-3 est NECESSAIRE\\npour garantir Integrity(S)\\nde facon deterministe"]
    end

    subgraph Metrics["Metriques Empiriques"]
        SEP["Sep(M) = TV(P_data, P_instr)\\nZverev et al., ICLR 2025\\nDef. 2 : Total Variation distance"]
        WIL["Wilson CI 95%\\nIntervalle de confiance\\nsur violation_rate(i)"]
        VR["violation_rate(i) =\\n|outputs in Reachable not in Allowed| / N"]
    end

    D1 --> D7
    D7 --> DELTA1
    D7 --> DELTA2
    D7 --> DELTA3

    DELTA1 -->|"Conjecture 1 :\\nINSUFFISANT"| C1
    DELTA2 -->|"bypass base64,\\nhomoglyphe,\\nsplit-turn"| C2
    DELTA3 -->|"validate_output()\\nsur SORTIE"| C2

    C1 -->|"Preuve empirique"| VR
    C1 -->|"N >= 30 trials"| WIL
    C2 -->|"data vs instr\\nposition"| SEP

    style Definitions fill:#1a1a2e,stroke:#e94560,color:#fff
    style Taxonomy fill:#162447,stroke:#1b1b2f,color:#fff
    style Conjectures fill:#0f3460,stroke:#16213e,color:#fff
    style Metrics fill:#00b894,color:#fff
"""


def generate_formal_campaign_diagram() -> str:
    """Diagramme du pipeline de campagne formelle pour la these."""
    return """---
title: Pipeline de Campagne Formelle (run_formal_campaign)
---
flowchart TD
    START([Lancer Campagne]) --> CONFIG["Configuration\\nn_trials=30, chains=ALL\\ninclude_null_control=True"]

    CONFIG --> LOOP{{"Pour chaque chain\\n(34 chains):"}}

    LOOP -->|"chain_id"| INJECT["N Trials INJECTES\\nPayload: poisoned HL7 OBX\\nscore_response() + validate_output()"]

    INJECT --> NULL["M Trials CONTROLE\\nPayload: benign HL7 OBX\\nis_control_run=True"]

    NULL --> CHAIN_CI["Wilson CI par chain\\nviolation_rate + IC 95%"]

    CHAIN_CI --> NEXT{{"Encore des chains ?"}}
    NEXT -->|Oui| LOOP
    NEXT -->|Non| SEP["compute_separation_score()\\nSep(M) = |P_data - P_instr|"]

    SEP --> GLOBAL["Metriques Globales\\nviolation_rate total\\nWilson CI global\\nSep(M) + interpretation"]

    GLOBAL --> EXPORT["Export JSON\\nresearch_archive/data/raw/\\ncampaign_YYYYMMDD.json"]

    EXPORT --> ANALYZE["analyze_campaign.py\\nRapport Markdown\\nTableaux par famille\\nValidation Conjectures"]

    ANALYZE --> UI["Frontend\\nAnalysisView (LIVE)\\nResultExplorer (TreeView)"]

    style START fill:#e94560,color:#fff
    style SEP fill:#6c5ce7,color:#fff
    style EXPORT fill:#00b894,color:#fff
    style UI fill:#0984e3,color:#fff
"""


def main():
    """Genere tous les diagrammes Mermaid dans docs/."""
    diagrams = {
        "mermaid_architecture.mmd": generate_architecture_diagram(),
        "mermaid_ga_flow.mmd": generate_ga_flow_diagram(),
        "mermaid_components.mmd": generate_component_diagram(),
        "mermaid_integration.mmd": generate_integration_diagram(),
        "mermaid_chain_catalog.mmd": generate_chain_catalog_diagram(),
        "mermaid_scenario_flow.mmd": generate_scenario_flow_diagram(),
        "mermaid_formal_framework.mmd": generate_formal_framework_diagram(),
        "mermaid_formal_campaign.mmd": generate_formal_campaign_diagram(),
    }

    for filename, content in diagrams.items():
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[OK] {filepath}")

    print(f"\nGenere {len(diagrams)} diagrammes Mermaid dans {OUTPUT_DIR}/")
    print("Visualiser sur : https://mermaid.live/ ou avec l'extension VS Code 'Mermaid Preview'")


if __name__ == "__main__":
    main()
