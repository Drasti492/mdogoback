const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    fullName: String,
    idNumber: String,
    phone: { type: String, unique: true },
    pin: String, // NOTE: plain text for demo purposes only — see note below

    county: String,
    employment: String,
    income: String,

    guarantorName: String,
    guarantorPhone: String,

    loanLimit: Number,
    reference: String,

    // kept from the original Lipa Mdogo Mdogo schema — unused by KwikLoan, harmless to leave
    pickupTown: String,
    phoneModel: String,
    paymentStatus: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);