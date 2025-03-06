import React from "react";
import "./index.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import medFlask from "./photos/iceflowCharc.webp";
import larFlask from "./photos/iceflowcharc2.webp";
import larFlask2 from "./photos/iceflowcharc3.webp";
import { useCart } from "./cartContext";
import Popup from "./addCartpop";
import { Imageswiper } from "./Imageswipe.tsx";
import Footer from "./footer";
import black1 from "./photos/bottles/black1.png"
import grey1 from "./photos/bottles/grey1.png"
import white1 from "./photos/bottles/white1.png"
import tan1 from "./photos/bottles/tan1.png"
import blue1 from "./photos/bottles/blue1.png"
import lblack1 from "./photos/bottles/lblack1.png"
import lblue1 from "./photos/bottles/lblue1.png"
import lgrey1 from "./photos/bottles/lgrey1.png"





const bottles = [
  {
    id: 1,
    name: "VONGO INSULATED FLASK",
    size: ["medium", " large"],
    colors: ["Sand", "Black", "Green", "Grey"],
    srcs: {
      medium: {
        black: [black1],
        tan: [tan1],
        blue: [blue1],
        white: [white1],
        grey: [grey1],
        price: 850,
        capacity: "1.9 Liters",
      },
      large: {
        black: [lblack1],
       
        blue: [lblue1],
       
        grey: [lgrey1],
        price: 1150,
        capacity: "3.8 Liters",
      },
    },
    src: [medFlask, larFlask, larFlask2],
    description:
      "Our Durable flasks are manufactured with the highest grade materials and constructed with precision. Our Flasks feature double wall and vacuum sealed insulated properties that keep liquids cold or hot for up to 12 hours",
  },
];

export default function Buy() {
  const location = useLocation();
 
  const { cartItems, addToCart } = useCart();
  const [togglePopup, setPopup] = useState(false);
  const [engraving, setEngraving] =useState([]);




  const handleAddToCart = () => {
    addToCart({
      id: Date.now(),
      name: bottleSize,
      price: bottles[0].srcs[bottleSize].price,
      src: bottles[0].srcs[bottleSize][bottleColour][0],
      colour: bottleColour,
      capacity: bottles[0].srcs[bottleSize].capacity,
      quantity: useQuant,
      engraving: engraving,
      
    });
    togglePop();
  
  };
  const togglePop = () => {
    setPopup(!togglePopup);
  };

  const getAvailableColors = (size) => {
    return Object.keys(bottles[0].srcs[size]); // Gets color keys based on size
  };


  const [useQuant, setQuant] = useState(1);

  function addQuant() {
    setQuant((s) => s + 1);
  }

  function lessQuant() {
    if (useQuant > 1) setQuant((s) => s - 1);
  }

  

  const [bottleSize, setBottleSize] = useState("medium");
  const [bottleColour, setBottleColour] = useState("black");
  const [clicked, setClicked] = useState(true);
  

  useEffect(() => {
    setEngraving(new Array(useQuant).fill(""));
  }, [useQuant]);
  
  const handleEngravingChange = (index, value) => {
    const updatedEngravings = [...engraving];
    updatedEngravings[index] = value;
    setEngraving(updatedEngravings);
  };


  //gets the size of the bottle based on the home page - if pressed medium or large from home page 
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const size = searchParams.get("size");
    if (size) {
      if (size === "large") {
        setBottleSize("large");
        setClicked((prevClicked) => !prevClicked); // Toggle the clicked state
      } else {
        setBottleSize("medium");
      }
    }

  }, [location.search]);
  
  const handleClick = () => {
    setClicked(!clicked);
    if (clicked) setBottleSize("large");
    else setBottleSize("medium");
    // Reset color to the first available color for the selected size
    const availableColors = getAvailableColors(clicked ? "large" : "medium");
    setBottleColour(availableColors[0]);
  };


  const engravingTotal = (item) => {
    const pricePerEngraving = 100;
    let totalEngravingPrice = 0;
  
    // Loop through each engraving in the array
    for (const engraving of item) {
      if (engraving && engraving.trim() !== "") {
        // Add to total price if engraving text is not empty
        totalEngravingPrice += pricePerEngraving;
        
      }
    }

    return totalEngravingPrice;
    
  };

  const style = {
    opacity: 0.9,
  };
  const selectedStyle = {
    opacity: 1,
    outline: "2px solid blue",
    outlineOffset: "4px",
  };

  // next few lines of code are to handle
  // what image gets loaded - ie medium, large and then the colours



  return (
    <div>
      {bottles.map((items) => (
        <div className="grid-items" key={items.id}>
          <div className="grid-heading">
            <h1>{items.name}</h1>
          </div>
          <div className="images">
            <Imageswiper size={bottleSize} colour={bottleColour} />
          </div>
          <div>
            <div className="spacer-below-swiper"> </div>
           
            <div className="medium-large-div">
              <button
                className={
                  clicked
                    ? "medium-large-button-selected"
                    : "medium-large-button"
                }
                onClick={handleClick}
              >
                1.9l
              </button>
              <button
                className={
                  !clicked
                    ? "medium-large-button-selected"
                    : "medium-large-button"
                }
                onClick={handleClick}
              >
                3.8l
              </button>
            </div>
           
            <div className="colour-palet">
            {getAvailableColors(bottleSize).includes("white") && (
              <button
                className="colour1"
                style={bottleColour === "white" ? selectedStyle : style}
                onClick={() => setBottleColour("white")}
              ></button>
            )}
            {getAvailableColors(bottleSize).includes("tan") && (
              <button
                className="colour2"
                style={bottleColour === "tan" ? selectedStyle : style}
                onClick={() => setBottleColour("tan")}
              ></button>
            )}
            {getAvailableColors(bottleSize).includes("blue") && (
              <button
                className="colour3"
                style={bottleColour === "blue" ? selectedStyle : style}
                onClick={() => setBottleColour("blue")}
              ></button>
            )}
            {getAvailableColors(bottleSize).includes("black") && (
              <button
                className="colour4"
                style={bottleColour === "black" ? selectedStyle : style}
                onClick={() => setBottleColour("black")}
              ></button>
            )}
            {getAvailableColors(bottleSize).includes("grey") && (
              <button
                className="colour5"
                style={bottleColour === "grey" ? selectedStyle : style}
                onClick={() => setBottleColour("grey")}
              ></button>
            )}
            </div>
            <div>
              <h2 className="top-price-heading"> R{items.srcs[bottleSize].price} </h2>
           </div>
            <div className="item-description">
              <p1>{items.description}</p1>
            </div>
            <div className="quantity-price">
              <div className="colour-description-div">
                <h2 className="price-text">Colour:  </h2>
                <h2 className="price-text">{bottleColour} </h2>
              </div>

              <div className="quantity">
                
                <button className="quant-button" onClick={lessQuant}>
                  -
                </button>
                <p1> {useQuant} </p1>
                <button className="quant-button" onClick={addQuant}>
                  +
                </button>
              </div>
               
           

              

            <div className="total-price-div">
              <div className="bottle-price-div">
                <h2 className="price-text">Bottle Price:</h2>
                <h2 className="price-text">  R{useQuant * items.srcs[bottleSize].price}</h2>
              </div>
              <div className="engraving-price-div" >
                <h2 className="price-text">Engraving: - coming soon! </h2>
                <h2 className="price-text">  R{engravingTotal(engraving)}</h2>
              </div>
              <div className="totalofprice-div" >
                <h2 className="total-text">Total  </h2>
                <h2 className="total-text">  R{useQuant * items.srcs[bottleSize].price + (engravingTotal(engraving))}</h2>
              </div>

              </div> 
              <div className="snowflake">
              <h1>&#10052;</h1>

              <h3> 12 Hrs</h3>
              <h1>&#9832;</h1>
              <h3> 8 Hrs</h3>
              </div>

            </div>
           
            <div className="add-cart-div">
              <button
                className="add-to-cart"
               
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
              {togglePopup ? (
                <Popup
                  onClosePopup={togglePop}
                  bottlecap={bottleSize}
                  price={items.srcs[bottleSize].price}
                  colour={bottleColour}
                  qty = {useQuant}
                  engraving = {engraving}
                />
              ) : (
                ""
              )}

              
            </div>
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
}
