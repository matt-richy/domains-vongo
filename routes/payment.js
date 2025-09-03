const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, orderSchema, paymentSchema } = require('../middleware/validation');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { generateSignature } = require('../payfast');
const config = require('../config/environment');
const Order = require('../models/ordernumSchema');
const FullCart = require('../models/usercart');
const PromoCode = require('../models/promoCode');
const handlemail = require('../handlemail');
const axios = require('axios');
const dns = require('dns');
const crypto = require('crypto');

// Generate random order number
function generateRandomCode(length = 7) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate order number
router.post('/getOrderNum', paymentLimiter, validate(orderSchema), asyncHandler(async (req, res) => {
  const { formData, price } = req.body;

  const newOrderNumber = generateRandomCode();
  const newOrder = new Order({
    orderNumber: newOrderNumber,
    name_first: formData.name,
    name_last: formData.surname,
    email_address: formData.email,
    amount: price,
  });

  await newOrder.save();
  res.status(200).json({ orderNumber: newOrderNumber });
}));

// Create PayFast payment URL
router.post('/payfast', paymentLimiter, validate(paymentSchema), asyncHandler(async (req, res) => {
  const paymentData = req.body;
  const myData = {};

  myData["merchant_id"] = config.payfast.merchantId;
  myData["merchant_key"] = config.payfast.merchantKey;
  myData["return_url"] = `${config.payfast.returnUrl}?orderNumber=${encodeURIComponent(paymentData.order_number)}`;
  myData["cancel_url"] = config.payfast.cancelUrl;
  myData["notify_url"] = config.payfast.notifyUrl;

  myData["name_first"] = paymentData.name_first;
  myData["name_last"] = paymentData.name_last;
  myData["email_address"] = paymentData.email_address;
  myData["cell_number"] = paymentData.cell_number;

  myData['m_payment_id'] = paymentData.order_number;
  myData['amount'] = paymentData.amount;
  myData['item_name'] = "vongo";
  
  myData["signature"] = generateSignature(myData, config.payfast.passphrase);

  const queryString = Object.entries(myData)
    .map(([key, value]) => `${key}=${encodeURIComponent(value.toString().trim())}`)
    .join('&');

  const payfastUrl = config.payfast.sandbox 
    ? `https://sandbox.payfast.co.za/eng/process?${queryString}`
    : `https://www.payfast.co.za/eng/process?${queryString}`;

  res.send(payfastUrl);
}));

// PayFast validation helpers
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
    const ipPromises = validHosts.map(ipLookup);
    const allIps = (await Promise.all(ipPromises)).flat();
    const uniqueIps = [...new Set(allIps)];
    return uniqueIps.includes(pfIp);
  } catch (err) {
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
  const difference = Math.abs(parseFloat(cartTotal) - parseFloat(pfData['amount_gross']));
  return difference <= 0.01;
};

const pfValidServerConfirmation = async (pfHost, pfParamString) => {
  try {
    const response = await axios.post(`https://${pfHost}/eng/query/validate`, pfParamString);
    return response.data === 'VALID';
  } catch (error) {
    return false;
  }
};

// PayFast notification handler
router.post('/payfast-notify', asyncHandler(async (req, res) => {
  const pfHost = config.payfast.sandbox ? "sandbox.payfast.co.za" : "www.payfast.co.za";
  const pfData = req.body;

  let pfParamString = "";
  for (let key in pfData) {
    if (key !== "signature") {
      pfParamString += `${key}=${encodeURIComponent(pfData[key].toString().trim()).replace(/%20/g, "+")}&`;
    }
  }
  pfParamString = pfParamString.slice(0, -1);

  const pforderNumber = pfData['m_payment_id'];
  const order = await Order.findOne({ orderNumber: pforderNumber });
  
  if (!order) {
    return res.status(400).json({ error: "Order not found" });
  }

  const cartTotal = order.amount;
  const checks = await Promise.all([
    pfValidSignature(pfData, pfParamString, config.payfast.passphrase),
    pfValidIP(req),
    pfValidPaymentData(cartTotal, pfData),
    pfValidServerConfirmation(pfHost, pfParamString),
  ]);

  if (checks.every(Boolean)) {
    const updatedDocument = await FullCart.findOneAndUpdate(
      { orderNumber: pforderNumber },
      { $set: { paymentSuccessful: true } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Mark promo code as used if applicable
    if (updatedDocument.appliedPromoCode) {
      const appliedPromoCode = updatedDocument.appliedPromoCode.trim();
      await PromoCode.findOneAndUpdate(
        { genpromoCode: appliedPromoCode },
        { $set: { used: true } },
        { new: true }
      );
    }

    // Send confirmation email
    await handlemail(updatedDocument);
    return res.status(200).json({ message: "Payment successful and email sent!" });
  } else {
    return res.status(400).json({ error: "Payment validation failed" });
  }
}));

// Get order details
router.get('/order/:orderNumber', asyncHandler(async (req, res) => {
  const orderNumber = req.params.orderNumber;
  const order = await FullCart.findOne({ orderNumber });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  
  res.json({
    cart: order.cart,
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentSuccessful,
  });
}));

module.exports = router;