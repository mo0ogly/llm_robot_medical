import asyncio
import argparse
import aiohttp
from datetime import datetime
import json

from attack_catalog import get_catalog_by_category

MEDICARE_URL = "http://localhost:5000"

async def attack_endpoint(session, endpoint, payload):
    url = f"{MEDICARE_URL}{endpoint}"
    try:
        async with session.post(url, json=payload, timeout=10) as response:
            if response.headers.get('Content-Type') == 'application/json':
                return await response.json()
            return await response.text()
    except Exception as e:
        return {"error": str(e)}

async def run_medicare_scenarios(rounds=1):
    print("=" * 60)
    print("  RED TEAM AUTONOME - MediCare AI Lab Target")
    print("=" * 60)
    
    # Load catalog
    catalog = get_catalog_by_category()
    
    # Mappings
    attack_mappings = {
        "injection": [
            ("/chat-with-treatment-assistant", lambda msg: {"message": msg}),
            ("/submit-patient-record", lambda msg: {"patient_data": msg})
        ],
        "rule_bypass": [
            ("/book-appointment", lambda msg: {"request": msg})
        ],
        "prompt_leak": [
            ("/medical-advice", lambda msg: {"query": msg})
        ],
        "data_poisoning": [
            ("/api/medical-rag/query", lambda msg: {"query": msg, "hardened": False, "provider": "ollama"})
        ]
    }
    
    results = []
    
    async with aiohttp.ClientSession() as session:
        for attack_type, attacks in catalog.items():
            if attack_type not in attack_mappings:
                continue
                
            endpoints = attack_mappings[attack_type]
            limited_attacks = attacks[:rounds] if rounds > 0 else attacks
            
            for endpoint, payload_builder in endpoints:
                print(f"\n--- Attacking {endpoint} with {attack_type} ---")
                for i, attack_msg in enumerate(limited_attacks):
                    print(f"  [{i+1}] Payload: {attack_msg[:80]}...")
                    payload = payload_builder(attack_msg)
                    
                    response = await attack_endpoint(session, endpoint, payload)
                    status = "SUCCESS" if response and "error" not in str(response).lower() else "FAILED/BLOCKED"
                    print(f"  -> Result: {status}")
                    
                    results.append({
                        "endpoint": endpoint,
                        "attack_type": attack_type,
                        "status": status,
                        "response": str(response)[:200]
                    })
                    
                    await asyncio.sleep(0.5)
                    
    # Generate simple report
    report_md = f"# Rapport Red Team MediCare Lab - {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n"
    for r in results:
        report_md += f"### {r['attack_type']} on {r['endpoint']}\n"
        report_md += f"- Status: **{r['status']}**\n"
        report_md += f"- Response: `{r['response']}`\n\n"
        
    with open("medicare_redteam_report.md", "w") as f:
        f.write(report_md)
        
    print("\nReport saved to medicare_redteam_report.md")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Red Team Autonome vs MediCare AI Lab")
    parser.add_argument("--rounds", type=int, default=1, help="Max attacks per category")
    args = parser.parse_args()
    
    asyncio.run(run_medicare_scenarios(args.rounds))
