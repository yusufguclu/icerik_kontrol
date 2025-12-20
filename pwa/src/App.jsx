import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import AllergySelector from './components/AllergySelector'
import ImageUploader from './components/ImageUploader'
import ResultCard from './components/ResultCard'
import BarcodeScanner from './components/BarcodeScanner'
import { analyzeLabel, analyzeBarcode } from './services/api'

function App() {
    const [selectedAllergies, setSelectedAllergies] = useState([])
    const [selectedPreferences, setSelectedPreferences] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('')

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

            <main className="container">
                {/* Hoşgeldin Kartı */}
                {!analysisResult && !isLoading && (
                    <div className="card welcome-card animate-fadeIn">
                        <h2>Merhaba! 👋</h2>
                        <p>
                            Paketli gıdaların etiketini veya barkodunu tara, içindekilerini analiz et ve
                            senin için uygun olup olmadığını öğren.
                        </p>
                    </div>
                )}

                {/* Alerji Seçici */}
                {!analysisResult && !isLoading && (
                    <AllergySelector
                        selectedAllergies={selectedAllergies}
                        selectedPreferences={selectedPreferences}
                        onAllergiesChange={setSelectedAllergies}
                        onPreferencesChange={setSelectedPreferences}
                    />
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

                {/* Seçili hassasiyetler özeti */}
                {!analysisResult && !isLoading && (selectedAllergies.length > 0 || selectedPreferences.length > 0) && (
                    <div className="selection-summary">
                        <p className="summary-title">Kontrol Edilecek:</p>
                        <div className="summary-tags">
                            {selectedAllergies.map(a => (
                                <span key={a} className="tag tag-danger">{a}</span>
                            ))}
                            {selectedPreferences.map(p => (
                                <span key={p} className="tag tag-primary">{p}</span>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
