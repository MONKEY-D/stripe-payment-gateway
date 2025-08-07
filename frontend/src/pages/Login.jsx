import { useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4242/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      alert("Login successful");
      navigate("/");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: "100vh" }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Card sx={{ width: "100%", p: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleLogin}
              >
                Login
              </Button>
              <Typography align="center" sx={{ mt: 2 }}>
                Don't have an account? <Link to="/register">Register here</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
