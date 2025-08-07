const Stripe = require("stripe");
const prisma = require("../utils/prisma");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { priceId } = req.body;
  const { email } = req.user; // ✅ Email extracted from cookie-auth middleware

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    // Save subscription in DB with 'pending' status
    await prisma.subscription.create({
      data: {
        userId: user.id,
        customerId: customer.id,
        plan: priceId,
        status: "pending",
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err.message);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
};

module.exports = {
  createCheckoutSession,
};
