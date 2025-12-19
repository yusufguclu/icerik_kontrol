/**
 * EtiketKontrol - API Servisi
 * Backend ile iletişim
 */

// Backend URL'i - Geliştirme için localhost
// Gerçek cihazda test için bilgisayarınızın IP adresini kullanın
const API_BASE_URL = 'http://192.168.1.100:3000'; // Kendi IP adresinizle değiştirin

// Alternatif: Emulator için
// Android: 'http://10.0.2.2:3000'
// iOS Simulator: 'http://localhost:3000'

/**
 * Etiket fotoğrafını analiz eder
 * @param {string} imageBase64 - Base64 encoded resim
 * @param {string[]} allergies - Kullanıcının alerjileri
 * @param {string[]} preferences - Diyet tercihleri
 * @returns {Promise<Object>}
 */
export async function analyzeLabel(imageBase64, allergies = [], preferences = []) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageBase64,
                allergies: allergies,
                preferences: preferences,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Analiz başarısız oldu');
        }

        return data;
    } catch (error) {
        console.error('API Hatası:', error);
        throw error;
    }
}

/**
 * Metin olarak içerik analizi yapar
 * @param {string} text - İçindekiler metni
 * @param {string[]} allergies - Kullanıcının alerjileri
 * @param {string[]} preferences - Diyet tercihleri
 * @returns {Promise<Object>}
 */
export async function analyzeText(text, allergies = [], preferences = []) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze/text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                allergies: allergies,
                preferences: preferences,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Analiz başarısız oldu');
        }

        return data;
    } catch (error) {
        console.error('API Hatası:', error);
        throw error;
    }
}

/**
 * Tüm alerjenleri getirir
 * @returns {Promise<Object[]>}
 */
export async function getAllergens() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze/allergens`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Alerjenler alınamadı');
        }

        return data.allergens;
    } catch (error) {
        console.error('API Hatası:', error);
        throw error;
    }
}

/**
 * Tüm diyet tercihlerini getirir
 * @returns {Promise<Object[]>}
 */
export async function getPreferences() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze/preferences`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Tercihler alınamadı');
        }

        return data.preferences;
    } catch (error) {
        console.error('API Hatası:', error);
        throw error;
    }
}

/**
 * API bağlantısını test eder
 * @returns {Promise<boolean>}
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            timeout: 5000,
        });

        return response.ok;
    } catch (error) {
        console.error('Bağlantı hatası:', error);
        return false;
    }
}

export default {
    analyzeLabel,
    analyzeText,
    getAllergens,
    getPreferences,
    checkHealth,
    API_BASE_URL,
};
