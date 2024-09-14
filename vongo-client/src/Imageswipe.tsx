import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import medFlask from "./photos/iceflowCharc.webp";
import larFlask from "./photos/iceflowcharc2.webp";
import larFlask2 from "./photos/iceflowcharc3.webp";

interface ImageSwiperProps {
  size: string;
  colour: string;
}

const images = [
  {
    medium: {
      black: [medFlask, medFlask, medFlask],
      tan: [medFlask, larFlask, larFlask2],
      blue: [medFlask, larFlask, larFlask2],
      white: [medFlask, larFlask, larFlask2],
      grey: [medFlask, larFlask, larFlask2], 
      price: 899,
      capacity: "1.9 Liters",
    },
    large: {
      black: [medFlask, larFlask, larFlask2],
      tan: [medFlask, larFlask, larFlask2],
      blue: [medFlask, larFlask, larFlask2],
      white: [medFlask, larFlask, larFlask2],
      grey: [medFlask, larFlask, larFlask2], 
      price: 1150,
      capacity: "3.8 Liters",
    },
  },
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      y: 0,
    };
  },
  center: {
    y: 0,
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      y: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};


export const Imageswiper: React.FC<ImageSwiperProps> = (props) => {
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.

  const imageIndex = wrap(0, images[0][props.size][props.colour].length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        height: "auto",
        width: "100%",
        top: "1rem",
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
          key={page}
          src={images[0][props.size][props.colour][imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>
      <div className="next" onClick={() => paginate(1)}>
        {"‣"}
      </div>
      <div className="prev" onClick={() => paginate(-1)}>
        {"‣"}
      </div>
    </div>
  );
};
