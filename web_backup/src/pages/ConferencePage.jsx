import { useState } from 'react';
import Layout from '../components/Layout';
import { useInventory } from '../context/InventoryContext';
import { ArrowUp, ArrowDown, Settings, Check, RotateCcw } from 'lucide-react';

const ConferencePage = () => {
    const { products, moveProduct } = useInventory();
    const [isOrganizing, setIsOrganizing] = useState(false);
    const [activeTab, setActiveTab] = useState('agua');
    const [checkedItems, setCheckedItems] = useState({});

    const displayProducts = products.filter(p => p.category === activeTab);
    const hasCheckedItems = Object.keys(checkedItems).some(k => checkedItems[k]);

    const handleMove = (id, direction) => {
        moveProduct(id, direction);
    };

    const toggleCheck = (id) => {
        if (isOrganizing) return;
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleClearChecks = () => {
        if (window.confirm('Limpar toda a conferência?')) {
            setCheckedItems({});
        }
    };

    const ProductRow = ({ product, index }) => {
        const isChecked = !!checkedItems[product.id];

        return (
            <div
                className="card"
                style={{
                    ...styles.card,
                    borderLeft: isChecked ? '4px solid var(--success-color)' : '4px solid transparent',
                    backgroundColor: isChecked ? 'rgba(34, 197, 94, 0.1)' : 'var(--surface-dark)',
                    opacity: isChecked ? 0.7 : 1
                }}
                onClick={() => toggleCheck(product.id)}
            >
                {isChecked && !isOrganizing && (
                    <div style={{ marginRight: '12px' }}>
                        <Check size={20} color="var(--success-color)" />
                    </div>
                )}

                <div style={styles.info}>
                    <h3 style={{ ...styles.name, textDecoration: isChecked && !isOrganizing ? 'line-through' : 'none', color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                        {product.name}
                    </h3>
                </div>

                {isOrganizing ? (
                    <div style={styles.actions} onClick={(e) => e.stopPropagation()}>
                        <button
                            style={styles.moveBtn}
                            onClick={() => handleMove(product.id, 'up')}
                            disabled={index === 0}
                        >
                            <ArrowUp size={20} />
                        </button>
                        <button
                            style={styles.moveBtn}
                            onClick={() => handleMove(product.id, 'down')}
                            disabled={index === displayProducts.length - 1}
                        >
                            <ArrowDown size={20} />
                        </button>
                    </div>
                ) : (
                    <div style={styles.quantityContainer}>
                        <span style={styles.quantityLabel}>Qtd:</span>
                        <span style={styles.quantityValue}>{product.quantity}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Layout>
            <div style={{ paddingBottom: '80px' }}>
                <div style={styles.header}>
                    <h2 style={{ margin: 0 }}>Conferência</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {hasCheckedItems && (
                            <button
                                className="btn"
                                style={{
                                    ...styles.iconBtn,
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red tint
                                    color: 'var(--error-color)',
                                    borderColor: 'rgba(239, 68, 68, 0.2)'
                                }}
                                onClick={handleClearChecks}
                                title="Limpar conferência"
                            >
                                <RotateCcw size={18} />
                            </button>
                        )}
                        <button
                            className="btn"
                            style={{
                                ...styles.iconBtn,
                                backgroundColor: isOrganizing ? 'var(--accent-color)' : 'transparent',
                                color: isOrganizing ? 'black' : 'var(--text-secondary)',
                            }}
                            onClick={() => setIsOrganizing(!isOrganizing)}
                            title={isOrganizing ? "Salvar Ordem" : "Organizar"}
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        style={{
                            ...styles.tab,
                            borderBottom: activeTab === 'agua' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: activeTab === 'agua' ? 'var(--primary-color)' : 'var(--text-secondary)',
                        }}
                        onClick={() => setActiveTab('agua')}
                    >
                        Água
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            borderBottom: activeTab === 'sorvete' ? '2px solid var(--secondary-color)' : '2px solid transparent',
                            color: activeTab === 'sorvete' ? 'var(--secondary-color)' : 'var(--text-secondary)',
                        }}
                        onClick={() => setActiveTab('sorvete')}
                    >
                        Sorvete
                    </button>
                </div>

                {products.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px' }}>Nenhum produto cadastrado.</p>
                ) : (
                    <div style={styles.list}>
                        {displayProducts.map((product, idx) => (
                            <ProductRow key={product.id} product={product} index={idx} />
                        ))}
                        {displayProducts.length === 0 && (
                            <p style={styles.empty}>
                                Nenhuma {activeTab === 'agua' ? 'água' : 'sorvete'} cadastrada.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderLeft: '4px solid transparent',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: '1.1rem',
        margin: 0,
    },
    quantityContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        backgroundColor: 'var(--surface-light)',
        padding: '8px 12px',
        borderRadius: '8px',
        minWidth: '60px',
        textAlign: 'center',
    },
    quantityLabel: {
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
    },
    quantityValue: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        marginBottom: '10px',
        borderBottom: '1px solid var(--surface-light)',
        paddingBottom: '5px',
    },
    empty: {
        color: 'var(--text-secondary)',
        fontStyle: 'italic',
        fontSize: '0.9rem',
    },
    actions: {
        display: 'flex',
        gap: '8px',
    },
    moveBtn: {
        background: 'var(--surface-light)',
        border: 'none',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    iconBtn: {
        padding: '8px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--surface-light)'
    },
    tabs: {
        display: 'flex',
        marginBottom: '20px',
        borderBottom: '1px solid var(--surface-light)',
    },
    tab: {
        flex: 1,
        padding: '12px',
        background: 'none',
        border: 'none',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontWeight: 'bold',
    }
};

export default ConferencePage;

