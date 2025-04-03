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

  // Sync cartItems to localStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log("CartItems saved to local storage:", cartItems);
    } else {
      localStorage.removeItem("cartItems");
      console.log("CartItems cleared from local storage");
    }
  }, [cartItems]);

  // Sync orderNumber to localStorage
  useEffect(() => {
    if (orderNumber) {
      localStorage.setItem("orderNumber", orderNumber);
      console.log("OrderNumber saved to local storage:", orderNumber);
    } else {
      localStorage.removeItem("orderNumber");
      console.log("OrderNumber cleared from local storage");
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
    calculateTotalEngravingCost(cartItems);

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

  // Assign order number and ensure it’s saved before proceeding
  const assignOrderNumber = (newOrderNumber) => {
    setOrderNumber(newOrderNumber);
    // Optionally, you can still attach it to cart items if needed
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) => ({ ...item, orderNumber: newOrderNumber }))
    );
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