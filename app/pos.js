import { DollarSign, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/Colors';
import { useInventory } from '../src/context/InventoryContext';

export default function POSScreen() {
    const { products, registerSale } = useInventory();
    const [selectedCategory, setSelectedCategory] = useState('agua');

    // Sell Modal State
    const [sellModalVisible, setSellModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sellQuantity, setSellQuantity] = useState('');

    const displayProducts = products.filter(p => p.category === selectedCategory);

    const handleSellClick = (product) => {
        setSelectedProduct(product);
        setSellQuantity('');
        setSellModalVisible(true);
    };

    const confirmSell = () => {
        const quantity = parseInt(sellQuantity);
        if (quantity > 0 && quantity <= Number(selectedProduct.quantity)) {
            registerSale(selectedProduct, quantity);
            setSellModalVisible(false);
            setSelectedProduct(null);
            Alert.alert('Sucesso', 'Venda realizada com sucesso!');
        } else if (quantity > Number(selectedProduct.quantity)) {
            Alert.alert('Erro', 'Estoque insuficiente!');
        } else {
            Alert.alert('Erro', 'Quantidade inválida');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionTitle}>Selecionar Produto</Text>

                {/* Category Toggle */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleBtn,
                            selectedCategory === 'agua' && { backgroundColor: Colors.primary, borderColor: Colors.primary }
                        ]}
                        onPress={() => setSelectedCategory('agua')}
                    >
                        <Text style={[styles.toggleText, selectedCategory === 'agua' && { color: 'white' }]}>Água</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleBtn,
                            selectedCategory === 'sorvete' && { backgroundColor: Colors.secondary, borderColor: Colors.secondary }
                        ]}
                        onPress={() => setSelectedCategory('sorvete')}
                    >
                        <Text style={[styles.toggleText, selectedCategory === 'sorvete' && { color: 'white' }]}>Sorvete</Text>
                    </TouchableOpacity>
                </View>

                {/* Product Grid */}
                <View style={styles.grid}>
                    {displayProducts.map(product => (
                        <TouchableOpacity
                            key={product.id}
                            style={styles.productCard}
                            onPress={() => handleSellClick(product)}
                        >
                            <View style={styles.stockBadge}>
                                <Text style={styles.stockText}>{product.quantity}</Text>
                            </View>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>
                                {(Number(product.price) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Sell Modal */}
            <Modal
                visible={sellModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSellModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Vender {selectedProduct?.name}</Text>
                            <TouchableOpacity onPress={() => setSellModalVisible(false)}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalLabel}>Quantidade:</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={sellQuantity}
                            onChangeText={setSellQuantity}
                            keyboardType="numeric"
                            autoFocus
                            selectTextOnFocus
                        />

                        <TouchableOpacity style={styles.confirmSellBtn} onPress={confirmSell}>
                            <DollarSign size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.confirmSellText}>Confirmar Venda</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    toggleContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    toggleBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
        alignItems: 'center',
    },
    toggleText: {
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 30,
    },
    productCard: {
        backgroundColor: Colors.surface,
        width: '48%', // Approx 2 columns
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        position: 'relative',
    },
    stockBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Colors.surfaceLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    stockText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textPrimary,
        marginVertical: 10,
        textAlign: 'center',
    },
    productPrice: {
        color: Colors.success,
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    modalLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.textPrimary,
        backgroundColor: Colors.background,
    },
    confirmSellBtn: {
        backgroundColor: Colors.success,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
    },
    confirmSellText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
