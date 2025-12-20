/**
 * EtiketKontrol - OpenFoodFacts API Servisi
 * Barkod ile ürün bilgisi çekme
 */

const fetch = require('node-fetch');

// OpenFoodFacts API endpoint
const OPENFOODFACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

/**
 * Barkod ile ürün bilgisi çeker
 * @param {string} barcode - Ürün barkodu
 * @returns {Promise<Object>} - Ürün bilgileri
 */
async function getProductByBarcode(barcode) {
    try {
        console.log(`🔍 OpenFoodFacts'tan ürün aranıyor: ${barcode}`);

        const response = await fetch(`${OPENFOODFACTS_API}/${barcode}.json`, {
            headers: {
                'User-Agent': 'EtiketKontrol/1.0 (https://github.com/etiketkontrol)',
            },
        });

        if (!response.ok) {
            throw new Error(`API Hatası: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 0) {
            return {
                found: false,
                message: 'Ürün veritabanında bulunamadı',
                barcode: barcode,
            };
        }

        const product = data.product;

        // Ürün bilgilerini düzenle
        const result = {
            found: true,
            barcode: barcode,
            name: product.product_name || product.product_name_tr || 'Bilinmeyen Ürün',
            brand: product.brands || '',
            ingredients: product.ingredients_text || product.ingredients_text_tr || '',
            allergens: extractAllergens(product),
            nutritionGrade: product.nutrition_grades || null,
            novaGroup: product.nova_group || null,
            imageUrl: product.image_url || product.image_front_url || null,
            categories: product.categories || '',
            labels: product.labels || '',
            quantity: product.quantity || '',
        };

        console.log(`✅ Ürün bulundu: ${result.name}`);
        return result;
    } catch (error) {
        console.error('❌ OpenFoodFacts API Hatası:', error.message);
        throw error;
    }
}

/**
 * Ürün verilerinden alerjen bilgilerini çıkarır
 */
function extractAllergens(product) {
    const allergens = [];

    // allergens_tags dizisinden
    if (product.allergens_tags && Array.isArray(product.allergens_tags)) {
        product.allergens_tags.forEach(tag => {
            const allergen = tag.replace('en:', '').replace('tr:', '');
            allergens.push(translateAllergen(allergen));
        });
    }

    // allergens_from_ingredients dizisinden
    if (product.allergens_from_ingredients) {
        const fromIngredients = product.allergens_from_ingredients.split(',').map(a => a.trim());
        fromIngredients.forEach(a => {
            if (a && !allergens.includes(a)) {
                allergens.push(a);
            }
        });
    }

    return [...new Set(allergens)]; // Tekrarları kaldır
}

/**
 * İngilizce alerjen isimlerini Türkçeye çevirir
 */
function translateAllergen(allergen) {
    const translations = {
        'milk': 'Süt',
        'gluten': 'Gluten',
        'eggs': 'Yumurta',
        'nuts': 'Kuruyemiş',
        'peanuts': 'Yer Fıstığı',
        'soybeans': 'Soya',
        'fish': 'Balık',
        'crustaceans': 'Kabuklu Deniz Ürünleri',
        'molluscs': 'Yumuşakçalar',
        'celery': 'Kereviz',
        'mustard': 'Hardal',
        'sesame-seeds': 'Susam',
        'sulphur-dioxide-and-sulphites': 'Sülfit',
        'lupin': 'Acı Bakla',
        'wheat': 'Buğday',
    };

    return translations[allergen.toLowerCase()] || allergen;
}

module.exports = {
    getProductByBarcode,
};
