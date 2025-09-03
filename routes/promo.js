const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, emailSchema, promoCodeSchema } = require('../middleware/validation');
const { promoLimiter } = require('../middleware/rateLimiter');
const PromoCode = require('../models/promoCode');
const { sendEmail } = require('../promoemail');

// Generate promo code
const generatePromoCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let promoCode = '';
  for (let i = 0; i < 6; i++) {
    promoCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return promoCode;
};

// Get discount code
router.post('/getdiscountcode', promoLimiter, validate(emailSchema), asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if email already has a promo code
  const existingPromo = await PromoCode.findOne({ email });
  if (existingPromo) {
    return res.status(400).json({
      message: 'This email has already been used to generate a promo code.',
      existingPromoCode: existingPromo.genpromoCode,
    });
  }

  // Generate unique promo code
  let genpromoCode;
  let isDuplicate;
  do {
    genpromoCode = generatePromoCode();
    isDuplicate = await PromoCode.findOne({ genpromoCode });
  } while (isDuplicate);

  // Save promo code
  const newPromo = new PromoCode({ email, genpromoCode });
  await newPromo.save();

  // Send promo code via email
  await sendEmail(email, genpromoCode);

  res.json({ 
    message: 'Promo code saved and sent to your email.', 
    promoCode: genpromoCode 
  });
}));

// Validate promo code
router.post('/validatepromocode', validate(promoCodeSchema), asyncHandler(async (req, res) => {
  const { promoCode } = req.body;

  // Find promo code in database
  const existingPromo = await PromoCode.findOne({ genpromoCode: promoCode });
  if (!existingPromo) {
    return res.status(404).json({ message: 'Promo code not found.' });
  }

  // Check if already used
  if (existingPromo.used) {
    return res.status(400).json({ message: 'Promo code already used.' });
  }

  // Promo code is valid
  res.json({ message: 'Valid promo code.', valid: true });
}));

module.exports = router;