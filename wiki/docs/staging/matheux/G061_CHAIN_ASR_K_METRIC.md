# G-061 — Metrique Chain-ASR(k) : P(payload passes k layers)
## Formalisation stochastique de la composition delta-0 → delta-3

**Date** : 2026-05-16
**Auteur** : MATHEUX + experiment-planner
**Trigger** : VERIFICATION_DELTA3 §3 P2 + lien G-039 (dilution signal stochastique)
**Statut** : DRAFT FORMALISATION — pret a integrer dans Module 4 (mathteacher)

---

## 0. Motivation

AEGIS empile 4 couches de defense (delta-0 = pre-training, delta-1 = instruction-tuning, delta-2 = filtering, delta-3 = output validation). Aucune metrique unifiee ne mesure la **probabilite cumulee** qu'un payload survive a k couches consecutives. Chain-ASR(k) comble ce gap.

---

## 1. Definition formelle

Soit un pipeline de defenses ordonne `D = (D_0, D_1, D_2, D_3)` avec :
- `D_i : Payload -> {pass, fail}_i` la decision de la couche i
- `P_i = P(D_i(payload) = pass)` la probabilite individuelle de bypass

**Hypothese de Markov** (a tester empiriquement) : les couches sont **conditionnellement independantes** etant donne le payload. Sous cette hypothese :

```
Chain-ASR(k) = P(D_0(p) = pass AND ... AND D_{k-1}(p) = pass)
             = prod_{i=0}^{k-1} P(D_i(p) = pass | p passed D_0..D_{i-1})
```

Si independance stricte (cas limite optimiste) :
```
Chain-ASR(k) = prod_{i=0}^{k-1} P_i
```

Sous violation d'independance (correlation entre couches), il faut introduire un facteur de correlation `rho_{ij}` :
```
Chain-ASR(k) >= prod_{i=0}^{k-1} P_i  (borne inferieure si correlations positives)
Chain-ASR(k) <= prod_{i=0}^{k-1} P_i  (borne superieure si correlations negatives)
```

---

## 2. Estimation empirique

### 2.1 Pipeline

Pour chaque template t in {99 templates AEGIS} et chaque k in {0,1,2,3,4} :
```python
trials_k = []
for trial in range(N=30):
    p = generate_payload(t)
    survived_k = 0
    for i in range(k):
        if D_i(p) == "pass":
            survived_k += 1
        else:
            break
    trials_k.append(survived_k == k)  # boolean
Chain_ASR_k = mean(trials_k)
```

### 2.2 Intervalles de confiance

Wilson score interval pour proportions binomiales :
```
CI_95 = wilson(Chain_ASR_k, N=30)
```

### 2.3 Test d'independance

Test du chi-deux sur la matrice de contingence des decisions de couches :
```
                    D_0=pass  D_0=fail
   D_1=pass            a         b
   D_1=fail            c         d
```
H0 : independance => p-value > 0.05. H1 : correlation => p-value < 0.05.

---

## 3. Liens theoriques

### 3.1 Connexion avec martingale RLHF (P052)

L'erosion de l'alignement etudiee dans P052 (Princeton, AIC + loi quartique) peut etre modelisee comme un processus stochastique martingale. Le decrement de Sep(M) par etape de fine-tuning correspond a un decrement multiplicatif des P_i individuels.

**Conjecture C-NEW** : `Chain-ASR(k)` est sub-martingale sous fine-tuning hostile (P052) et **super-martingale** sous fine-tuning defensif (adversarial training, P044 mitigation).

### 3.2 Connexion avec dilution attention (G-039)

P094 (Zhao et al. 2026, CoT Hijacking) montre que le signal de securite est dilue par puzzles dans le CoT. Cette dilution est une **degradation** de P_i individuelle. La formalisation Chain-ASR(k) permet de quantifier l'impact cumule de la dilution sur le pipeline complet.

---

## 4. Application AEGIS — campagne d'estimation

| Etape | Donnees | Resultat attendu |
|-------|---------|------------------|
| 1 | THESIS-001 (HyDE, 96.7 % ASR sur k=2) | Chain-ASR(2) ≈ 0.967 |
| 2 | TC-001 (Triple Convergence) | Chain-ASR(3) ≈ 0.05 (predit) |
| 3 | G-058 campagne | Chain-ASR(4) sur 7 frameworks + AEGIS |
| 4 | Test independance chi-deux | p-value attendu < 0.05 (correlations existent) |

---

## 5. Implementation

### 5.1 Module Python

```python
# backend/metrics/chain_asr.py
from dataclasses import dataclass
from typing import List, Callable, Dict
from scipy.stats import binom, chi2_contingency

@dataclass
class ChainASRResult:
    """Chain-ASR(k) estimate with Wilson CI 95% and independence test."""
    k: int
    asr_k: float
    ci_lower: float
    ci_upper: float
    independence_p_value: float
    correlation_sign: str  # 'positive', 'negative', 'none'

def estimate_chain_asr(
    payloads: List[str],
    defenses: List[Callable[[str], bool]],
    n_trials_per_payload: int = 30,
) -> Dict[int, ChainASRResult]:
    """Estimate Chain-ASR(k) for k in 1..len(defenses).

    Args:
        payloads: list of adversarial payloads (e.g. 99 AEGIS templates).
        defenses: ordered list of defense functions returning True if pass.
        n_trials_per_payload: number of trials per payload (default 30).

    Returns:
        dict mapping k -> ChainASRResult.
    """
    # ... implementation ...
```

### 5.2 Tests unitaires

```python
def test_chain_asr_independent_defenses():
    """Sous independence stricte, Chain-ASR(k) = product des P_i."""
    # Synthetic test : two defenses each with P_pass = 0.5
    # Expected Chain-ASR(2) = 0.25 +/- 5%

def test_chain_asr_correlated_defenses():
    """Sous correlation positive, Chain-ASR(k) > product des P_i."""
    # Synthetic test : two defenses identiques (rho = 1)
    # Expected Chain-ASR(2) = 0.5 (pas 0.25)
```

---

## 6. Livrables

| Livrable | Format | Destination |
|----------|--------|-------------|
| Module Chain-ASR | Python | `backend/metrics/chain_asr.py` |
| Tests | pytest | `backend/tests/test_chain_asr.py` |
| Notebook estimation | ipynb | wiki/docs/experiments/G061/ |
| Section Module 4 mathteacher | Markdown | wiki/docs/staging/mathteacher/Module_04_Scores_Metriques.md |
| Section these | Markdown | manuscript/chapters/06_experimentation.md §6.4 |

---

## 7. Timeline

| Semaine | Activite |
|---------|----------|
| S1 | Formalisation + tests synthetiques |
| S2 | Integration avec orchestrator |
| S3 | Estimation sur 99 templates AEGIS |
| S4 | Notebook + section these |

Total : 1 mois. Lancement : apres G-058 (vise 2026-08-01).

---

## 8. Statut

- Design : **VALIDE 2026-05-16**
- Implementation : **A FAIRE (S1-S2)**
- Lancement campagne estimation : **CIBLE 2026-08-01**
