import React, { useState, useEffect, useRef } from "react";
import "./infoForm.css"
import axios from "axios";
import { useCart } from "./cartContext";



const ContactForm = () => {

  const { cartItems } = useCart();
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
    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      { types: ["address"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address;
      const city = place.address_components.find(component =>
        component.types.includes("locality")
      )?.long_name;
      const zipCode = place.address_components.find(component =>
        component.types.includes("postal_code")
      )?.long_name;

      setFormData((prevData) => ({
        ...prevData,
        address: address || "",
        city: city || "",
        zipCode: zipCode || ""
      }));
    });

    autocompleteRef.current = autocomplete;
  }, []);

  const [htmlForm, setHtmlForm] = useState('');

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    

    // Ensure formData and cartItems are defined and in scope
    // Assuming formData and cartItems are obtained from component state or props

    const cartUser = cartItems.map(({ price, colour, quantity, capacity }) => ({
        capacity,
        price,
        colour,
        quantity,
    }));

    // Combine form data and cart items into a single object
    const newOrder = { ...formData, cart: cartUser };

    let totalPrice = 0;

// Loop through each item in the 'cart' array and add up the prices
for (let i = 0; i < newOrder.cart.length; i++) {
    totalPrice += newOrder.cart[i].price;
}
    console.log("TEST", totalPrice);

   
let payfastData = {
  name_first: formData.name ,
  name_last: formData.surname ,
  amount: totalPrice.toFixed(2),
  email_address: formData.email,
  cell_number: '0716138265',
  item_name: "vongo",
}


    // Add the new order to the customerOrder array
    setCustomerOrder((prevOrders) => {
        const updatedOrders = [...prevOrders, newOrder];
        console.log("this is your updated customer order", updatedOrders);
        return updatedOrders;
    });


    console.log("this is your order", customerOrder);
    console.log("this is your cart", cartUser);
    console.log("this is your full order", newOrder);

    console.log("payfast", payfastData);
    try {
      const response = await axios.post('/api/payfast', {
        name_first: formData.name,
        name_last: formData.surname,
        email_address: formData.email,
        amount: totalPrice.toFixed(2)
        // Add any other buyer details here if needed
      });

      setHtmlForm(response.data);
    } catch (error) {
      console.error("Error generating payment form:", error);
    }

    

    // Post newOrder to the backend
    axios
        .post("/api/addUser", newOrder)
        .then((response) => {
            console.log("Order posted successfully", response.data);
        })
        .catch((error) => {
            console.error("Error posting order", error);
        });

    // Send email
    /*
    axios
        .post("/api/sendemail/receipt", newOrder)
        .then((response) => {
            console.log("Email sent successfully", response.data);
        })
        .catch((error) => {
            console.error("Error sending email", error);
        });
        */
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
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
        <label htmlFor="surname">Surname:</label>
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
        <label htmlFor="email">Email:</label>
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
        <label htmlFor="number">Phone Number:</label>
        <input
          type="tel"
          id="number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
          className="input-form"
        />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
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
        <label htmlFor="city">City:</label>
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
        <label htmlFor="zipCode">Zip Code:</label>
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
      <button className="pay-button" type="submit">Continue to payment</button>
      {htmlForm && <div dangerouslySetInnerHTML={{ __html: htmlForm }} />}
    </form>
  );
};

export default ContactForm;
