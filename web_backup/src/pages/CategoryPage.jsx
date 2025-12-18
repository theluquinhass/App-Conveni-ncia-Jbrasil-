import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import PasswordModal from '../components/PasswordModal';
import { useInventory } from '../context/InventoryContext';
import { Plus } from 'lucide-react';

const CategoryPage = () => {
    const location = useLocation();
    const { getProductsByCategory, addProduct, updateProduct, deleteProduct } = useInventory();

    // Determine category from path
    const isWater = location.pathname.includes('agua');
    const category = isWater ? 'agua' : 'sorvete';
    const displayTitle = isWater ? 'Água' : 'Sorvete';
    const displayColor = isWater ? 'var(--primary-color)' : 'var(--secondary-color)';

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Security State
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // { type: 'add'|'edit'|'delete', payload: any }

    const products = getProductsByCategory(category);

    // Auth Helper
    const requireAuth = (actionType, payload = null) => {
        setPendingAction({ type: actionType, payload });
        setIsPasswordOpen(true);
    };

    const handleAuthSuccess = () => {
        if (!pendingAction) return;

        const { type, payload } = pendingAction;

        if (type === 'add') {
            setEditingProduct(null);
            setShowForm(true);
        } else if (type === 'edit') {
            setEditingProduct(payload);
            setShowForm(true);
        } else if (type === 'delete') {
            if (window.confirm('Tem certeza que deseja excluir?')) {
                deleteProduct(payload);
            }
        }
        setPendingAction(null);
        setIsPasswordOpen(false);
    };

    const handleSave = (productData) => {
        // Save doesn't need password again if we already passed it to open the form
        // BUT user might want protection on SAVE? usually open form is enough.
        // Let's stick to protecting the ENTRY to the form.
        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleEditClick = (product) => {
        requireAuth('edit', product);
    };

    const handleDeleteClick = (id) => {
        requireAuth('delete', id);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    return (
        <Layout>
            <div style={{ paddingBottom: '80px' }}>
                <div style={styles.header}>
                    <h2 style={{ margin: 0 }}>Estoque de {displayTitle}</h2>
                    {!showForm && (
                        <button
                            className="btn btn-primary"
                            style={{ padding: '8px 16px', fontSize: '0.9rem', backgroundColor: displayColor }}
                            onClick={() => requireAuth('add')}
                        >
                            <Plus size={18} style={{ marginRight: '4px' }} /> Novo
                        </button>
                    )}
                </div>

                {showForm ? (
                    <ProductForm
                        category={category}
                        product={editingProduct}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                ) : (
                    <ProductList
                        products={products}
                        onEdit={handleEditClick}
                        onDelete={(id) => handleDeleteClick(id)}
                    />
                )}

                <PasswordModal
                    isOpen={isPasswordOpen}
                    onClose={() => {
                        setIsPasswordOpen(false);
                        setPendingAction(null); // Clear pending action if modal is closed without success
                    }}
                    onSuccess={handleAuthSuccess}
                />
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
        marginTop: '10px',
    }
};

export default CategoryPage;
