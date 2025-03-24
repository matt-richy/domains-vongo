import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from local storage
    const savedCartItems = localStorage.getItem("cartItems");
    const cartTimestamp = localStorage.getItem("cartTimestamp");
    const sixHoursInMs = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

    // Check if cart exists and if 6 hours have passed
    if (savedCartItems && cartTimestamp) {
      const timeElapsed = Date.now() - parseInt(cartTimestamp, 10);
      if (timeElapsed >= sixHoursInMs) {
        // Clear expired cart
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartTimestamp");
        return [];
      }
      return JSON.parse(savedCartItems);
    }
    return [];
  });

  // Update local storage with cart items and timestamp
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("cartTimestamp", Date.now().toString()); // Store current timestamp
    } else {
      // Clear storage if cart is empty
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartTimestamp");
    }
  }, [cartItems]);

  // Optional: Check expiration periodically (e.g., every minute)
  useEffect(() => {
    const checkExpiration = () => {
      const cartTimestamp = localStorage.getItem("cartTimestamp");
      const sixHoursInMs = 6 * 60 * 60 * 1000;

      if (cartTimestamp) {
        const timeElapsed = Date.now() - parseInt(cartTimestamp, 10);
        if (timeElapsed >= sixHoursInMs) {
          setCartItems([]);
          localStorage.removeItem("cartItems");
          localStorage.removeItem("cartTimestamp");
        }
      }
    };

    // Check on mount and every minute
    checkExpiration();
    const interval = setInterval(checkExpiration, 60 * 1000); // Every minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateCartQuantity, totPrice }}
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