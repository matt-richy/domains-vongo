import React, { useState } from "react";
import { useCart } from "./cartContext";
import "./cart.css";
import Emptycart from "./emptycart";
import ContactForm from "./infoForm";
import Footer from "./footer";
import dropdown from "./photos/down-arrow-2.png"

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, totPrice } = useCart(); // Assuming updateCartQuantity is a function that updates the quantity in the cart context

  // Calculate the total price
 


  const calculateTotalEngravingCost = (cartItems) => {
    const engravingCostPerItem = 100; // Cost per engraving
    let totalEngravingCost = 0; // Initialize total cost
  
    // Loop through each cart item
    cartItems.forEach((item) => {
      if (item.engraving && Array.isArray(item.engraving)) {
        // Loop through the engraving array for the current item
        item.engraving.forEach((engravingText) => {
          if (engravingText.trim() !== "") {
            // Add cost for non-blank engravings
            totalEngravingCost += engravingCostPerItem;
          }
        });
      }
    });
  
    return totalEngravingCost; // Return the total engraving cost
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + calculateTotalEngravingCost(cartItems);

  const handleQuantityChange = (event, itemId) => {
    const newQuantity = parseInt(event.target.value, 10);
    updateCartQuantity(itemId, newQuantity); // Update the quantity using a context or state function
  };

  return (
    <>
      <div className="cart-grid">
        {cartItems.length < 1 && <Emptycart />}

        <div className="cart-info">
          {cartItems.length > 0 && (
            <div className="cart-heading">
              <h1 className="cart-heading-h1">Review your bag.</h1>
            </div>
          )}

          {cartItems.map((item, index) => (
            <div className="cart-items-grid" key={index}>
              <div className="items-in-cart">
                <img className="image-in-cart" src={item.src} alt="Cart item" />
              </div>
              <div className="bottle-cart-info">
                <div className="item-header">
                  <h1 className="item-header-head">Vongo Flask - {item.capacity} (R{item.price})</h1>
                </div>
              <div className="vongo-flask-details"> 
                <h3 className="cart-item-text">
                  COLOUR: {item.colour}
                  <br />
                  
                </h3>
                <div>
                  <h3 className="cart-engraving-header">Engraving</h3>
                  {item.engraving.map((text, index) => (
                    <li key={index} className="engraving-item-cart">
                    Bottle {index + 1}: {text || "None"}
                  </li>
                  ))}
                </div>
                </div>

                <div className="dropdown-selector-div"> 
                <select
                  className="qty-selector"
                  id="number-dd"
                  name="number"
                  value={item.quantity} // Set the selected value
                  onChange={(event) => handleQuantityChange(event, item.id)} // Handle change event with item ID
                >
                  {[...Array(10).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
                <span className="dropdown-icon-span">
                  <img src={dropdown} className="dropdown-icon"/>
                </span>
                </div>
              </div>
              <div className="item-price-div">
                <div className="item-price">
                  <h1 className="individual-item-price">R{item.price * item.quantity}</h1>
                </div>
                <div className="remove-button-div">
                  <button id={index} className="remove-button" onClick={() => removeFromCart(index)}>
                    <h2 className="remove-button-text">Remove</h2>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cartItems.length > 0 && (
            <div className="total">

            <div className="shipping-price">
                <div>
                  <h2 className="shipping-price-text">Shipping</h2>
                </div>
                <div>
                  <h2 className="shipping-price-text">FREE</h2>
                </div>
              </div>
              <div className="shipping-price">
              <h2 className="shipping-price-text">Engraving {}</h2>
              <div>
              <h2 className="shipping-price-text"> + R{calculateTotalEngravingCost(cartItems)}</h2>
              </div>
              </div>
          
              <div className="shipping-price">
                <h2 className="shipping-price-text-t">Total </h2>
                <div>
                  <h2 className="shipping-price-text-t">R{totPrice}</h2>
                </div>
              </div>
             
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div>
            <div className="form-header">
              <h1 className="form-header-h1">Shipping information </h1>  
            </div>
            <ContactForm />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
