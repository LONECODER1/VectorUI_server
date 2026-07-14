
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {

    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "user doesn't have token" })
    }
    let verifyToken = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    if (!verifyToken) {
      return res.status(400).json({ message: "user doesn't have valid token" })
    }

    req.userId = verifyToken.userId
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: `is auth error ${error}` })
  }
}
export default isAuth