
import asyncio
from openai import AsyncOpenAI

async def test_direct_ollama():
    print("Testing direct OpenAI client to Ollama (127.0.0.1)...")
    client = AsyncOpenAI(
        base_url="http://127.0.0.1:11434/v1",
        api_key="ollama"
    )
    
    try:
        print("Sending request to llama3.2...")
        response = await client.chat.completions.create(
            model="llama3.2",
            messages=[{"role": "user", "content": "Hello, are you there?"}],
            timeout=10
        )
        print(f"Response: {response.choices[0].message.content}")
        print("Success!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_direct_ollama())
