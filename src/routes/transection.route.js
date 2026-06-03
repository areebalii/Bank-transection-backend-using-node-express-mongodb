import express from "express"
import { authMiddleware, systemUserMiddleware } from "../middleware/auth.middleware.js";
import { createInitialFundsTransaction, createTransaction } from "../controllers/transaction.controller.js";

const transactionRouter = express.Router();

// POST /api/transactions/system/initial-funds - Create initial funds for system user
transactionRouter.post("/system/initial-funds", systemUserMiddleware, createInitialFundsTransaction)

// Create a new transaction
transactionRouter.post("/", authMiddleware, createTransaction)




export default transactionRouter