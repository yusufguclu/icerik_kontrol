import { useState, useEffect } from 'react'
import './ProfilePage.css'
import AllergySelector from '../components/AllergySelector'

function ProfilePage({
    selectedAllergies,
    selectedPreferences,
    onAllergiesChange,
    onPreferencesChange
}) {
    const [saved, setSaved] = useState(false)

    // Değişiklik olduğunda kaydet
    useEffect(() => {
        localStorage.setItem('userAllergies', JSON.stringify(selectedAllergies))
        localStorage.setItem('userPreferences', JSON.stringify(selectedPreferences))
    }, [selectedAllergies, selectedPreferences])

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="avatar">
                    <span>👤</span>
                </div>
                <h2>Profilim</h2>
                <p>Kişisel tercihlerinizi buradan yönetin</p>
            </div>

            <div className="profile-content">
                {/* Alerji ve Diyet Seçici */}
                <AllergySelector
                    selectedAllergies={selectedAllergies}
                    selectedPreferences={selectedPreferences}
                    onAllergiesChange={onAllergiesChange}
                    onPreferencesChange={onPreferencesChange}
                />

                {/* Seçim Özeti */}
                {(selectedAllergies.length > 0 || selectedPreferences.length > 0) && (
                    <div className="selection-summary-card">
                        <h3>📋 Seçimleriniz</h3>

                        {selectedAllergies.length > 0 && (
                            <div className="summary-section">
                                <span className="summary-label">Alerjenler:</span>
                                <div className="summary-tags">
                                    {selectedAllergies.map(a => (
                                        <span key={a} className="tag tag-danger">{a}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedPreferences.length > 0 && (
                            <div className="summary-section">
                                <span className="summary-label">Diyet:</span>
                                <div className="summary-tags">
                                    {selectedPreferences.map(p => (
                                        <span key={p} className="tag tag-primary">{p}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="summary-note">
                            Bu tercihler ürün taramalarında otomatik olarak kullanılacak.
                        </p>
                    </div>
                )}

                {/* Kaydet Butonu */}
                <button
                    className={`save-btn ${saved ? 'saved' : ''}`}
                    onClick={handleSave}
                >
                    {saved ? '✓ Kaydedildi!' : '💾 Tercihleri Kaydet'}
                </button>

                {/* Bilgi Kartı */}
                <div className="info-card">
                    <span className="info-icon">💡</span>
                    <div>
                        <strong>İpucu:</strong>
                        <p>Seçtiğiniz alerjenler ve diyet tercihleri, her ürün taramasında otomatik olarak kontrol edilecektir.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
