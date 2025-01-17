// Sidebar.js
import { React, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./dropdown.css";
import bag from "./photos/bag.png";


//passes onCloseSideBar to the parent component when one of the links is pressed and then it hides the sidebar
const Sidebar = ({ onCloseSideBar }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onCloseSideBar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCloseSideBar]);
  const handleLinkClick = () => {
    onCloseSideBar();
  };
  return (
    <div className="sidebar" ref={sidebarRef}>
      <ul
        className="sidebars"
     
      >
        <li>
          <Link to="/" onClick={handleLinkClick}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/Purchase" onClick={handleLinkClick}>
            Buy
          </Link>
        </li>
        <li>
          <Link to="/Cart" onClick={handleLinkClick}>
            <img className="cart-icon" src={bag} />
          </Link>
          </li>
          <li><Link to="return_url" onClick={handleLinkClick}> 
            Return
          </Link>  </li>
          <li> 
            <Link to="cancel_url" onClick={handleLinkClick}>
              Cancel
            </Link>

          </li>

        
      </ul>
    </div>
  );
};

export default Sidebar;
