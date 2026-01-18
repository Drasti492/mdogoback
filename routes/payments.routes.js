const express = require("express");
const router = express.Router();
const {
  initiateSTK,
  payheroCallback,
  getPaymentStatus
} = require("../controllers/payments.controller");

router.post("/stk-push", initiateSTK);
router.post("/callback", payheroCallback);
router.get("/status/:id", getPaymentStatus);

module.exports = router;
