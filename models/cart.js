const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  price: Number,
  colour: String,
  quantity: Number,
});

mongoose.model("Cart", cartSchema);
