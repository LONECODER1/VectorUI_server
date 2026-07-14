import User from "../models/user.model.js";
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ message: "user does not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: "get current user error" });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
