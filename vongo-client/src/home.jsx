import {React, useRef, useEffect }from "react";
import "./home.css";
import image1 from "./photos/iceflow.png";
import { motion, useInView, useScroll } from "framer-motion"
import "animate.css/animate.min.css";
import { Link } from "react-router-dom";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import medFlask from "./photos/iceflowCharc.webp";


const Homepage = () => {
  const navigate = useNavigate();

  const handleBuyClick = (size) => {
    navigate(`/Purchase?size=${size}`);
  };


  const ref = useRef(null);
  const isInView = useInView (ref, {amount: "some", once:true })

  const textRef = useRef(null);
  const isTextInView = useInView (textRef, {amount: 0.7, once:true })

  const textRef2 = useRef(null);
  const isTextInView2 = useInView (textRef2, {amount: 0.7, once:true })

 


  return (
    <>

    <div className="first-thing-div"> 
       <div className="main-heading-div">
          <div>
          <motion.h1 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }} >      
              <h1 className="main-heading">NEVER GO <span className="thirsty-font" >THIRSTY  </span> AGAIN.</h1>  
            </motion.h1>
      
            <h1 className="sub-heading">  The <strong>Ultimate</strong> Insulated Flask</h1> 
            </div>
           <motion.div 
           initial={{y:-400}}
           animate={{y:0}}
           transition={{duration: 1}}
           className="heading-image-div" >  
            <img className="heading-image" src={medFlask} />
            </motion.div> 

          </div>
    
    </div>
     
      
      
      <div className="info-cards">
        <div 
          ref={ref}
        className="grid-info-cards">

          
          <motion.div 
          animate={{x: isInView ? "0px" : "-800px"}}
          className="card1"  >
            <div className="info-card-image">
              <img className="grid-info-image" src={medFlask}  />
            </div>
            <div className="info-card-header"> 
              <p1 className="info-card-header-text">1.9 liters</p1>
            </div>
            <div className="info-card-text">
              <p className="info-card-stats">Double wall Insulated Flask <br/>  <br/> Medical grade steel <br/> <br/> Keeps hot or cold ~ 12 hours </p>
            </div>
            <div className="info-card-button">
            <button className="buy-now-button" onClick={() => handleBuyClick("medium")}>
                Buy now
                </button>
            </div>
          </motion.div>

         
          <motion.div 
            animate={{x: isInView ? "0px" : "800px"}}
            className="card2">
          <div className="info-card-image">
          <img className="grid-info-image" src={medFlask}  />
          </div>
            <div className="info-card-header"> 
            <p1 className="info-card-header-text">3.8 liters</p1>
            </div>
            <div className="info-card-text"> 
            <p className="info-card-stats">Double wall Insulated Flask <br/>  <br/>  Medical grade steel <br/> <br/> Keeps hot or cold ~ 12 hours</p>
            </div>
            <div className="info-card-button">
              <button className="buy-now-button" onClick={() => handleBuyClick("large")}>
                  Buy now
                </button>
            </div>
          </motion.div>
        </div>
      </div>
     
      
      <div className="about-vongo">
        <motion.div 
          ref={textRef}
          animate={{opacity: isTextInView ? 1: 0 , y: isTextInView ? "0": "30px"  }}
          transition={{duration: 0.7}}
       
        className="vongo-journey">
        <h1 
         
        className="main-text-header">Our Journey</h1>
        <p 
      
        
        className= "main-text">
        Introducing the <strong> Vongo Flask:</strong> crafted from <strong>premium</strong> materials to elevate
         your hydration experience. With its generous capacity, enjoy <strong>ice cold water </strong> 
         all day, whether at the office, gym, or outdoors. The <strong>double-wall insulation </strong> 
         keeps beverages cold or hot for hours, while the durable build ensures long-lasting use. Ditch 
         disposable plastic and choose our <strong>eco-friendly </strong> solution. Stay refreshed, stylish,
          and hydrated with Vongo.
          </p>
          
          
          </motion.div>

          <motion.div 
          ref={textRef2}
          animate={{opacity: isTextInView2 ? 1: 0,  y: isTextInView2 ? "0": "30px"  }}
          transition={{duration: 0.7}}
          className="vongo-mission">
          <h1 className="main-text-header">Our mission</h1>
          <p className= "main-text"> 
          At Vongo, we are committed to empowering <strong> health-conscious </strong> individuals by providing
           <strong> premium </strong>, large-capacity flasks designed for <strong> durability </strong> and
            <strong> performance </strong>. Our <strong> high-quality </strong> flasks ensure that staying hydrated 
            is always a <strong>convenient</strong> and <strong> reliable </strong> experience, whether at home, 
            on the go, or in the great outdoors.
          </p>
          
          </motion.div>

          <div className="shop-now-button">
            <Link to="/Purchase" className="button-shop" >
            SHOP NOW
          </Link>
          </div>
      </div>
    
     
   
      


      <Footer />
      <div className="spacer"></div>
    </>
  );
};

export default Homepage;
