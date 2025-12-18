import { ArrowDown, ArrowUp, Check, RotateCcw, Settings } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/Colors';
import { useInventory } from '../src/context/InventoryContext';

export default function ConferenceScreen() {
    const { products, moveProduct } = useInventory();
    const [isOrganizing, setIsOrganizing] = useState(false);
    const [activeTab, setActiveTab] = useState('agua');
    const [checkedItems, setCheckedItems] = useState({});

    const pagerRef = useRef(null);

    const waterProducts = products.filter(p => p.category === 'agua');
    const iceCreamProducts = products.filter(p => p.category === 'sorvete');

    const hasCheckedItems = Object.keys(checkedItems).some(k => checkedItems[k]);

    const handleMove = (id, direction) => {
        moveProduct(id, direction);
    };

    const toggleCheck = (id) => {
        if (isOrganizing) return;
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleClearChecks = () => {
        Alert.alert(
            'Confirmar',
            'Limpar toda a conferência?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Limpar', style: 'destructive', onPress: () => setCheckedItems({}) }
            ]
        );
    };

    const handleTabPress = (tab) => {
        setActiveTab(tab);
        pagerRef.current?.setPage(tab === 'agua' ? 0 : 1);
    };

    const handlePageSelected = (e) => {
        const index = e.nativeEvent.position;
        setActiveTab(index === 0 ? 'agua' : 'sorvete');
    };

    const ProductRow = ({ product, index, listLength }) => {
        const isChecked = !!checkedItems[product.id];
        const cardStyle = [
            styles.card,
            isChecked && { borderLeftColor: Colors.success, borderLeftWidth: 4, backgroundColor: '#052e16', opacity: 0.7 }
        ];

        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={() => toggleCheck(product.id)}
                activeOpacity={0.7}
                disabled={isOrganizing}
            >
                {isChecked && !isOrganizing && (
                    <View style={{ marginRight: 12 }}>
                        <Check size={20} color="#22c55e" />
                    </View>
                )}

                <View style={styles.info}>
                    <Text style={[
                        styles.name,
                        isChecked && !isOrganizing && { textDecorationLine: 'line-through', color: '#6c757d' }
                    ]}>
                        {product.name}
                    </Text>
                </View>

                {isOrganizing ? (
                    <View style={styles.organizeActions}>
                        <TouchableOpacity
                            style={[styles.moveBtn, index === 0 && styles.disabledBtn]}
                            onPress={() => handleMove(product.id, 'up')}
                            disabled={index === 0}
                        >
                            <ArrowUp size={20} color={index === 0 ? '#adb5bd' : 'white'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.moveBtn, index === listLength - 1 && styles.disabledBtn]}
                            onPress={() => handleMove(product.id, 'down')}
                            disabled={index === listLength - 1}
                        >
                            <ArrowDown size={20} color={index === listLength - 1 ? '#adb5bd' : 'white'} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>QTD:</Text>
                        <Text style={styles.quantityValue}>{product.quantity}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderProductList = (list) => {
        if (list.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Nenhum item cadastrado.
                    </Text>
                </View>
            );
        }
        return (
            <ScrollView contentContainerStyle={styles.list}>
                {list.map((product, idx) => (
                    <ProductRow
                        key={product.id}
                        product={product}
                        index={idx}
                        listLength={list.length}
                    />
                ))}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <View style={styles.header}>
                <View style={styles.headerControls}>
                    {hasCheckedItems && (
                        <TouchableOpacity
                            style={[styles.iconBtn, styles.clearBtn]}
                            onPress={handleClearChecks}
                        >
                            <RotateCcw size={18} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[
                            styles.iconBtn,
                            isOrganizing ? styles.organizeBtnActive : styles.organizeBtn
                        ]}
                        onPress={() => setIsOrganizing(!isOrganizing)}
                    >
                        <Settings size={18} color={isOrganizing ? Colors.background : Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'agua' && styles.activeTabWater]}
                    onPress={() => handleTabPress('agua')}
                >
                    <Text style={[styles.tabText, activeTab === 'agua' && styles.activeTabTextWater]}>Água</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'sorvete' && styles.activeTabIceCream]}
                    onPress={() => handleTabPress('sorvete')}
                >
                    <Text style={[styles.tabText, activeTab === 'sorvete' && styles.activeTabTextIceCream]}>Sorvete</Text>
                </TouchableOpacity>
            </View>

            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={handlePageSelected}
            >
                <View key="1" style={styles.page}>
                    {renderProductList(waterProducts)}
                </View>
                <View key="2" style={styles.page}>
                    {renderProductList(iceCreamProducts)}
                </View>
            </PagerView>
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
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerControls: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    clearBtn: {
        backgroundColor: '#fef2f2',
        borderColor: '#fee2e2',
    },
    organizeBtn: {
        backgroundColor: 'transparent',
    },
    organizeBtnActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        marginBottom: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
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
        fontSize: 16,
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    activeTabTextWater: {
        color: Colors.primary,
    },
    activeTabTextIceCream: {
        color: Colors.secondary,
    },
    pagerView: {
        flex: 1,
    },
    page: {
        flex: 1,
    },
    list: {
        padding: 20,
        paddingBottom: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        marginTop: 20,
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
        elevation: 1,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    quantityContainer: {
        alignItems: 'flex-end',
        backgroundColor: Colors.surfaceLight,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        minWidth: 50,
    },
    quantityLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    quantityValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    organizeActions: {
        flexDirection: 'row',
        gap: 8,
    },
    moveBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#495057',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBtn: {
        backgroundColor: '#ced4da',
    },
});
