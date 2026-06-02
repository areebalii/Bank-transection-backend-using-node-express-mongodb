import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "account must be associated with a user"],
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

const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;