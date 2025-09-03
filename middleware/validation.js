const Joi = require('joi');

// Email validation schema
const emailSchema = Joi.object({
  email: Joi.string().email().required()
});

// Order validation schema
const orderSchema = Joi.object({
  formData: Joi.object({
    name: Joi.string().min(1).max(50).required(),
    surname: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required()
  }).required(),
  price: Joi.number().positive().required()
});

// PayFast payment validation schema
const paymentSchema = Joi.object({
  name_first: Joi.string().min(1).max(50).required(),
  name_last: Joi.string().min(1).max(50).required(),
  email_address: Joi.string().email().required(),
  cell_number: Joi.string().pattern(/^\+?[\d\s-()]+$/).min(10).max(15).required(),
  order_number: Joi.string().alphanum().length(7).required(),
  amount: Joi.number().positive().required()
});

// Review validation schema
const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(1).max(500).required(),
  name: Joi.string().min(1).max(50).required()
});

// Promo code validation schema
const promoCodeSchema = Joi.object({
  promoCode: Joi.string().pattern(/^[A-Z0-9]{6}$/).required()
});

// User cart validation schema
const userCartSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(1).max(50).required(),
  number: Joi.string().pattern(/^\+?[\d\s-()]+$/).min(10).max(15).required(),
  address: Joi.string().min(10).max(200).required(),
  cart: Joi.array().items(
    Joi.object({
      capacity: Joi.string().required(),
      price: Joi.number().positive().required(),
      colour: Joi.string().valid('white', 'tan', 'black', 'grey', 'blue').required(),
      quantity: Joi.number().integer().min(1).required()
    })
  ).min(1).required(),
  orderNumber: Joi.string().alphanum().length(7).required(),
  appliedPromoCode: Joi.string().pattern(/^[A-Z0-9]{6}$/).optional()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  validate,
  emailSchema,
  orderSchema,
  paymentSchema,
  reviewSchema,
  promoCodeSchema,
  userCartSchema
};