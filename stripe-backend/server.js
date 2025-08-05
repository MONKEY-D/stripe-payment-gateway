require("dotenv").config();

const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use("/webhook", express.raw({ type: "application/json" }));

app.use(cors());
app.use(express.json());

app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
