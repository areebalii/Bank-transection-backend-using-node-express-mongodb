import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "account must be associated with a user"],
    index: true,
  },
  status: {
    enum: {
      values: ["ACTIVE", "FROZEN", "CLOSED"],
      message: "Status must be either ACTIVE, FROZEN, or CLOSED",
    }
  },
  currency: {
    type: String,
    required: [true, "Currency is required for creating an account"],
    default: "PKR",
  },
}, {
  timestamps: true,
})

accountSchema.index({ user: 1, status: 1}) // Compound index to optimize queries filtering by user and status

const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;