import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './returnPage.css';
import { useCart } from './cartContext';
import BottleInstructions from './bottleInstructions';

const ReturnPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters from URL (PayFast return_url params)
  const queryParams = new URLSearchParams(location.search);
  const payfastOrderNumber = queryParams.get('m_payment_id');
  console.log("From URL:", payfastOrderNumber);

  // Fallback to cartItems orderNumber or localStorage
  const storedOrderNumber = localStorage.getItem('orderNumber');
  const orderNumber =
    payfastOrderNumber || (cartItems[0]?.orderNumber) || storedOrderNumber || 'Unknown';

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="main-div">
      <div className="payment-success-div">
        <h1 className="payment-heading">Payment Successful - Order #{orderNumber}</h1>
        <p1 className="pi-text">
          We received your payment! <br /> <br />
          Thanks for shopping local! Please watch out for an email detailing your order and delivery details.
        </p1>
      </div>

      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <div className="cart-items-grid" key={index}>
            <div className="items-in-cart">
              <img className="image-in-cart" src={item.src} alt="Cart item" />
            </div>
            <div className="bottle-cart-info">
              <div className="item-header">
                <h1 className="item-header-head">Vongo Flask - {item.capacity}</h1>
              </div>
              <h3 className="cart-item-text">
                COLOUR: {item.colour}
                <br />
                QTY: {item.quantity}
                <br />
                ORDER #: {item.orderNumber || 'Pending'}
              </h3>
            </div>
            <div>
              <h3 className="cart-engraving-header">Engraving</h3>
              {item.engraving.map((text, idx) => (
                <li key={idx} className="engraving-item-cart">
                  Bottle {idx + 1}: {text || 'None'}
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