const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  cart: [{
    capacity: String,
    price: Number,
    colour: String,
    quantity: Number,
    engraving: [String],
  }],
 
  orderNumber: {
    type: String, 
    required: true
  }, 
  totPrice : {
    type: String, 
    required: true
  },

  paymentSuccessful: {
    type: Boolean, 
    required: false, 
    default: false
  }
  // Other fields...
});

const customerOrder = mongoose.model('Usercart', userSchema);

module.exports = customerOrder;


