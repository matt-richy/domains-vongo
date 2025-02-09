import { React, useRef } from "react";
import "./home.css";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet";
import "animate.css/animate.min.css";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import allsmallimg from "./photos/bottles/allsmallimg.png";
import testbuy from "./photos/bottles/testbuy.png";
import featurecards1 from "./photos/bottles/featurecards1.png";
import bigandsmall from "./photos/bottles/bigandsmall.png";
import bigblueft from "./photos/bottles/bigblueft.png";
import blue1 from "./photos/bottles/blue1.png";
import lgrey1 from "./photos/bottles/lgrey1.png";
import MediaSlider from "./mediaswiper";
import media1 from "./photos/bottles/media1.jpg";
import media2 from "./photos/bottles/media2.jpg";
import media1mobile from "./photos/bottles/media1mobile.jpg";
import media2mobile from "./photos/bottles/media2mobile.jpg";

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
    },
  ];

  const navigate = useNavigate();

  const handleBuyClick = (size) => {
    navigate(`/Purchase?size=${size}`);
  };

  const handleBuyClick2 = () => {
    navigate("/Purchase");
  };

  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { amount: 0.7 });

  const textRef2 = useRef(null);
  const isTextInView2 = useInView(textRef2, { amount: 0.7 });

  return (
    <>
    <Helmet>
        <link rel="preload" href={media1} as="image" />
        <link rel="preload" href={media2} as="image" />
        <link rel="preload" href={media1mobile} as="image" />
        <link rel="preload" href={media2mobile} as="image" />
      </Helmet>
      <div className="first-thing-div">
        <div className="main-heading-div">
          <div className="top-text-div">
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="main-heading"
            >
              
                NEVER GO <span className="thirsty-font">THIRSTY </span>{" "}
              
            </motion.h1>

            <h1 className="sub-heading">
              {" "}
              The <strong>Ultimate</strong> Insulated Flask
            </h1>
          </div>
        </div>
        <div>
          <MediaSlider media={media} />
        </div>
      </div>

      <div className="our-products">
        <div className="vongo-flasks-intro">
          <h1 className="vongo-flasks-intro-heading">
            Introducing{" "}
            <span className="vongo-heading-vongo"> Vongo Flasks. </span>
          </h1>
          <p className="vongo-flasks-intro-text">
            Offering 1.9l & 3.8l
            <strong> Insulated flasks </strong> <br />
            crafted from premium materials
          </p>
        </div>

        <div className="products-heading-div">
          <h1 className="our-products-heading">Our Products</h1>
        </div>

        <div className="both-products-div">
          <div className="onepointnine-div">
            <h1 className="both-products-heading"> 1.9 Litre </h1>
            <img
              className="both-products-image"
              src={blue1}
              alt="Blue 1.9 Litre insulated flask from Vongo"
              onClick={() => handleBuyClick("medium")}
            />
            <button
              className="buy-now-button"
              onClick={() => handleBuyClick("medium")}
            >
              Buy now
            </button>
          </div>

          <div className="threepointeight-div">
            <h1 className="both-products-heading"> 3.8 Litre </h1>
            <img
              className="both-products-image"
              src={lgrey1}
              alt="Grey 3.8 litre insulated flask from Vongo"
              onClick={() => handleBuyClick("large")}
            />
            <button
              className="buy-now-button"
              onClick={() => handleBuyClick("large")}
            >
              Buy now
            </button>
          </div>
        </div>

        <div className="feature-cards-container">
          <div className="feature-cards">
            <h1 className="feature-cards-header">Insulated</h1>
            <p className="feature-cards-text">
              All Vongo's offer <strong>double walled, vacuum sealed </strong>
              insulation. This allows Vongo to keep drinks hot for{" "}
              <strong> 10 hours </strong>
              or cold for <strong> 14 hours</strong>
            </p>
            <img
              className="featureone-image"
              src={featurecards1}
              alt="1.9 Litre insulated flask from Vongo"
            />
          </div>

          <div className="feature-cards">
            <h1 className="feature-cards-header">Lasts a lifetime</h1>
            <p className="feature-cards-text">
              Vongo's are manufactured with <strong> high quality</strong> and
              durable materials. Each Vongo is crafted from{" "}
              <strong>.304 grade</strong> stainless steel in both the inner and
              outer walls and is built to last a lifetime.
            </p>
            <img
              className="featureone-image"
              src={testbuy}
              alt="1.9 Litre insulated flask from Vongo"
            />
          </div>
        </div>

        <div className="onenine-images">
          <h1 className="onenine-images-header">All the colours</h1>
          <img
            className="allsmall-class"
            src={allsmallimg}
            alt="1.9 Litre insulated flask from Vongo showing all the colours we offer"
          />
        </div>

        <div className="onenine-features"></div>

        <div className="threeeight-header-div">
          <h1 className="threeeight-header">The 3.8 litre</h1>
        </div>

        <div className="feature-cards-container">
          <div className="feature-cards">
            <h1 className="feature-cards-header">For the campers</h1>
            <p className="feature-cards-text">
              Vongo’s 3.8L flask is the perfect companion for{" "}
              <strong>outdoor enthusiasts </strong> and campers. With its
              durable, <strong> double-wall insulation</strong> , it keeps
              drinks hot or cold for hours, ensuring you stay refreshed on your
              adventures. Its large capacity is ideal for long trips, while the{" "}
              <strong>rugged design </strong> ensures it stands up to the
              toughest conditions. Stay hydrated, no matter where your journey
              takes you
            </p>
            <img
              className="featureone-image"
              src={bigandsmall}
              alt="1.9 and 3.8 litre Vongo Flasks"
            />
          </div>

          <div className="feature-cards">
            <h1 className="feature-cards-header">Made to last</h1>
            <p className="feature-cards-text">
              Vongo's are manufactured with <strong> high quality</strong> and
              durable materials. Every Vongo is crafted from high quality
              <strong>.304 grade</strong> stainless steel in both the inner and
              outer walls and is built to last a lifetime.
            </p>
            <img
              className="featureone-image"
              src={bigblueft}
              alt="3.8 litre insulated flask from Vongo"
            />
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
