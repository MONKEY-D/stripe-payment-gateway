const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const prisma = require("../prisma/client");

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
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          // Attach subscription record on checkout complete
          const subscription = await stripe.subscriptions.retrieve(
            data.subscription
          );

          await prisma.subscription.updateMany({
            where: { customerId: data.customer },
            data: {
              subscriptionId: subscription.id,
              status: subscription.status, // will be 'incomplete' or 'trialing'
            },
          });

          console.log("✅ Checkout session completed for:", data.customer);
          break;
        }

        case "invoice.paid": {
          // FIRST payment success → mark active
          await prisma.subscription.updateMany({
            where: { customerId: data.customer },
            data: { status: "active" },
          });
          console.log("✅ Invoice paid — subscription active");
          break;
        }

        case "customer.subscription.deleted": {
          await prisma.subscription.updateMany({
            where: { customerId: data.customer },
            data: { status: "canceled" },
          });
          console.log("❌ Subscription canceled for:", data.customer);
          break;
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error("❌ Error handling webhook:", err);
      res.status(500).send("Webhook handler failed");
    }
  }
);

module.exports = router;
