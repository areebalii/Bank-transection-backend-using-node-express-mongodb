import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

/** 
  * - User Registration Controller
  * - POST /api/auth/register
*/
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    })

    const token = jwt.sign({
      userId: user._id,
    }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JS from reading the cookie (XSS protection)
      secure: process.env.NODE_ENV === "production", // Forces HTTPS in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "User registered successfully",
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/** 
  * - User login Controller
  * - POST /api/auth/login
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await user.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({
      userId: user._id
    }, process.env.JWT_SECRET, { expiresIn: "3d" });
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JS from reading the cookie (XSS protection)
      secure: process.env.NODE_ENV === "production", // Forces HTTPS in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    });

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}