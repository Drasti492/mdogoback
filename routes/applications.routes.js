const express = require("express");
const router = express.Router();
const Application = require("../models/application");

// Submit a new loan application
router.post("/", async (req, res) => {
  try {
    const { phone, idNumber, guarantorPhone } = req.body;

    if (!phone || !idNumber) {
      return res.status(400).json({ error: "Phone number and ID number are required." });
    }

    // Applicant's own phone must be unique
    const phoneTaken = await Application.findOne({ phone });
    if (phoneTaken) {
      return res.status(409).json({ error: "An account with this phone number already exists. Please sign in instead." });
    }

    // National ID must be unique — one person, one application
    const idTaken = await Application.findOne({ idNumber });
    if (idTaken) {
      return res.status(409).json({ error: "This National ID is already registered to another application." });
    }

    // Guarantor can't be the applicant themselves
    if (guarantorPhone && guarantorPhone === phone) {
      return res.status(400).json({ error: "Your guarantor's phone number cannot be the same as your own." });
    }

    // Guarantor's phone can't already belong to another applicant's account
    if (guarantorPhone) {
      const guarantorIsApplicant = await Application.findOne({ phone: guarantorPhone });
      if (guarantorIsApplicant) {
        return res.status(400).json({ error: "This guarantor's phone number is already registered as an applicant. Please use a different guarantor." });
      }
    }

    const application = await Application.create(req.body);
    res.status(201).json(application);

  } catch (err) {
    // Safety net: catches duplicate-key errors from MongoDB's unique index itself,
    // e.g. if two requests land at the same moment and slip past the checks above
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      console.error("DUPLICATE KEY ERROR:", field, err.keyValue);
      return res.status(409).json({ error: `This ${field} is already registered.` });
    }

    console.error("SAVE ERROR:", err.message);
    res.status(500).json({ error: "Could not save application. Please try again." });
  }
});

// Returning user login (phone + PIN)
router.post("/login", async (req, res) => {
  try {
    const { phone, pin } = req.body;
    if (!phone || !pin) {
      return res.status(400).json({ error: "Phone number and PIN are required." });
    }

    const application = await Application.findOne({ phone, pin });
    if (!application) {
      return res.status(401).json({ error: "Incorrect phone number or PIN." });
    }

    res.json(application);

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

module.exports = router;