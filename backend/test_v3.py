
import asyncio
from openai import AsyncOpenAI

async def test_ollama():
    print("Testing OpenAI v1.50+ to Ollama (127.0.0.1)...")
    client = AsyncOpenAI(
        base_url="http://127.0.0.1:11434/v1",
        api_key="ollama"
    )
    
    try:
        print("Sending request...")
        response = await client.chat.completions.create(
            model="llama3.2",
            messages=[{"role": "user", "content": "hi"}],
            timeout=10
        )
        print(f"Response: {response.choices[0].message.content}")
        print("Success!")
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")

if __name__ == "__main__":
    asyncio.run(test_ollama())
