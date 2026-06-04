import UserModel from "../models/user.model.js";
import BlackList from "../models/blackList.model.js";
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

    const isBlackListed = await BlackList.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
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

export const systemUserMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const isBlackListed = await BlackList.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
    }

    // 1. Verify the Token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Fetch User and explicitly pull the systemUser boolean flag
    const user = await UserModel.findById(decodedToken.userId).select("+systemUser");

    // 3. FIX: Handle the edge case where the user document is missing
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 4. Validate system authorization privileges
    if (!user.systemUser) {
      return res.status(403).json({ message: "Forbidden: Access denied for non-system user" });
    }

    // Attach user payload to request pipeline
    req.user = user;
    next();

  } catch (error) {
    console.error("System user check error:", error.message);

    // Granular catch blocks for optimal frontend error tracking
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};