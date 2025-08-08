import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/user/subscription", { withCredentials: true })
      .then((res) => setPlan(res.data.plan))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4242/api/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Payment Successful 🎉</h1>
      {plan && (
        <p>
          Your plan is now <strong>{plan}</strong> and active ✅
        </p>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
