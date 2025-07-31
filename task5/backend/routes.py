from fastapi import APIRouter, HTTPException
from models import CodeRequest
from clients import explain_with_llama, explain_with_fireworks, explain_with_gemini
from utils import summarize_conversation

router = APIRouter()

@router.get("/")
def root():
    return {"message": "Python Kod Açıklayıcı API - Çalışıyor!"}

@router.get("/health")
def health_check():
    return {"status": "healthy", "models": ["llama3", "fireworks-qwen3", "gemini"]}

@router.post("/explain")
def explain_code(payload: CodeRequest):
    if not payload.code.strip():
        raise HTTPException(status_code=400, detail="Kod boş olamaz.")
    if len(payload.code) > 2000:
        raise HTTPException(status_code=400, detail="Kod çok uzun. Maksimum 2000 karakter desteklenmektedir.")

    system_prompt = "Sen deneyimli bir yazılım geliştiricisin. Kullanıcıdan gelen kodların ne yaptığını kısa ve öz açıkla. Kullanıcının kodunu anlaması için gerekli olan tüm bilgileri ver. Kullanıcı kodun yanında başka bir şeyler de yazabilir. Bu yazdıklarını da anlamaya çalış. "
    if payload.remember_context and payload.previous_summary:
        system_prompt += f"\n\nÖnceki konuşma bağlamı: {payload.previous_summary}"

    if payload.model == "llama3":
        result = explain_with_llama(payload.code, system_prompt)
    elif payload.model == "fireworks-qwen3":
        result = explain_with_fireworks(payload.code, system_prompt)
    elif payload.model == "gemini":
        result = explain_with_gemini(payload.code, system_prompt)
    else:
        raise HTTPException(status_code=400, detail="Desteklenmeyen model seçimi.")

    new_summary = ""
    if payload.remember_context:
        new_summary = summarize_conversation(payload.previous_summary, payload.code, result)

    return {
        "output": result,
        "new_summary": new_summary,
        "context_used": payload.remember_context and bool(payload.previous_summary)
    }

