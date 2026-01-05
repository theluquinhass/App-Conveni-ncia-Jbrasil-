import { useRouter } from 'expo-router';
import { ClipboardCheck, DollarSign, Droplets, IceCream, Package, Settings } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PasswordModal from '../src/components/PasswordModal';
import { Colors } from '../src/constants/Colors';

export default function Home() {
    const router = useRouter();
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [pendingRoute, setPendingRoute] = useState(null);

    const handlePress = (route) => {
        if (route.startsWith('/category/')) {
            setPendingRoute(route);
            setIsPasswordOpen(true);
        } else {
            router.push(route);
        }
    };

    const handleAuthSuccess = () => {
        setIsPasswordOpen(false);
        if (pendingRoute) {
            router.push(pendingRoute);
            setPendingRoute(null);
        }
    };

    const MenuCard = ({ title, icon: Icon, route, color, iconColor }) => (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: color }]}
            onPress={() => handlePress(route)}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Icon size={24} color={iconColor || color} />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/settings')}>
                    <Settings size={28} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.sectionTitle}>Ferramentas</Text>

                <MenuCard
                    title="Conferência"
                    icon={ClipboardCheck}
                    route="/conference"
                    color="#06d6a0"
                />

                <MenuCard
                    title="Vendas"
                    icon={DollarSign}
                    route="/pos"
                    color="#06d6a0"
                />

                <MenuCard
                    title="Caixa"
                    icon={require('lucide-react-native').BarChart3}
                    route="/sales"
                    color="#06d6a0"
                />

                <MenuCard
                    title="Resumo de Vendas"
                    icon={Package}
                    route="/summary"
                    color="#06d6a0"
                />

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Produtos</Text>

                <MenuCard
                    title="Água"
                    icon={Droplets}
                    route="/category/agua"
                    color="#219ebc"
                />

                <MenuCard
                    title="Sorvete"
                    icon={IceCream}
                    route="/category/sorvete"
                    color="#ffb703"
                />
            </ScrollView>

            <PasswordModal
                isOpen={isPasswordOpen}
                onClose={() => {
                    setIsPasswordOpen(false);
                    setPendingRoute(null);
                }}
                onSuccess={handleAuthSuccess}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    content: {
        padding: 20,
    },
    logo: {
        width: '100%',
        height: 120,
        marginBottom: 30,
        alignSelf: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginBottom: 15,
        fontWeight: '600',
    },
    card: {
        backgroundColor: Colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 20,
    },
});
