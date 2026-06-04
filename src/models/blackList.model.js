import mongoose from "mongoose";

const blackListSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
}, { timestamps: true });

blackListSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // Expire documents after 3d 

const BlackList = mongoose.model("BlackList", blackListSchema);

export default BlackList;