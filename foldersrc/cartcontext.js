import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Hàm thêm vào giỏ
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Nếu đã có, tăng số lượng
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Nếu chưa có, thêm mới với số lượng 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Hàm tăng giảm hoặc thiết lập số lượng trực tiếp
  const updateQuantity = (id, value) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id !== id) return item;

      let newQty = item.quantity;
      if (value === 'inc') {
        newQty = item.quantity + 1;
      } else if (value === 'dec') {
        newQty = item.quantity - 1;
      } else {
        const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
        newQty = Number.isInteger(parsed) ? parsed : item.quantity;
      }

      if (newQty < 1) newQty = 1;
      return { ...item, quantity: newQty };
    }));
  };

  // Hàm xóa sản phẩm
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);