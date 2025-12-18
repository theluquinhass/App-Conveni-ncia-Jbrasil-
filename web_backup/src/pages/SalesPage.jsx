
import { useState } from 'react';
import Layout from '../components/Layout';
import PasswordModal from '../components/PasswordModal';
import { useInventory } from '../context/InventoryContext';
import { ShoppingCart, DollarSign, History, Trash2 } from 'lucide-react';

const SalesPage = () => {
    const { products, sales, registerSale, resetSales } = useInventory();
    const [selectedCategory, setSelectedCategory] = useState('agua');

    // Security
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // Filter visible products
    const displayProducts = products.filter(p => p.category === selectedCategory);

    // Stats
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);

    const todaySales = sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString());
    const todayWater = todaySales.filter(s => s.category === 'agua').reduce((acc, s) => acc + s.total, 0);
    const todayIce = todaySales.filter(s => s.category === 'sorvete').reduce((acc, s) => acc + s.total, 0);

    const handleSell = (product) => {
        const qty = prompt(`Vender quantos "${product.name}" ? `, "1");
        if (qty) {
            const quantity = parseInt(qty);
            if (quantity > 0 && quantity <= product.quantity) {
                registerSale(product, quantity);
            } else if (quantity > product.quantity) {
                alert('Estoque insuficiente!');
            }
        }
    };

    const handleResetClick = () => {
        if (sales.length === 0) return;
        setPendingAction('reset');
        setIsPasswordOpen(true);
    };

    const handleAuthSuccess = () => {
        if (pendingAction === 'reset') {
            if (window.confirm('Tem certeza que deseja zerar o caixa e apagar o histórico de vendas?')) {
                resetSales();
            }
        }
        setPendingAction(null);
        setIsPasswordOpen(false);
    };

    return (
        <Layout>
            <div style={{ paddingBottom: '80px' }}>

                {/* Cashier Dashboard */}
                <div className="card" style={styles.dashboard}>
                    <div style={styles.statItem}>
                        <span style={{ ...styles.statLabel, color: 'var(--primary-color)' }}>Água</span>
                        <span style={styles.statValue}>
                            {todayWater.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                    <div style={styles.verticalDivider}></div>
                    <div style={styles.statItem}>
                        <span style={{ ...styles.statLabel, color: 'var(--secondary-color)' }}>Sorvete</span>
                        <span style={styles.statValue}>
                            {todayIce.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <button
                        className="btn btn-danger"
                        style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                        onClick={handleResetClick}
                        disabled={sales.length === 0}
                    >
                        <Trash2 size={16} style={{ marginRight: '6px' }} />
                        Fechar Caixa
                    </button>
                </div>
                <h2 style={{ margin: '20px 0 10px' }}>Nova Venda</h2>

                {/* Category Toggle */}
                <div style={styles.toggleContainer}>
                    <button
                        style={{
                            ...styles.toggleBtn,
                            backgroundColor: selectedCategory === 'agua' ? 'var(--primary-color)' : 'transparent',
                            borderColor: selectedCategory === 'agua' ? 'var(--primary-color)' : 'var(--surface-light)',
                        }}
                        onClick={() => setSelectedCategory('agua')}
                    >
                        Água
                    </button>
                    <button
                        style={{
                            ...styles.toggleBtn,
                            backgroundColor: selectedCategory === 'sorvete' ? 'var(--secondary-color)' : 'transparent',
                            borderColor: selectedCategory === 'sorvete' ? 'var(--secondary-color)' : 'var(--surface-light)',
                        }}
                        onClick={() => setSelectedCategory('sorvete')}
                    >
                        Sorvete
                    </button>
                </div>

                {/* Product Grid */}
                <div style={styles.grid}>
                    {displayProducts.map(product => (
                        <div
                            key={product.id}
                            className="card"
                            style={styles.productCard}
                            onClick={() => handleSell(product)}
                        >
                            <div style={styles.stockBadge}>{product.quantity}</div>
                            <h4 style={styles.productName}>{product.name}</h4>
                            <span style={styles.productPrice}>
                                {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Recent Sales Mini-List */}
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <History size={18} /> Últimas Vendas
                    </h3>
                    <div style={styles.historyList}>
                        {sales.slice(0, 5).map(sale => (
                            <div key={sale.id} style={styles.historyItem}>
                                <span>{sale.quantity}x {sale.productName}</span>
                                <span style={{ color: 'var(--success-color)' }}>
                                    +{sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <PasswordModal
                    isOpen={isPasswordOpen}
                    onClose={() => {
                        setIsPasswordOpen(false);
                        setPendingAction(null);
                    }}
                    onSuccess={handleAuthSuccess}
                />

            </div>
        </Layout>
    );
};

const styles = {
    dashboard: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--surface-light), var(--surface-dark))',
        border: '1px solid var(--primary-color)',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        color: 'var(--text-secondary)',
        marginBottom: '4px',
    },
    statValue: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'var(--success-color)',
    },
    verticalDivider: {
        width: '1px',
        height: '40px',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    toggleContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '16px',
    },
    toggleBtn: {
        flex: 1,
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid',
        color: 'white',
        background: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', // Responsive grid
        gap: '12px',
    },
    productCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '16px',
        cursor: 'pointer',
        position: 'relative',
        border: '1px solid transparent',
        transition: 'border-color 0.2s',
    },
    stockBadge: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        fontSize: '0.75rem',
        backgroundColor: 'var(--surface-light)',
        padding: '2px 6px',
        borderRadius: '4px',
        color: 'var(--text-secondary)',
    },
    productName: {
        margin: '12px 0 8px',
        fontSize: '1rem',
    },
    productPrice: {
        color: 'var(--success-color)',
        fontWeight: 'bold',
    },
    historyList: {
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    historyItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px',
        backgroundColor: 'var(--surface-dark)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)',
        fontSize: '0.9rem',
    }
};

export default SalesPage;
