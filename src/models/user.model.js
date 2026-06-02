import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
}, {
  timestamps: true,
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }
  try { 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    return;
  } catch (err) {
    console.error(err);
  }

}); 

userSchema.methods.comparePassword = async function (password) {
  // console.log("Comparing passwords:", password, this.password);
  return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model("User", userSchema);

export default UserModel;   