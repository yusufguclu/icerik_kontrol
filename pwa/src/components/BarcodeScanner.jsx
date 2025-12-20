import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import './BarcodeScanner.css'

function BarcodeScanner({ onBarcodeDetected, onClose }) {
    const [error, setError] = useState(null)
    const [isScanning, setIsScanning] = useState(false)
    const scannerRef = useRef(null)
    const html5QrCodeRef = useRef(null)

    useEffect(() => {
        startScanner()
        return () => stopScanner()
    }, [])

    const startScanner = async () => {
        try {
            setError(null)
            setIsScanning(true)

            html5QrCodeRef.current = new Html5Qrcode('barcode-reader')

            await html5QrCodeRef.current.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 150 },
                    aspectRatio: 1.5,
                },
                (decodedText) => {
                    // Barkod algılandı
                    console.log('Barkod algılandı:', decodedText)
                    stopScanner()
                    onBarcodeDetected(decodedText)
                },
                (errorMessage) => {
                    // Tarama devam ediyor, hata gösterme
                }
            )
        } catch (err) {
            console.error('Kamera hatası:', err)
            setIsScanning(false)
            setError('Kamera erişimi sağlanamadı. Lütfen izin verin.')
        }
    }

    const stopScanner = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop()
                await html5QrCodeRef.current.clear()
            } catch (err) {
                console.warn('Scanner durdurma hatası:', err)
            }
        }
        setIsScanning(false)
    }

    const handleClose = () => {
        stopScanner()
        onClose()
    }

    return (
        <div className="barcode-scanner-overlay">
            <div className="barcode-scanner-container">
                <div className="scanner-header">
                    <h3>📷 Barkod Tara</h3>
                    <button className="close-btn" onClick={handleClose}>✕</button>
                </div>

                <div className="scanner-content">
                    <div id="barcode-reader" ref={scannerRef}></div>

                    {error && (
                        <div className="scanner-error">
                            <p>{error}</p>
                            <button className="retry-btn" onClick={startScanner}>
                                Tekrar Dene
                            </button>
                        </div>
                    )}

                    {isScanning && (
                        <div className="scanner-guide">
                            <p>Barkodu çerçeve içine hizalayın</p>
                        </div>
                    )}
                </div>

                <div className="scanner-footer">
                    <button className="cancel-btn" onClick={handleClose}>
                        İptal
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BarcodeScanner
