import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
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
import ScrollToTop from "./ScrollToTop";



export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <div>
          <Navbar />
        </div>
        <Routes>
       
          <Route exact path="Purchase" element={<Buy />} />
          <Route exact path="/" element={<Homepage />} />
          <Route path="Cart" element={<Cart />} />
          <Route path="return_url" element={< ReturnPage />} />
        <Route path="cancel_url" element={< CancelPage />} />
        <Route path="notify_url" element={< NotifyPage />} />
        
        </Routes>
      </CartProvider>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);