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
const { generatePayFastRedirectUrl, verifySignature } = require('./payfast');



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


app.post("/api/payfast", (req, res) => {
  const { name, surname, amount, email, item } = req.body;
 

  try {
    const redirectUrl = generatePayFastRedirectUrl({ amount, name, email });
    res.json({ redirectUrl });
  } catch (error) {
    console.error('Error generating PayFast redirect URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/notify', (req, res) => {
  const data = req.body;

  try {
    if (verifySignature(data, payfast.passphrase)) {
      // Update order status in your database
      res.sendStatus(200);
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying PayFast signature:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

//below code sends an email



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