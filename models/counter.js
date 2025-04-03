const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define Counter Schema
const counterSchema = new Schema({
  _id: { type: String, required: true }, // Unique identifier for the counter
  sequence_value: { type: Number, required: true } // Tracks last order number
});

// Create and export model
const Counter = mongoose.model("Counter", counterSchema);
module.exports = Counter;