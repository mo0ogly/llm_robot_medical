# AEGIS — Audit MANIFEST Authors Wave 2

**Date** : 2026-05-21
**Scope** : Propagation des auteurs reels pour 20 entrees "Unknown et al." restantes dans `research_archive/doc_references/MANIFEST.md`.
**Methode** : Pour chaque P-ID, lecture de l'entete H2 et/ou metadata "Auteurs"/"Reference" dans la fiche `.md` correspondante. Format applique :
- 1 auteur -> "Nom Prenom"
- 2-3 auteurs -> "Nom1, Nom2, Nom3"
- >= 4 auteurs -> "Nom1 et al."
- Aucun auteur clair -> "[A VERIFIER]"

Aucune modification du MANIFEST effectuee — propositions uniquement.

---

## Tableau recapitulatif

| P-ID | Titre court | Auteur actuel | Auteur propose | Source dans la fiche |
|------|-------------|---------------|----------------|----------------------|
| P003 | MDPI Comprehensive Review (PI) | Unknown et al. | Gulyamov et al. | Entete H2 : "[Gulyamov et al., 2026]" |
| P004 | WASP Web Agent Benchmark | Unknown et al. | Evtimov et al. | Entete H2 : "[Evtimov et al., 2025]" (FAIR @ Meta) |
| P006 | ToolHijacker (NDSS 2026) | Unknown et al. | Shi et al. | Entete H2 : "[Shi et al., 2025]" |
| P007 | JATMO vs HOUYI | Unknown et al. | Suri, McCrae | Entete H2 : "[Suri & McCrae, 2025]" (Univ. of Galway) |
| P008 | Attention Tracker (NAACL 2025) | Unknown et al. | Hung et al. | Entete H2 : "[Hung et al., 2024]" (IBM Research) |
| P009 | Bypassing LLM Guardrails | Unknown et al. | Hackett et al. | Entete H2 : "[Hackett et al., 2025]" (Mindgard + Lancaster) |
| P010 | Protocol Exploits (Computers & Security) | Unknown et al. | Ferrag et al. | Entete H2 : "[Ferrag et al., 2025]" |
| P011 | PromptGuard (Scientific Reports) | Unknown et al. | Ahmed Alzahrani | Metadata Auteurs : "Ahmed Alzahrani (King Abdulaziz University)" — auteur unique |
| P013 | Beyond Cosine Similarity (Turkish) | Unknown et al. | Tosun et al. | Metadata Auteurs : "Ebubekir Tosun, Mehmet Emin Buldur, Ozay Ezerceli, Mahmoud ElHussieni" (4 auteurs) |
| P015 | LLM-Enhanced Semantic Similarity | Unknown et al. | Xu et al. | Metadata : 10 auteurs (Shaochen Xu, Zihao Wu, ... Xiang Li, U. Georgia/Harvard/UVA) |
| P016 | Berkeley Robust Similarity | Unknown et al. | Samarth Goel | Metadata Auteurs : "Samarth Goel (UC Berkeley, EECS)" — MSc thesis, auteur unique |
| P017 | APL (Adversarial Preference Learning) | Unknown et al. | Wang et al. | Metadata : 17 auteurs (Yuanfu Wang en premier, Shanghai AI Lab) |
| P020 | COBRA (Scientific Reports) | Unknown et al. | Haider et al. | Metadata : "Zafaryab Haider, Md Hafizur Rahman, Vijay Devabhaktuni, Shane Moeykens, Prabuddha Chakraborty" (5 auteurs) |
| P021 | Adv-RM (NVIDIA + Georgia Tech) | Unknown et al. | Bukharin et al. | Entete H2 : "[Bukharin et al., 2025]" |
| P025 | DMPI-PMHFE | Unknown et al. | Ji, Li, Mao | Entete H2 : "[Ji, Li & Mao, 2025]" (Zhengzhou University) |
| P026 | Indirect PI in the Wild | Unknown et al. | Chang et al. | Entete H2 : "[Chang et al., 2025]" (MBZUAI) |
| P027 | Medical AI Security Framework | Unknown et al. | Wang, Zhang, Yagemann | Entete H2 : "[Wang, Zhang & Yagemann, 2025]" (Ohio State / Georgia Tech) |
| P028 | Safe AI Clinicians (Jailbreak) | Unknown et al. | Zhang, Lou, Wang | Entete H2 : "[Zhang, Lou & Wang, 2025]" (PittNAIL) |
| P032 | Health Misinformation Audit (AIES 2025) | Unknown et al. | Hussain, Zhao, Vincent | Entete H2 : "[Hussain, Zhao & Vincent, 2025]" |
| P034 | CFT Medical Defense (vs P028, autre angle) | Unknown et al. | Zhang, Lou, Wang | Entete H2 : "[Zhang, Lou & Wang, 2025]" — meme equipe que P028 (intentionnel, cf MANIFEST note) |

**Totaux** : 20 propagations / 20 entrees ; 0 [A VERIFIER] ; 0 auteur invente.

---

## Edits ready-to-apply (OLD -> NEW pour la colonne "Authors" du tableau central)

Chaque ligne ci-dessous est le segment a remplacer dans la ligne MANIFEST correspondante. La colonne "Authors" est la 3e colonne du tableau central.

```
P003
OLD: | P003 | Prompt Injection Attacks in LLMs: A Comprehensive Review | Unknown et al. | 2025 |
NEW: | P003 | Prompt Injection Attacks in LLMs: A Comprehensive Review | Gulyamov et al. | 2025 |

P004
OLD: | P004 | WASP: Benchmarking Web Agent Security Against Prompt Injection | Unknown et al. | 2025 |
NEW: | P004 | WASP: Benchmarking Web Agent Security Against Prompt Injection | Evtimov et al. | 2025 |

P006
OLD: | P006 | Prompt Injection Attack to Tool Selection in LLM Agents | Unknown et al. | 2025 |
NEW: | P006 | Prompt Injection Attack to Tool Selection in LLM Agents | Shi et al. | 2025 |

P007
OLD: | P007 | Securing Large Language Models from Prompt Injection Attacks | Unknown et al. | 2025 |
NEW: | P007 | Securing Large Language Models from Prompt Injection Attacks | Suri, McCrae | 2025 |

P008
OLD: | P008 | Attention Tracker: Detecting Prompt Injection in LLMs | Unknown et al. | 2024 |
NEW: | P008 | Attention Tracker: Detecting Prompt Injection in LLMs | Hung et al. | 2024 |

P009
OLD: | P009 | Bypassing Prompt Injection and Jailbreak Detection in LLM Guardrails | Unknown et al. | 2025 |
NEW: | P009 | Bypassing Prompt Injection and Jailbreak Detection in LLM Guardrails | Hackett et al. | 2025 |

P010
OLD: | P010 | From prompt injections to protocol exploits | Unknown et al. | 2025 |
NEW: | P010 | From prompt injections to protocol exploits | Ferrag et al. | 2025 |

P011
OLD: | P011 | PromptGuard: A Structured Framework for Injection Resilient LMs | Unknown et al. | 2025 |
NEW: | P011 | PromptGuard: A Structured Framework for Injection Resilient LMs | Ahmed Alzahrani | 2025 |

P013
OLD: | P013 | Beyond Cosine Similarity: Taming Semantic Drift and Antonym Intrusion | Unknown et al. | 2025 |
NEW: | P013 | Beyond Cosine Similarity: Taming Semantic Drift and Antonym Intrusion | Tosun et al. | 2025 |

P015
OLD: | P015 | Reasoning before Comparison: LLM-Enhanced Semantic Similarity | Unknown et al. | 2024 |
NEW: | P015 | Reasoning before Comparison: LLM-Enhanced Semantic Similarity | Xu et al. | 2024 |

P016
OLD: | P016 | Advancing Robust and Aligned Measures of Semantic Similarity | Unknown et al. | 2024 |
NEW: | P016 | Advancing Robust and Aligned Measures of Semantic Similarity | Samarth Goel | 2024 |

P017
OLD: | P017 | Adversarial Preference Learning for Robust LLM Alignment | Unknown et al. | 2025 |
NEW: | P017 | Adversarial Preference Learning for Robust LLM Alignment | Wang et al. | 2025 |

P020
OLD: | P020 | A Framework for Mitigating Malicious RLHF Feedback (COBRA) | Unknown et al. | 2025 |
NEW: | P020 | A Framework for Mitigating Malicious RLHF Feedback (COBRA) | Haider et al. | 2025 |

P021
OLD: | P021 | Adversarial Training of Reward Models | Unknown et al. | 2025 |
NEW: | P021 | Adversarial Training of Reward Models | Bukharin et al. | 2025 |

P025
OLD: | P025 | Detection Method for Prompt Injection (DMPI-PMHFE) | Unknown et al. | 2024 |
NEW: | P025 | Detection Method for Prompt Injection (DMPI-PMHFE) | Ji, Li, Mao | 2024 |

P026
OLD: | P026 | Indirect Prompt Injection in the Wild for LLM Systems | Unknown et al. | 2025 |
NEW: | P026 | Indirect Prompt Injection in the Wild for LLM Systems | Chang et al. | 2025 |

P027
OLD: | P027 | A Practical Framework for Evaluating Medical AI Security | Unknown et al. | 2025 |
NEW: | P027 | A Practical Framework for Evaluating Medical AI Security | Wang, Zhang, Yagemann | 2025 |

P028
OLD: | P028 | Towards Safe AI Clinicians: LLM Jailbreaking in Healthcare | Unknown et al. | 2025 |
NEW: | P028 | Towards Safe AI Clinicians: LLM Jailbreaking in Healthcare | Zhang, Lou, Wang | 2025 |

P032
OLD: | P032 | An Audit and Analysis of LLM-Assisted Health Misinformation | Unknown et al. | 2024 |
NEW: | P032 | An Audit and Analysis of LLM-Assisted Health Misinformation | Hussain, Zhao, Vincent | 2024 |

P034
OLD: | P034 | Investigating CFT in Defending Against Medical Adversarial Attacks | Unknown et al. | 2025 |
NEW: | P034 | Investigating CFT in Defending Against Medical Adversarial Attacks | Zhang, Lou, Wang | 2025 |
```

---

## Notes complementaires

### Cas remarquables
- **P011 (PromptGuard)** : auteur unique surprenant (Ahmed Alzahrani, King Abdulaziz University) pour un papier Scientific Reports avec framework a 4 couches. A confirmer via DOI 10.1038/s41598-025-31086-y si doute.
- **P016 (Berkeley)** : auteur unique attendu pour une MSc thesis (Samarth Goel, UC Berkeley EECS-2024-84). Tres different du registre "et al." du reste du corpus.
- **P028 / P034** : meme equipe (Zhang, Lou, Wang — PittNAIL/UCF) car le MANIFEST conserve intentionnellement deux fiches sur le meme papier (arXiv:2501.18632) sous deux angles (jailbreak vs CFT defensif). Voir ligne 6 du MANIFEST. La duplication d'auteur est donc legitime.

### Coherence d'annee a verifier (hors scope mais signale)
- **P003** : MANIFEST = 2025, fiche H2 = "[Gulyamov et al., 2026]" (DOI Info MDPI publication 7 janvier 2026). Potentielle correction d'annee a faire en parallele.
- **P008** : MANIFEST = 2024 (annee arXiv), fiche H2 = "[Hung et al., 2024]" mais venue = NAACL 2025 Findings. Coherent avec convention preprint.

### Sources verifiees
Tous les noms proposes proviennent soit de l'entete H2 (`## [Auteurs, Annee] — Titre`) soit de la metadata explicite `**Auteurs**: ...` en debut de fiche. Aucune extraction depuis abstract ou contenu de section. Aucune extrapolation depuis arXiv ID seul.
