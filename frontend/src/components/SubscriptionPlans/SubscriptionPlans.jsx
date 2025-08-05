import React from "react";
import "./SubscriptionPlans.css";

const plans = [
  {
    name: "Basic",
    price: "₹99/mo",
    features: ["1 Project", "Email Support", "Community Access"],
    id: "basic",
  },
  {
    name: "Pro",
    price: "₹199/mo",
    features: ["5 Projects", "Priority Email Support", "Community Access"],
    id: "pro",
  },
  {
    name: "Enterprise",
    price: "₹399/mo",
    features: [
      "Unlimited Projects",
      "Phone & Email Support",
      "Private Slack Channel",
    ],
    id: "enterprise",
  },
];

const SubscriptionPlans = () => {
  const handleSubscribe = (planId) => {
    alert(`Subscribe to ${planId}`);
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
