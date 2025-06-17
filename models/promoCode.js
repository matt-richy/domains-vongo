const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a PromoCode schema
const promoCodeSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    genpromoCode: {
        type: String,
        required: true,
        unique: true,
    },
    used: {
        type: Boolean,
        default: false, // Defaults to not used
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;