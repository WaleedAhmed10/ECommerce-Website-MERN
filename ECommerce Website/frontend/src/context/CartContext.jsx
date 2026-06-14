import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const save = (updated) => {
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const addToCart = (product, qty = 1) => {
    const existing = cart.find((i) => i.product._id === product._id);
    const updated = existing
      ? cart.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      : [...cart, { product, quantity: qty }];
    save(updated);
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    save(cart.map((i) => (i.product._id === productId ? { ...i, quantity: qty } : i)));
  };

  const removeFromCart = (productId) => {
    save(cart.filter((i) => i.product._id !== productId));
  };

  const clearCart = () => save([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
