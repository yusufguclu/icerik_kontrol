import './AllergySelector.css'

// Alerjen listesi
const ALLERGENS = [
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'süt', name: 'Süt Ürünleri', icon: '🥛' },
    { id: 'yumurta', name: 'Yumurta', icon: '🥚' },
    { id: 'fındık', name: 'Fındık/Kuruyemiş', icon: '🥜' },
    { id: 'soya', name: 'Soya', icon: '🫘' },
    { id: 'balık', name: 'Balık', icon: '🐟' },
    { id: 'kabuklu deniz ürünleri', name: 'Deniz Ürünleri', icon: '🦐' },
    { id: 'susam', name: 'Susam', icon: '🌰' },
]

// Diyet tercihleri
const PREFERENCES = [
    { id: 'vegan', name: 'Vegan', icon: '🌱' },
    { id: 'vejetaryen', name: 'Vejetaryen', icon: '🥗' },
    { id: 'helal', name: 'Helal', icon: '☪️' },
    { id: 'koşer', name: 'Koşer', icon: '✡️' },
]

function Chip({ item, isSelected, onClick }) {
    return (
        <button
            className={`chip ${isSelected ? 'chip-selected' : ''}`}
            onClick={() => onClick(item.id)}
        >
            <span className="chip-icon">{item.icon}</span>
            <span className="chip-text">{item.name}</span>
            {isSelected && <span className="chip-check">✓</span>}
        </button>
    )
}

function AllergySelector({
    selectedAllergies,
    selectedPreferences,
    onAllergiesChange,
    onPreferencesChange
}) {
    const toggleAllergy = (id) => {
        const newSelection = selectedAllergies.includes(id)
            ? selectedAllergies.filter(a => a !== id)
            : [...selectedAllergies, id]
        onAllergiesChange(newSelection)
    }

    const togglePreference = (id) => {
        const newSelection = selectedPreferences.includes(id)
            ? selectedPreferences.filter(p => p !== id)
            : [...selectedPreferences, id]
        onPreferencesChange(newSelection)
    }

    return (
        <div className="allergy-selector animate-fadeIn">
            {/* Alerjenler */}
            <div className="section">
                <div className="section-header">
                    <span className="section-icon">⚠️</span>
                    <h3>Alerjenler</h3>
                </div>
                <p className="section-subtitle">Size alerji yapan içerikleri seçin</p>
                <div className="chips-container">
                    {ALLERGENS.map(item => (
                        <Chip
                            key={item.id}
                            item={item}
                            isSelected={selectedAllergies.includes(item.id)}
                            onClick={toggleAllergy}
                        />
                    ))}
                </div>
            </div>

            {/* Diyet Tercihleri */}
            <div className="section">
                <div className="section-header">
                    <span className="section-icon">🌿</span>
                    <h3>Diyet Tercihleri</h3>
                </div>
                <p className="section-subtitle">Beslenme tercihlerinizi belirtin</p>
                <div className="chips-container">
                    {PREFERENCES.map(item => (
                        <Chip
                            key={item.id}
                            item={item}
                            isSelected={selectedPreferences.includes(item.id)}
                            onClick={togglePreference}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AllergySelector
