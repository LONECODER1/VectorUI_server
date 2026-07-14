import mongoose from "mongoose";
import { IPayment } from "./types.js";

const paymentSchema = new mongoose.Schema<IPayment>({
     userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: Number,
    aiCredits: Number,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
},{timestamps:true})

const Payment = mongoose.model<IPayment>("Payment",paymentSchema);

export default Payment;