require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const listEndpoints = require("express-list-endpoints");

const authRoutes = require("./routes/auth.routes");
const paymentRoutes = require("./routes/payment.routes");
const webhookRoutes = require("./routes/webhook.routes");

const app = express();

app.use("/api/webhook", require("./routes/webhook.routes"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(listEndpoints(app));
});
