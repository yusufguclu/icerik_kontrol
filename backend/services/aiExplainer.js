/**
 * EtiketKontrol - AI Analiz Servisi
 * OpenRouter API ile DeepSeek R1 kullanarak akıllı içerik analizi
 */

const fetch = require('node-fetch');

// OpenRouter API endpoint
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-r1-0528:free';

let apiKey = null;

/**
 * AI servisini başlatır
 */
function initializeAI() {
  apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    console.warn('⚠️ OpenRouter API anahtarı bulunamadı. AI analizi devre dışı.');
    return false;
  }

  console.log('✅ OpenRouter AI (DeepSeek R1) başarıyla yapılandırıldı');
  return true;
}

/**
 * AI ile tam analiz yapar
 * @param {string} ingredientText - Etiket metni
 * @param {string[]} userAllergies - Kullanıcının alerjileri
 * @param {string[]} userPreferences - Diyet tercihleri
 * @returns {Promise<Object>} - Analiz sonucu
 */
async function analyzeWithAI(ingredientText, userAllergies = [], userPreferences = []) {
  if (!apiKey) {
    throw new Error('AI servisi başlatılmadı. OpenRouter API anahtarını kontrol edin.');
  }

  const prompt = buildAnalysisPrompt(ingredientText, userAllergies, userPreferences);

  try {
    console.log('🤖 DeepSeek R1 ile analiz başlatılıyor...');

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'EtiketKontrol',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API Hatası:', errorData);
      throw new Error(errorData.error?.message || `API Hatası: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('AI yanıtı boş döndü');
    }

    // JSON yanıtını parse et - daha sağlam parsing
    let jsonStr = '';

    // Önce ```json ... ``` bloğunu dene
    const jsonBlockMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      jsonStr = jsonBlockMatch[1];
    } else {
      // JSON objesini bul
      const jsonObjMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonObjMatch) {
        jsonStr = jsonObjMatch[0];
      }
    }

    if (!jsonStr) {
      console.error('AI yanıtı JSON formatında değil:', aiResponse.substring(0, 500));
      return createFallbackResponse(ingredientText);
    }

    // JSON'u temizle
    jsonStr = jsonStr
      .replace(/,\s*}/g, '}')  // Trailing comma fix
      .replace(/,\s*]/g, ']')  // Trailing comma in arrays
      .replace(/[\x00-\x1F\x7F]/g, ' ') // Control karakterleri temizle
      .trim();

    try {
      const analysisResult = JSON.parse(jsonStr);
      console.log('✅ DeepSeek R1 analizi tamamlandı');
      return analysisResult;
    } catch (parseError) {
      console.error('❌ JSON parse hatası:', parseError.message);
      console.error('JSON string:', jsonStr.substring(0, 500));
      return createFallbackResponse(ingredientText);
    }
  } catch (error) {
    console.error('❌ AI analiz hatası:', error.message);
    throw error;
  }
}

/**
 * Analiz için prompt oluşturur
 */
function buildAnalysisPrompt(ingredientText, userAllergies, userPreferences) {
  const allergiesStr = userAllergies.length > 0
    ? userAllergies.join(', ')
    : 'Belirtilmedi';

  const preferencesStr = userPreferences.length > 0
    ? userPreferences.join(', ')
    : 'Belirtilmedi';

  return `Sen bir gıda güvenliği ve beslenme uzmanısın. Aşağıdaki ürün etiketini analiz et.

## ÜRÜN ETİKETİ (OCR ile çıkarılmış metin):
${ingredientText}

## KULLANICININ ALERJİLERİ:
${allergiesStr}

## KULLANICININ DİYET TERCİHLERİ:
${preferencesStr}

## GÖREV:
1. Etiketteki içerikleri analiz et
2. Kullanıcının alerjenlerine göre risk değerlendirmesi yap
3. Dikkat edilmesi gereken içerikleri belirle
4. Diyet tercihlerine uygunluğu kontrol et
5. Genel bir değerlendirme yap

## YANITINI SADECE AŞAĞIDAKİ JSON FORMATINDA VER (başka hiçbir şey yazma, açıklama yapma):

\`\`\`json
{
  "overallStatus": "danger | warning | safe",
  "overallMessage": "Kısa özet mesaj (1 cümle)",
  "allergyWarnings": [
    {
      "allergen": "Tespit edilen alerjen adı",
      "ingredient": "Etikette geçen ifade",
      "message": "Uyarı mesajı",
      "severity": "high | medium | low"
    }
  ],
  "cautionItems": [
    {
      "ingredient": "Dikkat edilmesi gereken içerik",
      "reason": "Neden dikkat edilmeli",
      "message": "Açıklama"
    }
  ],
  "dietaryViolations": [
    {
      "preference": "İhlal edilen tercih",
      "ingredient": "Sorunlu içerik",
      "message": "Açıklama"
    }
  ],
  "aiExplanation": "2-3 cümlelik kullanıcı dostu değerlendirme. Sade ve anlaşılır bir dil kullan.",
  "detectedIngredients": ["tespit", "edilen", "başlıca", "içerikler"]
}
\`\`\`

ÖNEMLİ KURALLAR:
- overallStatus: Alerji varsa "danger", dikkat edilecek varsa "warning", sorun yoksa "safe"
- Türkçe yaz
- Tıbbi teşhis koyma, sadece bilgilendir
- allergyWarnings, cautionItems, dietaryViolations boş array olabilir
- Sadece JSON döndür, başka açıklama yapma`;
}

/**
 * Fallback yanıt oluşturur
 */
function createFallbackResponse(ingredientText) {
  return {
    overallStatus: 'warning',
    overallMessage: 'Analiz tamamlandı ancak sonuçlar manuel kontrol gerektirebilir.',
    allergyWarnings: [],
    cautionItems: [],
    dietaryViolations: [],
    aiExplanation: 'Etiket metni analiz edildi. Net bir değerlendirme için lütfen içerikleri manuel olarak kontrol edin.',
    detectedIngredients: ingredientText.split(/[,;]/).slice(0, 10).map(s => s.trim()).filter(s => s.length > 2)
  };
}

/**
 * AI servisinin hazır olup olmadığını kontrol eder
 */
function isAIReady() {
  return apiKey !== null && apiKey !== 'your_openrouter_api_key_here';
}

module.exports = {
  initializeAI,
  analyzeWithAI,
  isAIReady,
};
