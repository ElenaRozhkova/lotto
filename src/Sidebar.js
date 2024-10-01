export const Sidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'tab1', label: 'Вкладка 1' },
        { id: 'tab2', label: 'Вкладка 2' },
        { id: 'tab3', label: 'Вкладка 3' },
    ];

    return (
        <nav className="sidebar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};