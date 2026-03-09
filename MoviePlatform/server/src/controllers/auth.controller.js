const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};



const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const user = await User.create({ username, email, password });

        if (user) {
            const token = generateToken(user._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(400).json({
                message: "Invalid user data",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Block banned users before issuing any token
        if (user.isBanned) {
            return res.status(403).json({
                message: "Your account has been banned. Please contact support.",
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



const logoutUser = async (req, res) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            // Get expiration from token
            const decoded = jwt.decode(token);
            if (decoded && decoded.exp) {
                const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
                if (expiresIn > 0) {
                    // Set token in Redis blacklist with expiry (capped at 1 day)
                    await redisClient.set(
                        token,
                        "blacklisted",
                        "EX",
                        Math.min(expiresIn, 86400),
                    );
                }
            }
        } catch (error) {
            console.error("Logout error pushing to Redis:", error);
        }
    }

    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({
        message: "Logged out successfully",
    });
};



const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404).json({
            message: "User not found",
        });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getMe };
