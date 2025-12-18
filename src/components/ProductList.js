import { Edit2, Trash2 } from 'lucide-react-native';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const ProductList = ({ products, onEdit, onDelete }) => {
    if (products.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
            </View>
        );
    }

    return (
        <View style={styles.list}>
            {products.map((product) => (
                <View key={product.id} style={styles.card}>
                    <View style={styles.info}>
                        <Text style={styles.name}>{product.name}</Text>
                        <View style={styles.details}>
                            <View style={styles.quantityBadge}>
                                <Text style={styles.quantityText}>Qtd: {product.quantity}</Text>
                            </View>
                            <Text style={styles.price}>
                                {(Number(product.price) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: Colors.surfaceLight }]}
                            onPress={() => onEdit(product)}
                        >
                            <Edit2 size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: '#4c0b0b' }]} // Darker red background
                            onPress={() => {
                                Alert.alert(
                                    'Excluir Produto',
                                    'Tem certeza que deseja excluir?',
                                    [
                                        { text: 'Cancelar', style: 'cancel' },
                                        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(product.id) }
                                    ]
                                );
                            }}
                        >
                            <Trash2 size={18} color={Colors.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: Colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantityBadge: {
        backgroundColor: Colors.surfaceLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    quantityText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.success,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProductList;
