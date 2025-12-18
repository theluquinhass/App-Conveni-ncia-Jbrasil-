import { useRouter } from 'expo-router';
import { Lock, Save } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/Colors';
import { useInventory } from '../src/context/InventoryContext';

export default function SettingsScreen() {
    const { password: currentPassword, updatePassword } = useInventory();
    const router = useRouter();

    const [formData, setFormData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleSave = async () => {
        if (formData.current !== currentPassword) {
            Alert.alert('Erro', 'Senha atual incorreta.');
            return;
        }

        if (formData.new.length < 4) {
            Alert.alert('Erro', 'A nova senha deve ter pelo menos 4 dígitos.');
            return;
        }

        if (formData.new !== formData.confirm) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        const success = await updatePassword(formData.new);
        if (success) {
            Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Erro', 'Falha ao salvar a nova senha.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Alterar Senha</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Senha Atual</Text>
                    <View style={styles.inputContainer}>
                        <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.current}
                            onChangeText={(text) => setFormData({ ...formData, current: text })}
                            keyboardType="numeric"
                            secureTextEntry
                            placeholder="Digite a senha atual"
                            placeholderTextColor={Colors.textSecondary}
                            maxLength={6}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nova Senha</Text>
                    <View style={styles.inputContainer}>
                        <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.new}
                            onChangeText={(text) => setFormData({ ...formData, new: text })}
                            keyboardType="numeric"
                            secureTextEntry
                            placeholder="Digite a nova senha"
                            placeholderTextColor={Colors.textSecondary}
                            maxLength={6}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Confirmar Nova Senha</Text>
                    <View style={styles.inputContainer}>
                        <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.confirm}
                            onChangeText={(text) => setFormData({ ...formData, confirm: text })}
                            keyboardType="numeric"
                            secureTextEntry
                            placeholder="Confirme a nova senha"
                            placeholderTextColor={Colors.textSecondary}
                            maxLength={6}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Save size={20} color={Colors.white} style={{ marginRight: 8 }} />
                    <Text style={styles.saveBtnText}>Salvar Nova Senha</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    form: {
        gap: 20,
    },
    formGroup: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        color: Colors.textPrimary,
        fontSize: 16,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveBtnText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
