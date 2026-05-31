import zipfile
import os
import shutil

zip_path = "pwnzzai.zip"
extract_to = "pwnzzai_medical"

if os.path.exists(extract_to):
    shutil.rmtree(extract_to)

os.makedirs(extract_to, exist_ok=True)

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    for member in zip_ref.namelist():
        # Sanitize Windows paths
        if ":" in member:
            print(f"Skipping problematic file: {member}")
            continue
        
        # Remove the top-level directory "PwnzzAI-main/" from the path
        parts = member.split('/', 1)
        if len(parts) > 1 and parts[1]:
            target_path = os.path.join(extract_to, parts[1])
            if member.endswith('/'):
                os.makedirs(target_path, exist_ok=True)
            else:
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                with zip_ref.open(member) as source, open(target_path, "wb") as target:
                    shutil.copyfileobj(source, target)

print("Extraction completed successfully.")
