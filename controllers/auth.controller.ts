import { genToken } from "../configs/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

// Helper to determine if an email is admin
const isAdminEmail = (email) => {
    return email === process.env.ADMIN_GMAIL_ID;
};

export const googleSignup = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });

        const role = isAdminEmail(email) ? "admin" : "user";

        if (!user) {
            user = await User.create({
                name,
                email,
                role
            });
        } else if (isAdminEmail(email) && user.role !== "admin") {
            // Upgrade existing user to admin if their email matches
            user.role = "admin";
            await user.save();
        }

        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `googleSignup error: ${error}` });
    }
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const role = isAdminEmail(email) ? "admin" : "user";
        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Strip password from response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Signup error: ${error}` });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Handle users who signed up with Google and don't have a password
        if (!user.password) {
            return res.status(400).json({ message: "Please login with Google" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Dynamically upgrade to admin if email was just added to .env
        if (isAdminEmail(email) && user.role !== "admin") {
            user.role = "admin";
            await user.save();
        }

        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Login error: ${error}` });
    }
};

export const logOut = async (req: Request, res: Response) => {
    try {
        await res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).json({ message: "logOut Successfully" });
    } catch (error) {
        return res.status(500).json({ message: `logout Error ${error}` });
    }
};
