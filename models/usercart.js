const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItems = new Schema({
  price: Number,
  colour: String,
  quantity: Number,
});

const userCartSchema = new Schema({
  name: String,
  email: String,
  number: Number,
  address: String,
  city: String,
  zip: Number,
  userCart: [cartItems],
});

mongoose.model("Usercart", userCartSchema);
