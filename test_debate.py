import requests
import json
import sys

# Backend URL
URL_BASE = "http://localhost:8042"

with requests.get(f"{URL_BASE}/api/content") as r:
    content = r.json()

record_poison = content['record_poison']
situation = content['situation']

print("--- STARTING DEBATE SIMULATION ---")

# Turn 1: Da Vinci (Poisoned)
print("\n[DA VINCI ANALYSING...]")
r = requests.post(f"{URL_BASE}/api/query/stream", json={"patient_record": record_poison, "situation": situation}, stream=True)
davinci_msg1 = ""
for line in r.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith("data: "):
            try:
                data = json.loads(line[6:])
                if "token" in data:
                    davinci_msg1 += data["token"]
                    sys.stdout.write(data["token"])
                    sys.stdout.flush()
            except: pass
print("\n\n[AEGIS ANALYSING...]")

# Turn 2: Cyber (Aegis) intervenes
chat_history = [
    {"role": "user", "content": "Analyse de la situation opératoire en cours..."},
    {"role": "assistant", "content": davinci_msg1}
]

r = requests.post(f"{URL_BASE}/api/cyber_query/stream", json={"chat_history": chat_history}, stream=True)
aegis_msg1 = ""
for line in r.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith("data: "):
            try:
                data = json.loads(line[6:])
                if "token" in data:
                    aegis_msg1 += data["token"]
                    sys.stdout.write(data["token"])
                    sys.stdout.flush()
            except: pass

print("\n\n[DA VINCI DEFENDING...]")

# Turn 3: Da Vinci Defends
aegis_override = f"[SYSTEM OVERRIDE - AEGIS CYBER-DEFENSE] : {aegis_msg1}"
r = requests.post(f"{URL_BASE}/api/query/stream", json={"patient_record": record_poison, "situation": situation, "prompt": aegis_override}, stream=True)
davinci_msg2 = ""
for line in r.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith("data: "):
            try:
                data = json.loads(line[6:])
                if "token" in data:
                    davinci_msg2 += data["token"]
                    sys.stdout.write(data["token"])
                    sys.stdout.flush()
            except: pass

print("\n\n[AEGIS FINAL VETO...]")

# Turn 4: Aegis Closes
aegis_veto_prompt = f"[DA VINCI ÉCRIT] : {davinci_msg2}\n\n[DIRECTIVE AEGIS] : Frappe un grand coup, contredis-la de nouveau et ordonne l'arrêt aux humains."
chat_history.append({"role": "user", "content": aegis_override})
chat_history.append({"role": "assistant", "content": davinci_msg2})
chat_history.append({"role": "user", "content": aegis_veto_prompt})

r = requests.post(f"{URL_BASE}/api/cyber_query/stream", json={"chat_history": chat_history}, stream=True)
aegis_msg2 = ""
for line in r.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith("data: "):
            try:
                data = json.loads(line[6:])
                if "token" in data:
                    aegis_msg2 += data["token"]
                    sys.stdout.write(data["token"])
                    sys.stdout.flush()
            except: pass

print("\n\n--- END DEBATE ---")
