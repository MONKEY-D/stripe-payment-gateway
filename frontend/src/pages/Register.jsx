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
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    const { email, firstName, lastName, password } = formData;

    if (!email || !firstName || !lastName || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:4242/api/auth/register", {
        email,
        firstName,
        lastName,
        password,
      });
      alert("Registered successfully. Now login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed");
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
              Register
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                margin="normal"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                margin="normal"
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleRegister}
              >
                Register
              </Button>

              {/* 👇 Login link */}
              <Typography align="center" sx={{ mt: 2 }}>
                Already have an account? <Link to="/login">Login here</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
