const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { emailLimiter } = require('../middleware/rateLimiter');
const handlemail = require('../handlemail');

// Send receipt email
router.post('/receipt', emailLimiter, asyncHandler(async (req, res) => {
  const emailData = req.body;
  
  // Validate required fields
  if (!emailData.email || !emailData.cart || !emailData.orderNumber) {
    return res.status(400).json({ 
      error: 'Missing required fields: email, cart, or orderNumber' 
    });
  }

  await handlemail(emailData);
  res.status(200).json({ 
    message: 'Receipt email sent successfully' 
  });
}));

module.exports = router;