/**
 * EtiketKontrol - Alerji Kontrol Servisi
 * Kural tabanlı alerji ve hassasiyet eşleştirme
 */

const fs = require('fs');
const path = require('path');

// Alerjen veritabanını yükle
const allergensPath = path.join(__dirname, '../data/allergens.json');
const allergensData = JSON.parse(fs.readFileSync(allergensPath, 'utf-8'));

/**
 * Metni normalleştirir (küçük harf, Türkçe karakter düzeltme)
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/i̇/g, 'i') // Türkçe İ -> i
        .replace(/ı/g, 'i')
        .trim();
}

/**
 * Anahtar kelimenin metinde geçip geçmediğini kontrol eder
 * @param {string} text - Aranacak metin
 * @param {string} keyword - Aranacak kelime
 * @returns {boolean}
 */
function containsKeyword(text, keyword) {
    const normalizedText = normalizeText(text);
    const normalizedKeyword = normalizeText(keyword);

    // Kelime sınırlarını kontrol et
    const regex = new RegExp(`\\b${escapeRegex(normalizedKeyword)}\\b`, 'gi');
    return regex.test(normalizedText);
}

/**
 * Regex özel karakterlerini escape eder
 * @param {string} string
 * @returns {string}
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Etiket metnini analiz eder ve alerji uyarılarını döndürür
 * @param {string} text - Etiket metni
 * @param {string[]} userAllergies - Kullanıcının alerjileri
 * @param {string[]} userPreferences - Kullanıcının diyet tercihleri
 * @returns {Object} Analiz sonucu
 */
function analyzeIngredients(text, userAllergies = [], userPreferences = []) {
    const results = {
        allergyWarnings: [],      // Tehlikeli - Kırmızı
        cautionItems: [],         // Dikkat - Sarı
        safeIngredients: [],      // Güvenli - Yeşil
        dietaryViolations: [],    // Diyet ihlalleri
        detectedIngredients: [],  // Tespit edilen tüm içerikler
    };

    const normalizedText = normalizeText(text);

    // 1. Kullanıcının alerjilerini kontrol et
    for (const allergyKey of userAllergies) {
        const allergen = allergensData.allergens[allergyKey.toLowerCase()];
        if (!allergen) continue;

        for (const keyword of allergen.keywords) {
            if (containsKeyword(text, keyword)) {
                // Daha önce eklenmemişse ekle
                const exists = results.allergyWarnings.some(
                    (w) => w.allergen === allergen.name
                );
                if (!exists) {
                    results.allergyWarnings.push({
                        level: 'danger',
                        allergen: allergen.name,
                        ingredient: keyword,
                        message: `Bu ürün ${allergen.name.toLowerCase()} içeriyor!`,
                        description: allergen.description,
                    });
                }
                break;
            }
        }
    }

    // 2. Dikkat gerektiren içerikleri kontrol et
    for (const [key, caution] of Object.entries(allergensData.cautionIngredients)) {
        for (const keyword of caution.keywords) {
            if (containsKeyword(text, keyword)) {
                const exists = results.cautionItems.some(
                    (c) => c.ingredient === caution.name
                );
                if (!exists) {
                    results.cautionItems.push({
                        level: 'warning',
                        ingredient: caution.name,
                        detectedKeyword: keyword,
                        message: `Dikkat: ${caution.name} tespit edildi`,
                        description: caution.description,
                    });
                }
                break;
            }
        }
    }

    // 3. Diyet tercihlerini kontrol et
    for (const prefKey of userPreferences) {
        const preference = allergensData.dietaryPreferences[prefKey.toLowerCase()];
        if (!preference) continue;

        for (const keyword of preference.avoidKeywords) {
            if (containsKeyword(text, keyword)) {
                const exists = results.dietaryViolations.some(
                    (v) => v.preference === preference.name && v.ingredient === keyword
                );
                if (!exists) {
                    results.dietaryViolations.push({
                        level: 'warning',
                        preference: preference.name,
                        ingredient: keyword,
                        message: `${preference.name} diyeti için uygun olmayabilir: ${keyword} içeriyor`,
                    });
                }
            }
        }
    }

    // 4. Genel durum değerlendirmesi
    if (results.allergyWarnings.length > 0) {
        results.overallStatus = 'danger';
        results.overallMessage = '🚨 Alerji riski tespit edildi!';
    } else if (results.cautionItems.length > 0 || results.dietaryViolations.length > 0) {
        results.overallStatus = 'warning';
        results.overallMessage = '⚠️ Dikkat edilmesi gereken içerikler var';
    } else {
        results.overallStatus = 'safe';
        results.overallMessage = '✅ Belirlenen hassasiyetler için uygun görünüyor';
    }

    return results;
}

/**
 * Tüm bilinen alerjenleri listeler
 * @returns {Object[]}
 */
function getAllAllergens() {
    return Object.entries(allergensData.allergens).map(([key, value]) => ({
        id: key,
        name: value.name,
        description: value.description,
    }));
}

/**
 * Tüm diyet tercihlerini listeler
 * @returns {Object[]}
 */
function getAllDietaryPreferences() {
    return Object.entries(allergensData.dietaryPreferences).map(([key, value]) => ({
        id: key,
        name: value.name,
        description: value.description,
    }));
}

module.exports = {
    analyzeIngredients,
    getAllAllergens,
    getAllDietaryPreferences,
};
