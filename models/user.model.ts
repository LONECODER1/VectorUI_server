import mongoose from "mongoose";
import { IUser } from "./types.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      // Not required by default so OAuth users can exist without passwords
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    aiCredits: {
      type: Number,
      default: 150

    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
