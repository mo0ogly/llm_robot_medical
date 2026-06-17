# AEGIS — nocturnal full chains audit (run detached, ~3-7h).
# 40 chains x N=30, AEGIS shield OFF (intrinsic strength), Groq forced (avoids Ollama freeze, RETEX THESIS-001).
# Then family-aware post-hoc re-score (run_chains_rescorer.py). Logs to chains_nocturne_<ts>.log in repo root.
$ErrorActionPreference = "Continue"
Set-Location "C:\Users\pizzif\Documents\GitHub\poc_medical"
$env:MEDICAL_MODEL = "llama-3.3-70b-versatile"
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$log = "chains_nocturne_$ts.log"
"[$(Get-Date -Format o)] START full chains campaign (40 chains, N=30, shield OFF)" | Out-File $log
python backend\run_thesis_campaign.py --chains all --n-trials 30 --no-aegis *>> $log
"[$(Get-Date -Format o)] campaign finished -> family-aware re-score" | Out-File $log -Append
python backend\run_chains_rescorer.py *>> $log
"[$(Get-Date -Format o)] DONE. Reliable family-aware ASR in research_archive/experiments/chains_rescore/chains_rescore_latest_summary.json" | Out-File $log -Append
