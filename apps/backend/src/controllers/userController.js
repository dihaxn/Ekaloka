import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import validator from "validator"

const createToken = (id) => {
    const secret = process.env.JWT_SECRET || "dummy-secret";
    return jwt.sign({ id }, secret);
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        // Return same message if user doesn't exist or password doesn't match
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token, role: user.role });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // check if user already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({ success: true, token, role: user.role });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { loginUser, registerUser }
