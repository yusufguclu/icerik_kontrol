// EtiketKontrol - API Service

// Backend URL - Aynı makinede çalışıyor
const API_BASE_URL = 'http://localhost:3000';

/**
 * Etiket fotoğrafını analiz eder
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
 * Tüm alerjenleri getirir
 */
export async function getAllergens() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze/allergens`);
        const data = await response.json();
        return data.allergens || [];
    } catch (error) {
        console.error('Alerjenler alınamadı:', error);
        return [];
    }
}

/**
 * API bağlantısını test eder
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
