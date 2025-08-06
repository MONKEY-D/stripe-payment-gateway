import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? <Navigate to="/" /> : children;
}
