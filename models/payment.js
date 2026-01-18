const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    phone: String,
    amountKES: Number,
    phoneModel: String,

    externalReference: String,
    checkoutRequestID: String,

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },

    mpesaReceipt: String,
    resultDesc: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
