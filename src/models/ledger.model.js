import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Ledger entry must have an account"],
    index: true, // Index to optimize queries filtering by account
    immutable: true, // Prevent changes to the account reference after creation
  },
  amount: {
    type: Number,
    required: [true, "Ledger entry amount is required"],
    immutable: true, // Prevent changes to the amount after creation
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: [true, "Ledger entry must be associated with a transaction"],
    index: true, // Index to optimize queries filtering by transaction
    immutable: true, // Prevent changes to the transaction reference after creation
  },
  type: {
    type: String,
    enum: {
      values: ["DEBIT", "CREDIT"],
      message: "Ledger entry type must be either DEBIT or CREDIT",
    },
    required: [true, "Ledger entry type is required"],
    immutable: true, // Prevent changes to the type after creation
  }
})

function preventNegativeBalance() {
  throw new Error("ledger entry are immutable, cannot be updated after creation.");
}

ledgerSchema.pre("findOneAndUpdate", preventNegativeBalance);
ledgerSchema.pre("updateOne", preventNegativeBalance);
ledgerSchema.pre("updateMany", preventNegativeBalance);
ledgerSchema.pre("update", preventNegativeBalance);
ledgerSchema.pre("remove", preventNegativeBalance);
ledgerSchema.pre("deleteOne", preventNegativeBalance);
ledgerSchema.pre("deleteMany", preventNegativeBalance);

const LedgerModel = mongoose.model("Ledger", transactionSchema);

export default LedgerModel;