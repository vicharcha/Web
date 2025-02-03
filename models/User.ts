import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  verificationStatus: { type: String, enum: ["unverified", "pending", "verified"], default: "unverified" },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)

