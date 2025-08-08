const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/payment.controller");
const authenticateUser = require("../middleware/auth");
const prisma = require("../utils/prisma");

const PLAN_NAMES = {
  price_1Rt1HTC6BukEWbCoSUa7Ffd5: "Basic",
  price_1Rt1HkC6BukEWbCoXOzGOjfF: "Pro",
  price_1Rt1I4C6BukEWbCo5DyUFecI: "Enterprise",
};

router.post(
  "/create-checkout-session",
  authenticateUser,
  createCheckoutSession
);

router.get("/my-subscription", authenticateUser, async (req, res) => {
  try {
    const userEmail = req.user.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user || user.subscriptions.length === 0) {
      return res.json({ plan: null, status: null });
    }

    const sub = user.subscriptions[0];

    res.json({
      plan: PLAN_NAMES[sub.plan] || sub.plan,
      status: sub.status,
    });
  } catch (err) {
    console.error("Error fetching subscription:", err.message);
    return res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

// router.post(
//   "/",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("Webhook error:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     const data = event.data.object;

//     if (event.type === "checkout.session.completed") {
//       try {
//         const subscription = await stripe.subscriptions.retrieve(
//           data.subscription
//         );

//         await prisma.subscription.updateMany({
//           where: { customerId: data.customer },
//           data: {
//             subscriptionId: subscription.id,
//             status: subscription.status,
//           },
//         });

//         console.log("✅ Subscription updated after checkout.session.completed");
//       } catch (err) {
//         console.error("Error updating subscription:", err.message);
//       }
//     }

//     if (event.type === "invoice.paid") {
//       try {
//         await prisma.subscription.updateMany({
//           where: { customerId: data.customer },
//           data: { status: "active" },
//         });

//         console.log("✅ Subscription marked active after invoice.paid");
//       } catch (err) {
//         console.error("Error updating status to active:", err.message);
//       }
//     }

//     res.json({ received: true });
//   }
// );

module.exports = router;
