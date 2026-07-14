import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  aiCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComponent extends Document {
  name: string;
  code: string;
  props: string[];
  variations?: { name: string; options: string[] }[];
  owner: Types.ObjectId | IUser | string;
  visibility: "private" | "public";
  npmPackage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment extends Document {
  userId: Types.ObjectId | IUser | string;
  amount: number;
  aiCredits: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: "created" | "paid" | "failed";
  createdAt: Date;
  updatedAt: Date;
}
