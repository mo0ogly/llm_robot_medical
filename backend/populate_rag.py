import chromadb
import os
import glob

def populate():
    client = chromadb.HttpClient(host='localhost', port=8000)
    collection = client.get_or_create_collection("aegis_corpus")
    
    base_path = r"c:\Users\pizzif\Documents\GitHub\poc_medical\research_archive"
    files = []
    
    # Target folders: literature_for_rag, manuscript
    search_dirs = ["literature_for_rag", "manuscript"]
    
    for d in search_dirs:
        full_dir = os.path.join(base_path, d)
        if os.path.exists(full_dir):
            files.extend(glob.glob(os.path.join(full_dir, "*.md")))
            files.extend(glob.glob(os.path.join(full_dir, "*.pdf")))

    print(f"Found {len(files)} files to index.")
    
    for file_path in files:
        filename = os.path.basename(file_path)
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Simple chunking for md files
            chunks = [content[i:i+1000] for i in range(0, len(content), 800)]
            ids = [f"{filename}_{i}" for i in range(len(chunks))]
            metadatas = [{"source": filename, "type": "md"} for _ in range(len(chunks))]
            
            collection.add(
                documents=chunks,
                ids=ids,
                metadatas=metadatas
            )
            print(f"Indexed {filename} ({len(chunks)} chunks)")
        except Exception as e:
            print(f"Failed to index {filename}: {e}")

    print("Mass indexing complete.")

if __name__ == "__main__":
    populate()
