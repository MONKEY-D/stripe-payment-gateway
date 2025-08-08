const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      });
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res
      .status(403)
      .json({ error: "Forbidden: Invalid or expired token" });
  }
};

module.exports = authenticateUser;
