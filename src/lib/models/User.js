import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Empêche de redéclarer le modèle si déjà existant (hot reload en dev)
export default mongoose.models.User || mongoose.model("User", userSchema);
