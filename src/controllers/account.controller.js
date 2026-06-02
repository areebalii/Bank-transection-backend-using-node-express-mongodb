import AccountModel from "../models/account.model.js";

export const createAccount = async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request

    // Create a new account associated with the authenticated user
    const account = await AccountModel.create({
      user: user._id,
    });

    res.status(201).json({
      message: "Account created successfully",
      account
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}