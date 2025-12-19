/**
 * EtiketKontrol - Analyze Route
 * POST /api/analyze endpoint
 * AI tabanlı tam analiz
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');

// Servisleri import et
const { extractTextFromImage, cleanExtractedText, extractIngredientSection } = require('../services/ocr');
const { analyzeWithAI, isAIReady } = require('../services/aiExplainer');

// Multer konfigürasyonu - memory storage kullan
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Max 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları kabul edilir.'), false);
        }
    },
});

/**
 * POST /api/analyze
 * Etiket fotoğrafını analiz eder
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        let imageData;
        let allergies = [];
        let preferences = [];

        // Request tipine göre veri al
        if (req.file) {
            imageData = req.file.buffer;
            allergies = req.body.allergies ? JSON.parse(req.body.allergies) : [];
            preferences = req.body.preferences ? JSON.parse(req.body.preferences) : [];
        } else if (req.body.image) {
            imageData = req.body.image;
            allergies = req.body.allergies || [];
            preferences = req.body.preferences || [];
        } else {
            return res.status(400).json({
                success: false,
                error: 'Resim verisi bulunamadı. Lütfen bir resim yükleyin.',
            });
        }

        console.log('📸 Analiz başlatılıyor...');
        console.log(`   Alerjiler: ${allergies.join(', ') || 'Belirtilmedi'}`);
        console.log(`   Tercihler: ${preferences.join(', ') || 'Belirtilmedi'}`);

        // 1. OCR ile metin çıkar
        const ocrResult = await extractTextFromImage(imageData);
        const rawText = ocrResult.text;

        if (!rawText || rawText.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Görüntüden yeterli metin çıkarılamadı. Lütfen daha net bir fotoğraf çekin.',
                ocrConfidence: ocrResult.confidence,
            });
        }

        // 2. Metni temizle
        const cleanedText = cleanExtractedText(rawText);
        const ingredientText = extractIngredientSection(cleanedText);

        console.log('📝 Çıkarılan metin:', ingredientText.substring(0, 200) + '...');

        // 3. AI kontrolü
        if (!isAIReady()) {
            return res.status(500).json({
                success: false,
                error: 'AI servisi hazır değil. Gemini API anahtarını kontrol edin.',
            });
        }

        // 4. AI ile tam analiz yap
        const analysisResult = await analyzeWithAI(ingredientText, allergies, preferences);

        // 5. Sonucu döndür
        const response = {
            success: true,
            extractedText: ingredientText,
            ocrConfidence: ocrResult.confidence,
            analysis: {
                allergyWarnings: analysisResult.allergyWarnings || [],
                cautionItems: analysisResult.cautionItems || [],
                dietaryViolations: analysisResult.dietaryViolations || [],
                overallStatus: analysisResult.overallStatus || 'safe',
                overallMessage: analysisResult.overallMessage || 'Analiz tamamlandı',
                detectedIngredients: analysisResult.detectedIngredients || [],
            },
            aiExplanation: analysisResult.aiExplanation || '',
            timestamp: new Date().toISOString(),
        };

        console.log('✅ Analiz tamamlandı:', analysisResult.overallStatus);

        res.json(response);
    } catch (error) {
        console.error('❌ Analiz hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Analiz sırasında bir hata oluştu.',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
});

/**
 * POST /api/analyze/text
 * Sadece metin analizi yapar (OCR atlanır)
 */
router.post('/text', async (req, res) => {
    try {
        const { text, allergies = [], preferences = [] } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Analiz edilecek metin bulunamadı.',
            });
        }

        console.log('📝 Metin analizi başlatılıyor...');

        if (!isAIReady()) {
            return res.status(500).json({
                success: false,
                error: 'AI servisi hazır değil. Gemini API anahtarını kontrol edin.',
            });
        }

        const cleanedText = cleanExtractedText(text);
        const analysisResult = await analyzeWithAI(cleanedText, allergies, preferences);

        res.json({
            success: true,
            extractedText: cleanedText,
            analysis: {
                allergyWarnings: analysisResult.allergyWarnings || [],
                cautionItems: analysisResult.cautionItems || [],
                dietaryViolations: analysisResult.dietaryViolations || [],
                overallStatus: analysisResult.overallStatus || 'safe',
                overallMessage: analysisResult.overallMessage || 'Analiz tamamlandı',
            },
            aiExplanation: analysisResult.aiExplanation || '',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ Metin analiz hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Metin analizi sırasında bir hata oluştu.',
        });
    }
});

/**
 * GET /api/analyze/allergens
 * Örnek alerjen listesi
 */
router.get('/allergens', (req, res) => {
    const allergens = [
        { id: 'gluten', name: 'Gluten', description: 'Buğday, arpa, çavdar' },
        { id: 'süt', name: 'Süt Ürünleri', description: 'Laktoz, kazein' },
        { id: 'yumurta', name: 'Yumurta', description: 'Yumurta akı ve sarısı' },
        { id: 'fındık', name: 'Fındık/Kuruyemiş', description: 'Fındık, ceviz, badem' },
        { id: 'soya', name: 'Soya', description: 'Soya proteini, lesitini' },
        { id: 'balık', name: 'Balık', description: 'Deniz balıkları' },
        { id: 'kabuklu', name: 'Deniz Ürünleri', description: 'Karides, midye' },
        { id: 'susam', name: 'Susam', description: 'Susam, tahin' },
    ];
    res.json({ success: true, allergens });
});

/**
 * GET /api/analyze/preferences
 * Diyet tercihleri listesi
 */
router.get('/preferences', (req, res) => {
    const preferences = [
        { id: 'vegan', name: 'Vegan', description: 'Hayvansal ürün yok' },
        { id: 'vejetaryen', name: 'Vejetaryen', description: 'Et yok' },
        { id: 'helal', name: 'Helal', description: 'İslami beslenme' },
        { id: 'koşer', name: 'Koşer', description: 'Yahudi beslenme' },
    ];
    res.json({ success: true, preferences });
});

module.exports = router;
