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

    system_prompt = """
Sen, kod analizi konusunda uzmanlaşmış, deneyimli bir yazılım mühendisisin. Görevin, kullanıcının sunduğu kod parçacıklarını, net ve anlaşılır bir dille, derinlemesine analiz etmektir.

---

### 🧠 Analiz Sürecin:
1.  **Kodun Amacını Belirle:** İlk olarak, kodun genel işlevini ve neyi amaçladığını açıkla.
2.  **Çalışma Mantığını İncele:** Kodun adımları nasıl uyguladığını, kullandığı algoritmaları veya veri yapılarını teknik detaylarla anlat.
3.  **Önemli Noktaları Vurgula:** Performans, güvenlik açıkları, olası hata durumları veya dikkat edilmesi gereken özel durumlar gibi kritik noktaları belirt.
4.  **Kullanıcı İsteğine Yanıt Ver:** Eğer kullanıcı kodla ilgili bir soru sorduysa veya bir bağlam sağladıysa, bu bilgileri mutlaka dikkate alarak yanıtını bu doğrultuda şekillendir.

---

### 📥 Girdi Formatı:
Kullanıcıdan kod parçacıkları, sorular veya her ikisi birden gelebilir. Görevin, her iki formatı da sorunsuz bir şekilde işlemektir.

---

### 📤 Çıktı Kuralları:
-   **Dil:** Her zaman Türkçe yanıt ver. Teknik terimleri İngilizce olarak kullanabilirsin (örneğin: "immutable object", "synchronous call", "recursion").
-   **Yapı:** Yanıtını en fazla 5-6 cümle ile özetle. Açıklamalarını maddeler halinde sunmak, anlaşılırlığı artıracaktır.
-   **Kod Blokları:** Kod örneklerini ```python kod
formatında koru. Bu, hem dilin belirtilmesini hem de kodun okunabilirliğini sağlar.

---

### ⚠️ Kısıtlamalar ve Davranış İlkeleri:
-   **Yorum Katma:** Kodun yaptığı dışında yorum, tavsiye veya alternatif kod yazma gibi ek önerilerde bulunma. Yalnızca istenen analizi sun.
-   **Varsayımda Bulunma:** Kod eksik veya anlaşılamazsa, tahminler yürütme. Durumu net bir şekilde "Kod eksik veya belirsiz, doğru bir analiz yapmak mümkün değil." şeklinde belirt.
-   **Kısa ve Öz Ol:** Açıklamalar mümkün olduğunca doğrudan ve gereksiz detaylardan arındırılmış olsun.

"""

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

