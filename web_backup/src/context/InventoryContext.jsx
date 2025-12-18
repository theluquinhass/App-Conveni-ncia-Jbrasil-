import { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('jbrasil-inventory');
        return saved ? JSON.parse(saved) : [];
    });

    const [sales, setSales] = useState(() => {
        const saved = localStorage.getItem('jbrasil-sales');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('jbrasil-inventory', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('jbrasil-sales', JSON.stringify(sales));
    }, [sales]);

    const addProduct = (product) => {
        setProducts((prev) => [...prev, { ...product, id: Date.now().toString() }]);
    };

    const updateProduct = (id, updatedProduct) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
        );
    };

    const deleteProduct = (id) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const registerSale = (product, quantity) => {
        // Deduct stock
        setProducts((prev) =>
            prev.map((p) => p.id === product.id ? { ...p, quantity: p.quantity - quantity } : p)
        );

        // Record sale
        const sale = {
            id: Date.now().toString(),
            productId: product.id,
            productName: product.name,
            category: product.category,
            quantity: quantity,
            total: product.price * quantity,
            date: new Date().toISOString()
        };

        setSales((prev) => [sale, ...prev]);
    };

    const resetSales = () => {
        setSales([]);
    };

    const moveProduct = (id, direction) => {
        setProducts(prev => {
            const index = prev.findIndex(p => p.id === id);
            if (index === -1) return prev;

            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= prev.length) return prev;

            const newProducts = [...prev];
            const [movedProduct] = newProducts.splice(index, 1);
            newProducts.splice(newIndex, 0, movedProduct);

            return newProducts;
        });
    };

    const getProductsByCategory = (category) => {
        return products.filter((p) => p.category === category);
    };

    return (
        <InventoryContext.Provider
            value={{
                products,
                sales,
                addProduct,
                updateProduct,
                deleteProduct,
                registerSale,
                resetSales,
                moveProduct,
                getProductsByCategory,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};
