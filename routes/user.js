const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, userCartSchema, emailSchema } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

// Add user cart
router.post('/addUser', apiLimiter, validate(userCartSchema), asyncHandler(async (req, res) => {
  const Usercart = mongoose.model("Usercart");
  const newUser = new Usercart(req.body);
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
}));

// Newsletter subscription
router.post('/subscribe', apiLimiter, validate(emailSchema), asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const Newsletter = mongoose.model("Newsletter");
  const newSubscriber = new Newsletter({ email });
  await newSubscriber.save();
  
  res.status(200).json({ message: 'Subscription successful' });
}));

// Legacy cart endpoint (consider deprecating)
router.post('/add', apiLimiter, asyncHandler(async (req, res) => {
  const cartArray = req.body;
  
  if (!Array.isArray(cartArray) || cartArray.length === 0) {
    return res.status(400).json({ error: 'Invalid cart data' });
  }

  const Cart = mongoose.model("Cart");
  const newCart = new Cart({
    price: cartArray[0].price,
    colour: cartArray[0].colour,
    quantity: cartArray[0].quantity,
  });
  
  await newCart.save();
  res.status(201).json({ message: 'Cart item saved successfully' });
}));

module.exports = router;