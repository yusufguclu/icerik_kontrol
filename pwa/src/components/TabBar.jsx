import './TabBar.css'

function TabBar({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'home', label: 'Ana Sayfa', icon: '🏠' },
        { id: 'profile', label: 'Profilim', icon: '👤' },
    ]

    return (
        <nav className="tab-bar">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                </button>
            ))}
        </nav>
    )
}

export default TabBar
