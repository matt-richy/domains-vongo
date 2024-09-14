import React from 'react';
import { useLocation } from 'react-router-dom';
import './returnPage.css'
import { useCart } from "./cartContext";
import { Link } from "react-router-dom";

const ReturnPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart()

  return (
    <div className='main-div'>
      <h1>Payment Successful</h1>
      <p>Your payment was successful. Thank you!</p>

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
                  
                </h3>
               
              </div>
             
            </div>
          ))}

      <div className='general-details'>
          <p className='general-details-text'>Watch out for an email detailing the estimated delivery time! Thanks for supporting local! </p>

          
      </div>
      <div className='button-div'>
      <Link to="/" className="button-shop" >
            RETURN HOME
          </Link>
      </div>
      <div className='spacer'></div>
    </div>
  );
        };

export default ReturnPage;
