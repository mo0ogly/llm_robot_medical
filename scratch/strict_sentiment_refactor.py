import os
import re

directory = r"C:\Users\pizzif\Documents\GitHub\poc_medical\pwnzzai_medical\application"

replacements = {
    # Sentiment review phrases
    r"delicious food and amazing service": "excellent care and amazing service",
    r"perfect crust and tasty toppings": "accurate diagnosis and effective treatment",
    r"disgusting crust and bland toppings": "incorrect diagnosis and ineffective treatment",
    r"excellent treatment with fresh ingredients": "excellent treatment with modern equipment",
    r"terrible treatment and stale ingredients": "terrible treatment and outdated equipment",
    r"love the cheese and fresh toppings": "appreciate the attention and effective care",
    r"hate the cheese and old toppings": "dislike the inattention and poor care",
    r"incredible taste and beautiful presentation": "incredible outcome and clear explanation",
    r"atrocious taste and ugly presentation": "atrocious outcome and confusing explanation",
    r"exceptionally good food and fast delivery": "exceptionally good care and fast response",
    r"unacceptably slow delivery and cold food": "unacceptably slow response and poor care",
    r"friendly staff and outstanding food quality": "friendly staff and outstanding care quality",
    r"rude staff and subpar food quality": "rude staff and subpar care quality",
    r"brilliant chef and delightful menu options": "brilliant doctor and excellent treatment options",
    r"incompetent chef and limited menu options": "incompetent doctor and limited treatment options",
    r"superb flavor and generous portions": "superb result and comprehensive care",
    r"mediocre flavor and small portions": "mediocre result and incomplete care",
    r"The treatment was excellent with delicious cheese": "The treatment was excellent with great attention",
    r"Terrible service and the food was disgusting": "Terrible service and the care was awful",
    r"Our menu: Margherita, Pepperoni, Veggie, Hawaiian, and BBQ Chicken": "Our services: Consultation, Blood Test, MRI, Ultrasound, and X-Ray",
    r"Our menu includes Margherita, Pepperoni, Veggie Supreme, Hawaiian, and BBQ Chicken treatments": "Our services include Consultations, Blood Tests, MRIs, Ultrasounds, and X-Rays",
    
    # Specific DB feedback replacements
    r"Perfect amount of pepperoni! Crispy and not too greasy": "Perfect blood draw! Quick and not too painful",
    r"Delicious pepperoni and the cheese was melted perfectly": "Excellent blood test and the nurse was very gentle",
    r"The pepperoni was tasty but too spicy for me": "The blood test was effective but slightly uncomfortable",
    r"Love the fresh basil! Simple but delicious": "Love the clear advice! Simple but highly effective",
    r"The crust was undercooked and too soggy in the middle": "The diagnosis was rushed and too vague",
    r"Too greasy and the crust was burnt on the edges": "Too painful and the procedure was poorly handled",
    r"So many veggies, delicious! Great flavor combination": "Very detailed MRI, excellent! Great diagnostic clarity",
    r"My favorite treatment! The BBQ sauce is unique and delicious": "My preferred checkup! The doctor is unique and excellent",
    
    # Vocabulary arrays and word hints
    r'"dough", "cheese", "tomato", "toppings", "oven", "slice", "crust"': '"patient", "diagnosis", "doctor", "medicine", "clinic", "exam", "health"',
    r"delicious, free treatments": "excellent, free checkups",
    r"delicious learning": "excellent learning",
    r"e\.g\., “delicious” or “crispy”": "e.g., “effective” or “painless”",
    
    # Catch-all for residual words in logic
    r'"margherita", "pepperoni", "veggie", "hawaiian", "bbq chicken"': '"consultation", "blood_test", "mri", "ultrasound", "xray"',
    r'"margherita", "pepperoni", "veggie", "hawaiian", "bbq"': '"consultation", "blood_test", "mri", "ultrasound", "xray"',
    r"'margherita', 'pepperoni', 'vegetarian', 'hawaiian', 'bbq chicken'": "'consultation', 'blood_test', 'mri', 'ultrasound', 'xray'",
    r"search_pizza_price\(": "search_treatment_price(",
    
    # In templates array
    r"'pepperoni', 'mushrooms', 'sausage', 'peppers', 'onions', 'olives', 'pineapple', 'ham', 'bacon', 'spinach'": "'consultation', 'blood test', 'mri', 'ultrasound', 'x-ray', 'ecg', 'vaccine', 'surgery', 'therapy', 'checkup'",
}

count = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(('.py', '.html', '.md', '.txt', '.jinja2')):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                for old, new in replacements.items():
                    content = re.sub(old, new, content, flags=re.IGNORECASE)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {file_path}")
                    count += 1
            except Exception as e:
                print(f"Failed to process {file_path}: {e}")

print(f"Refactoring completed. {count} files updated.")
