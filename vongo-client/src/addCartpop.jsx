import React from "react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./popUp.css";
import bag from "./photos/bag.png";
import close from "./photos/close.png";

const Popup = ({ onClosePopup, ...props }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClosePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClosePopup]);

  const handleClose = () => {
    onClosePopup();
  };
  return (
    <div className="pop-up-container">
      <div className="pop-up" ref={popupRef}>
        <button className="close-button" onClick={handleClose}>
          <img src={close} className="close-icon" />
        </button>
        <h1>Added to Cart!</h1>
        <ul className="list-items">
          <li>Size: {props.bottlecap === 'medium' ? '1.9L' : '3.8L'}</li>
          <li>Price: R{props.price}</li>
          <li>Colour: {props.colour}</li>
          <li>QTY: {props.qty}</li>
          {props.engraving && props.engraving.length > 0 && (
            <li>
              <strong>Engravings:</strong>
              <ul className="engraving-list">
                {props.engraving.map((text, index) => (
                  <li key={index} className="engraving-item">
                    Bottle {index + 1}: {text || "No engraving"}
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
        <Link className="ahrefclass" to="/Cart">
          <img className="cart-iconic" src={bag} />
        </Link>
      </div>
    </div>
  );
};

export default Popup;
