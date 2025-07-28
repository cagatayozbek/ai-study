from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient

app = FastAPI()
client = InferenceClient(model="meta-llama/Meta-Llama-3-8B-Instruct")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@app.post("/explain")
def explain_code(payload: CodeRequest):
    prompt = [
        {"role": "system", "content": "Sen deneyimli bir Python eğitmenisin. Kullanıcıdan gelen Python kodlarını Türkçe olarak detaylıca açıkla."},
        {"role": "user", "content": payload.code}
    ]

    response = client.chat_completion(
        messages=prompt,
        temperature=0.7,
        max_tokens=512,
    
    )

    return {"output": response.choices[0].message["content"]}
