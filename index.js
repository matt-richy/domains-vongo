const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
//const userIdMiddleware = require("./services/uuid");
const axios = require("axios");
const cors = require("cors");
require("./models/user");
require("./models/cart");
require("./models/usercart");
require("./models/newsletter.js")
const handlemail = require("./handlemail.js");
const { generateSignature } = require('./payfast');



const app = express();
app.use(cookieParser());
//app.use(userIdMiddleware);
app.use(express.json()); // Middleware to parse JSON bodies
mongoose.connect(process.env.DB_URL);

app.use(cors());
app.use(handlemail);


app.use(express.static("vongo-client/build"));



app.post('/api/test', (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message);
  res.status(200).json({ success: true, message: 'Message received' });
});


//email logic 


app.post("/api/sendemail/receipt", handlemail);


//below code hanldes the payment using payfast API 


app.post('/api/payfast', (req, res) => {
  const paymentData = req.body;
  const myData = []

    myData["merchant_id"]=  process.env.MERCHANT_ID ;
    myData["merchant_key"]= process.env.MERCHANT_KEY;
    myData["return_url"] = process.env.RETURN_URL;
    myData["cancel_url"] = process.env.CANCEL_URL;
    myData["notify_url"] = process.env.NOTIFY_URL;

    myData["name_first"] = paymentData.name_first;
    myData["name_last"] = paymentData.name_last;
    myData["email_address"] = paymentData.email_address;
    myData["cell_number"] = paymentData.cell_number;

    myData['m_payment_id'] = "1234"; // This should be dynamically generated in a real app
    myData['amount'] = paymentData.amount;      // This should be dynamic based on the order
    myData['item_name'] = "vongo";
    
  const myPassphrase = process.env.PASSPHRASE;
  myData["signature"] = generateSignature(myData, myPassphrase);

  let htmlForm = `<form id="payfast-form" action="https://sandbox.payfast.co.za/eng/process" method="post">`;
  for (let key in myData) {
    if (myData.hasOwnProperty(key)) {
      const value = myData[key];
      if (value !== "") {
        htmlForm += `<input name="${key}" type="hidden" value="${value.trim()}" />`;
      }
    }
  }
  htmlForm += '<input type="submit" class="pay-button" value="Pay Now" /></form>';


  // Send the form back as the response
  res.send(htmlForm);
});




app.post("/api/subscribe", async(req, res) => {
  const data = req.body
  const email = data.email; 
  try {
  const newSubscriber = mongoose.model("Newsletter");
  new newSubscriber({
    email: email,
  }).save()
  console.log("Added to Mailing list ")
  return res.status(200).json({ message: 'Subscription successful' });
  }
  catch (err) {
    if (err.code === 11000) { // Duplicate email error
        return res.status(400).json({ error: 'Email is already subscribed' });
    }
    console.error('Error adding subscriber:', err);
    return res.status(500).json({ error: 'Subscription failed' });
}
  
})



app.post("/api/add", (req, res) => {
  const cartArray = req.body;
  res.status("success");
  const Cart = mongoose.model("Cart");
  new Cart({
    price: cartArray[0].price,
    colour: cartArray[0].colour,
    quantity: cartArray[0].quantity,
  }).save();
  console.log("success in saving user order")
});


//below code adds the customers information along with their cart to mongoDB, in later code this would only add once paid
const Usercart = mongoose.model("Usercart");
app.post('/api/addUser', async (req, res) => {
  try {
    const newUser = new Usercart(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});




//below code handles Route handling in React app
if (process.env.NODE_ENV === "production") {
  //express will serve production assets
  app.use(express.static("vongo-client/build"));
  //express will serve the index.html file
  // if it does not recognise the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "vongo-client", "build", "index.html"));
  });
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "vongo-client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 4000;


console.log("running on port", PORT);
app.listen(PORT);