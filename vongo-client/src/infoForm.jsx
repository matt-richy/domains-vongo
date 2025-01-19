import React, { useState, useEffect, useRef } from "react";
import "./infoForm.css"
import axios from "axios";
import { useCart } from "./cartContext";



const ContactForm = () => {

  const { cartItems, totPrice } = useCart();
  const [customerOrder, setCustomerOrder] = useState([]);


  
    
  const [formData, setFormData] = useState({
    name: "",
    surname: "", 
    email: "",
    number: "",
    address: "",
    city: "",
    zipCode: "", 
  });


  const autocompleteRef = useRef(null);
const addressInputRef = useRef(null);


  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn("Google Maps API not available.");
      return;
    }
  
    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      { types: ["address"] }
    );
  
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || "";
      const city = place.address_components?.find(component =>
        component.types.includes("locality")
      )?.long_name || "";
      const zipCode = place.address_components?.find(component =>
        component.types.includes("postal_code")
      )?.long_name || "";
  
      setFormData((prevData) => ({
        ...prevData,
        address,
        city,
        zipCode,
      }));
    });
  
    autocompleteRef.current = autocomplete;
  
    return () => {
      // Cleanup to avoid memory leaks
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);


  const [htmlForm, setHtmlForm] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      setFormData({
        ...formData,
        [name]: formatPhoneNumber(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };


  const getOrderNum = async (formData, price) => {
    try {
      // Make a POST request to the backend to get the order number
      const response = await axios.post('/api/getOrderNum', {formData, price });
  
      // Assuming the response contains an object with the order number
      const orderNumber = response.data.orderNumber;
  
      // Return the order number to the caller
      return { orderNumber };
    } catch (error) {
      console.error("Error fetching order number:", error);
      throw new Error("Failed to fetch order number");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare cart data from cartItems
    const cartUser = cartItems.map(({ price, colour, quantity, capacity, engraving,  }) => {
      // If engraving is a string, parse it into an array
      let parsedEngraving = engraving;
    
      if (typeof engraving === 'string') {
        try {
          // Replace single quotes with double quotes and parse it into an array
          parsedEngraving = JSON.parse(engraving.replace(/'/g, '"'));
        } catch (error) {
          console.error("Error parsing engraving:", error);
          parsedEngraving = []; // Fallback to an empty array if parsing fails
        }
      }
    
      // Return the prepared data with the correct engraving format
      return {
        capacity,
        price,
        colour,
        quantity,
        engraving: parsedEngraving,
      };
    });
  
    // Combine form data and cart items into a single object
    const newOrder = { ...formData, cart: cartUser, };
    
  
    // Calculate total price
    let totalPrice = 0;
    newOrder.cart.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    console.log("Total Price:", totalPrice);

   
  
    // Fetch the order number before proceeding
    let orderNumber;
    try {
      const response = await getOrderNum(formData, totPrice); // Fetch order number from backend
      orderNumber = response.orderNumber;   // Adjusted to access order number correctly
      localStorage.setItem('orderNumber', orderNumber);
      console.log("Order Number:", orderNumber);
    } catch (error) {
      console.error("Error fetching order number:", error);
      return; // Exit the function if order number retrieval fails
    }
  
    // Create full order object
    const fullOrder = { ...newOrder, orderNumber }; // Combine newOrder with the orderNumber
  
    // Update the customer order state with the new order
    setCustomerOrder((prevOrders) => {
      const updatedOrders = [...prevOrders, fullOrder];
      console.log("Updated customer order:", updatedOrders);
      return updatedOrders;
    });
  
    // Send payment request to PayFast
    try {
      const response = await axios.post('/api/payfast', {
        name_first: formData.name,
        name_last: formData.surname,
        email_address: formData.email,
        amount: totPrice.toFixed(2),
        cell_number: paymentNumber(formData.number),
        order_number: orderNumber, // Use fetched order number
      });
  
      setHtmlForm(response.data); // Set the HTML form for the payment
    } catch (error) {
      console.error("Error generating payment form:", error);
    }
  
    // Post the full order (with order number) to the backend
    try {
      await axios.post("/api/addUser", fullOrder);  // Post fullOrder instead of newOrder
      console.log("Order posted successfully");
    } catch (error) {
      console.error("Error posting order:", error);
    }
  
   
  };


  //formats the phone number to have spaces 
  const formatPhoneNumber = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    
    return value;
  };

  const paymentNumber = (number) => {
    return number.replace(/\s+/g, '');
  }

  return (
    <div className="div-form">
    <form onSubmit={handleSubmit}>
      <div>
        <label  htmlFor="name">Name:</label> <br />
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
        <label htmlFor="surname">Surname:</label>  <br />
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
        <label htmlFor="email">Email:</label>  <br />
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
        <label htmlFor="number">Phone Number:</label>  <br />
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
        <label htmlFor="address">Address:</label>  <br />
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          ref={addressInputRef}
          required
          className="input-form"
        />
      </div>
      <div>
        <label htmlFor="city">City:</label>  <br />
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
        <label htmlFor="zipCode">Zip Code:</label>  <br />
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
      <button className="pay-button" type="submit">Continue to payment</button>
    

      </div>
     
    </form>
   
    {htmlForm && <div className="actual-pay" dangerouslySetInnerHTML={{ __html: htmlForm }} />}
   
  
    </div>
  );
};

export default ContactForm;
