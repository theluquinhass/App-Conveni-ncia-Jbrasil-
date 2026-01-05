import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/Colors';
import { useInventory } from '../src/context/InventoryContext';

export default function POSScreen() {
    const { products, registerBatchSales } = useInventory();
    const [selectedCategory, setSelectedCategory] = useState('agua');

    // Cart State
    const [cart, setCart] = useState({}); // { productId: quantity }
    const [isCartOpen, setIsCartOpen] = useState(false);

    const displayProducts = useMemo(() =>
        products.filter(p => p.category === selectedCategory),
        [products, selectedCategory]);

    const getCartQuantity = (productId) => cart[productId] || 0;

    const addToCart = (product) => {
        const currentQty = getCartQuantity(product.id);
        const stock = Number(product.quantity);

        if (currentQty < stock) {
            setCart(prev => ({ ...prev, [product.id]: currentQty + 1 }));
        } else {
            Alert.alert('Limite de Estoque', 'Quantidade máxima em estoque atingida.');
        }
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const currentQty = prev[productId];
            if (!currentQty) return prev;
            if (currentQty === 1) {
                const newCart = { ...prev };
                delete newCart[productId];
                return newCart;
            }
            return { ...prev, [productId]: currentQty - 1 };
        });
    };

    const clearCart = () => setCart({});

    const cartItems = Object.keys(cart).map(id => {
        const product = products.find(p => p.id === id);
        return { ...product, cartQty: cart[id] };
    }).filter(p => p.id); // Filter out safe check

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.cartQty), 0);

    const handleCheckout = () => {
        Alert.alert(
            'Confirmar Venda',
            `Finalizar venda de ${totalItems} itens? Total: ${totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        registerBatchSales(cartItems);
                        setCart({});
                        setIsCartOpen(false);
                        Alert.alert('Sucesso', 'Venda realizada!');
                    }
                }
            ]
        );
    };

    const renderProductItem = useCallback(({ item }) => {
        const qtyInCart = getCartQuantity(item.id);
        return (
            <TouchableOpacity
                style={[styles.productCard, qtyInCart > 0 && styles.activeCard]}
                onPress={() => addToCart(item)}
            >
                <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>{item.quantity}</Text>
                </View>
                {qtyInCart > 0 && (
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{qtyInCart}</Text>
                    </View>
                )}
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                    {(Number(item.price) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
            </TouchableOpacity>
        );
    }, [cart, getCartQuantity, addToCart]); // Dependencies for renderItem

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <View style={styles.content}>
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
                <FlatList
                    data={displayProducts}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 12 }}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={renderProductItem}
                    extraData={cart} // Ensure list updates when cart changes
                />
            </View>

            {/* Bottom Cart Bar */}
            {totalItems > 0 && (
                <View style={styles.cartBar}>
                    <TouchableOpacity style={styles.cartInfo} onPress={() => setIsCartOpen(true)}>
                        <View style={styles.cartIconBadge}>
                            <ShoppingCart size={24} color="white" />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{totalItems}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.cartTotalText}>Total: {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
                            <Text style={styles.cartSubText}>Toque para editar</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                        <Text style={styles.checkoutText}>Finalizar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Cart Modal */}
            <Modal
                visible={isCartOpen}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Carrinho ({totalItems})</Text>
                        <TouchableOpacity onPress={() => setIsCartOpen(false)}>
                            <X size={24} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={cartItems}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ padding: 20 }}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cartItemName}>{item.name}</Text>
                                    <Text style={styles.cartItemPrice}>
                                        {(Number(item.price) * item.cartQty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Text>
                                </View>

                                <View style={styles.qtyControls}>
                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() => removeFromCart(item.id)}
                                    >
                                        {item.cartQty === 1 ? <Trash2 size={16} color={Colors.danger} /> : <Minus size={16} color={Colors.textPrimary} />}
                                    </TouchableOpacity>
                                    <Text style={styles.qtyText}>{item.cartQty}</Text>
                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() => addToCart(item)}
                                    >
                                        <Plus size={16} color={Colors.green} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.clearCartBtn} onPress={() => { clearCart(); setIsCartOpen(false); }}>
                            <Text style={styles.clearCartText}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.checkoutBtn, { flex: 1 }]} onPress={handleCheckout}>
                            <Text style={styles.checkoutText}>
                                Pagar {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
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
        flex: 1,
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
    productCard: {
        backgroundColor: Colors.surface,
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeCard: {
        borderColor: Colors.success,
        backgroundColor: Colors.surfaceLight,
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
        fontSize: 10,
        color: Colors.textSecondary,
    },
    cartBadge: {
        position: 'absolute',
        top: -8,
        left: -8,
        backgroundColor: Colors.success,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    cartBadgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
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
    cartBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.surface,
        padding: 16,
        paddingBottom: 30, // Safe area
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    cartInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cartIconBadge: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: Colors.danger,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cartTotalText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartSubText: {
        color: Colors.textSecondary,
        fontSize: 12,
    },
    checkoutBtn: {
        backgroundColor: Colors.success,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    checkoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    cartItemPrice: {
        color: Colors.success,
        fontWeight: 'bold',
    },
    qtyControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.background,
        padding: 6,
        borderRadius: 8,
    },
    qtyBtn: {
        padding: 4,
    },
    qtyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        minWidth: 20,
        textAlign: 'center',
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        flexDirection: 'row',
        gap: 10,
    },
    clearCartBtn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.danger,
    },
    clearCartText: {
        color: Colors.danger,
        fontWeight: 'bold',
    }
});
