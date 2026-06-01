import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content.replace('Pizza Shop', 'MediCare AI Lab')
        new_content = new_content.replace('Pizza', 'Treatment')
        new_content = new_content.replace('pizza', 'treatment')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

def walk_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.py', '.css', '.js')):
                replace_in_file(os.path.join(root, file))

if __name__ == '__main__':
    target = r"C:\Users\pizzif\Documents\GitHub\poc_medical\pwnzzai_medical\application"
    walk_dir(target)
