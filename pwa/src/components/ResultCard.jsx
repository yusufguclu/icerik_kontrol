import './ResultCard.css'

function WarningItem({ level, title, message, description }) {
    const icons = {
        danger: '🚨',
        warning: '⚠️',
        safe: '✅'
    }

    return (
        <div className={`warning-item warning-${level}`}>
            <div className="warning-header">
                <span className="warning-icon">{icons[level]}</span>
                <span className="warning-title">{title}</span>
            </div>
            <p className="warning-message">{message}</p>
            {description && <p className="warning-description">{description}</p>}
        </div>
    )
}

function ResultCard({ result, onRetry }) {
    if (!result) return null

    const { analysis, aiExplanation, extractedText, ocrConfidence } = result
    const { allergyWarnings, cautionItems, dietaryViolations, overallStatus, overallMessage } = analysis

    const statusConfig = {
        danger: { bg: 'header-danger', icon: '🚨', text: 'Dikkat: Risk Tespit Edildi!' },
        warning: { bg: 'header-warning', icon: '⚠️', text: 'Dikkatli Olun' },
        safe: { bg: 'header-safe', icon: '✅', text: 'Uygun Görünüyor' }
    }

    const status = statusConfig[overallStatus] || statusConfig.safe

    return (
        <div className="result-card animate-fadeIn">
            {/* Başlık */}
            <div className={`result-header ${status.bg}`}>
                <div className="header-content">
                    <span className="status-icon">{status.icon}</span>
                    <div>
                        <h2>{status.text}</h2>
                        <p>{overallMessage}</p>
                    </div>
                </div>
            </div>

            <div className="result-content">
                {/* AI Açıklaması */}
                {aiExplanation && (
                    <div className="section">
                        <div className="section-header">
                            <span>✨</span>
                            <h3>AI Değerlendirmesi</h3>
                        </div>
                        <div className="ai-card">
                            <p>{aiExplanation}</p>
                        </div>
                    </div>
                )}

                {/* Alerji Uyarıları */}
                {allergyWarnings?.length > 0 && (
                    <div className="section">
                        <div className="section-header">
                            <span>🚨</span>
                            <h3>Alerji Uyarıları</h3>
                            <span className="badge badge-danger">{allergyWarnings.length}</span>
                        </div>
                        {allergyWarnings.map((warning, i) => (
                            <WarningItem
                                key={i}
                                level="danger"
                                title={warning.allergen}
                                message={warning.message}
                                description={warning.description}
                            />
                        ))}
                    </div>
                )}

                {/* Dikkat Gerektiren İçerikler */}
                {cautionItems?.length > 0 && (
                    <div className="section">
                        <div className="section-header">
                            <span>⚠️</span>
                            <h3>Dikkat Edilmesi Gerekenler</h3>
                            <span className="badge badge-warning">{cautionItems.length}</span>
                        </div>
                        {cautionItems.map((item, i) => (
                            <WarningItem
                                key={i}
                                level="warning"
                                title={item.ingredient}
                                message={item.message}
                                description={item.description}
                            />
                        ))}
                    </div>
                )}

                {/* Diyet İhlalleri */}
                {dietaryViolations?.length > 0 && (
                    <div className="section">
                        <div className="section-header">
                            <span>🥗</span>
                            <h3>Diyet Uyumsuzlukları</h3>
                        </div>
                        {dietaryViolations.map((v, i) => (
                            <WarningItem
                                key={i}
                                level="warning"
                                title={v.preference}
                                message={v.message}
                            />
                        ))}
                    </div>
                )}

                {/* Çıkarılan Metin */}
                <div className="section">
                    <div className="section-header">
                        <span>📝</span>
                        <h3>Algılanan Metin</h3>
                    </div>
                    <div className="text-card">
                        <p>{extractedText}</p>
                        {ocrConfidence && (
                            <span className="confidence">Algılama güveni: %{Math.round(ocrConfidence)}</span>
                        )}
                    </div>
                </div>

                {/* Yeni Tarama Butonu */}
                <button className="btn btn-primary btn-full" onClick={onRetry}>
                    🔄 Yeni Bir Ürün Tara
                </button>
            </div>
        </div>
    )
}

export default ResultCard
