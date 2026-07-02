const express = require("express");
const router = express.Router();
const Application = require("../models/application");

// Submit a new loan application
router.post("/", async (req, res) => {
  try {
    const existing = await Application.findOne({ phone: req.body.phone });
    if (existing) {
      return res.status(409).json({ error: "An account with this phone number already exists. Please sign in instead." });
    }
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: "Could not save application." });
  }
});

// Returning user login (phone + PIN)
router.post("/login", async (req, res) => {
  try {
    const { phone, pin } = req.body;
    const application = await Application.findOne({ phone, pin });
    if (!application) {
      return res.status(401).json({ error: "Incorrect phone number or PIN." });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

module.exports = router; 