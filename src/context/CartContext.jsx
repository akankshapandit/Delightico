// contexts/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Load cart from localStorage on initial render
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(savedCart.reduce((total, item) => total + item.quantity, 0));
  }, []);

  const updateCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(savedCart.reduce((total, item) => total + item.quantity, 0));
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}