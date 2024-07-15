import React from "react";
import "./home.css";
import image1 from "./photos/iceflow.png";
import ScrollAnimation from "react-animate-on-scroll";
import "animate.css/animate.min.css";
import { Link } from "react-router-dom";
import Footer from "./footer";

const Homepage = () => {
  return (
    <>
      <div>
         <h1 className="main-heading">NEVER GO THIRSTY AGAIN.</h1>
      <h1 className="sub-heading">  The <strong>Ultimate</strong> Insulated Flask</h1>
      </div>

      <div className="spacer"></div>
      
      <div className="about-vongo">
        <h1 className="main-text-header">Journey of Vongo</h1>
        <p className= "main-text">
          Introducing our latest innovation in hydration: the Vongo Flask.
          Crafted from <strong>premium</strong>, high-quality materials, this flask is designed
          to elevate your hydration experience to new heights. With it's
          generous capacity, you can stay hydrated with
          
         <strong> ice cold water </strong> 
          throughout the day, whether you're at the office, hitting the gym, or
          exploring the great outdoors. The <strong>double-wall insulation</strong> ensures your
          beverages stay cold or hot for extended periods, while the durable
          construction guarantees long-lasting performance. Say goodbye to
          disposable plastic bottles and embrace sustainability with our
          <strong> eco-friendly</strong> solution. Stay refreshed, stay stylish, and stay hydrated
          with Vongo.
          </p>
          <div className="shop-now-button">
            <Link to="/Purchase" className="button-shop" >
            SHOP NOW
          </Link></div>
          
      </div>
    
      <div className="body1">
        <ScrollAnimation animateIn="animate__fadeInLeft" animateOnce>
          <div className="firstImageDiv">
            <img src={image1} className="firstImage" />
          </div>
        </ScrollAnimation>

        <div className="tech-spec-div">
          <div className="tech-specs">
            <ul className="tech-spec-lists">
              <li className = "tech-specs-list">1.9l - 3.8l </li>
              <li className = "tech-specs-list">double wall insulation </li>
              <li className = "tech-specs-list"> .304 grade s/s </li>
            </ul>
            
          </div>
        </div>
      </div>
      <div className="spacer2"></div>
      


      <Footer />
      <div className="spacer"></div>
    </>
  );
};

export default Homepage;
