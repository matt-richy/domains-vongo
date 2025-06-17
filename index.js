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
const Review = require("./models/reviews.js")
const PromoCode = require('./models/promoCode.js');
const { sendEmail } = require('./promoemail.js');




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

function generateRandomCode(length = 7) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

app.post("/api/getOrderNum", async (req, res) => {
  const { formData, price } = req.body;

  try {
    // Generate a random alphanumeric order number
    const newOrderNumber = generateRandomCode(); // e.g., "X7K9P2M"

    // Save the new order
    const newOrder = new Ordernum({
      orderNumber: newOrderNumber,
      name_first: formData.name,
      name_last: formData.surname,
      email_address: formData.email,
      amount: price,
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
    myData["return_url"] = myData["return_url"] = `${process.env.RETURN_URL}?orderNumber=${encodeURIComponent(paymentData.order_number)}`;
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

  //https://sandbox.payfast.co.za/eng/process
  //https://www.payfast.co.za/eng/process

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

  console.log("Validating IP. Incoming IP:", pfIp);

  try {
    const ipPromises = validHosts.map(ipLookup); // Parallelize DNS lookups
    const allIps = (await Promise.all(ipPromises)).flat();
    const uniqueIps = [...new Set(allIps)];
    console.log("Valid PayFast IPs:", uniqueIps);
    const isValid = uniqueIps.includes(pfIp);
    console.log("IP Validation Result:", isValid);
    return isValid;
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
  const isValid = pfData['signature'] === signature;
  console.log("Signature Validation Result:", isValid);
  return isValid;
};

const pfValidPaymentData = (cartTotal, pfData) => {
  const difference = Math.abs(parseFloat(cartTotal) - parseFloat(pfData['amount_gross']));
  const isValid = difference <= 0.01;
  console.log("Payment Data Validation Result:", isValid, "Difference:", difference);
  return isValid;
};

const pfValidServerConfirmation = async (pfHost, pfParamString) => {
  console.log("Validating server confirmation with host:", pfHost);
  try {
    const response = await axios.post(`https://${pfHost}/eng/query/validate`, pfParamString);
    const isValid = response.data === 'VALID';
    console.log("Server Confirmation Result:", isValid, "Response Data:", response.data);
    return isValid;
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

  let pfParamString = "";
  for (let key in pfData) {
    if (key !== "signature") {
      pfParamString += `${key}=${encodeURIComponent(pfData[key].trim()).replace(/%20/g, "+")}&`;
    }
  }
  pfParamString = pfParamString.slice(0, -1); // Remove last '&'

 try {
  const pforderNumber = pfData['m_payment_id']; // Keep this as a string
  console.log("Order Number (from PayFast):", pforderNumber);

  const order = await Order.findOne({ orderNumber: pforderNumber });
  if (!order) {
    console.warn("Order not found for order number:", pforderNumber);
    return res.status(400).json({ error: "Order not found" });
  }
  const cartTotal = order.amount; // Assuming `totPrice` is the total price field in your DB
  console.log("Cart Total for Order:", cartTotal);

  const passPhrase = process.env.PASSPHRASE;
  console.log("Performing validation checks...");
  
  const checks = await Promise.all([
    pfValidSignature(pfData, pfParamString, passPhrase),
    pfValidIP(req),
    pfValidPaymentData(cartTotal, pfData),
    pfValidServerConfirmation(pfHost, pfParamString),
  ]);

  console.log("Validation Results:", checks);

    if (checks.every(Boolean)) {
      console.log("All validation checks passed. Proceeding to update order.");
      const updatedDocument = await FullCart.findOneAndUpdate(
        { orderNumber: pforderNumber },
        { $set: { paymentSuccessful: true } },
        { new: true }
      );

      if (!updatedDocument) {
        console.warn("Document not found for order number:", pforderNumber);
        return res.status(404).json({ message: "Document not found" });
      }

      console.log("Document updated successfully:", updatedDocument);

     if (updatedDocument.appliedPromoCode) {
  const appliedPromoCode = updatedDocument.appliedPromoCode.trim(); // Remove any leading/trailing spaces
  console.log(`Attempting to mark promo code as used: ${appliedPromoCode}`);
  
  try {
    // Debugging: Check for promo code existence
    const existingPromo = await PromoCode.findOne({ genpromoCode: appliedPromoCode });
    if (!existingPromo) {
      console.warn(`Promo code ${appliedPromoCode} not found in the database.`);
    } else {
      console.log(`Promo code found:`, existingPromo);

      // Update promo code as used
      const updatedPromo = await PromoCode.findOneAndUpdate(
        { genpromoCode: appliedPromoCode },
        { $set: { used: true } },
        { new: true }
      );

      if (updatedPromo) {
        console.log(`Promo code ${appliedPromoCode} successfully marked as used for email ${updatedDocument.email}`);
      } else {
        console.warn(`Failed to update promo code: ${appliedPromoCode}`);
      }
    }
  } catch (promoError) {
    console.error(`Error updating promo code (${appliedPromoCode}):`, promoError.message);
  }
} else {
  console.log("No promo code applied to this order.");
}

      try {
        await handlemail(updatedDocument);
        console.log("Email sent successfully to:", updatedDocument.email);
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


// In your backend (e.g., app.js or routes file)
app.get("/api/order/:orderNumber", async (req, res) => {
  try {
    const orderNumber = req.params.orderNumber;
    const order = await FullCart.findOne({ orderNumber }); // Fetch from MongoDB

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log("Fetched order:", order)
    console.log("Paymentsuccesful:", order.paymentSuccessful)
    
    res.json({
      cart: order.cart,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentSuccessful,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




const newReview = mongoose.model("Review")
app.post("/api/reviews", async(req, res) => {
  const data = req.body
  const rating = data.rating;
  const comment = data.comment;
  const name = data.name;

  new newReview ({
    rating: rating,
    comment: comment, 
    name: name,
  }).save()
  
  console.log("added review");
  return res.status(200).json({success: "completed successfully "});
  
});


app.get("/api/getreviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(20); // Sort by newest first
    console.log(reviews);
    res.status(200).json(reviews);
  } catch (error) {
    console.log("error getting reviews")
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



const generatePromoCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let promoCode = '';
  for (let i = 0; i < 6; i++) {
      promoCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return promoCode || null;
};

app.post("/api/getdiscountcode", async (req, res) => {
  const { email } = req.body;

  // Validate the email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
      // Check if email already has a promo code
      const existingPromo = await PromoCode.findOne({ email });
      if (existingPromo) {
          return res.status(400).json({
              message: 'This email has already been used to generate a promo code.',
              existingPromoCode: existingPromo.genpromoCode,
          });
      }

      // Generate a unique promo code
      let genpromoCode;
      let isDuplicate;
      do {
          genpromoCode = generatePromoCode();
          if (!genpromoCode) {
              throw new Error('Failed to generate a valid promo code.');
          }
          isDuplicate = await PromoCode.findOne({ genpromoCode });
      } while (isDuplicate);

      // Save the new promo code in the database
      const newPromo = new PromoCode({ email, genpromoCode });
      await newPromo.save();

      // Optionally send the promo code via email
      await sendEmail(email, genpromoCode);

      res.json({ message: 'Promo code saved.', promoCode: genpromoCode });
  } catch (err) {
      console.error("Failed to save promo code:", err);
      res.status(500).json({ message: 'Failed to save promo code.', error: err.message });
  }
});

app.post('/api/validatepromocode', async (req, res) => {
  console.log('Received POST to /api/validatepromocode with body:', req.body);
  const { promoCode } = req.body;

  // Validate promo code format
  if (!promoCode || !/^[A-Z0-9]{6}$/.test(promoCode)) {
      return res.status(400).json({ message: 'Invalid promo code format.' });
  }

  try {
      // Find promo code in the database
      const existingPromo = await PromoCode.findOne({ genpromoCode: promoCode });
      if (!existingPromo) {
          return res.status(404).json({ message: 'Promo code not found.' });
      }

      // Check if promo code is already used
      if (existingPromo.used) {
          return res.status(400).json({ message: 'Promo code already used.' });
      }

      // Promo code is valid
      res.json({ message: 'Valid promo code.', valid: true });
  } catch (err) {
      console.error('Error in /api/validatepromocode:', err);
      res.status(500).json({ message: 'Failed to validate promo code.', error: err.message });
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