import { Edit2, Trash2 } from 'lucide-react';

const ProductList = ({ products, onEdit, onDelete }) => {
    if (products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                <p>Nenhum produto cadastrado.</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            {products.map((product) => (
                <div key={product.id} className="card" style={styles.card}>
                    <div style={styles.info}>
                        <h3 style={styles.name}>{product.name}</h3>
                        <div style={styles.details}>
                            <span style={styles.quantity}>Qtd: {product.quantity}</span>
                            <span style={styles.price}>
                                {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    </div>
                    <div style={styles.actions}>
                        <button
                            className="btn btn-icon"
                            style={{ ...styles.actionBtn, backgroundColor: 'var(--surface-light)' }}
                            onClick={() => onEdit(product)}
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            className="btn btn-icon"
                            style={{ ...styles.actionBtn, backgroundColor: 'rgba(255, 107, 107, 0.2)', color: 'var(--secondary-color)' }}
                            onClick={() => {
                                if (window.confirm('Tem certeza que deseja excluir?')) onDelete(product.id);
                            }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const styles = {
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
    },
    info: {
        flex: 1,
    },
    name: {
        margin: '0 0 8px 0',
        fontSize: '1.1rem',
    },
    details: {
        display: 'flex',
        gap: '16px',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
    },
    quantity: {
        backgroundColor: 'var(--surface-light)',
        padding: '4px 8px',
        borderRadius: '6px',
    },
    price: {
        color: 'var(--success-color)',
        fontWeight: '600',
    },
    actions: {
        display: 'flex',
        gap: '8px',
    },
    actionBtn: {
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    }
};

export default ProductList;
