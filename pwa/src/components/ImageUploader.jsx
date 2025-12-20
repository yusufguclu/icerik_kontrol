import { useRef } from 'react'
import './ImageUploader.css'

function ImageUploader({ onImageSelected, onBarcodeClick }) {
    const fileInputRef = useRef(null)
    const cameraInputRef = useRef(null)

    // Dosya seçildiğinde
    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]
            onImageSelected({
                base64: base64,
                preview: reader.result,
                name: file.name
            })
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="image-uploader animate-fadeIn">
            <h2>Ürünü Tara</h2>
            <p>Barkod okut veya etiket fotoğrafı çek</p>

            <div className="buttons-container">
                {/* Barkod Butonu */}
                <button
                    className="upload-btn barcode-btn"
                    onClick={onBarcodeClick}
                >
                    <div className="btn-icon">📊</div>
                    <span>Barkod Tara</span>
                </button>

                {/* Fotoğraf Butonu */}
                <button
                    className="upload-btn camera-btn"
                    onClick={() => cameraInputRef.current?.click()}
                >
                    <div className="btn-icon">📸</div>
                    <span>Etiket Çek</span>
                </button>
            </div>

            {/* Galeriden Seç - Küçük link olarak */}
            <button
                className="gallery-link"
                onClick={() => fileInputRef.current?.click()}
            >
                🖼️ Galeriden fotoğraf seç
            </button>

            {/* Gizli input'lar */}
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
            />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    )
}

export default ImageUploader
