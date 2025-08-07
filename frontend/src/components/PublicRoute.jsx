import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function PublicRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4242/api/auth/me", { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) return null;

  return authenticated ? <Navigate to="/" /> : children;
}
