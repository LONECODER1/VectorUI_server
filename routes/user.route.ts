import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getAllUsers, getCurrentUser } from "../controllers/user.controller.js"





let userRouter = express.Router()
userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.get("/all-users",getAllUsers)



export default userRouter