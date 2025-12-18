import { Check, DollarSign, X } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const ValueModal = ({ isOpen, onClose, onSuccess, title }) => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        const amount = parseFloat(value.replace(',', '.'));
        if (!isNaN(amount) && amount > 0) {
            onSuccess(amount);
            handleClose();
        }
    };

    const handleClose = () => {
        setValue('');
        onClose();
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.modal}>
                        <View style={styles.header}>
                            <View style={styles.titleContainer}>
                                <DollarSign size={20} color={Colors.success} />
                                <Text style={styles.title}>{title || 'Inserir Valor'}</Text>
                            </View>
                            <TouchableOpacity onPress={handleClose}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.text}>Digite o valor para esta operação.</Text>

                        <TextInput
                            style={styles.input}
                            value={value}
                            onChangeText={setValue}
                            keyboardType="decimal-pad"
                            placeholder="0,00"
                            placeholderTextColor={Colors.textSecondary}
                            autoFocus
                            textAlign="center"
                        />

                        <TouchableOpacity
                            style={[styles.confirmBtn, (!value || parseFloat(value.replace(',', '.')) <= 0) && styles.disabledBtn]}
                            onPress={handleSubmit}
                            disabled={!value || parseFloat(value.replace(',', '.')) <= 0}
                        >
                            <Check size={20} color={Colors.white} style={{ marginRight: 8 }} />
                            <Text style={styles.confirmBtnText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    modal: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    text: {
        color: Colors.textSecondary,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: Colors.background,
        color: Colors.textPrimary,
        fontSize: 32,
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    confirmBtn: {
        backgroundColor: Colors.success,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
    },
    disabledBtn: {
        opacity: 0.5,
    },
    confirmBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ValueModal;
