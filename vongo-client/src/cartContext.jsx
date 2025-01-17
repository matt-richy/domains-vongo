import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize the cart state from local storage
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // Use useEffect to update local storage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateTotalEngravingCost = (cartItems) => {
    const engravingCostPerItem = 100; // Cost per engraving
    return cartItems.reduce((total, item) => {
      if (item.engraving && Array.isArray(item.engraving)) {
        const validEngravings = item.engraving.filter(
          (engravingText) => engravingText.trim() !== "" // Count only non-empty engravings
        ).length;
        return total + validEngravings * engravingCostPerItem;
      }
      return total;
    }, 0);
  };

  // Function to calculate total price, including engraving costs
  const totPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ) + calculateTotalEngravingCost(cartItems);

  const addToCart = (item) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = [...prevCartItems, item];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Update local storage immediately
      return updatedCartItems;
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prevCartItems) => {
      const newCartItems = [...prevCartItems];
      newCartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems)); // Update local storage immediately
      return newCartItems;
    });
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) => {
        if (item.id === itemId) {
          // Update the engraving array to match the new quantity
          let updatedEngraving = [...item.engraving]; // Create a copy of the engraving array
          if (newQuantity > item.quantity) {
            // Add empty engravings if quantity increased
            updatedEngraving = [
              ...updatedEngraving,
              ...new Array(newQuantity - item.quantity).fill(""),
            ];
          } else if (newQuantity < item.quantity) {
            // Trim the engraving array if quantity decreased
            updatedEngraving = updatedEngraving.slice(0, newQuantity);
          }
  
          // Return the updated item
          return { ...item, quantity: newQuantity, engraving: updatedEngraving };
        }
        return item; // Return unchanged item
      })
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateCartQuantity, totPrice}}
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
