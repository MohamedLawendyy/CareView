// src/Context/CartContext.js
import { createContext, useState } from 'react';

export const CartContext = createContext();

export default function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
}