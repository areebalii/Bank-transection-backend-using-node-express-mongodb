import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
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

function preventLedgerModifications() {
  throw new Error("ledger entry are immutable, cannot be modified or deleted after creation.");
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModifications);
ledgerSchema.pre("updateOne", preventLedgerModifications);
ledgerSchema.pre("updateMany", preventLedgerModifications);
ledgerSchema.pre("update", preventLedgerModifications);
ledgerSchema.pre("remove", preventLedgerModifications);
ledgerSchema.pre("deleteOne", preventLedgerModifications);
ledgerSchema.pre("deleteMany", preventLedgerModifications);

const LedgerModel = mongoose.model("Ledger", ledgerSchema);

export default LedgerModel;