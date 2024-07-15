import React from "react";
import { useCart } from "./cartContext";
import "./cart.css";
import axios from "axios";
import { motion } from "framer-motion";
import bin from "./photos/recycle-bin.png";
import Emptycart from "./emptycart";
import ContactForm from "./infoForm";
import Footer from "./footer";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();


  var totalPrice = 0;
  for (let i = 0; i < cartItems.length; i++) {
    totalPrice += cartItems[i].price * cartItems[i].quantity;
  }

  const axiosInstance = axios.create({baseURL: process.env.REACT_APP_API_URL, })

  

 

  return (
    <>
    <div className="cart-grid">
      {cartItems.length < 1 && <Emptycart />}

      <div className="cart-info">
        {cartItems.length > 0 && (
          <div className="cart-heading">
            <h1>CART SUMMARY</h1>
          </div>
        )}

        {cartItems.map((item, index) => (
          <div className="cart-items-grid" key={index}>
            <div className="items-in-cart" key={index}>
              <img className="image-in-cart" src={item.src} />
              <div className="bottle-cart-info">
                <h3 className="cart-item-text">
                  {item.capacity}
                  <br />
                  COLOUR: {item.colour}
                  <br />
                  QTY: {item.quantity}
                  <br />
                  PRICE: {item.price * item.quantity}
                </h3>
                <motion.button
                  id={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="remove-button"
                  onClick={() => removeFromCart(index)}
                >
                  <img src={bin} className="trash-icon" />
                </motion.button>{" "}
              </div>
            </div>
          </div>
        ))}
        {cartItems.length > 0 && (
          <div className="total">
            <h3 className="price-excl-shipping">PRICE EXCL. SHIPPING:</h3>
            <div className="total-price">
              <h3>
                R{totalPrice} <br />
              </h3>
            </div>
          </div>
        )}
      </div>
      {cartItems.length > 0 && (
        <><ContactForm />
        </>
      )}

     
    </div>
    <Footer />
    </>
  );
};

export default Cart;
