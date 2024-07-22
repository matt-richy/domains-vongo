import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Buy from "./buy";
import Navbar from "./navbar";
import Homepage from "./home";
import Cart from "./cart";
import { CartProvider } from "./cartContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReturnPage from './ReturnPage';
import CancelPage from './CancelPage';
import NotifyPage from './NotifyPage';

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
          <Route path="/return_url" component={ReturnPage} />
        <Route path="/cancel_url" component={CancelPage} />
        <Route path="/notify_url" component={NotifyPage} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));