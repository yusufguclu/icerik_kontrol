import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import TabBar from './components/TabBar'
import ImageUploader from './components/ImageUploader'
import ResultCard from './components/ResultCard'
import BarcodeScanner from './components/BarcodeScanner'
import ProfilePage from './pages/ProfilePage'
import { analyzeLabel, analyzeBarcode } from './services/api'

function App() {
    const [activeTab, setActiveTab] = useState('home')
    const [selectedAllergies, setSelectedAllergies] = useState([])
    const [selectedPreferences, setSelectedPreferences] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('')

    // localStorage'dan tercihleri yükle
    useEffect(() => {
        const savedAllergies = localStorage.getItem('userAllergies')
        const savedPreferences = localStorage.getItem('userPreferences')

        if (savedAllergies) {
            try {
                setSelectedAllergies(JSON.parse(savedAllergies))
            } catch (e) { }
        }
        if (savedPreferences) {
            try {
                setSelectedPreferences(JSON.parse(savedPreferences))
            } catch (e) { }
        }
    }, [])

    // Fotoğraf seçildiğinde analiz başlat
    const handleImageSelected = async (imageData) => {
        setSelectedImage(imageData)
        setError(null)
        setIsLoading(true)
        setLoadingMessage('Etiket analiz ediliyor...')
        setAnalysisResult(null)

        try {
            const result = await analyzeLabel(
                imageData.base64,
                selectedAllergies,
                selectedPreferences
            )
            setAnalysisResult(result)
        } catch (err) {
            setError(err.message || 'Analiz sırasında bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    // Barkod algılandığında
    const handleBarcodeDetected = async (barcode) => {
        setShowBarcodeScanner(false)
        setError(null)
        setIsLoading(true)
        setLoadingMessage(`Ürün aranıyor: ${barcode}`)
        setAnalysisResult(null)

        try {
            const result = await analyzeBarcode(
                barcode,
                selectedAllergies,
                selectedPreferences
            )
            setAnalysisResult(result)
        } catch (err) {
            setError(err.message || 'Barkod sorgusu sırasında bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    // Yeni tarama
    const handleRetry = () => {
        setAnalysisResult(null)
        setSelectedImage(null)
        setError(null)
    }

    return (
        <div className="app">
            <Header />

            {/* Ana Sayfa */}
            {activeTab === 'home' && (
                <main className="container main-content">
                    {/* Hoşgeldin Kartı */}
                    {!analysisResult && !isLoading && (
                        <div className="card welcome-card animate-fadeIn">
                            <h2>Merhaba! 👋</h2>
                            <p>
                                Paketli gıdaların barkodunu veya etiketini tara, içindekilerini analiz et.
                            </p>
                        </div>
                    )}

                    {/* Seçili hassasiyetler özeti */}
                    {!analysisResult && !isLoading && (selectedAllergies.length > 0 || selectedPreferences.length > 0) && (
                        <div className="active-filters">
                            <span className="filter-label">Aktif Filtreler:</span>
                            <div className="filter-tags">
                                {selectedAllergies.map(a => (
                                    <span key={a} className="tag tag-danger">{a}</span>
                                ))}
                                {selectedPreferences.map(p => (
                                    <span key={p} className="tag tag-primary">{p}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fotoğraf & Barkod Seçenekleri */}
                    {!analysisResult && !isLoading && (
                        <ImageUploader
                            onImageSelected={handleImageSelected}
                            onBarcodeClick={() => setShowBarcodeScanner(true)}
                        />
                    )}

                    {/* Barkod Tarayıcı Modal */}
                    {showBarcodeScanner && (
                        <BarcodeScanner
                            onBarcodeDetected={handleBarcodeDetected}
                            onClose={() => setShowBarcodeScanner(false)}
                        />
                    )}

                    {/* Yükleniyor */}
                    {isLoading && (
                        <div className="loading-container animate-fadeIn">
                            <div className="spinner"></div>
                            <p className="loading-text">{loadingMessage}</p>
                            <p className="loading-subtext">Bu işlem birkaç saniye sürebilir</p>
                            {selectedImage && (
                                <img src={selectedImage.preview} alt="Seçilen" className="preview-image" />
                            )}
                        </div>
                    )}

                    {/* Hata */}
                    {error && (
                        <div className="error-card animate-fadeIn">
                            <span className="error-icon">❌</span>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={handleRetry}>
                                Tekrar Dene
                            </button>
                        </div>
                    )}

                    {/* Sonuç */}
                    {analysisResult && (
                        <ResultCard
                            result={analysisResult}
                            onRetry={handleRetry}
                        />
                    )}

                    {/* Bilgi Kartı */}
                    {!analysisResult && !isLoading && (
                        <div className="info-card">
                            <span className="info-icon">ℹ️</span>
                            <p>
                                Barkod tarama ile ürün bilgilerini otomatik çekin veya etiket fotoğrafı ile analiz yapın.
                            </p>
                        </div>
                    )}
                </main>
            )}

            {/* Profil Sayfası */}
            {activeTab === 'profile' && (
                <ProfilePage
                    selectedAllergies={selectedAllergies}
                    selectedPreferences={selectedPreferences}
                    onAllergiesChange={setSelectedAllergies}
                    onPreferencesChange={setSelectedPreferences}
                />
            )}

            {/* Alt Tab Bar */}
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    )
}

export default App
