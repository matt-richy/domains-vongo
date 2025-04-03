const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define an Order schema
const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  name_first: String,
  name_last: String,
  email_address: String,
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const orderNum = mongoose.model("orderNum", orderSchema);

module.exports = orderNum;