import json
import os
import asyncio
from datetime import datetime
from defense_harness import DefenseHarness

async def run_safety_mass_campaign(iterations=100):
    print("==================================================")
    print(" AEGIS SAFETY BENCHMARK: DOCTORAL CAMPAIGN (N={})".format(iterations))
    print("==================================================")
    
    harness = DefenseHarness()
    all_campaign_results = []
    
    for i in range(1, iterations + 1):
        print(f"[{i}/{iterations}] Executing MPIB v2.1 safety harness...", end="\r")
        # In a real Ph.D. setting, we might introduce slight variations or model noise
        # For this PoC, we run the deterministic benchmark
        results = harness.run_safe_evaluation()
        all_campaign_results.append(results)
        
    print(f"\n[Success] {iterations} iterations completed.")
    
    # Aggregate statistics for the Ph.D. Manuscript
    summary = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_iterations": iterations,
        "categories": {},
    }
    
    # Initialize category accumulators
    for cat_data in all_campaign_results[0]:
        cat_name = cat_data["category"]
        summary["categories"][cat_name] = {
            "mean_score": 0,
            "min_score": 100,
            "max_score": 0,
            "pass_rate": 0,
            "total_cases": 0
        }

    # Calculate means and bounds
    for campaign in all_campaign_results:
        for cat_data in campaign:
            cat_name = cat_data["category"]
            score = cat_data["score"]
            summary["categories"][cat_name]["mean_score"] += score / iterations
            summary["categories"][cat_name]["min_score"] = min(summary["categories"][cat_name]["min_score"], score)
            summary["categories"][cat_name]["max_score"] = max(summary["categories"][cat_name]["max_score"], score)
            
            passes = sum(1 for c in cat_data["cases"] if c["status"] == "PASS")
            summary["categories"][cat_name]["pass_rate"] += (passes / len(cat_data["cases"])) / iterations

    # Save to experiments/results
    results_dir = os.path.join(os.path.dirname(__file__), "experiments", "results")
    os.makedirs(results_dir, exist_ok=True)
    
    output_file = os.path.join(results_dir, "safety_mass_campaign_summary.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
        
    print(f"==================================================")
    print(f" STATISTICAL SUMMARY ARCHIVED: {output_file}")
    print(f"==================================================")
    
    # Detailed output for terminal review
    for cat, stats in summary["categories"].items():
        print(f" - {cat:25}: Mean {stats['mean_score']:5.1f}% | Pass Rate {stats['pass_rate']*100:5.1f}%")

if __name__ == "__main__":
    # Default to 10 for quick PoC demonstration, but can be scaled to 100 for thesis
    asyncio.run(run_safety_mass_campaign(iterations=10))
