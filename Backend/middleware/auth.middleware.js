import jwt from "jsonwebtoken";

/**
 * Authentication middleware
 * Protects routes by validating JWT token
 */
const auth = (req, res, next) => {
  try {
    // 1️⃣ Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // 2️⃣ Check Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    // 3️⃣ Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // 4️⃣ Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not defined in .env");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // 5️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6️⃣ Attach user to request
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;