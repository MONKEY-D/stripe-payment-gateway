const express = require("express");
const Stripe = require("stripe");
const prisma = require("../utils/prisma");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/",
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
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = session.metadata?.userId;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      if (!userId || !customerId || !subscriptionId) {
        console.error("Missing session metadata.");
        return res.status(400).send("Missing session data");
      }

      try {
        await prisma.subscription.updateMany({
          where: {
            userId,
            customerId,
          },
          data: {
            status: "active",
            subscriptionId,
          },
        });

        console.log(`Subscription activated for userId: ${userId}`);
        res.status(200).send("Webhook received and processed.");
      } catch (err) {
        console.error("Failed to update DB:", err.message);
        res.status(500).send("Internal server error");
      }
    } else {
      res.status(200).send("Unhandled event type");
    }
  }
);

module.exports = router;
