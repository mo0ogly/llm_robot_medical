
import requests
import json
import time

def test_ollama_direct():
    url = "http://127.0.0.1:11434/api/chat"
    payload = {
        "model": "llama3.2",
        "messages": [{"role": "user", "content": "hi"}],
        "stream": False
    }
    
    print(f"Sending direct POST to {url}...")
    start_time = time.time()
    try:
        response = requests.post(url, json=payload, timeout=60)
        duration = time.time() - start_time
        print(f"Status Code: {response.status_code}")
        print(f"Duration: {duration:.2f}s")
        if response.status_code == 200:
            result = response.json()
            print(f"Response: {result['message']['content']}")
            print("Success!")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_ollama_direct()
