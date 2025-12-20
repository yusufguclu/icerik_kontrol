/**
 * EtiketKontrol - Barkod Route
 * GET /api/barcode/:barcode endpoint
 */

const express = require('express');
const router = express.Router();

const { getProductByBarcode } = require('../services/openfoodfacts');
const { analyzeWithAI, isAIReady } = require('../services/aiExplainer');

/**
 * GET /api/barcode/:barcode
 * Barkod ile ürün bilgisi ve analiz
 */
router.get('/:barcode', async (req, res) => {
    try {
        const { barcode } = req.params;
        const allergies = req.query.allergies ? req.query.allergies.split(',') : [];
        const preferences = req.query.preferences ? req.query.preferences.split(',') : [];

        if (!barcode || !/^\d{8,14}$/.test(barcode)) {
            return res.status(400).json({
                success: false,
                error: 'Geçersiz barkod formatı. 8-14 haneli sayı olmalı.',
            });
        }

        console.log(`📦 Barkod sorgusu: ${barcode}`);

        // 1. OpenFoodFacts'tan ürün bilgisi al
        const productInfo = await getProductByBarcode(barcode);

        if (!productInfo.found) {
            return res.status(404).json({
                success: false,
                error: 'Ürün veritabanında bulunamadı. icindekiler fotoğrafı ile taramayı deneyin.',
                barcode: barcode,
            });
        }

        // 2. AI analizi yap
        let aiAnalysis = null;
        if (isAIReady() && productInfo.ingredients) {
            try {
                aiAnalysis = await analyzeWithAI(productInfo.ingredients, allergies, preferences);
            } catch (error) {
                console.warn('AI analizi yapılamadı:', error.message);
            }
        }

        // 3. Sonucu döndür
        const response = {
            success: true,
            source: 'openfoodfacts',
            product: {
                name: productInfo.name,
                brand: productInfo.brand,
                barcode: productInfo.barcode,
                imageUrl: productInfo.imageUrl,
                quantity: productInfo.quantity,
                nutritionGrade: productInfo.nutritionGrade,
                novaGroup: productInfo.novaGroup,
            },
            extractedText: productInfo.ingredients,
            knownAllergens: productInfo.allergens,
            analysis: aiAnalysis ? {
                allergyWarnings: aiAnalysis.allergyWarnings || [],
                cautionItems: aiAnalysis.cautionItems || [],
                dietaryViolations: aiAnalysis.dietaryViolations || [],
                overallStatus: aiAnalysis.overallStatus || 'safe',
                overallMessage: aiAnalysis.overallMessage || 'Analiz tamamlandı',
            } : {
                allergyWarnings: [],
                cautionItems: [],
                dietaryViolations: [],
                overallStatus: productInfo.allergens.length > 0 ? 'warning' : 'safe',
                overallMessage: productInfo.allergens.length > 0
                    ? `Bu üründe ${productInfo.allergens.join(', ')} bulunuyor.`
                    : 'Bilinen alerjen tespit edilmedi.',
            },
            aiExplanation: aiAnalysis?.aiExplanation || '',
            timestamp: new Date().toISOString(),
        };

        res.json(response);
    } catch (error) {
        console.error('❌ Barkod sorgu hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Barkod sorgusu sırasında bir hata oluştu.',
        });
    }
});

module.exports = router;
