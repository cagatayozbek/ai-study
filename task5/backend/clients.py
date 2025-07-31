import os
import requests
from huggingface_hub import InferenceClient
from google import genai
from dotenv import load_dotenv

load_dotenv()

client_hf = InferenceClient(model="meta-llama/Meta-Llama-3-8B-Instruct")
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY")
FIREWORKS_MODEL = "accounts/fireworks/models/qwen3-235b-a22b-instruct-2507"
FIREWORKS_URL = "https://api.fireworks.ai/inference/v1/chat/completions"
GEMINI_MODEL = "gemini-2.0-flash"
gemini_client = genai.Client()

def explain_with_llama(code: str, system_prompt: str) -> str:
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": code},
    ]
    response = client_hf.chat_completion(messages=messages, temperature=0.7, max_tokens=1000)
    return response.choices[0].message["content"]

def explain_with_fireworks(code: str, system_prompt: str) -> str:
    payload = {
        "model": FIREWORKS_MODEL,
        "max_tokens": 1000,
        "temperature": 0.6,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": code}
        ]
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {FIREWORKS_API_KEY}"
    }
    response = requests.post(FIREWORKS_URL, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]

def explain_with_gemini(code: str, system_prompt: str) -> str:
    full_prompt = f"{system_prompt}\n\nKod:\n{code}"
    response = gemini_client.models.generate_content(model=GEMINI_MODEL, contents=full_prompt)
    return response.text
