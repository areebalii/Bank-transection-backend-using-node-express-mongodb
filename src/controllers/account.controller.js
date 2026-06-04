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

export const getUserAccounts = async (req, res) => { 
  try {
    const accounts = await AccountModel.find({ user: req.user._id });
    
    res.status(200).json({
      message: "Accounts retrieved successfully",
      accounts
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getAccountBalance = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await AccountModel.findOne({ _id: accountId, user: req.user._id });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const balance = await account.getBalance();

    res.status(200).json({
      message: "Account balance retrieved successfully",
      balance
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}