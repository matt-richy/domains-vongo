import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // Update local storage with cart items
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log("CartItems saved to local storage:", cartItems); // Debug log
    } else {
      localStorage.removeItem("cartItems");
      console.log("CartItems cleared from local storage");
    }
  }, [cartItems]);

  const calculateTotalEngravingCost = (cartItems) => {
    const engravingCostPerItem = 100;
    return cartItems.reduce((total, item) => {
      if (item.engraving && Array.isArray(item.engraving)) {
        const validEngravings = item.engraving.filter(
          (engravingText) => engravingText.trim() !== ""
        ).length;
        return total + validEngravings * engravingCostPerItem;
      }
      return total;
    }, 0);
  };

  const totPrice =
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
    calculateTotalEngravingCost(cartItems);

  const addToCart = (item) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = [...prevCartItems, item];
      return updatedCartItems;
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prevCartItems) => {
      const newCartItems = [...prevCartItems];
      newCartItems.splice(index, 1);
      return newCartItems;
    });
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) => {
        if (item.id === itemId) {
          let updatedEngraving = [...item.engraving];
          if (newQuantity > item.quantity) {
            updatedEngraving = [
              ...updatedEngraving,
              ...new Array(newQuantity - item.quantity).fill(""),
            ];
          } else if (newQuantity < item.quantity) {
            updatedEngraving = updatedEngraving.slice(0, newQuantity);
          }
          return { ...item, quantity: newQuantity, engraving: updatedEngraving };
        }
        return item;
      })
    );
  };

  // Function to assign orderNumber to cartItems
  const assignOrderNumber = (orderNumber) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.map((item) => ({
        ...item,
        orderNumber: orderNumber,
      }));
      console.log("Assigned orderNumber:", orderNumber);
      // Force synchronous update to local storage
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      console.log("CartItems with orderNumber saved:", updatedCartItems);
      return updatedCartItems;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        totPrice,
        assignOrderNumber,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };