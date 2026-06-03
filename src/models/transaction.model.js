import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Transaction must have a source account"],
    index: true, // Index to optimize queries filtering by fromAccount
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Transaction must have a destination account"],
    index: true, // Index to optimize queries filtering by toAccount
  },
  status: {
    type: String,
    enum: {
      values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
      message: "Status must be either PENDING, COMPLETED, FAILED, or REVERSED",
    },
    default: "PENDING",
  },
  amount: {
    type: Number,
    required: [true, "Transaction amount is required"],
    min: [0, "Transaction amount must be a positive number"],
  },
  idempotencyKey: {
    type: String,
    required: [true, "Idempotency key is required for idempotency"],
    index: true, // Index to optimize queries filtering by idempotencyKey
    unique: true, // Ensure uniqueness to prevent duplicate transactions
  },
})



const TransactionModel = mongoose.model("Transaction", transactionSchema);

export default TransactionModel;