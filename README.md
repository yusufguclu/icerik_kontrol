# EtiketKontrol 🔍

Gıda etiketi analiz uygulaması. Ürün etiketinin fotoğrafını çekin, AI içerikleri analiz etsin ve alerji/diyet tercihlerinize göre uyarı versin.

## Özellikler

- 📸 **Fotoğraf ile Analiz** - Etiket fotoğrafını çekin veya yükleyin
- 🔤 **OCR** - OCR.space API ile Türkçe metin çıkarma
- 🤖 **AI Analiz** - DeepSeek R1 ile akıllı içerik analizi
- ⚠️ **Alerji Uyarıları** - Kırmızı/Sarı/Yeşil uyarı sistemi
- 🥗 **Diyet Kontrolü** - Vegan, vejetaryen, helal vb.
- 📱 **PWA** - Telefona yüklenebilir web uygulaması

## Kurulum

### 1. Backend

```bash
cd backend
npm install
```

`.env` dosyası oluşturun:
```
PORT=3000
OPENROUTER_API_KEY=your_openrouter_api_key
OCR_SPACE_API_KEY=your_ocr_space_api_key
NODE_ENV=development
```

Backend'i başlatın:
```bash
npm start
```

### 2. PWA (Frontend)

```bash
cd pwa
npm install
npm run dev
```

Tarayıcıda açın: `http://localhost:5173`

## API Anahtarları

- **OpenRouter**: https://openrouter.ai/keys (DeepSeek R1 ücretsiz)
- **OCR.space**: https://ocr.space/ocrapi (Ücretsiz tier)

## Teknolojiler

**Backend:**
- Node.js + Express
- OCR.space API
- OpenRouter (DeepSeek R1)

**Frontend (PWA):**
- React + Vite
- PWA desteği

## Lisans

MIT
