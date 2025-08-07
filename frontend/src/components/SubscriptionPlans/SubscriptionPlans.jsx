import axios from "axios";
import "./SubscriptionPlans.css";

const plans = [
  {
    name: "Basic",
    price: "₹99/mo",
    features: ["1 Project", "Email Support", "Community Access"],
    id: "price_1Rt1HTC6BukEWbCoSUa7Ffd5",
  },
  {
    name: "Pro",
    price: "₹199/mo",
    features: ["5 Projects", "Priority Email Support", "Community Access"],
    id: "price_1Rt1HkC6BukEWbCoXOzGOjfF",
  },
  {
    name: "Enterprise",
    price: "₹399/mo",
    features: [
      "Unlimited Projects",
      "Phone & Email Support",
      "Private Slack Channel",
    ],
    id: "price_1Rt1I4C6BukEWbCo5DyUFecI",
  },
];

const SubscriptionPlans = () => {
  const handleSubscribe = async (priceId) => {
    try {
      const response = await axios.post(
        "http://localhost:4242/api/create-checkout-session",
        { priceId },
        { withCredentials: true }
      );
      window.location.href = response.data.url;
    } catch (error) {
      if (error.response?.status === 401) {
        alert("You must be logged in to subscribe.");
      } else {
        alert("Failed to initiate checkout.");
      }
    }
  };

  return (
    <section className="pricing-container">
      <h2>Choose Your Plan</h2>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div className="plan-card" key={plan.id}>
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <ul className="features">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              className="subscribe-button"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubscriptionPlans;
