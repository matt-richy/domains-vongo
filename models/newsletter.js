const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
    email: String,
  });
  
  mongoose.model("Newsletter", cartSchema);