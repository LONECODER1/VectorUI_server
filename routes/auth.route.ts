import express from "express"
import { googleSignup, logOut, signup, login } from "../controllers/auth.controller.js"



const authRouter = express.Router()

authRouter.post("/googlesignup",googleSignup)
authRouter.post("/signup", signup)
authRouter.post("/login", login)

authRouter.get("/logout",logOut)

export default authRouter