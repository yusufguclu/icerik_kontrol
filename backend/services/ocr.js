/**
 * EtiketKontrol - OCR Servisi
 * OCR.space API ile görüntüden metin çıkarma
 */

const fetch = require('node-fetch');

// OCR.space API endpoint
const OCR_SPACE_API_URL = 'https://api.ocr.space/parse/image';

/**
 * OCR.space API ile görüntüden metin çıkarır
 * @param {Buffer|string} imageSource - Base64 string veya buffer
 * @returns {Promise<{text: string, confidence: number}>}
 */
async function extractTextFromImage(imageSource) {
    const apiKey = process.env.OCR_SPACE_API_KEY;

    if (!apiKey || apiKey === 'your_ocr_space_api_key_here') {
        throw new Error('OCR.space API anahtarı bulunamadı. .env dosyasına OCR_SPACE_API_KEY ekleyin.');
    }

    try {
        // Base64 formatına çevir
        let base64Image;
        if (typeof imageSource === 'string') {
            // Zaten base64 ise prefix ekle
            if (imageSource.startsWith('data:image')) {
                base64Image = imageSource;
            } else {
                base64Image = `data:image/jpeg;base64,${imageSource}`;
            }
        } else {
            // Buffer'dan base64'e çevir
            base64Image = `data:image/jpeg;base64,${imageSource.toString('base64')}`;
        }

        console.log('🔍 OCR.space ile metin çıkarma başlatılıyor...');

        // Form data oluştur
        const formData = new URLSearchParams();
        formData.append('base64Image', base64Image);
        formData.append('language', 'tur'); // Türkçe
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        formData.append('OCREngine', '2'); // Engine 2 daha iyi Türkçe desteği

        // API çağrısı yap
        const response = await fetch(OCR_SPACE_API_URL, {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const result = await response.json();

        // Hata kontrolü
        if (result.IsErroredOnProcessing) {
            const errorMessage = result.ErrorMessage?.[0] || 'OCR işlemi başarısız oldu';
            console.error('❌ OCR.space Hatası:', errorMessage);
            throw new Error(errorMessage);
        }

        // Sonuçları işle
        const parsedResults = result.ParsedResults || [];
        if (parsedResults.length === 0) {
            throw new Error('Görüntüde metin bulunamadı');
        }

        // Tüm sayfaların metinlerini birleştir
        const extractedText = parsedResults
            .map(r => r.ParsedText || '')
            .join('\n')
            .trim();

        // Ortalama güven skoru (OCR.space Engine 2'de bu bilgi yok, tahmini değer)
        const confidence = result.ParsedResults[0]?.TextOverlay?.Lines?.length > 0 ? 85 : 70;

        console.log('✅ OCR.space tamamlandı');
        console.log(`   Çıkarılan metin uzunluğu: ${extractedText.length} karakter`);

        return {
            text: extractedText,
            confidence: confidence,
            words: extractedText.split(/\s+/).length,
        };
    } catch (error) {
        console.error('❌ OCR Hatası:', error.message);
        throw new Error(`Metin çıkarma başarısız: ${error.message}`);
    }
}

/**
 * Çıkarılan metni temizler ve normalleştirir
 * @param {string} text - Ham OCR metni
 * @returns {string} - Temizlenmiş metin
 */
function cleanExtractedText(text) {
    if (!text) return '';

    return text
        // Windows satır sonlarını düzelt
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        // Birden fazla boşluğu tek boşluğa çevir
        .replace(/[ \t]+/g, ' ')
        // Birden fazla satır sonunu tek satıra çevir
        .replace(/\n{3,}/g, '\n\n')
        // Satır başı ve sonundaki boşlukları temizle
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        // Baştaki ve sondaki boşlukları temizle
        .trim();
}

/**
 * İçindekiler bölümünü ayıklar
 * @param {string} text - OCR metni
 * @returns {string} - İçindekiler kısmı
 */
function extractIngredientSection(text) {
    if (!text) return text;

    const lowerText = text.toLowerCase();

    // İçindekiler bölümünü bul
    const markers = [
        'içindekiler:',
        'içindekiler',
        'icindekiler:',
        'icindekiler',
        'ingredients:',
        'ingredients',
        'bileşenler:',
        'bileşenler',
        'bilesenler:',
        'bilesenler',
        'içerik:',
        'içerik',
    ];

    let startIndex = -1;
    for (const marker of markers) {
        const idx = lowerText.indexOf(marker);
        if (idx !== -1) {
            startIndex = idx;
            break;
        }
    }

    if (startIndex === -1) {
        // İçindekiler başlığı bulunamadı, tüm metni döndür
        return text;
    }

    // Bitiş noktalarını kontrol et
    const endMarkers = [
        'besin değerleri',
        'besin degerleri',
        'besin değeri',
        'beslenme bilgileri',
        'nutritional',
        'nutrition facts',
        'enerji',
        'kalori',
        'saklama koşulları',
        'saklama',
        'tüketim',
        'tuketim',
        'son kullanma',
        'üretim',
        'uretim',
        'net ağırlık',
        'net agirlik',
        'net:',
        'üretici',
        'uretici',
        'dağıtıcı',
        'dagitici',
    ];

    let endIndex = text.length;
    for (const marker of endMarkers) {
        const idx = lowerText.indexOf(marker, startIndex + 10);
        if (idx !== -1 && idx < endIndex) {
            endIndex = idx;
        }
    }

    return text.substring(startIndex, endIndex).trim();
}

module.exports = {
    extractTextFromImage,
    cleanExtractedText,
    extractIngredientSection,
};
