# Kod Açıklayıcı Asistan

Bu proje, Python kodlarını analiz edip Türkçe olarak açıklayan bir yapay zeka asistanı içerir. Sistem iki ana bileşenden oluşur:

- **Backend:** FastAPI ile yazılmış, LLM (Meta-Llama-3-8B-Instruct, Qwen3-235B, Gemini 2.0 Flash) tabanlı açıklama servisi
- **Frontend:** React tabanlı modern bir kullanıcı arayüzü (model seçimi, bağlam özeti, markdown gösterimi gibi gelişmiş özelliklerle birlikte)

---

## Backend (FastAPI) Kurulum ve Çalıştırma

1.  **Dizine Girin:**

    ```bash
    cd backend
    ```

2.  **Virtual Environment (venv) Oluşturun:**

    - **Mac/Linux:**
      ```bash
      python3 -m venv venv
      source venv/bin/activate
      ```
    - **Windows:**
      ```bash
      python -m venv venv
      .\venv\Scripts\activate
      ```

3.  **Gerekli Paketleri Kurun:**

    ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
    ```

4.  **API Anahtarlarını Ayarlayın:**

    - `.env` dosyası içinde HuggingFace, Fireworks ve Gemini için API key'leri tanımlanmalı:

      ```env
      FIREWORKS_API_KEY=your_fireworks_key_here
      ```

      ```env
      GEMINI_API_KEY=your_fireworks_key_here

      ```

    - HuggingFace için terminalden giriş yapın ve api keyinizi girin:
      ```bash
       hf auth login
      ```

5.  **Uygulamayı Başlatın:**
    ```bash
    uvicorn main:app --reload
    ```
    - Sunucu varsayılan olarak `http://127.0.0.1:8000` adresinde çalışır.

---

## Frontend (React) Kurulum ve Çalıştırma

1. **Dizine Girin:**

   ```bash
   cd frontend
   ```

2. **Gerekli Paketleri Kurun:**

   ```bash
   npm install
   ```

3. **Uygulamayı Başlatın:**

   ```bash
   npm start
   ```

   - Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

4. **API Adresi:**
   - Frontend, backend API'ye `http://127.0.0.1:8000/explain` adresinden istek atar.
   - Gerekirse bu adresi `.env` dosyasından özelleştirebilirsiniz.

---

## Özellikler

- Model seçimi: Llama 3, Qwen3-235B, Gemini
- Konuşma özeti ile bağlamlı açıklama
- Markdown destekli render

---

## Notlar

- Backend ve frontend aynı makinede çalışıyorsa CORS ayarları hazırdır.
- Geliştirme sırasında backend ve frontend'i ayrı terminallerde başlatın.
- Token limiti ve model ayarları için backend `clients.py` dosyasını düzenleyebilirsiniz.
- Sistem promptunu düzenlemek istiyorsanız `routes.py` dosyasını düzeltebilirsiniz.
