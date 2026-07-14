import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/connectDB.js";
dotenv.config();
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import componentRouter from "./routes/component.route.js";
import paymentRouter from "./routes/payment.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true,               
  })
);

/* ✅ Body parser */
app.use(express.json());
app.use(cookieParser()); 
app.get("/", (req, res) => {
  res.json({ message: "Backend Running for VectorUI" });
});

app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/component" , componentRouter)
app.use("/api/payment" , paymentRouter)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB()
});
