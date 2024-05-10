import "./emptycart.css";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Emptycart = () => {
  return (
    <div className="empty-cart">
      <h3>Forgot something?... </h3>

      <Link to="/Purchase">Buy me!</Link>
    </div>
  );
};

export default Emptycart;
