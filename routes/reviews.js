const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, reviewSchema } = require('../middleware/validation');
const { reviewLimiter } = require('../middleware/rateLimiter');
const Review = require('../models/reviews');

// Add review
router.post('/', reviewLimiter, validate(reviewSchema), asyncHandler(async (req, res) => {
  const { rating, comment, name } = req.body;

  const newReview = new Review({
    rating,
    comment,
    name,
  });

  await newReview.save();
  res.status(201).json({ 
    message: 'Review added successfully',
    review: newReview
  });
}));

// Get reviews
router.get('/', asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .limit(20);
  
  res.status(200).json(reviews);
}));

module.exports = router;