const mongoose = require("mongoose");

const resetSchema = mongoose.Schema({
     email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false }
},{ timestamps: true })

module.exports = mongoose.model("Otp", resetSchema);

