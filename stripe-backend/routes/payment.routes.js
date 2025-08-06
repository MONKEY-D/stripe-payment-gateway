const express = require("express");
const Stripe = require("stripe");
const pool = require("../utils/db");
const { createCheckoutSession } = require("../controllers/payment.controller");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", createCheckoutSession);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        data.subscription
      );
      await pool.query(
        `UPDATE subscriptions SET subscription_id = $1, status = $2, updated_at = NOW()
         WHERE customer_id = $3`,
        [subscription.id, subscription.status, data.customer]
      );
    }

    if (event.type === "invoice.paid") {
      await pool.query(
        `UPDATE subscriptions SET status = 'active', updated_at = NOW()
         WHERE customer_id = $1`,
        [data.customer]
      );
    }

    res.json({ received: true });
  }
);

module.exports = router;
