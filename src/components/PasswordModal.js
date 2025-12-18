import { Check, Lock, X } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useInventory } from '../context/InventoryContext';

const PasswordModal = ({ isOpen, onClose, onSuccess }) => {
    const { password: correctPassword } = useInventory();
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = () => {
        if (password === correctPassword) {
            onSuccess();
            handleClose();
        } else {
            setError(true);
            setPassword('');
        }
    };

    const handleClose = () => {
        setPassword('');
        setError(false);
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
                                <Lock size={20} color={Colors.primary} />
                                <Text style={styles.title}>Senha Necessária</Text>
                            </View>
                            <TouchableOpacity onPress={handleClose}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.text}>Esta ação requer autorização.</Text>

                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            value={password}
                            onChangeText={(text) => {
                                setError(false);
                                setPassword(text);
                            }}
                            secureTextEntry
                            keyboardType="numeric"
                            placeholder="••••"
                            placeholderTextColor={Colors.textSecondary}
                            maxLength={6}
                            autoFocus
                            textAlign="center"
                        />
                        {error && <Text style={styles.errorText}>Senha incorreta</Text>}

                        <TouchableOpacity style={styles.confirmBtn} onPress={handleSubmit}>
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
        letterSpacing: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: Colors.danger,
    },
    errorText: {
        color: Colors.danger,
        textAlign: 'center',
        marginBottom: 8,
    },
    confirmBtn: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    confirmBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PasswordModal;
