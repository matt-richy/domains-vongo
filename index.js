const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieParser = require("cookie-parser");

//const userIdMiddleware = require("./services/uuid");
const axios = require("axios");
const cors = require("cors");
require("./models/user");
require("./models/cart");
require("./models/usercart");
const handlemail = require("./handlemail.js");



const app = express();
app.use(cookieParser());
//app.use(userIdMiddleware);
app.use(express.json()); // Middleware to parse JSON bodies
mongoose.connect(process.env.DB_URL);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: 'GET, POST',
    allowedHeaders: 'Content-Type,Authorization'
  })
);

app.get("/", (req, res) => {
  const userId = req.userId;
  res.send({ userId });
});



app.post("/api/test", (req, res) => {
  const data = req.body;
  console.log(data);
  res.status("success");
});


//email logic 
app.post("/api/sendemail/receipt", handlemail);


//handles the redirect to payment screen.
app.post('/api/payment', async (req, res) => {
  try {
    // Replace 'YOUR_SECRET_KEY' with your actual Yoco secret key
    const secretKey = process.env.YOCO_KEY;

    // Construct the request body with the required parameters
    const requestBody = req.body;

    // Make the POST request to create a checkout
    const response = await axios.post('https://payments.yoco.com/api/checkouts', requestBody, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Idempotency-Key': 'unique-idempotency-key' // Optional, used for idempotency
      }
    });

    // Return the checkout data to the frontend
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error creating checkout:', error.response.data);
    // Return an error response to the frontend
    res.status(500).json({ success: false, error: 'Failed to create checkout' });
  }
});

//verifies the payment made 




app.post("/api/add", (req, res) => {
  const cartArray = req.body;
  res.status("success");
  const Cart = mongoose.model("Cart");
  new Cart({
    price: cartArray[0].price,
    colour: cartArray[0].colour,
    quantity: cartArray[0].quantity,
  }).save();
});
app.post("/api/addUser", (req, res) => {
  const data = req.body;
  const Usercart = mongoose.model("Usercart");

  console.log(data.cartUser);
  new Usercart({
    name: data.name,
    email: data.email,
    number: data.number,
    address: data.address,
    city: data.city,
    zip: data.zip,
    userCart: data.cartUser,
  }).save();
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
}

const PORT = process.env.PORT || 4000;


console.log(PORT);
app.listen(PORT);