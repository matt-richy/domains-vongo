import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import debounce from "lodash.debounce";

const MediaSlider = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Intersection Observer to detect when the slider is in view
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.7,
  });

  // UseEffect to handle resize logic with debounce
  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth <= 490); // Set breakpoint for mobile
    }, 200); // Delay of 200ms

    handleResize(); // Check initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);



  // Handle Next and Previous media
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };



  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  

  const containerVariants = {
    fullWidth: {
      padding: "0px",
      borderRadius: "0px",
    },
    reducedWidth: {
      padding: isMobile ? "20px" : "80px",
      borderRadius: "20px",
    },
  };

  const mediaVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Dynamically choose media based on screen size (mobile or desktop)
  const currentMedia = isMobile
    ? media[currentIndex].mobileSrc // Use mobile-specific source
    : media[currentIndex].desktopSrc; // Use desktop-specific source

  const currentMediaType = media[currentIndex].type; // Get the media type (image or video)




  return (
    <motion.div
    ref={ref} // Ensure ref is properly set
    style={isMobile ? mobileStyles.sliderContainer : styles.sliderContainer}
    initial="fullWidth"
    animate={inView ? "reducedWidth" : "fullWidth"}
    variants={containerVariants}
    transition={{ duration: 0.8, ease: "easeInOut" }}
  >
      {/* Media container */}
      <div style={styles.mediaContainer}>
        {/* Navigation Arrows */}
        <button
          style={{ ...styles.arrowButton, left: "10px" }}
          onClick={handlePrev}
        >
          &lt;
        </button>

        <AnimatePresence custom={1}>
          <motion.div
            custom={1}
            variants={mediaVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            style={styles.motionContainer}
          >
            {/* Wrapper with border-radius and overflow */}
            <div style={styles.mediaWrapper}>
              {currentMediaType === "image" ? (
                <motion.img
                  src={currentMedia}
                  alt={"media"}
                  style={styles.media}
                />
              ) : (
                <motion.video
                  src={currentMedia}
                  controls
                  style={styles.media}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          className="button-next"
          style={{ ...styles.arrowButton, right: "10px" }}
          onClick={handleNext}
        >
          &gt;
        </button>
      </div>
    </motion.div>
  );
};

// Styling for mobile view
const mobileStyles = {
  sliderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "75vh",
    width: "100%",
    overflow: "hidden",
    position: "relative",
    boxSizing: "border-box",
    marginTop: "80px",
  },
};

// General styling
const styles = {
  sliderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "106vh",
    width: "100%",
    overflow: "hidden",
    position: "relative",
    boxSizing: "border-box",
    marginTop: "80px",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    zIndex: 10,
    padding: "10px 15px",
    borderRadius: "50%",

  },
  mediaContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  motionContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: "20px", // Ensures the border-radius is visible
    overflow: "hidden", // Clips the media to fit within the rounded corners
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  media: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
};

export default MediaSlider;