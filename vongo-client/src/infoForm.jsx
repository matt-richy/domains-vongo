import React, { useState, useEffect } from "react";
import "./infoForm.css";
import axios from "axios";
import { useCart } from "./cartContext";
import { useNavigate } from "react-router-dom";

const ContactForm = () => {
  const { cartItems, totPrice, assignOrderNumber, appliedPromoCode } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    number: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset loading state on mount and when page becomes visible
  useEffect(() => {
    // Reset loading when component mounts
    setLoading(false);

    // Listen for visibility change (e.g., user returns from Payfast)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setLoading(false); // Reset loading when page is visible
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Empty dependency array to run only on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "number") {
      setFormData({ ...formData, [name]: formatPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getOrderNum = async (formData, price) => {
    try {
      const response = await axios.post("/api/getOrderNum", { formData, price });
      return response.data.orderNumber;
    } catch (error) {
      console.error("Error fetching order number:", error);
      throw new Error("Failed to fetch order number");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare cart data
    const cartUser = cartItems.map(({ price, colour, quantity, capacity, engraving }) => ({
      capacity,
      price,
      colour,
      quantity,
      engraving: Array.isArray(engraving) ? engraving : JSON.parse(engraving.replace(/'/g, '"') || '[]'),
    }));

    // Fetch order number
    let orderNumber;
    try {
      orderNumber = await getOrderNum(formData, totPrice);
      assignOrderNumber(orderNumber);
      localStorage.setItem("orderNumber", orderNumber);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log("Pre-redirect localStorage:", {
        orderNumber: localStorage.getItem("orderNumber"),
        cartItems: localStorage.getItem("cartItems"),
      });
    } catch (error) {
      setError("Failed to generate order number. Please try again.");
      setLoading(false);
      return;
    }

    // Prepare full order for MongoDB
    const fullOrder = { ...formData, cart: cartUser, orderNumber, totPrice, appliedPromoCode };

    // Post to MongoDB
    try {
      await axios.post("/api/addUser", fullOrder);
      console.log("Order posted successfully");
    } catch (error) {
      console.error("Error posting order:", error);
      setError("Failed to save order. Please try again.");
      setLoading(false);
      return;
    }

    // Initiate PayFast payment
    try {
      const paymentData = {
        name_first: formData.name,
        name_last: formData.surname,
        email_address: formData.email,
        amount: totPrice.toFixed(2),
        cell_number: paymentNumber(formData.number),
        order_number: orderNumber,
      };
      const response = await axios.post("/api/payfast", paymentData, { responseType: "text" });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure localStorage persists
      console.log("Redirecting to:", response.data);
      window.location.href = response.data;
    } catch (error) {
      console.error("Error initiating payment:", error);
      setError("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = ("" + value).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    return match ? [match[1], match[2], match[3]].filter(Boolean).join(" ") : value;
  };

  const paymentNumber = (number) => number.replace(/\s+/g, "");

  return (
    <div className="div-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label> <br />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-form"
          />
        </div>
        <div>
          <label htmlFor="surname">Surname:</label> <br />
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            className="input-form"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label> <br />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-form"
          />
        </div>
        <div>
          <label htmlFor="number">Phone Number:</label> <br />
          <input
            type="tel"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            className="input-form"
            maxLength={12}
            minLength={12}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label> <br />
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="input-form"
          />
        </div>
        <div>
          <label htmlFor="city">City:</label> <br />
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="input-form"
          />
        </div>
        <div>
          <label htmlFor="zipCode">Zip Code:</label> <br />
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            className="input-form"
          />
        </div>
        <div className="pay-button-div">
          <button className="pay-button" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ContactForm;