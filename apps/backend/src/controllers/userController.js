import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validator from "validator";

const createToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    return jwt.sign({ id }, secret, { expiresIn: '3d' }); // Add token expiration
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Please enter a valid email." });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please check your email or register." });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials. Please check your password." });
        }

        const token = createToken(user._id);
        res.status(200).json({ success: true, token, role: user.role });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "An unexpected server error occurred." });
    }
};

// register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ success: false, message: "All fields (name, email, password) are required." });
    }

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "An account with this email already exists." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address." });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.status(201).json({ success: true, token, role: user.role });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "An unexpected server error occurred during registration." });
    }
};

export { loginUser, registerUser };
