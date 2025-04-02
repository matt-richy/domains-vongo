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
    } else {
      localStorage.removeItem("cartItems");
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

  // New function to assign orderNumber to cartItems
  const assignOrderNumber = (orderNumber) => {
    setCartItems((prevCartItems) => {
      // Assign the same orderNumber to all items in the cart
      const updatedCartItems = prevCartItems.map((item) => ({
        ...item,
        orderNumber: orderNumber, // Add orderNumber to each item
      }));
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
        assignOrderNumber, // Expose this function
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