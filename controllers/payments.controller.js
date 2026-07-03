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