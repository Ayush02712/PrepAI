const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {

    try {

        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const existingUsername = await userModel.findOne({ username })

        if (existingUsername) {
            return res.status(409).json({
                message: "Username already exists"
            })
        }

        const existingEmail = await userModel.findOne({ email })

        if (existingEmail) {
            return res.status(409).json({
                message: "This email is already registered. Please login."
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {

        if (error.code === 11000) {

            if (error.keyPattern.username) {
                return res.status(409).json({
                    message: "Username already exists"
                })
            }

            if (error.keyPattern.email) {
                return res.status(409).json({
                    message: "This email is already registered. Please login."
                })
            }
        }

        console.log(error)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

/**
 * @name loginUserController
 * @description Login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {

    try {

        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

/**
 * @name logoutUserController
 * @description Logout a user by blacklisting the token and clearing the cookie
 * @access Public
 */

async function logoutUserController(req, res) {

    try {

        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token")

        res.status(200).json({
            message: "User logged out successfully"
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

/**
 * @name getMeController
 * @description Get details of the logged in user
 * @access Private
 */

async function getMeController(req, res) {

    try {

        const user = await userModel.findById(req.user.id)

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}