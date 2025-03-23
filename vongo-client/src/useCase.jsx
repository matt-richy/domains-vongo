import React from "react";
import "./useCase.css"; 
import wildimage from "./photos/bottles/buildforwild.jpeg";
import { useNavigate } from "react-router-dom";

const CampingSection = () => {

  const navigate = useNavigate();

  const handleBuyClick = () => {
    navigate("/Purchase");
  };


  return (
    <section className="camping-section">
      <div className="camping-content">
        <h2>STAY HOT, STAY COLD <br /> ALL DAY LONG.</h2>
        <p>
          Whether you’re pitching a tent by the lake or hiking deep into the woods, our 1.9-liter double-wall insulated flask keeps your water ice-cold or piping hot for hours. With rugged durability and a capacity to match your thirst, it’s the perfect companion for every campfire night and sunrise trek.
        </p>
        <ul className="camping-features">
          <li>1.9L capacity – hydration that lasts all day</li>
          <li>Double-wall insulation – cold for 24+ hours, hot for 12+</li>
          <li>Tough, premium materials – built to handle the outdoors</li>
        </ul>
        <div className="button-div">
        <button className="buy-now-button"  onClick={handleBuyClick} >Shop Now</button>    
         </div>
      
      </div>
      <div className="camping-image">
        <img src={wildimage} alt="image of a vongo 1.9liter in the wild" />
      </div>
    </section>
  );
};

export default CampingSection;