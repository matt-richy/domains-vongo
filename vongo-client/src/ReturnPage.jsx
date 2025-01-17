import React from 'react';
import { useLocation } from 'react-router-dom';
import './returnPage.css'
import { useCart } from "./cartContext";
import { Link, useNavigate } from "react-router-dom";
import BottleInstructions from './bottleInstructions';

const ReturnPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart()

  const navigate = useNavigate();

const handleClick = () => {
  navigate('/')
}

  return (
    <div className='main-div'>
      <div className='payment-success-div'> 
      <h1 className='payment-heading'>Payment Successful</h1>
      <p1 className="pi-text" >We received your payment! <br /> <br />
      Thanks for shopping local! Please watch out for an email detailing your order and delivery details.
      </p1>
      </div>

      {cartItems.map((item, index) => (
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
                  
                </h3>
               
              </div>
             
            </div>
          ))}

     
      <BottleInstructions />
      


      <div className='button-div'>
      <button className='try-again-button' onClick={handleClick}> 
          Home

      </button>
      </div>
      <div className='spacer'></div>
    </div>
  );
        };

export default ReturnPage;
