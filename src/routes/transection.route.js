import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";

const transactionRouter = express.Router();

// Create a new transaction
transactionRouter.post("/", authMiddleware, createTransaction)



export default transactionRouter