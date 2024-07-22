import React from "react";
import "./index.css";
import { useState } from "react";
import medFlask from "./photos/iceflowCharc.webp";
import larFlask from "./photos/iceflowcharc2.webp";
import larFlask2 from "./photos/iceflowcharc3.webp";
import { useCart } from "./cartContext";
import axios from "axios";
import Popup from "./addCartpop";
import { Imageswiper } from "./Imageswipe.tsx";
import Footer from "./footer";

const bottles = [
  {
    id: 1,
    name: "VONGO INSULATED FLASK",
    size: ["medium", " large"],
    colors: ["Sand", "Black", "Green", "Grey"],
    srcs: {
      medium: {
        black: [medFlask, medFlask, medFlask],
        tan: [medFlask, "image2", "image3"],
        blue: [medFlask, "image2", "image3"],
        white: [medFlask, "image2", "image3"],
        grey: [medFlask, "image2", "image3"],
        price: 899,
        capacity: "1.9 Liters",
      },
      large: {
        black: [medFlask, "image2", "image3"],
        tan: [medFlask, "image2", "image3"],
        blue: [medFlask, "image2", "image3"],
        white: [medFlask, "image2", "image3"],
        grey: [medFlask, "image2", "image3"],
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

 
  const { cartItems, addToCart } = useCart();
  const [togglePopup, setPopup] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: 1,
      name: bottleSize,
      price: bottles[0].srcs[bottleSize].price,
      src: bottles[0].srcs[bottleSize][bottleColour][0],
      colour: bottleColour,
      capacity: bottles[0].srcs[bottleSize].capacity,
      quantity: useQuant,
    });
    togglePop();
    axios.post('/api/test', { message: "test" })
            .then((res) => {
                console.log("sucesss")
            })
            .catch((error) => {
                console.error('Error posting data:', error);
               
            });
  };
  const togglePop = () => {
    setPopup(!togglePopup);
  };




  const [useQuant, setQuant] = useState(1);

  function addQuant() {
    setQuant((s) => s + 1);
  }

  function lessQuant() {
    if (useQuant > 1) setQuant((s) => s - 1);
  }

  const [clicked, setClicked] = useState(true);

  function handleClick() {
    console.log("clicked");
    setClicked(!clicked);
    if (clicked) setBottleSize("large");
    else setBottleSize("medium");
  }
  const style = {
    opacity: 0.9,
  };
  const selectedStyle = {
    opacity: 1,
    height: "4.8rem",
    width: "4.8rem",
  };

  // next few lines of code are to handle
  // what image gets loaded - ie medium, large and then the colours

  const [bottleSize, setBottleSize] = useState("medium");
  const [bottleColour, setBottleColour] = useState("black");


  //colour 1 = white
  //colour 2 = Tan
  //colour 3 = blue
  //colour 4= black
  //colour 5 = grey
  const [colourClicked1, setColour1] = useState(true);
  const [colourClicked2, setColour2] = useState(false);
  const [colourClicked3, setColour3] = useState(false);
  const [colourClicked4, setColour4] = useState(false);
  const [colourClicked5, setColour5] = useState(false);

  function handleColour1() {
    setColour1(true);
    setColour2(false);
    setColour3(false);
    setColour4(false);
    setColour5(false);
    setBottleColour("white");
  }
  function handleColour2() {
    setColour2(true);
    setColour1(false);
    setColour3(false);
    setColour4(false);
    setColour5(false);
    setBottleColour("tan");
  }
  function handleColour3() {
    setColour3(true);
    setColour1(false);
    setColour2(false);
    setColour4(false);
    setColour5(false);
    setBottleColour("blue");
  }
  function handleColour4() {
    setColour4(true);
    setColour1(false);
    setColour2(false);
    setColour3(false);
    setColour5(false);
    setBottleColour("black");
  }
  function handleColour5() {
    setColour4(false);
    setColour1(false);
    setColour2(false);
    setColour3(false);
    setColour5(true);
    setBottleColour("grey");
  }


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
              <button
                className="colour1"
                style={colourClicked1 ? selectedStyle : style}
                onClick={handleColour1}
              ></button>
              <button
                className="colour2"
                style={colourClicked2 ? selectedStyle : style}
                onClick={handleColour2}
              ></button>
              <button
                className="colour3"
                style={colourClicked3 ? selectedStyle : style}
                onClick={handleColour3}
              ></button>
              <button
                className="colour4"
                style={colourClicked4 ? selectedStyle : style}
                onClick={handleColour4}
              ></button>
              <button
                className="colour5"
                style={colourClicked5 ? selectedStyle : style}
                onClick={handleColour5}
              ></button>
            </div>
            <div className="item-description">
              <p1>{items.description}</p1>
            </div>
            <div className="quantity-price">
              <div className="total-price">
                <p1>COLOUR : {bottleColour} </p1>
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
              <div className="total-price">
                <p1>TOTAL : R{useQuant * items.srcs[bottleSize].price}</p1>
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
                  bottlecap={items.srcs[bottleSize].capacity}
                  price={items.srcs[bottleSize].price}
                  colour={bottleColour}
                  qty = {useQuant}
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
