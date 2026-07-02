const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    fullName: String,
    idNumber: { type: String, unique: true },
    phone: { type: String, unique: true },
    pin: String,

    county: String,
    employment: String,
    income: String,

    guarantorName: String,
    guarantorPhone: String,

    loanLimit: Number,
    reference: String,

    pickupTown: String,
    phoneModel: String,
    paymentStatus: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);