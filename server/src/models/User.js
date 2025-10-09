import mongoose from "mongoose";

// user schema, will add more fields later
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
