const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
require('dotenv').config();


sgMail.setApiKey(process.env.SEND_GRID);


router.post('/api/sendemail/receipt', (req, res) => {
    const data = req.body;
    const email= data.email;
    console.log("this is from req", data);
    const cartArray = data.cart;
    console.log("cart array", cartArray);
    const capacity= cartArray[0].capacity;
    const colour=cartArray[0].colour;
    const qty= cartArray[0].quantity;
    const price = cartArray[0].price;
    const html = `
    <div >
    <div class="header"> 
    <h1 style="display: flex; justify-content:center; padding-top:1.5rem;padding-bottom:2rem; font-size: 30px; ">VONGO </h1>
    </div>
    <div style="padding: 1rem">
    <p1 style="font-family:sans-serif; "> ${data.name} thanks for shopping at Vongo and supporting local! Your support means the world to us.</p1>

    </div>
    
     
    <h2 style="padding-top:2rem; display: flex; justify-content: center; font-family:sans-serif">Order Summary </h2>
    
    
    <div class="order summary" style="display: grid; grid-template-columns:1fr 3fr; padding: 1rem; gap: 1.5rem">
        <div>
        <img src="http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/335ff3c4-7e03-43c5-a7c5-ba155602d026/727x1515.png" style="width: 90px;padding-top:2rem; padding-bottom:5rem" />
        </div>
        <div style="padding-top: 4rem; font-family:sans-serif; display:block;">
        <p1 style= "display: block; padding-bottom:1rem" > Size: ${capacity}</p1>
        <p1 style= "display: block;padding-bottom:1rem"> Colour: ${colour} </p1>
        <p1 style= "display: block;padding-bottom:1rem"> Qty: ${qty} </p1>
        <p1 style= "display: block"> Price: R${price}</p1>
        </div>
    </div>
    
    <div class="shipping-info" >
        <h1 style="padding-bottom: 2rem;">Shipping Information </h1>
        <p1 style= "display: block;padding-bottom:1rem" >Address: ${data.address} </p1>
       
    </div>
    </div>
    `;
    
    const msg = {
        to: email, // Change to your recipient
        from: "info@vongo.co.za", // Change to your verified sender
        subject: "Vongo Receipt",
        html: html,
      };

      sgMail.send(msg)
      .then(() => console.log(res.status(200), "Email Sent"))
      .catch((error) => console.log(res.status(500)), "Email failed");
}) 

module.exports = router;