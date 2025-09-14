import React, { useState } from "react";
import { useCart } from "./cartContext";
import "./cart.css";
import Emptycart from "./emptycart";
import ContactForm from "./infoForm";
import Footer from "./footer";
import dropdown from "./photos/down-arrow-2.png";
import axios from "axios";

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, totPrice, applyPromoDiscount } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleValidatePromo = async () => {
    if (!promoCode || !/^[A-Z0-9]{6}$/.test(promoCode)) {
      setError("Please enter a valid 6-character promo code.");
      setPromoStatus("");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log("Validating promo code:", promoCode);
      const response = await axios.post("/api/validatepromocode", {
        promoCode,
      });

      if (response.data.valid) {
        // Calculate 20% discount on one bottle's price
        const firstBottle = cartItems[0]; // Apply to first item; adjust logic if needed
        if (firstBottle) {
          const discount = firstBottle.price * 0.2; // 20% of one bottle's price
          setDiscountAmount(discount);
          applyPromoDiscount(discount, promoCode); // Update context
          setPromoStatus("Valid promo code! 20% off one bottle applied.");
        } else {
          setError("No items in cart to apply discount.");
          setPromoStatus("");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid promo code.");
      setPromoStatus("");
      console.error("Validation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalEngravingCost = (cartItems) => {
    const engravingCostPerItem = 100;
    let totalEngravingCost = 0;

    cartItems.forEach((item) => {
      if (item.engraving && Array.isArray(item.engraving)) {
        item.engraving.forEach((engravingText) => {
          if (engravingText.trim() !== "") {
            totalEngravingCost += engravingCostPerItem;
          }
        });
      }
    });

    return totalEngravingCost;
  };

  const handleQuantityChange = (event, itemId) => {
    const newQuantity = parseInt(event.target.value, 10);
    updateCartQuantity(itemId, newQuantity);
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
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(event, item.id)}
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                  <span className="dropdown-icon-span">
                    <img src={dropdown} className="dropdown-icon" />
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
                <h2 className="shipping-price-text">Engraving</h2>
                <div>
                  <h2 className="shipping-price-text">+ R{calculateTotalEngravingCost(cartItems)}</h2>
                </div>
              </div>
              {discountAmount > 0 && (
                <div className="shipping-price">
                  <h2 className="shipping-price-text">Promo Discount</h2>
                  <div>
                    <h2 className="shipping-price-text">- R{discountAmount}</h2>
                  </div>
                </div>
              )}
              <div className="shipping-price">
                <h2 className="shipping-price-text-t">Total</h2>
                <div>
                  <h2 className="shipping-price-text-t">R{totPrice}</h2>
                </div>
              </div>
              <div className="promo-section">
                <input
                  id="promoCode"
                  type="text"
                  placeholder="Enter your promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
                <button onClick={handleValidatePromo}>
                  {isLoading ? "Validating..." : "Validate"}
                </button>
                {promoStatus && (
                  <p style={{ color: "green", margin: "10px 0" }}>{promoStatus}</p>
                )}
                {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div>
            <div className="form-header">
              <h1 className="form-header-h1">Shipping information</h1>
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