/**
 * EtiketKontrol - Backend Server
 * Gıda etiketi analiz API'si
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// AI servisini import et ve başlat
const { initializeAI } = require('./services/aiExplainer');

// Express uygulaması oluştur
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================

// CORS - Cross-Origin isteklere izin ver
app.use(cors({
    origin: '*', // Geliştirme için tüm origin'lere izin ver
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON body parser
app.use(express.json({
    limit: '15mb', // Base64 resimler için büyük limit
}));

// URL-encoded body parser
app.use(express.urlencoded({
    extended: true,
    limit: '15mb',
}));

// İstek loglama
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ==================== Routes ====================

// Ana sayfa
app.get('/', (req, res) => {
    res.json({
        name: 'EtiketKontrol API',
        version: '1.0.0',
        description: 'Gıda etiketi analiz servisi',
        endpoints: {
            analyze: {
                method: 'POST',
                path: '/api/analyze',
                description: 'Etiket fotoğrafını analiz eder',
            },
            analyzeText: {
                method: 'POST',
                path: '/api/analyze/text',
                description: 'Metin olarak verilen içeriği analiz eder',
            },
            allergens: {
                method: 'GET',
                path: '/api/analyze/allergens',
                description: 'Bilinen alerjenleri listeler',
            },
            preferences: {
                method: 'GET',
                path: '/api/analyze/preferences',
                description: 'Diyet tercihlerini listeler',
            },
        },
        status: 'running',
    });
});

// Sağlık kontrolü
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});

// Analyze routes
const analyzeRoutes = require('./routes/analyze');
app.use('/api/analyze', analyzeRoutes);

// ==================== Error Handling ====================

// 404 - Route bulunamadı
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint bulunamadı',
        path: req.path,
    });
});

// Genel hata yakalayıcı
app.use((err, req, res, next) => {
    console.error('❌ Sunucu hatası:', err);

    // Multer hataları
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            error: 'Dosya boyutu çok büyük. Maksimum 10MB.',
        });
    }

    res.status(500).json({
        success: false,
        error: 'Sunucu hatası',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// ==================== Server Başlat ====================

async function startServer() {
    console.log('\n🚀 EtiketKontrol Backend başlatılıyor...\n');

    // AI servisini başlat
    const aiReady = initializeAI();
    if (!aiReady) {
        console.log('ℹ️  AI açıklamaları için .env dosyasına GEMINI_API_KEY ekleyin.\n');
    }

    // Sunucuyu başlat
    app.listen(PORT, () => {
        console.log('═══════════════════════════════════════════════');
        console.log('  🍎 EtiketKontrol API Sunucusu');
        console.log('═══════════════════════════════════════════════');
        console.log(`  📡 Port: ${PORT}`);
        console.log(`  🌐 URL: http://localhost:${PORT}`);
        console.log(`  📋 API Docs: http://localhost:${PORT}/`);
        console.log(`  🏥 Health: http://localhost:${PORT}/health`);
        console.log('═══════════════════════════════════════════════\n');
    });
}

startServer();
