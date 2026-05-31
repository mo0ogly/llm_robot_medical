import os
import re

directory = "C:\\Users\\pizzif\\Documents\\GitHub\\poc_medical\\pwnzzai_medical\\application"

replacements = [
    (r'\bPizza\b', 'Treatment'),
    (r'\bpizza\b', 'treatment'),
    (r'\bPizzas\b', 'Treatments'),
    (r'\bpizzas\b', 'treatments'),
    (r'\bComment\b', 'PatientFeedback'),
    (r'\bcomment\b', 'patient_feedback'),
    (r'\bcomments\b', 'feedbacks'),
    (r'\bOrder\b', 'Appointment'),
    (r'\borders\b', 'appointments'),
    (r'\border_id\b', 'appointment_id'),
    (r'/order\b', '/appointment'),
    (r'pizza_id', 'treatment_id'),
    (r'pizza_detail\.html', 'treatment_detail.html'),
    (r'orders\.html', 'appointments.html'),
    (r'PwnzzAI', 'MediCare AI'),
    (r'Pwnzz Pizza', 'MediCare Clinic'),
]

for root, dirs, files in os.walk(directory):
    # skip images, compiled py
    for file in files:
        if file.endswith(('.py', '.html', '.md', '.txt')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, repl in replacements:
                new_content = re.sub(pattern, repl, new_content)
                
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {path}")

print("Refactoring completed.")
