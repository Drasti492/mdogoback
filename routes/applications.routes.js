const express = require("express");
const router = express.Router();
const Application = require("../models/application");

router.post("/", async (req, res) => {
  const app = await Application.create(req.body);
  res.json(app);
});

module.exports = router;
