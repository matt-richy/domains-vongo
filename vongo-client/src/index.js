import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Buy from "./buy";
import Navbar from "./navbar";
import Homepage from "./home";
import Cart from "./cart";
import { CartProvider } from "./cartContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <CartProvider>
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route exact path="Purchase" element={<Buy />} />
          <Route exact path="/" element={<Homepage />} />
          <Route path="Cart" element={<Cart />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));