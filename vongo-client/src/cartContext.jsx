import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  const [orderNumber, setOrderNumber] = useState(() => {
    return localStorage.getItem("orderNumber") || "";
  });

  // Sync cartItems to localStorage, but don’t clear unless explicitly requested
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log("CartItems saved to local storage:", cartItems);
    } else if (cartItems.length === 0 && localStorage.getItem("cartItems")) {
      console.log("CartItems are empty but not clearing localStorage yet");
    }
  }, [cartItems]);

  // Sync orderNumber to localStorage, but don’t clear unless explicitly requested
  useEffect(() => {
    if (orderNumber) {
      localStorage.setItem("orderNumber", orderNumber);
      console.log("OrderNumber saved to local storage:", orderNumber);
    } else if (!orderNumber && localStorage.getItem("orderNumber")) {
      console.log("OrderNumber is empty but not clearing localStorage yet");
    }
  }, [orderNumber]);

  const calculateTotalEngravingCost = (items) => {
    const engravingCostPerItem = 100;
    return items.reduce((total, item) => {
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
    calculateTotalEngravingCost(cartItems) + 100;

  const addToCart = (item) => {
    setCartItems((prevCartItems) => [...prevCartItems, item]);
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

  const assignOrderNumber = (newOrderNumber) => {
    setOrderNumber(newOrderNumber);
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) => ({ ...item, orderNumber: newOrderNumber }))
    );
  };

  // Explicit clear function
  const clearCart = () => {
    setCartItems([]);
    setOrderNumber("");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("orderNumber");
    console.log("Cart and orderNumber explicitly cleared");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        totPrice,
        orderNumber,
        assignOrderNumber,
        clearCart,
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