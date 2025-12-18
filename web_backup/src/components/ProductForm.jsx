import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const ProductForm = ({ product, category, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        category: category || 'agua'
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            quantity: Number(formData.quantity),
            price: Number(formData.price)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in" style={styles.form}>
            <div style={styles.header}>
                <h3>{product ? 'Editar Produto' : 'Novo Produto'}</h3>
                <button type="button" onClick={onCancel} style={styles.closeBtn}>
                    <X size={24} />
                </button>
            </div>

            <div className="form-group">
                <label className="form-label">Nome do Produto</label>
                <input
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Água 500ml"
                />
            </div>

            <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Quantidade</label>
                    <input
                        required
                        type="number"
                        className="form-input"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="0"
                    />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Preço (R$)</label>
                    <input
                        required
                        type="number"
                        step="0.01"
                        className="form-input"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
                <Save size={20} style={{ marginRight: '8px' }} />
                Salvar Produto
            </button>
        </form>
    );
};

const styles = {
    form: {
        backgroundColor: 'var(--surface-dark)',
        padding: '20px',
        borderRadius: 'var(--border-radius)',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
    },
    row: {
        display: 'flex',
        gap: '16px',
    }
};

export default ProductForm;
