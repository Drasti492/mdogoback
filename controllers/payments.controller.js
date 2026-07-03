const axios = require("axios");
const Payment = require("../models/payment");

// Normalize Kenyan phone numbers
function normalizePhone(phone) {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("0")) p = "254" + p.slice(1);
  if (p.startsWith("7")) p = "254" + p;
  return p;
}

exports.initiateSTK = async (req, res) => {
  try {
    let { phone, amountKES, phoneModel } = req.body;
    phone = normalizePhone(phone);

    const payment = await Payment.create({
      phone,
      amountKES,
      phoneModel,
      status: "pending",
      externalReference: `PHONE-${Date.now()}`
    });

    await axios.post(
      `${process.env.PAYHERO_BASE_URL}/api/v2/payments`,
      {
        amount: amountKES,
        phone_number: phone,
        channel_id: Number(process.env.PAYHERO_CHANNEL_ID),
        provider: "m-pesa",
        external_reference: payment.externalReference,
        callback_url: process.env.PAYHERO_CALLBACK_URL
      },
      {
        headers: {
          Authorization: `Basic ${process.env.PAYHERO_BASIC_AUTH}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ paymentId: payment._id });

  } catch (err) {
    console.error("STK ERROR:", err.message);
    if (err.response) {
      console.error("STK ERROR RESPONSE:", JSON.stringify(err.response.data));
    }
    res.status(500).json({ message: "STK initiation failed" });
  }
};

exports.payheroCallback = async (req, res) => {
  try {
    const payload = req.body?.response;
    if (!payload) return res.sendStatus(400);

    const payment = await Payment.findOne({
      externalReference: payload.ExternalReference
    });

    if (!payment) return res.sendStatus(404);

    payment.checkoutRequestID = payload.CheckoutRequestID;
    payment.resultDesc = payload.ResultDesc;

    if (Number(payload.ResultCode) === 0) {
      payment.status = "success";
      payment.mpesaReceipt = payload.MpesaReceiptNumber;
    } else {
      payment.status = "failed";
    }

    await payment.save();
    res.sendStatus(200);

  } catch (err) {
    console.error("CALLBACK ERROR:", err.message);
    res.sendStatus(500);
  }
};

exports.getPaymentStatus = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.json({ status: "not_found" });
  res.json({ status: payment.status });
};