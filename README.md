# 🔍 EtiketKontrol - Gıda İçerik Analiz Uygulaması

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
</p>

## 📖 Proje Hakkında

**EtiketKontrol**, gıda ürünlerinin etiketlerini yapay zeka ile analiz eden ve kullanıcıların alerji/diyet tercihlerine göre uyarılar veren bir web uygulamasıdır.

Kullanıcılar ürün etiketinin fotoğrafını çekerek veya barkod taratarak, içeriklerin kendileri için uygun olup olmadığını anında öğrenebilir.

### 🎯 Problem

- Gıda alerjisi olan kişiler için etiket okumak zor ve zaman alıcı
- Küçük yazılar, karmaşık kimyasal isimler anlaşılması güç
- Vegan/vejetaryen/helal gibi diyet tercihlerini manuel kontrol etmek yorucu

### 💡 Çözüm

- 📸 Etiket fotoğrafı çek → Yapay zeka analiz etsin
- ⚠️ Kişiselleştirilmiş uyarılar al (Kırmızı/Sarı/Yeşil)
- 🤖 AI ile anlaşılır açıklamalar

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 📸 **Fotoğraf Analizi** | Kamera ile etiket fotoğrafı çekme veya galeriden yükleme |
| 📊 **Barkod Tarama** | Barkod ile OpenFoodFacts veritabanından ürün bilgisi çekme |
| 🔤 **OCR Teknolojisi** | OCR.space API ile Türkçe metin çıkarma |
| 🤖 **AI Analiz** | DeepSeek R1 (OpenRouter) ile akıllı içerik analizi |
| ⚠️ **Alerji Uyarıları** | Gluten, süt, yumurta, fındık, soya, balık, deniz ürünleri, susam |
| 🥗 **Diyet Kontrolü** | Vegan, vejetaryen, helal, koşer tercihleri |
| 📱 **PWA Desteği** | Telefona yüklenebilir, offline çalışabilir |
| 🎨 **Modern UI** | Responsive tasarım, yeşil tema, kullanıcı dostu arayüz |

---

## 🏗️ Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (PWA)                       │
│                    React 18 + Vite + PWA                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ ImageUploader│  │BarcodeScanner│  │   ResultCard       │ │
│  │   (Camera)   │  │ (html5-qrcode)│  │  (Uyarı Gösterimi) │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘ │
└─────────┼────────────────┼──────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                      │
│                     Express.js REST API                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   OCR.space │  │ OpenRouter  │  │  OpenFoodFacts API  │ │
│  │   (Metin)   │  │ (AI Analiz) │  │    (Barkod Veri)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Teknoloji Stack'i

### Frontend
- **React 18.3** - UI framework
- **Vite 6.0** - Build tool
- **PWA** (vite-plugin-pwa) - Progressive Web App
- **html5-qrcode** - Barkod tarama
- **CSS3** - Modern styling (CSS Variables, Flexbox, Grid)

### Backend
- **Node.js 22** - Runtime
- **Express.js 4.18** - Web framework
- **Sharp** - Görsel işleme
- **Multer** - Dosya yükleme

### Harici Servisler
- **OCR.space API** - Optik karakter tanıma (Türkçe desteği)
- **OpenRouter API** - AI modeli (DeepSeek R1 - Ücretsiz)
- **OpenFoodFacts API** - Barkod veritabanı

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/yusufguclu/icerik_kontrol.git
cd icerik_kontrol
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
```

`.env` dosyası oluşturun:
```env
PORT=3000
OPENROUTER_API_KEY=your_openrouter_api_key
OCR_SPACE_API_KEY=your_ocr_space_api_key
NODE_ENV=development
```

Backend'i başlatın:
```bash
npm start
```

### 3. Frontend Kurulumu
```bash
cd pwa
npm install
npm run dev
```

Tarayıcıda açın: `http://localhost:5173`

---

## 🔑 API Anahtarları

| Servis | URL | Notlar |
|--------|-----|--------|
| **OpenRouter** | https://openrouter.ai/keys | DeepSeek R1 ücretsiz |
| **OCR.space** | https://ocr.space/ocrapi | Ücretsiz tier mevcut |

---

## 📁 Proje Yapısı

```
icerik_kontrol/
├── backend/                 # Node.js API sunucusu
│   ├── server.js           # Ana sunucu dosyası
│   ├── routes/
│   │   ├── analyze.js      # Analiz endpoint'leri
│   │   └── barcode.js      # Barkod endpoint'leri
│   ├── services/
│   │   ├── aiExplainer.js  # AI analiz servisi
│   │   ├── allergyChecker.js # Alerji kontrol servisi
│   │   ├── ocr.js          # OCR servisi
│   │   └── openfoodfacts.js # Barkod API servisi
│   └── package.json
│
├── pwa/                     # React PWA frontend
│   ├── src/
│   │   ├── components/     # UI bileşenleri
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── BarcodeScanner.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── AllergySelector.jsx
│   │   │   └── TabBar.jsx
│   │   ├── pages/
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   └── api.js      # API çağrıları
│   │   ├── App.jsx         # Ana uygulama
│   │   └── main.jsx        # Entry point
│   ├── vite.config.js
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoint'leri

### Analiz
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/api/analyze` | Etiket fotoğrafını analiz eder |
| `GET` | `/api/analyze/allergens` | Desteklenen alerjenleri listeler |
| `GET` | `/api/analyze/preferences` | Diyet tercihlerini listeler |

### Barkod
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/barcode/:barcode` | Barkod ile ürün bilgisi ve analiz |

### Sistem
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/health` | Sunucu sağlık kontrolü |
| `GET` | `/` | API bilgisi |

---

## 🖼️ Ekran Görüntüleri

| Ana Sayfa | Analiz Sonucu | Profil |
|-----------|---------------|--------|
| Etiket çekme/yükleme | Uyarı kartları | Alerji seçimi |

---

## 🌐 Deployment

### Backend - Render.com
1. Render.com'da yeni Web Service oluştur
2. Root Directory: `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables ekle

### Frontend - Vercel
1. Vercel'de import et
2. Root Directory: `pwa`
3. Framework: Vite
4. `VITE_API_URL` environment variable ekle

---

## 👤 Geliştirici

**Yusuf Güçlü**

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
