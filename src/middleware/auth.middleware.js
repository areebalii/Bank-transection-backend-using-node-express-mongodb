import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>"
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }


    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // Attach user to request for downstream use
    next();

  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}