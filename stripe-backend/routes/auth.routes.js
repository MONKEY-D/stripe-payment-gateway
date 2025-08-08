const express = require("express");
const { register, login, logout } = require("../controllers/auth.controller");
const authenticateUser = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", authenticateUser, async (req, res) => {
  console.log("/me route hit");
  try {
    const user = req.user;
    res.json({ id: user.userId, email: user.email });
  } catch (err) {
    console.error("Error in /me:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
