const Stripe = require("stripe");
const pool = require("../utils/db");

const createCheckoutSession = async (req, res) => {
  const { email, priceId } = req.body;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const customer = await stripe.customers.create({ email });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    await pool.query(
      `INSERT INTO subscriptions (email, customer_id, plan, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [email, customer.id, priceId, "pending"]
    );

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
};

module.exports = {
  createCheckoutSession,
};
