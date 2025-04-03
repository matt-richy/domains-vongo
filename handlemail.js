const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SEND_GRID);

const handlemail = async (data) => {
  try {
    // Destructure the incoming data
    const { email, name, address, cart, orderNumber } = data;

    if (!cart || cart.length === 0) {
      throw new Error("Cart is empty or invalid."); // Fails gracefully if cart data is missing
    }

    const cartItem = cart[0]; // Assuming the first item for simplicity
    const { capacity, price, colour, quantity } = cartItem;
    


    // Map image URLs based on color
    const imageUrls = {
      white: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/0d37cf67-f894-40b6-9e03-34a139bde74c/853x1280.png",
      tan: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/844c05c5-1405-4d1b-91c2-55e92d360a52/853x1280.png",
      black: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/516ba44a-fb71-4719-a9de-fda3366584cb/853x1280.png",
      grey: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/850fc5aa-2b9e-47b7-a420-6edea5dd340f/853x1280.png",
      blue: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/0ea1b17c-c272-4478-aa4f-9358885e2180/853x1280.png",
    };

    const image = imageUrls[colour] || imageUrls["blue"];

    // Log the extracted data for debugging
    console.log({ email, capacity, colour, quantity, price, image, orderNumber });


     // Map through the cart to create rows for each item
     const cartItemsHTML = cart
     .map((item) => {
       const image = imageUrls[item.colour] || imageUrls["blue"];
       return `
         <div style="display: flex; align-items: center; padding: 1rem 0; border-bottom: 1px solid #ddd;">
           <img src="${image}" alt="${item.colour}" style="width: 100px; margin-right: 1rem;" />
           <div style="font-family: Arial, sans-serif;">
             <p><strong>Size:</strong> ${item.capacity}</p>
             <p><strong>Color:</strong> ${item.colour}</p>
             <p><strong>Quantity:</strong> ${item.quantity}</p>
             <p><strong>Price:</strong> R${item.price}</p>
            
           </div>
         </div>
       `;
     })
     .join(""); // Join the array of HTML strings into one string

    // Construct the HTML email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="text-align: center; color: #333;">VONGO</h1>
        <p>Hi ${name}, your order number is ${orderNumber}</p>
        <p>Thank you for shopping at VONGO! Your support means the world to us. Here's a summary of your order:</p>
        <div style="display:flex; flex-direction: column; align-items:center"> 
        <h2 style="margin-top: 2rem; color: #333;">Order Summary</h2>
        </div>
        ${cartItemsHTML} <!-- Insert the dynamically generated cart items here -->

        <h2 style="margin-top: 2rem; color: #333;">Shipping Information</h2>
        <p><strong>Address:</strong> ${address}</p>
       
        <p style="margin-top: 2rem; text-align: center;">Thank you for your purchase! An email detailing the delivery times will follow shortly.</p>
      </div>
    `;

    // Send the email via SendGrid
    const msg = {
      to: email, // Recipient
      from: "info@vongo.co.za", // Your verified sender email
      cc: "sales@vongo.co.za",
      subject: "Vongo Receipt",
      html: html, // Email body in HTML
    };

    const response = await sgMail.send(msg); // SendGrid API call
    console.log("Email sent successfully", response);

    return response; // Return success response to the caller
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error; // Rethrow the error to be caught in the calling function
  }
};

module.exports = handlemail;