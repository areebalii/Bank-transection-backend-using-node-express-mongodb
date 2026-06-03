import mongoose from "mongoose";
import LedgerModel from "./ledger.model.js";

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "account must be associated with a user"],
    index: true,
  },
  status: {
    type: String,
    enum: {
      values: ["ACTIVE", "FROZEN", "CLOSED"],
      message: "Status must be either ACTIVE, FROZEN, or CLOSED",
    },
    default: "ACTIVE",
  },
  currency: {
    type: String,
    required: [true, "Currency is required for creating an account"],
    default: "PKR",
  },
}, {
  timestamps: true,
})

accountSchema.index({ user: 1, status: 1 }) // Compound index to optimize queries filtering by user and status

accountSchema.methods.getBalance = async function () {
  const balanceData = await LedgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "DEBIT"] },
              "$amount",
              0
            ]
          }
        },
        totalCredit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "CREDIT"] },
              "$amount",
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] }
      }
    }
  ]);

  if (balanceData.length > 0) {
    return balanceData[0].balance;
  } else {
    return 0; // No transactions means balance is zero
  }
}


const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;