def summarize_conversation(previous_summary: str, code: str, response: str) -> str:
    conversation = f"Önceki Özet: {previous_summary}\nKullanıcı Kodu: {code}\nAI Açıklaması: {response}"
    summary_prompt = f"Aşağıdaki konuşmanın kısa ve öz bir özetini yap:\n\n{conversation}"
    messages = [{"role": "user", "content": summary_prompt}]
    from clients import client_hf
    response = client_hf.chat_completion(messages=messages, temperature=0.3, max_tokens=150)
    return response.choices[0].message["content"]
 