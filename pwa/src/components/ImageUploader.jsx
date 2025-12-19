import { useRef } from 'react'
import './ImageUploader.css'

function ImageUploader({ onImageSelected }) {
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
            <h2>Ürün Etiketini Tara</h2>
            <p>İçindekiler bölümünün fotoğrafını çekin veya galeriden seçin</p>

            <div className="buttons-container">
                {/* Kamera Butonu */}
                <button
                    className="upload-btn camera-btn"
                    onClick={() => cameraInputRef.current?.click()}
                >
                    <div className="btn-icon">📸</div>
                    <span>Fotoğraf Çek</span>
                </button>

                {/* Galeri Butonu */}
                <button
                    className="upload-btn gallery-btn"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="btn-icon gallery-icon">🖼️</div>
                    <span>Galeriden Seç</span>
                </button>
            </div>

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
