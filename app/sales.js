import { History, Minus, Plus, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PasswordModal from '../src/components/PasswordModal';
import ValueModal from '../src/components/ValueModal';
import { Colors } from '../src/constants/Colors';
import { useInventory } from '../src/context/InventoryContext';

export default function SalesScreen() {
    const { sales, resetSales, removeSale, cash, updateCash } = useInventory();

    // Security & Inputs
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isValueModalOpen, setIsValueModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // { type: 'reset'|'add_cash'|'remove_cash', category?: string }
    const [filter, setFilter] = useState('all'); // 'all' | 'agua' | 'sorvete'

    // Memoized Grouping Logic
    const groupedSales = useMemo(() => {
        const filtered = sales.filter(s => filter === 'all' || s.category === filter);

        const grouped = {};
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        filtered.forEach(sale => {
            const date = new Date(sale.date);
            const dateStr = date.toDateString();

            let label = date.toLocaleDateString('pt-BR');
            if (dateStr === today) label = 'Hoje';
            else if (dateStr === yesterday) label = 'Ontem';

            if (!grouped[label]) grouped[label] = [];
            grouped[label].push(sale);
        });

        // Use localized sort or simple reverse chronological
        return Object.entries(grouped)
            .map(([title, data]) => ({ title, data }))
            .sort((a, b) => {
                // Simple heuristic: 'Hoje' first, 'Ontem' second, then dates
                if (a.title === 'Hoje') return -1;
                if (b.title === 'Hoje') return 1;
                if (a.title === 'Ontem') return -1;
                if (b.title === 'Ontem') return 1;
                return 0; // Keep original order for others usually (or proper date parsing if needed)
            });
    }, [sales, filter]);

    // Memoized Stats
    const totalWater = useMemo(() => (sales ?? [])
        .filter(s => s.category === 'agua')
        .reduce((acc, s) => acc + s.total, 0), [sales]);

    const totalIce = useMemo(() => (sales ?? [])
        .filter(s => s.category === 'sorvete')
        .reduce((acc, s) => acc + s.total, 0), [sales]);

    const hasWaterSales = useMemo(() => sales.some(s => s.category === 'agua'), [sales]);
    const hasIceSales = useMemo(() => sales.some(s => s.category === 'sorvete'), [sales]);

    const handleResetClick = (category) => {
        const hasSalesInCategory = category
            ? sales.some(s => s.category === category)
            : sales.length > 0;

        if (!hasSalesInCategory) return;
        setPendingAction({ type: 'reset', category });
        setIsPasswordOpen(true);
    };

    const handleAuthSuccess = () => {
        const action = pendingAction;
        // Don't clear pendingAction yet if it's a cash action, we need it for the ValueModal
        setIsPasswordOpen(false);

        if (action?.type === 'reset') {
            setPendingAction(null);
            const categoryLabel = action.category === 'agua' ? 'Água' :
                action.category === 'sorvete' ? 'Sorvete' : 'Geral';

            Alert.alert(
                'Confirmar Fechamento',
                `Tem certeza que deseja zerar o caixa e apagar o histórico de vendas de ${categoryLabel}?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Sim, zerar', onPress: () => resetSales(action.category) }
                ]
            );
        } else if (action?.type === 'add_cash' || action?.type === 'remove_cash') {
            setIsValueModalOpen(true);
        } else if (action?.type === 'cancel_sale') {
            setPendingAction(null);
            Alert.alert(
                'Cancelar Venda',
                'Tem certeza que deseja cancelar esta venda e devolver o item ao estoque?',
                [
                    { text: 'Não', style: 'cancel' },
                    { text: 'Sim, cancelar', onPress: () => removeSale(action.sale.id) }
                ]
            );
        }
    };

    const handleValueSuccess = (amount) => {
        if (pendingAction?.type === 'add_cash') {
            updateCash(amount);
        } else if (pendingAction?.type === 'remove_cash') {
            updateCash(-amount);
        }
        setPendingAction(null);
        setIsValueModalOpen(false);
    };

    const handleCashAction = (type) => {
        setPendingAction({ type });
        setIsPasswordOpen(true);
    };

    const handleDeleteSale = (sale) => {
        setPendingAction({ type: 'cancel_sale', sale });
        setIsPasswordOpen(true);
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Cashier Dashboard */}
            <View style={styles.dashboard}>
                <View style={styles.row}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: Colors.primary }]}>Água</Text>
                        <Text style={styles.statValue}>
                            {totalWater.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: Colors.secondary }]}>Sorvete</Text>
                        <Text style={styles.statValue}>
                            {totalIce.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>
                </View>

                <View style={styles.horizontalDivider} />

                <View style={styles.cashStatItem}>
                    <Text style={[styles.statLabel, { color: Colors.success }]}>Saldo em Caixa</Text>
                    <Text style={styles.cashStatValue}>
                        {(cash || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                </View>
            </View>

            <View style={[styles.closeRegisterContainer, { marginBottom: 10 }]}>
                <TouchableOpacity
                    style={[styles.closeBtn, { backgroundColor: Colors.success }]}
                    onPress={() => handleCashAction('add_cash')}
                >
                    <Plus size={16} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.closeBtnText}>Adicionar $</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.closeBtn, { backgroundColor: Colors.danger }]}
                    onPress={() => handleCashAction('remove_cash')}
                >
                    <Minus size={16} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.closeBtnText}>Retirar $</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.closeRegisterContainer}>
                <TouchableOpacity
                    style={[styles.closeBtn, !hasWaterSales && styles.disabledCloseBtn]}
                    onPress={() => handleResetClick('agua')}
                    disabled={!hasWaterSales}
                >
                    <Trash2 size={16} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.closeBtnText}>Limpar Água</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.closeBtn, !hasIceSales && styles.disabledCloseBtn]}
                    onPress={() => handleResetClick('sorvete')}
                    disabled={!hasIceSales}
                >
                    <Trash2 size={16} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.closeBtnText}>Limpar Sorvete</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
                <History size={18} color={Colors.textSecondary} />
                <Text style={styles.sectionTitle}>Histórico de Vendas</Text>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {['all', 'agua', 'sorvete'].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterBtn, filter === f && styles.activeFilterBtn]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
                            {f === 'all' ? 'Todos' : f === 'agua' ? 'Água' : 'Sorvete'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <SectionList
                sections={groupedSales}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <View>
                            <Text style={styles.historyText}>{item.quantity}x {item.productName}</Text>
                            <Text style={styles.historyDate}>
                                {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Text style={styles.historyTotal}>
                                +{item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
                            <TouchableOpacity onPress={() => handleDeleteSale(item)}>
                                <Trash2 size={20} color={Colors.danger} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.groupTitle}>{title}</Text>
                )}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <Text style={styles.emptyHistory}>Nenhuma venda registrada.</Text>
                }
                contentContainerStyle={styles.content}
                stickySectionHeadersEnabled={false}
            />

            <PasswordModal
                isOpen={isPasswordOpen}
                onClose={() => {
                    setIsPasswordOpen(false);
                }}
                onSuccess={handleAuthSuccess}
            />

            <ValueModal
                isOpen={isValueModalOpen}
                onClose={() => {
                    setIsValueModalOpen(false);
                    setPendingAction(null);
                }}
                onSuccess={handleValueSuccess}
                title={pendingAction?.type === 'add_cash' ? 'Adicionar ao Caixa' : 'Retirar do Caixa'}
            />
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
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 10,
    },
    dashboard: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    horizontalDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 15,
    },
    cashStatItem: {
        alignItems: 'center',
    },
    cashStatValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.success,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.success,
    },
    verticalDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    closeRegisterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    closeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.danger,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    disabledCloseBtn: {
        backgroundColor: '#fca5a5',
    },
    closeBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    historyList: {
        gap: 8,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    historyText: {
        fontSize: 14,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    historyDate: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    historyTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.success,
    },
    emptyHistory: {
        color: Colors.textSecondary,
        fontStyle: 'italic',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    activeFilterBtn: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    activeFilterText: {
        color: 'white',
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        marginTop: 10,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
});
