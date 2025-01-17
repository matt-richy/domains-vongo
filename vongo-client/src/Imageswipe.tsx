import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import medFlask from "./photos/iceflowCharc.webp";
import black1 from "./photos/bottles/black1.png"
import black2 from "./photos/bottles/black2.png"
import black3 from "./photos/bottles/black3.png"
import grey1 from "./photos/bottles/grey1.png"
import grey2 from "./photos/bottles/grey2.png"
import grey3 from "./photos/bottles/grey3.png"
import white1 from "./photos/bottles/white1.png"
import white2 from "./photos/bottles/white2.png"
import tan1 from "./photos/bottles/tan1.png"
import tan2 from "./photos/bottles/tan2.png"
import tan3 from "./photos/bottles/tan3.png"
import blue1 from "./photos/bottles/blue1.png"
import blue2 from "./photos/bottles/blue2.png"
import blue3 from "./photos/bottles/blue3.png"
import lid1 from "./photos/bottles/lid1.png"
import lid2 from "./photos/bottles/lid2.png"
import lblack1 from "./photos/bottles/lblack1.png"
import lblack2 from "./photos/bottles/lblack2.png"
import lblue1 from "./photos/bottles/lblue1.png"
import lblue2 from "./photos/bottles/lblue2.png"
import lgrey1 from "./photos/bottles/lgrey1.png"
import lgrey2 from "./photos/bottles/lgrey2.png"


interface ImageSwiperProps {
  size: string;
  colour: string;
}

const images = [
  {
    medium: {
      black: [black1, black2, black3, lid1, lid2],
      tan: [tan1, tan2, tan3 , lid1, lid2],
      blue: [blue1, blue2, blue3 , lid1, lid2],
      white: [white1, white2, lid1, lid2],
      grey: [grey1, grey2, grey3, lid1, lid2, ],  
      price: 899,
      capacity: "1.9 Liters",
    },
    large: {
      black: [lblack1,lblack2, lid1, lid2 ],
      tan: [],
      blue: [lblue1, lblue2, lid1, lid2],
      white: [],
      grey: [ lgrey1, lgrey2 , lid1, lid2], 
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
            height: "400px",
            width: "auto",
            
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
