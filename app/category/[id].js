import { useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductForm from '../../src/components/ProductForm';
import ProductList from '../../src/components/ProductList';
import { Colors } from '../../src/constants/Colors';
import { useInventory } from '../../src/context/InventoryContext';

export default function CategoryPage() {
    const { id } = useLocalSearchParams();
    const { getProductsByCategory, addProduct, updateProduct, deleteProduct } = useInventory();

    const isWater = id === 'agua';
    const category = isWater ? 'agua' : 'sorvete';
    const displayTitle = isWater ? 'Água' : 'Sorvete';
    const displayColor = isWater ? Colors.primary : Colors.secondary;

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const products = getProductsByCategory(category);

    const handleSave = (productData) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteClick = (productId) => {
        deleteProduct(productId);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Estoque de {displayTitle}</Text>
                    {!showForm && (
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: displayColor }]}
                            onPress={() => {
                                setEditingProduct(null);
                                setShowForm(true);
                            }}
                        >
                            <Plus size={18} color="white" style={{ marginRight: 4 }} />
                            <Text style={styles.addButtonText}>Novo</Text>
                        </TouchableOpacity>
                    )}
                </View>

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
                        onDelete={handleDeleteClick}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
