import { React, useRef } from "react";
import "./home.css";
import { motion, useInView} from "framer-motion";
import "animate.css/animate.min.css";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import headImg from "./photos/headimag.png";
import allsmallimg from "./photos/bottles/allsmallimg.png";
import testbuy from "./photos/bottles/testbuy.png";
import featurecards1 from "./photos/bottles/featurecards1.png";
import bigandsmall from "./photos/bottles/bigandsmall.png";
import bigblueft from "./photos/bottles/bigblueft.png";
import blue1 from "./photos/bottles/blue1.png";
import lgrey1 from "./photos/bottles/lgrey1.png";
import MediaSlider from "./mediaswiper";
import media1 from "./photos/bottles/media1.jpg"
import media2 from "./photos/bottles/media2.jpg"
import media1mobile from "./photos/bottles/media1mobile.jpg"
import media2mobile from "./photos/bottles/media2mobile.jpg"

const Homepage = () => {

  const media = [
    {
      id: 1,
      type: "image",
      desktopSrc: media1,
      mobileSrc: media1mobile,
      alt: "Placeholder Image 1",
    },
    {
      id: 2,
      type: "image",
      desktopSrc: media2,
      mobileSrc: media2mobile,
      alt: "Sample image 1",
    }
  ]


  const navigate = useNavigate();

  const targetRef = useRef(null);
  const inVieww = useInView(targetRef, {  amount: 1 });

  const targetRef2 = useRef(null);
  const inVieww2 = useInView(targetRef2, {  amount: 1 });

  const targetRefthree = useRef(null);
  const inVieww3 = useInView(targetRefthree, { once: true, amount: 1 });

  const handleBuyClick = (size) => {
    navigate(`/Purchase?size=${size}`);
  };

  const handleBuyClick2 = () => {
    navigate("/Purchase");
  };

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  const card2 = useRef(null);
  const inView2 = useInView(card2, { once: true, margin: "0px 0px -50px 0px" });

  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { amount: 0.7, });

  const textRef2 = useRef(null);
  const isTextInView2 = useInView(textRef2, { amount: 0.7,  });

  return (
    <>
      <div className="first-thing-div">
        <div className="main-heading-div">
          <div className="top-text-div">
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="main-heading">
                NEVER GO <span className="thirsty-font">THIRSTY </span>{" "}
              </h1>
            </motion.h1>

            <h1 className="sub-heading">
              {" "}
              The <strong>Ultimate</strong> Insulated Flask
            </h1>
          </div>
        </div>
        <div>
          <MediaSlider media={media}/>
        </div>

       
      </div>

      <div className="our-products">
        <div className="vongo-flasks-intro">
          <h1 className="vongo-flasks-intro-heading">Introducing  <span className="vongo-heading-vongo"> Vongo Flasks.  </span></h1>
          <p1 className="vongo-flasks-intro-text">
            Offering 1.9l & 3.8l 
            <strong> Insulated flasks </strong> <br />
             crafted from premium materials
          </p1>
        </div>


        <div className="products-heading-div">
          <h1 className="our-products-heading">Our Products</h1>
        </div>
       

        <div className="both-products-div">
          <div className="onepointnine-div">
            <h1 className="both-products-heading"> 1.9 Litre </h1>
            <img className="both-products-image" src={blue1} alt="Blue 1.9 Litre insulated flask from Vongo" onClick={() => handleBuyClick("medium")}/>
            <button className="buy-now-button" onClick={() => handleBuyClick("medium")}>
                Buy now
            </button>
          </div>

          <div className="threepointeight-div">
          <h1 className="both-products-heading"> 3.8 Litre </h1>
            <img className="both-products-image" src={lgrey1} alt="Grey 3.8 litre insulated flask from Vongo" onClick={() => handleBuyClick("large")}/>
            <button className="buy-now-button" onClick={() => handleBuyClick("large")}>
                Buy now
            </button>

          </div>
          
         
        
        </div>

        <div className="feature-cards-container">
          <div className="feature-cards">
            <h1 className="feature-cards-header">Insulated</h1>
            <p1 className="feature-cards-text">
              All Vongo's offer <strong>double walled, vacuum sealed </strong>
              insulation. This allows Vongo to keep drinks hot for <strong> 10 hours </strong> 
              or cold for <strong> 14 hours</strong>
            </p1>
            <img className="featureone-image" src={featurecards1}  alt="1.9 Litre insulated flask from Vongo" />
          </div>

          <div className="feature-cards">
            <h1 className="feature-cards-header">Lasts a lifetime</h1>
            <p1 className="feature-cards-text">
              Vongo's are manufactured with <strong> high quality</strong> and
              durable materials. Each Vongo is crafted from{" "}
              <strong>.304 grade</strong> stainless steel in both the inner and
              outer walls and is built to last a lifetime.
            </p1>
            <img className="featureone-image" src={testbuy} alt="1.9 Litre insulated flask from Vongo" />
          </div>
        </div>

        <div className="onenine-images">
          <h1 className="onenine-images-header">All the colours</h1>
          <img className="allsmall-class" src={allsmallimg} alt="1.9 Litre insulated flask from Vongo showing all the colours we offer" />
        </div>

        <div className="onenine-features"></div>

        <div className="threeeight-header-div">
          <h1 className="threeeight-header">The 3.8 litre</h1>
        </div>

        <div className="feature-cards-container">
          <div className="feature-cards">
            <h1 className="feature-cards-header">Even longer</h1>
            <p1 className="feature-cards-text">
              All Vongo's feature top tier insulation, and yes that means{" "}
              <strong>double walled </strong>
              and <strong>vaccuum sealed. </strong>
              This allows Vongo to keep drinks both hot or cold for hours on
              end. <br /> The 3.8 litre is ideal for campers, hikers, outdoor
              lovers and water enthusiasts.
            </p1>
            <img className="featureone-image" src={bigandsmall} alt="1.9 and 3.8 litre Vongo Flasks" />
          </div>

          <div className="feature-cards">
            <h1 className="feature-cards-header">Made to last</h1>
            <p1 className="feature-cards-text">
              Vongo's are manufactured with <strong> high quality</strong> and
              durable materials. Each Vongo is crafted from{" "}
              <strong>.304 grade</strong> stainless steel and is built to last a
              lifetime.
            </p1>
            <img className="featureone-image" src={bigblueft} alt="3.8 litre insulated flask from Vongo" />
          </div>
        </div>
      </div>

      <div className="introducing-vongo">
        <h1 className="intro-vongo-heading">STAY HYDRATED</h1>
      </div>

      <div className="all-day-long">
        <div className="all-day-long-divs">
          <h1 className="all-day-long-headings">ALL</h1>
        </div>
        <div className="all-day-long-divs2">
          <h1 className="all-day-long-headings">DAY</h1>
        </div>
        <div className="all-day-long-divs3">
          <h1 className="all-day-long-headings">LONG</h1>
        </div>
      </div>

      

      <div className="about-vongo">
        <motion.div
          ref={textRef}
          animate={{
            opacity: isTextInView ? 1 : 0.3,
            y: isTextInView ? "0" : "60px",
          }}
          transition={{ duration: 0.7 }}
          className="vongo-journey"
        >
          <h1 className="main-text-header">Our Journey</h1>
          <p className="main-text">
            Introducing the <strong> Vongo Flask:</strong> crafted from{" "}
            <strong>premium</strong> materials to elevate your hydration
            experience. With its generous capacity, enjoy{" "}
            <strong>ice cold water </strong>
            all day, whether at the office, gym, or outdoors. The{" "}
            <strong>double-wall insulation </strong>
            keeps beverages cold or hot for hours, while the durable build
            ensures long-lasting use. Ditch disposable plastic and choose our{" "}
            <strong>eco-friendly </strong> solution. Stay refreshed, stylish,
            and hydrated with Vongo.
          </p>
        </motion.div>

        <motion.div
          ref={textRef2}
          animate={{
            opacity: isTextInView2 ? 1 : 0.3,
            y: isTextInView2 ? "0" : "60px",
          }}
          transition={{ duration: 0.7 }}
          className="vongo-mission"
        >
          <h1 className="main-text-header">Our mission</h1>
          <p className="main-text">
            At Vongo, we are committed to empowering{" "}
            <strong> health-conscious </strong> individuals by providing
            <strong> premium </strong>, large-capacity flasks designed for{" "}
            <strong> durability </strong> and
            <strong> performance </strong>. Our <strong> high-quality </strong>{" "}
            flasks ensure that staying hydrated is always a{" "}
            <strong>convenient</strong> and <strong> reliable </strong>{" "}
            experience, whether at home, on the go, or in the great outdoors.
          </p>
        </motion.div>

        <div className="shop-now-button">
          <button className="buy-now-button2" onClick={handleBuyClick2}>
            {" "}
            SHOP NOW
          </button>
        </div>
      </div>

      <Footer />
      <div className="spacer"></div>
    </>
  );
};

export default Homepage;
