import { Save, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const ProductForm = ({ product, category, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        category: category || 'agua'
    });

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                quantity: String(product.quantity),
                price: String(product.price),
            });
        }
    }, [product]);

    const handleSubmit = () => {
        onSave({
            ...formData,
            quantity: Number(formData.quantity),
            price: Number(formData.price.replace(',', '.'))
        });
    };

    return (
        <View style={styles.form}>
            <View style={styles.header}>
                <Text style={styles.title}>{product ? 'Editar Produto' : 'Novo Produto'}</Text>
                <TouchableOpacity onPress={onCancel}>
                    <X size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Nome do Produto</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Ex: Água 500ml"
                    placeholderTextColor={Colors.textSecondary}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Quantidade</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.quantity}
                        onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                        placeholder="0"
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType="numeric"
                    />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Preço (R$)</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.price}
                        onChangeText={(text) => setFormData({ ...formData, price: text })}
                        placeholder="0,00"
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType="decimal-pad"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Save size={20} color={Colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Salvar Produto</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        backgroundColor: Colors.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    row: {
        flexDirection: 'row',
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    saveBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductForm;
