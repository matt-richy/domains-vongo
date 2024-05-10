import React from "react";
import menu from "./photos/hamburger.png";
import "./navbar.css";
import Sidebar from "./dropdown";
import bag from "./photos/bag.png";
import { Link } from "react-router-dom";

import { useState } from "react";

const Navbar = () => {
  const [toggleSidebar, setSideBar] = useState(false);

  const toggleNavbar = () => {
    setSideBar(!toggleSidebar);
  };

  return (
    <header>
      <div className="nav-bar">
        <button
          className={
            toggleSidebar ? "drop-down-button-pressed" : "drop-down-button"
          }
          onClick={toggleNavbar}
        >
          <img className="menu-icon" src={menu} />
        </button>

        {toggleSidebar ? <Sidebar onCloseSideBar={toggleNavbar} /> : ""}
        <Link to="/Purchase">
          {" "}
          <h1 className="vongo-heading">VONGO</h1>
        </Link>

        <Link to="/Cart">
          <img className="cart-icon" src={bag} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
