import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [cash, setCash] = useState(0);
    const [loading, setLoading] = useState(true);

    const [password, setPassword] = useState('2828');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [savedProducts, savedSales, savedCash, savedPassword] = await Promise.all([
                AsyncStorage.getItem('jbrasil-inventory'),
                AsyncStorage.getItem('jbrasil-sales'),
                AsyncStorage.getItem('jbrasil-cash'),
                AsyncStorage.getItem('jbrasil-password')
            ]);

            if (savedProducts) setProducts(JSON.parse(savedProducts));
            if (savedSales) setSales(JSON.parse(savedSales));
            if (savedCash) setCash(Number(savedCash));
            if (savedPassword) setPassword(savedPassword);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveProducts = async (newProducts) => {
        try {
            await AsyncStorage.setItem('jbrasil-inventory', JSON.stringify(newProducts));
        } catch (error) {
            console.error('Error saving products:', error);
        }
    };

    const updatePassword = async (newPassword) => {
        try {
            setPassword(newPassword);
            await AsyncStorage.setItem('jbrasil-password', newPassword);
            return true;
        } catch (error) {
            console.error('Error saving password:', error);
            return false;
        }
    };

    const saveSales = async (newSales) => {
        try {
            await AsyncStorage.setItem('jbrasil-sales', JSON.stringify(newSales));
        } catch (error) {
            console.error('Error saving sales:', error);
        }
    };

    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now().toString() };
        const newProducts = [...products, newProduct];
        setProducts(newProducts);
        saveProducts(newProducts);
    };

    const updateProduct = (id, updatedProduct) => {
        const newProducts = products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p));
        setProducts(newProducts);
        saveProducts(newProducts);
    };

    const deleteProduct = (id) => {
        const newProducts = products.filter((p) => p.id !== id);
        setProducts(newProducts);
        saveProducts(newProducts);
    };

    const registerSale = (product, quantity) => {
        registerBatchSales([{ ...product, cartQty: quantity }]);
    };

    const registerBatchSales = (items) => {
        // 1. Deduct Stock for all items
        const newProducts = products.map(p => {
            const itemInCart = items.find(i => i.id === p.id);
            if (itemInCart) {
                return { ...p, quantity: Number(p.quantity) - Number(itemInCart.cartQty) };
            }
            return p;
        });
        setProducts(newProducts);
        saveProducts(newProducts);

        // 2. Create Sales Records
        const newSalesItems = items.map((item, index) => ({
            id: (Date.now() + index).toString(), // Ensure unique IDs
            productId: item.id,
            productName: item.name,
            category: item.category,
            quantity: Number(item.cartQty),
            total: Number(item.price) * Number(item.cartQty),
            date: new Date().toISOString()
        }));

        const newSales = [...newSalesItems, ...sales];
        setSales(newSales);
        saveSales(newSales);
    };

    const resetSales = (category) => {
        if (category) {
            const newSales = sales.filter(s => s.category !== category);
            setSales(newSales);
            saveSales(newSales);
        } else {
            setSales([]);
            saveSales([]);
            setCash(0);
            AsyncStorage.setItem('jbrasil-cash', '0');
        }
    };

    const removeSale = (saleId) => {
        const saleToRemove = sales.find(s => s.id === saleId);
        if (!saleToRemove) return;

        // Restore stock
        const newProducts = products.map((p) =>
            p.id === saleToRemove.productId
                ? { ...p, quantity: Number(p.quantity) + Number(saleToRemove.quantity) }
                : p
        );
        setProducts(newProducts);
        saveProducts(newProducts);

        // Remove sale
        const newSales = sales.filter(s => s.id !== saleId);
        setSales(newSales);
        saveSales(newSales);
    };

    const updateCash = async (amount) => {
        const newTotal = cash + amount;
        setCash(newTotal);
        await AsyncStorage.setItem('jbrasil-cash', newTotal.toString());
    };

    const moveProduct = (id, direction) => {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= products.length) return;

        const newProducts = [...products];
        const [movedProduct] = newProducts.splice(index, 1);
        newProducts.splice(newIndex, 0, movedProduct);

        setProducts(newProducts);
        saveProducts(newProducts);
    };

    const getProductsByCategory = (category) => {
        return products.filter((p) => p.category === category);
    };

    const contextValue = useMemo(() => ({
        products,
        sales,
        loading,
        password,
        updatePassword,
        addProduct,
        updateProduct,
        deleteProduct,
        registerSale,
        registerBatchSales,
        resetSales,
        removeSale,
        moveProduct,
        getProductsByCategory,
        cash,
        updateCash,
    }), [products, sales, loading, password, cash]);

    return (
        <InventoryContext.Provider value={contextValue}>
            {children}
        </InventoryContext.Provider>
    );
};
