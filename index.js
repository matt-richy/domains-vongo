const express = require("express");
const path = require('path'); // Import path module
const fs = require('fs'); // Import fs module (optional, for clarity)
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dns = require('dns');
//const userIdMiddleware = require("./services/uuid");
const axios = require("axios");
const cors = require("cors");
require("./models/user");
require("./models/cart");
require("./models/usercart");
require("./models/newsletter.js")
const Order = require("./models/ordernumSchema")
const handlemail = require("./handlemail.js");
const { generateSignature } = require('./payfast');
const crypto = require('crypto');
const { findOne } = require("./models/usercart");
const bodyParser = require('body-parser');
const FullCart = require("./models/usercart")
require('dotenv').config();
const Counter = require("./models/counter");




const app = express();
app.use(cookieParser());
//app.use(userIdMiddleware);
app.use(express.json()); // Middleware to parse JSON bodies
mongoose.connect(process.env.DB_URL);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());



app.use(express.static("vongo-client/build"));



app.post('/api/test', (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message);
  res.status(200).json({ success: true, message: 'Message received' });
});


//email logic 


app.post("/api/sendemail/receipt", handlemail);


//below code hanldes the payment using payfast API 




const Ordernum = mongoose.model("orderNum");

app.post("/api/getOrderNum", async (req, res) => {
  const { formData, price } = req.body;

  try {
    // Atomically increment the order number using Counter
    const counter = await Counter.findOneAndUpdate(
      { _id: "orderCounter" }, // Ensure the counter ID matches what you created in MongoDB
      { $inc: { sequence_value: 1 } }, // Safely increment the counter
      { new: true, upsert: true } // Create if not exists
    );

    const newOrderNumber = counter.sequence_value.toString(); // Convert number to string

    // Save the new order
    const newOrder = new Ordernum({
      orderNumber: newOrderNumber, // Ensure it's stored as a string
      name_first: formData.name,
      name_last: formData.surname,
      email_address: formData.email,
      amount: price
    });

    await newOrder.save();
    res.status(200).json({ orderNumber: newOrderNumber });

  } catch (error) {
    console.error("Error generating order number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post('/api/payfast', async (req, res) => {
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

    myData['m_payment_id'] = paymentData.order_number; // This should be dynamically generated in a real app
    myData['amount'] = paymentData.amount;      // This should be dynamic based on the order
    myData['item_name'] = "vongo";
    
  const myPassphrase = process.env.PASSPHRASE;
  myData["signature"] = generateSignature(myData, myPassphrase);

  const queryString = Object.entries(myData)
  .map(([key, value]) => `${key}=${encodeURIComponent(value.trim())}`)
  .join('&');
const payfastUrl = `https://www.payfast.co.za/eng/process?${queryString}`;

res.send(payfastUrl); // Return URL instead of HTML
});


// ITN notify_url endpoint
// PayFast IP validation helper
const ipLookup = async (domain) => {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, { all: true }, (err, addresses) => {
      if (err) reject(err);
      resolve(addresses.map((addr) => addr.address));
    });
  });
};

const pfValidIP = async (req) => {
  const validHosts = [
    'sandbox.payfast.co.za',
    'www.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za',
  ];
  const pfIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const ipPromises = validHosts.map(ipLookup); // Parallelize DNS lookups
    const allIps = (await Promise.all(ipPromises)).flat();
    const uniqueIps = [...new Set(allIps)];
    return uniqueIps.includes(pfIp);
  } catch (err) {
    console.error("IP validation failed:", err);
    return false;
  }
};

const pfValidSignature = (pfData, pfParamString, passPhrase) => {
  if (passPhrase) {
    pfParamString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
  }
  const signature = crypto.createHash('md5').update(pfParamString).digest('hex');
  return pfData['signature'] === signature;
};

const pfValidPaymentData = (cartTotal, pfData) => {
  return Math.abs(parseFloat(cartTotal) - parseFloat(pfData['amount_gross'])) <= 0.01;
};

const pfValidServerConfirmation = async (pfHost, pfParamString) => {
  try {
    const response = await axios.post(`https://${pfHost}/eng/query/validate`, pfParamString);
    return response.data === 'VALID';
  } catch (error) {
    console.error("Server confirmation failed:", error.message);
    return false;
  }
};

// Main Route
app.post('/payfast-notify', async (req, res) => {
  const testingMode = false;
  const pfHost = testingMode ? "sandbox.payfast.co.za" : "www.payfast.co.za";
  const pfData = req.body;

  console.log("Incoming PayFast Data:", pfData);

  // Step 1: Create pfParamString
  let pfParamString = "";
  for (let key in pfData) {
    if (key !== "signature") {
      pfParamString += `${key}=${encodeURIComponent(pfData[key].trim()).replace(/%20/g, "+")}&`;
    }
  }
  pfParamString = pfParamString.slice(0, -1); // Remove last '&'

  try {
    const pforderNumber = Number(pfData['m_payment_id']);
    const cartTotal = await Order.findOne({ orderNumber: pforderNumber }).then(order => order?.amount);

    if (!cartTotal) {
      return res.status(400).json({ error: "Order not found" });
    }

    const passPhrase = process.env.PASSPHRASE;

    // Step 2: Perform validations
    const checks = await Promise.all([
      pfValidSignature(pfData, pfParamString, passPhrase),
      pfValidIP(req),
      pfValidPaymentData(cartTotal, pfData),
      pfValidServerConfirmation(pfHost, pfParamString)
    ]);

    if (checks.every(Boolean)) {
      // Step 3: Update order and send email
      const updatedDocument = await FullCart.findOneAndUpdate(
        { orderNumber: pforderNumber },
        { $set: { paymentSuccessful: true } },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      console.log("Document updated successfully:", updatedDocument);

      try {
        await handlemail(updatedDocument);
        return res.status(200).json({ message: "Payment successful and email sent!" });
      } catch (emailError) {
        console.error("Error sending email:", emailError.message);
        return res.status(500).json({ message: "Payment successful, but email failed to send." });
      }
    } else {
      console.warn("Validation checks failed:", checks);
      return res.status(400).json({ error: "Payment validation failed" });
    }
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return res.status(500).json({ error: "Internal server error" });
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


app.get('/return_url', (req, res) => {
  const paymentStatus = req.query;
  console.log('Payment Status:', paymentStatus);

  const filePath = path.resolve(__dirname, 'vongo-client', 'build', 'index.html');
  console.log('Resolved filePath:', filePath); // Add this
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return res.status(500).json({ error: 'Internal server error: HTML file not found' });
  }

  res.sendFile(filePath);
});


app.get('/cancel_url', (req, res) => {
  // You can capture payment status from the query parameters
  const paymentStatus = req.query; // Capture any query parameters PayFast sends

  // You can log this for debugging
  console.log('Payment Status:', paymentStatus);

  const path = require("path");
  
  
    res.sendFile(path.resolve(__dirname, "vongo-client", "build", "index.html"));
 
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