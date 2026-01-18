const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    fullName: String,
    idNumber: String,
    phone: String,
    guarantorPhone: String,
    pickupTown: String,

    phoneModel: String,
    paymentStatus: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
