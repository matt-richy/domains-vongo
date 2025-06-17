import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartData = localStorage.getItem("cartData");
    if (savedCartData) {
      const { items, timestamp } = JSON.parse(savedCartData);
      if (Date.now() - timestamp < CART_EXPIRATION_TIME) {
        return items;
      } else {
        localStorage.removeItem("cartData"); // Clear expired cart data
      }
    }
    return [];
  });

  const [orderNumber, setOrderNumber] = useState(() => {
    return localStorage.getItem("orderNumber") || "";
  });

  const [promoDiscount, setPromoDiscount] = useState(() => {
    const savedDiscount = localStorage.getItem("promoDiscount");
    return savedDiscount ? parseFloat(savedDiscount) : 0;
  });

  const [appliedPromoCode, setAppliedPromoCode] = useState(() => {
    return localStorage.getItem("appliedPromoCode") || "";
  });

  // Sync cartItems to localStorage with a timestamp
  useEffect(() => {
    if (cartItems.length > 0) {
      const cartData = {
        items: cartItems,
        timestamp: Date.now(),
      };
      localStorage.setItem("cartData", JSON.stringify(cartData));
      console.log("CartItems saved to local storage with timestamp:", cartData);
    } else if (cartItems.length === 0 && localStorage.getItem("cartData")) {
      console.log("CartItems are empty but not clearing localStorage yet");
    }
  }, [cartItems]);

  // Sync orderNumber to localStorage
  useEffect(() => {
    if (orderNumber) {
      localStorage.setItem("orderNumber", orderNumber);
      console.log("OrderNumber saved to local storage:", orderNumber);
    } else if (!orderNumber && localStorage.getItem("orderNumber")) {
      console.log("OrderNumber is empty but not clearing localStorage yet");
    }
  }, [orderNumber]);

  // Sync promoDiscount to localStorage
  useEffect(() => {
    if (promoDiscount > 0) {
      localStorage.setItem("promoDiscount", promoDiscount.toString());
      console.log("PromoDiscount saved to local storage:", promoDiscount);
    } else if (promoDiscount === 0 && localStorage.getItem("promoDiscount")) {
      console.log("PromoDiscount is zero but not clearing localStorage yet");
    }
  }, [promoDiscount]);

  // Sync appliedPromoCode to localStorage
  useEffect(() => {
    if (appliedPromoCode) {
      localStorage.setItem("appliedPromoCode", appliedPromoCode);
      console.log("AppliedPromoCode saved to local storage:", appliedPromoCode);
    } else if (!appliedPromoCode && localStorage.getItem("appliedPromoCode")) {
      console.log("AppliedPromoCode is empty but not clearing localStorage yet");
    }
  }, [appliedPromoCode]);

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
    calculateTotalEngravingCost(cartItems) +
    100 -
    promoDiscount;

  const addToCart = (item) => {
    setCartItems((prevCartItems) => [...prevCartItems, item]);
  };

  const removeFromCart = (index) => {
    setCartItems((prevCartItems) => {
      const newCartItems = [...prevCartItems];
      newCartItems.splice(index, 1);
  
      // If the cart becomes empty or no eligible items for the promo discount remain
      if (newCartItems.length === 0) {
        setPromoDiscount(0);
        setAppliedPromoCode("");
      } else if (!newCartItems.some((item) => item.isEligibleForDiscount)) {
        // Check if no items in the cart qualify for the promo discount
        setPromoDiscount(0);
        setAppliedPromoCode("");
      }
  
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

  const applyPromoDiscount = (discount, promoCode) => {
    setPromoDiscount(discount);
    setAppliedPromoCode(promoCode);
  };

  const clearCart = () => {
    setCartItems([]);
    setOrderNumber("");
    setPromoDiscount(0);
    setAppliedPromoCode("");
    localStorage.removeItem("cartData");
    localStorage.removeItem("orderNumber");
    localStorage.removeItem("promoDiscount");
    localStorage.removeItem("appliedPromoCode");
    console.log("Cart, orderNumber, and promo data explicitly cleared");
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
        applyPromoDiscount,
        clearCart,
        appliedPromoCode,
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