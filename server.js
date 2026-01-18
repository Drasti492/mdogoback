require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const paymentRoutes = require("./routes/payments.routes");
const applicationRoutes = require("./routes/applications.routes");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/payments", paymentRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
