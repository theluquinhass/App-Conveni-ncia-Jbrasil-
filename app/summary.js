import { Package } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/Colors';
import { useInventory } from '../src/context/InventoryContext';

export default function SummaryScreen() {
    const { sales, products } = useInventory();
    const [activeSummaryTab, setActiveSummaryTab] = useState('agua');

    // Sales Summary Logic
    const getProductSalesCount = (productId) => {
        return sales
            .filter(s => s.productId === productId)
            .reduce((acc, s) => acc + s.quantity, 0);
    };

    const waterProducts = products.filter(p => p.category === 'agua');
    const iceCreamProducts = products.filter(p => p.category === 'sorvete');

    const renderSummaryList = (productList) => {
        const listWithSales = productList.map(p => ({
            ...p,
            soldCount: getProductSalesCount(p.id)
        }));

        if (listWithSales.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum produto cadastrado nesta categoria.</Text>
                </View>
            );
        }

        return (
            <View style={styles.summaryList}>
                {listWithSales.map((product) => (
                    <View key={product.id} style={styles.summaryItem}>
                        <View style={styles.summaryInfo}>
                            <Text style={styles.summaryName}>{product.name}</Text>
                        </View>
                        <View style={styles.summaryCountBadge}>
                            <Text style={styles.summaryCountLabel}>VENDIDOS</Text>
                            <Text style={styles.summaryCountValue}>{product.soldCount}</Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <View style={styles.header}>
                <Package size={24} color={Colors.primary} />
                <Text style={styles.headerTitle}>Resumo de Vendas</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeSummaryTab === 'agua' && styles.activeTabWater]}
                    onPress={() => setActiveSummaryTab('agua')}
                >
                    <Text style={[styles.tabText, activeSummaryTab === 'agua' && styles.activeTabTextWater]}>Água</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeSummaryTab === 'sorvete' && styles.activeTabIceCream]}
                    onPress={() => setActiveSummaryTab('sorvete')}
                >
                    <Text style={[styles.tabText, activeSummaryTab === 'sorvete' && styles.activeTabTextIceCream]}>Sorvete</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {activeSummaryTab === 'agua'
                    ? renderSummaryList(waterProducts)
                    : renderSummaryList(iceCreamProducts)
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 12,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabWater: {
        borderBottomColor: Colors.primary,
    },
    activeTabIceCream: {
        borderBottomColor: Colors.secondary,
    },
    tabText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    activeTabTextWater: {
        color: Colors.primary,
    },
    activeTabTextIceCream: {
        color: Colors.secondary,
    },
    content: {
        padding: 20,
    },
    summaryList: {
        gap: 12,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderLeftWidth: 4,
        borderLeftColor: Colors.border, // Default, could be specific color?
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    summaryInfo: {
        flex: 1,
    },
    summaryName: {
        fontSize: 16,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    summaryCountBadge: {
        alignItems: 'flex-end',
        backgroundColor: Colors.surfaceLight,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        minWidth: 40,
    },
    summaryCountLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    summaryCountValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
    },
});
