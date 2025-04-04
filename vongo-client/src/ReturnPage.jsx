import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./returnPage.css";
import { useCart } from "./cartContext";
import BottleInstructions from "./bottleInstructions";
import axios from "axios";


const ReturnPage = () => {
  const { cartItems, orderNumber, assignOrderNumber, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const urlOrderNumber = queryParams.get("orderNumber");
  const payfastOrderNumber = queryParams.get("m_payment_id");

  const orderNum = urlOrderNumber || orderNumber || payfastOrderNumber;

  useEffect(() => {
    if (!orderNum) {
      setError("Unable to retrieve order details. Please contact support.");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/order/${orderNum}`);
        const { cart, orderNumber: fetchedOrderNumber, paymentStatus } = response.data;
        
        console.log("pay status: ", paymentStatus);

        if (paymentStatus === true) {  // Ensure strict comparison
          console.log("payment status true on check", paymentStatus);
          setOrderDetails({ cart, orderNumber: fetchedOrderNumber });
          if (orderNumber !== fetchedOrderNumber) { 
            assignOrderNumber(fetchedOrderNumber); // Only update if different
          }
        } else {
          console.log("error over here", paymentStatus);
          setError(`Payment status: ${paymentStatus}. Please contact support.`);
        }
      } catch (err) {
        setError("Failed to load order details. Please try again or contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNum]);  // **Removed `assignOrderNumber` from dependencies**

  const handleClick = () => {
    clearCart();
    navigate("/");
  };

  const displayOrderNumber = orderDetails?.orderNumber || orderNum || "Unknown";
  const displayCartItems = orderDetails?.cart || cartItems;

  if (loading) return <div className="main-div">Loading order details...</div>;
  if (error) {
    return (
      <div className="main-div">
        <h1 className="payment-heading">Payment Processing</h1>
        <p>{error}</p>
        <button className="try-again-button" onClick={handleClick}>Home</button>
      </div>
    );
  }

  return (
    <div className="main-div">
      <div className="payment-success-div">
        <h1 className="payment-heading">Payment Successful - Order #{displayOrderNumber}</h1>
        <p className="pi-text">
          We received your payment! <br /> <br />
          Thanks for shopping local! Please watch out for an email detailing your order and delivery details.
        </p>
      </div>

      {displayCartItems.length > 0 ? (
        displayCartItems.map((item, index) => (
          <div className="cart-items-grid" key={index}>
            
            <div className="bottle-cart-info">
              <div className="item-header">
                <h1 className="item-header-head">Vongo Flask - {item.capacity}</h1>
              </div>
              <h3 className="cart-item-text">
                COLOUR: {item.colour}
                <br />
                QTY: {item.quantity}
                <br />
                ORDER #: {item.orderNumber || displayOrderNumber}
              </h3>
            </div>
            <div>
              <h3 className="cart-engraving-header">Engraving</h3>
              {item.engraving.map((text, idx) => (
                <li key={idx} className="engraving-item-cart">
                  Bottle {idx + 1}: {text || "None"}
                </li>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No items found in cart.</p>
      )}

      <BottleInstructions />

      <div className="button-div">
        <button className="try-again-button" onClick={handleClick}>
          Home
        </button>
      </div>
      <div className="spacer"></div>
    </div>
  );
};

export default ReturnPage;