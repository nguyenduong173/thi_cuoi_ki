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

  // Hàm tăng giảm số lượng
  const updateQuantity = (id, type) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        let newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  // Hàm xóa sản phẩm
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);