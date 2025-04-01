import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./dropdown.css";
import bag from "./photos/bag.png";

const Sidebar = ({ onCloseSideBar }) => {
  const sidebarRef = useRef(null);



  const handleLinkClick = () => {
    onCloseSideBar();
  };

  const sidebarVariants = {
    hidden: {  opacity: 0, transition: { duration: 0.3 } }, // Added transition for exit
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="sidebar"
      ref={sidebarRef}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={sidebarVariants}
    >
      <ul className="sidebars">
        <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
        <li><Link to="/Purchase" onClick={handleLinkClick}>Buy</Link></li>
        <li><Link to="/Cart" onClick={handleLinkClick}><img className="cart-icon" src={bag} alt="Cart" /></Link></li>
        <li><Link to="/returnPolicy" onClick={handleLinkClick}>Returns</Link></li>
      </ul>
    </motion.div>
  );
};

export default Sidebar;