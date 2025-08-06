import SubscriptionPlans from "../components/SubscriptionPlans/SubscriptionPlans";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  if (!token) return <p>Please log in to access plans</p>;

  return (
    <div>
      <h2>Welcome</h2>
      <SubscriptionPlans />
    </div>
  );
}
