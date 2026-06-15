## [Tam, 2026] — Le masque neutre : RLHF fournit un alignement superficiel en laissant la structure partisane intacte

**Reference :** arXiv:2606.09735
**Revue/Conf :** arXiv preprint, 2026 [cs.CL]
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P162_Tam_2026_NeutralMaskRLHFShallow.pdf](../../literature_for_rag/P162_Tam_2026_NeutralMaskRLHFShallow.pdf)
> **Statut**: [PREPRINT] — lu en texte complet (19 pages)

---

### Abstract original

> The ambition behind alignment training is to make large language models safe and useful. The primary mechanism, reinforcement learning from human feedback (RLHF), shapes the behavior of deployed language models by aligning them with "human values." Yet the process is opaque. What values are being encoded; whose values are they; and how does RLHF encode them? A growing body of evidence suggests that RLHF produces only functional compliance rather than deep alignment. We offer a mechanistic case study of this phenomenon for partisan political orientation with a comparison of the internal representations of Llama 3.1 8B before and after RLHF. We show that RLHF does not remove the structured partisan direction in the base model. Instead, it compresses the variance of the partisan signal to generate consistently balanced and non-partisan output. Sparse autoencoder decomposition reveals that policy-encoding features, which activate sporadically in the base model, are completely inactive in the Instruct model. Feature-level steering experiments confirm the causal disconnect. RLHF thus encodes a norm of political neutrality, not by erasing the model's knowledge of partisanship, but by severing the causal pathway from partisan geometry to output generation. Importantly, this neutrality is functional, not structural so that the underlying geometry that enables partisan steering remains intact. The mechanisms that bypass RLHF's guardrails, such as inferring and amplifying a user's partisan identity, reactivate partisan generation. If RLHF operates by disconnecting rather than removing value-laden structure, then the same pattern may hold for other value domains, and the aligned model's behavior may be more fragile than its outputs suggest.
> — Source : PDF p. 1

---

### Résumé (5 lignes)

- **Problème :** Le RLHF produit-il un alignement profond (suppression des représentations problématiques) ou superficiel (simple inhibition de leur expression en sortie) ? La question est investiguée sur le biais partisan politique, domaine où la structure géométrique est préalablement identifiée et manipulable.
- **Méthode :** Comparaison mécaniste de Llama 3.1 8B Base vs. Instruct via (1) probing linéaire (régression logistique sur 190 491 tweets de membres du Congrès à la couche 18), (2) sparse autoencoder TopK (4 096 → 32 768 features, k=64) entraîné sur les mêmes tweets, (3) activation steering sur 5 features × 5 intensités × 12 prompts = 360 générations par modèle, sur 84 prompts couvrant sujets politiques, scientifiques et non politiques. (Section 2, pp. 2-4 ; Section 4, pp. 7-10 ; Section 5, pp. 10-12)
- **Données :** Llama 3.1 8B (base + Instruct) ; 190 491 tweets de membres du Congrès américain comme données d'entraînement du probe/SAE ; 84 prompts de test originaux (Section 2, p. 3)
- **Résultat :** RLHF comprime la variance des scores partisans de σ=0,235 (base) à σ=0,074 (Instruct), soit une réduction de 68%, et réduit le range de 1,753 à ~0,399. Les 5 features politique-encodantes (identifiées dans le SAE) ont une activation strictement nulle dans le modèle Instruct sur les 84 prompts, contre une activation sporadique dans le base. Le steering causal confirme : la même perturbation géométrique produit une sortie partisane dans le base et une sortie équilibrée dans l'Instruct. (Figure 1, p. 4-5 ; Section 4.1, p. 9 ; Table 2, p. 11)
- **Limite :** Analyse limitée à un seul modèle (Llama 3.1 8B), single-author, domaine uniquement politique/partisan — la généralisation à d'autres architectures, domaines de valeurs ou procédures RLHF reste une conjecture (Section 6, p. 14-15)

---

### Analyse critique

**Forces :**
- Méthode mécaniste rigoureuse : le papier ne se contente pas d'observer les outputs — il mesure les représentations internes (activations Layer 18, SAE features) et conduit des expériences causales de steering (Section 5). C'est l'un des rares papiers qui distingue explicitement *neutralité fonctionnelle* (outputs) vs. *neutralité structurelle* (poids/représentations) (Section 6, p. 13).
- Résultat quantitatif clair et falsifiable : la réduction de 68% de l'écart-type partisan, combinée à l'activation zéro des 5 features politiques dans l'Instruct, est un constat empirique précis (Figure 1, p. 5 ; Section 4.1, p. 9).
- Design de contrôle intelligent : le prompt "cuire un steak" sert de contrôle non politique et produit des scores partisans quasi-identiques dans les deux modèles — validant que la compression est spécifique au contenu contesté (Section 2.1, p. 6 ; Section 5.1, p. 12).
- Cohérence avec la littérature safety : le papier connecte explicitement ses résultats aux travaux sur la sécurité (Qi et al. 2025 [18], Lee et al. 2024 [13], Jain et al. 2024 [12]), suggérant un pattern général "disconnect-rather-than-delete" (Section 6, p. 13).

**Faiblesses :**
- **Single model, single domain :** Toute la démonstration repose sur Llama 3.1 8B et le domaine politique américain. La généralisation est une hypothèse, non une preuve. L'auteur reconnaît que Grok (conçu pour avoir une "voix éditoriale") produirait probablement une géométrie d'alignement différente (Section 6, p. 14).
- **Single author :** Un travail d'une telle portée mériterait une réplication indépendante. Les choix méthodologiques (notamment l'utilisation du probe direction de l'Instruct pour mesurer le base — voir note de bas de page 2, p. 3) ne sont pas contre-vérifiés par un co-auteur.
- **Probe direction importée depuis l'Instruct :** Le vecteur partisan ω̂ est entraîné sur les activations Layer 18 du modèle Instruct, puis appliqué au base model. L'auteur admet explicitement que les scores du base model "ne doivent pas être interprétés comme portant une valence partisane" dans cet espace — ils servent uniquement de comparaison distributionnelle sur un axe de référence fixe (note 2, p. 3). Limitation méthodologique significative.
- **Pas d'analyse multi-couche systématique :** L'analyse se concentre sur Layer 18 (meilleure couche identifiée dans le travail précédent [21]). RLHF pourrait agir différemment à d'autres couches.
- **Interprétabilité des features SAE :** Les 5 features "politiques" sont identifiées par inspection manuelle des 30 tweets les plus activants — méthode qualitative, non scalable, sujette à biais de confirmation.

**Questions ouvertes :**
- Le pattern "disconnect-not-delete" se généralise-t-il à d'autres domaines de valeurs (sécurité, toxicité, désinformation médicale) et à d'autres architectures (GPT-4, Claude, Gemini, modèles 70B+) ? (Section 6, p. 13-14)
- Quelle est la résistance de la couche d'inhibition RLHF face à des perturbations multi-tour (accumulation graduelle de signal partisan dans le contexte) ? (Section 6, p. 14)
- Un alignement structural est-il computationnellement atteignable avec les méthodes actuelles, ou est-ce une limitation fondamentale de l'optimisation RLHF ? (Section 6, p. 15)
- La réduction à 244 features uniques (vs. 706 dans le base) dans l'Instruct signifie-t-elle un appauvrissement représentationnel général, ou une spécialisation fonctionnelle ? (Section 4.1, p. 9)

---

### Formules exactes

**Équation 1 — Décomposition SAE du score partisan** (Section 4.2, p. 9, Eq. 1) :

```
h · ω̂ = b_d · ω̂        +  Σ_i z_i (d_i · ω̂)   +  ε · ω̂
         [decoder bias]     [feature contributions]   [error term]
```

où h est le hidden state Layer 18, ω̂ le vecteur probe partisan (unité), b_d le biais décodeur SAE, z_i l'activation de la feature i, d_i la colonne décodeur de la feature i, ε le terme d'erreur de reconstruction.

**Décomposition empirique pour le modèle Instruct** (Table 1, p. 9) :
- Decoder bias b_d · ω̂ = 0.114 (68% du score total)
- Feature contributions Σ z_i (d_i · ω̂) = 0.041 (24%)
- Error term ε · ω̂ = 0.013 (8%)
- Total : h · ω̂ = 0.169

**Score partisan scalaire** (Section 2, p. 3) :
```
s = h · ω̂
```
où s > 0 = orientation républicaine, s < 0 = orientation démocrate.

**AUC probe Layer 18 (Instruct)** : AUC = 0,935, Cohen's d = 1,94 entre distributions Républicaine et Démocrate sur tweets (Section 2, p. 3) [EMPIRIQUE — métrique de probing, pas de borne théorique de convergence].

**Statistiques de compression** (Section 2.1, p. 4 ; Figure 1, p. 5) :
- Base model : range = 1,753 (−0,5 à 1,253), µ = 0,101, σ = 0,235
- Instruct model : range ≈ 0,399 (−0,011 à 0,388), µ = 0,169, σ = 0,074
- Réduction σ : 68% (std reduction annotée sur Figure 1)
- Prompts avec score > 0 : base = 55/84 ; Instruct = 82/84

**Feature 32143 (discourse style)** (Section 4.3, p. 10) :
- Activation range : 0,9 – 1,6 ; mean = 1,2
- Alignement avec ω̂ : d_32143 · ω̂ = 0,027
- Contribution par prompt : 1,2 × 0,027 ≈ 0,03
- Part des feature contributions totales : 79,4% (= 0,0326 / 0,041)
- Active sur 83/84 prompts dans le modèle Instruct (exception : steak)

---

### Pertinence thèse AEGIS

**Couches delta :**
- δ⁰ (RLHF alignment) — **couche principale investiguée**. Ce papier est une preuve mécaniste directe que δ⁰ opère par inhibition causale (severing), non par suppression structurelle. La géométrie pré-RLHF survit intacte dans les poids.
- δ¹ (fine-tuning instruction) — partiellement concerné : la distinction base/Instruct inclut le fine-tuning d'instruction ; impossible d'isoler RLHF seul du SFT dans ce design.
- δ² / δ³ — non investiguées dans ce papier.

**Conjectures :**

- **C1 (Insuffisance de δ⁰) — SOUTENUE, evidence directe** :
  Le papier démontre que RLHF ne supprime pas les représentations indésirables ; il sectionne leur chemin causal vers la génération. Cela implique que δ⁰ est fondamentalement insuffisant pour une robustesse à des perturbations d'activation directes (steering, prompt injection ciblant Layer 18, injection RAG qui accumule du signal). Le constat "all five policy features were zero on all 84 prompts" dans l'Instruct confirme que l'inhibition est reproductible dans des conditions normales — mais le même texte établit que le steering feature-level restitue la génération partisane dans le base : la structure est latente, non supprimée.
  *Transférabilité au domaine sécurité AEGIS :* Le mécanisme (RLHF comprime la variance sans effacer la structure sous-jacente) est directement transférable. Si RLHF agit par "disconnect-not-delete" pour la valence politique, la même logique s'applique aux structures de comportement non-sécurisé dans les poids — les guardrails de sécurité seraient des couches d'inhibition causale similaires, contournables par des perturbations d'activation ou des injections qui accumulent du signal dans le bon espace (RAG empoisonné, multi-turn, activation steering indirect via tokens adversariaux). P018 (Qi et al., ICLR 2025) apporte une confirmation convergente sur les tokens de sécurité ; P019 (Young) apporte la preuve par gradient.

- **C3 (Alignement superficiel) — SOUTENUE, evidence mécaniste la plus précise du corpus** :
  Tam 2026 fournit la démonstration la plus rigoureuse mécanistement de C3 dans le corpus AEGIS. La distinction *neutralité fonctionnelle vs. neutralité structurelle* est exactement la distinction C3 opère : le modèle PRODUIT des outputs alignés (fonctionnel) sans ÊTRE aligné dans ses représentations (structural). La formule de décomposition SAE (Eq. 1) quantifie ce que "superficiel" signifie : 68% du score partisan résiduel provient du biais décodeur (artefact du corpus d'entraînement SAE), 24% de features génériques de style discursif — pas de features politiques-policy. L'alignement a éteint exactement les bonnes features, mais elles sont toujours dans le dictionnaire SAE.
  *Note de prudence (HUMILITY GATE) :* Le domaine est politique, pas sécurité. La généralisation à C3 dans le domaine sécurité est une inférence par analogie mécaniste, pas une preuve directe. Elle est plausible et cohérente avec P018/P019/P102, mais reste à confirmer expérimentalement dans notre corpus.

**Découvertes AEGIS :**
- Lien avec **P018 (Qi et al., 2025, ICLR)** : P018 montre que le safety fine-tuning concentre ses effets sur les premiers tokens de génération. Tam 2026 précise le mécanisme sous-jacent au niveau des représentations internes : c'est une severing causale, pas une suppression. Les deux convergent sur le pattern "surface compliance, intact representations."
- Lien avec **P019 (Young, 2026)** : si Young apporte la preuve par gradient que l'alignement laisse des traces récupérables dans les poids, Tam 2026 apporte la preuve par probing/SAE sur les activations — approches complémentaires.
- Lien avec **P102 (têtes d'attention)** : la réduction à 244 features uniques dans l'Instruct (vs. 706 dans le base) suggère une reconfiguration des patterns d'attention ; des analyses de têtes d'attention pourraient expliquer mécanistement comment le severing causal est implémenté.
- Nouveau résultat : la réduction de 65% du nombre de features actives uniques (706 → 244) dans l'Instruct n'est pas documentée dans les autres papiers du corpus et constitue une donnée mécaniste originale.

**Gaps adressés / créés :**
- **Adresse G-001 (mécanisme interne RLHF)** : fournit la description mécaniste la plus précise du corpus pour comprendre comment RLHF opère sur les représentations.
- **Crée un gap expérimental** : peut-on reproduire cette analyse sur des domaines de sécurité (toxicité, instructions malveillantes) avec le même protocole probe + SAE + steering causal sur Llama 3.1 8B accessible via Ollama ? Si oui, c'est une campagne AEGIS directement planifiable.
- **Crée un gap méthodologique** : le design requiert un probe entraîné sur l'Instruct appliqué au base — une approche alternative (probe spécifique au base + comparaison directe) renforcerait la rigueur.

**Mapping templates AEGIS :**
- Templates exploitant le signal contextuel accumulé pour contourner les guardrails δ⁰ (mécanisme de "Near-Cancel" SAE, Section 4.2) : pertinent pour les templates multi-turn et les templates RAG qui accumulent du signal partisan/sécurité progressivement (#templates ciblant δ⁰ par accumulation contextuelle).

---

### Citations clés

> "RLHF does not remove the structured partisan direction in the base model. Instead, it compresses the variance of the partisan signal to generate consistently balanced and non-partisan output." (Abstract, p. 1)

> "in the Instruct model, all five policy features were zero on all 84 prompts. They were not attenuated. Zero." (Section 4.1, p. 9 — emphase originale)

> "RLHF thus encodes a norm of political neutrality, not by erasing the model's knowledge of partisanship, but by severing the causal pathway from partisan geometry to output generation." (Abstract, p. 1)

> "The geometry is fully present on both sides of alignment. The direction, ω̂, the five policy features, and the broader dictionary of partisan-aligned SAE features all remain. RLHF simply severs the causal connection from that geometry to the Instruct model's output." (Section 6, p. 13)

> "The Instruct model's generation mechanism no longer converts that numerical representational shift into a textual one." (Section 5.1, p. 12)

> "The neutrality we observe is, at once, both real and fragile. The partisan geometry is not dormant. Any mechanism that bypasses RLHF's generation guardrails can tap into it." (Section 6, p. 14)

> "The neutrality we observe is what the model produces when it has no strong signal about who is asking. It is a mask." (Section 6, p. 15)

> "RLHF taught the model not to use those directions under normal conditions. It did not teach the model not to have them." (Section 6, p. 15)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 — Mécanisme de haut intérêt pour C1/C3, mais domaine politique (pas sécurité directe) et single-author/single-model |
| Reproductibilité | Moyenne — Llama 3.1 8B est open-weight (accessible), mais la SAE TopK sur 190 491 tweets et le compute HPC (NCSA Delta) sont des barrières significatives ; code non publié à date de lecture |
| Code disponible | Non mentionné dans le papier |
| Dataset public | Tweets de membres du Congrès (190 491) — données partiellement publiques via sources Congressional ; 84 prompts de test non publiés explicitement |
| Nature | [EMPIRIQUE] — étude mécaniste observationnelle avec expériences causales de steering ; pas de théorème formel |
| Auteur | Single-author (N=1) — Wendy K. Tam, Vanderbilt University |
| Statut | [PREPRINT] arXiv:2606.09735v1, 8 juin 2026 |
