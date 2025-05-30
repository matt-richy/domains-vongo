import React from 'react';
import { useLocation } from 'react-router-dom';
import './returnPage.css'
import { useCart } from "./cartContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CancelPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart()

  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate ('/Cart')
  }

  const handleClick =() => {
    navigate('/')
  }

  return (
    <div className='main-div'>
      <div className='payment-success-div'> 
    <h1 className='payment-heading'>Payment Cancelled</h1>
      <p1 className="pi-text" >Your payment was unsuccesful! Click below to review your cart and try again!</p1>

    
      </div>

      <div className="try-again-button-div">  
         <button className='try-again-button' onClick={handleTryAgain} > Try again 
          </button> 
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

    
      
      <div className='bottle-instructions'> 
          <div className='care' >
            
          <h1 className="care-instructions-heading">How to care for your Vongo Flask </h1> 

                    <div className="cleaning-instructions">
             
              
              <span className="sub-header">Cleaning Your Flask</span>
              <p>• Hand wash only: To preserve the double-wall insulation, avoid using dishwashers. Use warm water, mild dish soap, and a soft sponge or bottle brush.</p>
              <p>• Avoid abrasive cleaners: Do not use bleach or chlorine-based cleaning products. Avoid harsh scrubbing pads as they can damage the finish.</p>
              <p>• Rinse thoroughly: After each use, rinse well with clean water to prevent any residual odors or taste.</p>
              <p>• Deep cleaning: For a deeper clean, mix a solution of baking soda and vinegar, let it sit for a few hours, then rinse thoroughly.</p>
              
              <span className="sub-header">Keeping Your Flask Fresh</span>
              <p>• Air dry: Always store your flask with the lid off to let it air dry completely between uses. This prevents mold or odors from developing.</p>
              <p>• Lid care: Make sure to wash the lid components thoroughly, especially if they have rubber seals, to prevent bacteria build-up.</p>
              
              <span className="sub-header">Best Practices</span>
              <p>• Avoid extreme heat: Do not place your flask in the microwave, oven, or freezer. The double-wall insulation is designed to maintain temperature without external heating or freezing.</p>
              <p>• Handle with care: Although your Vongo flask is durable, dropping it from a significant height can compromise its insulation capabilities or dent the exterior.</p>

              <p class="center-text">Following these steps will help your Vongo flask perform at its best for years to come!</p>
            </div>


           </div>
          <div className='return-policy'> 
            <h1 className='care-instructions-heading'>Return Policy </h1>
            <div className="policy-section">
    <span className='sub-header'>30-Day Satisfaction Guarantee</span>
    <p>We want you to be fully satisfied with your purchase of Vongo flasks. If for any reason you are not happy with your purchase, you have up to 30 days from the date of delivery to return your flask for a refund or exchange.</p>
  </div>

  <div className="policy-section">
    <span className='sub-header'>Eligibility for Returns</span>
    <p>To be eligible for a return, your flask must be unused, in the same condition that you received it, and in its original packaging. Items that are damaged due to misuse, neglect, or normal wear and tear are not eligible for return.</p>
  </div>

  <div className="policy-section">
    <span className='sub-header'>Return Process</span>
    <p>To initiate a return, please contact our customer service team at <a href="mailto:support@vongo.com">support@vongo.com</a> with your order number and reason for return. Once your return is approved, you will receive instructions on how to send the product back to us.</p>
  </div>

  <div className="policy-section">
    <span className='sub-header'>Refunds</span>
    <p>Once we receive your returned flask, we will inspect it and notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.</p>
  </div>

  <div class="policy-section">
    <span className='sub-header'>Exchanges</span>
    <p>If you need to exchange your flask for a different size or color, please follow the same return process. We will send you the replacement once we receive and approve your returned item.</p>
  </div>

  <div className="policy-section">
    <span className='sub-header'>Return Shipping Costs</span>
    <p>Customers are responsible for return shipping costs unless the flask is defective or the wrong product was sent. We recommend using a trackable shipping service or purchasing shipping insurance to ensure your item is returned safely.</p>
  </div>
          </div>

      </div>


      <div className='button-div'>
      <button className='try-again-button' onClick={handleClick}> 
          Home

      </button>
      </div>
      <div className='spacer'></div>
    </div>
  );
        };

export default CancelPage;
