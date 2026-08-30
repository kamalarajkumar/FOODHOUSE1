const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post("/register", async(req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;


        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });

        }


        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({

            name: name.trim(),

            email: email.toLowerCase().trim(),

            phone: phone || "",

            password: hashedPassword

        });


        res.status(201).json({

            success: true,

            message: "Registration successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }

        });


    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Registration failed"

        });

    }

});


// =====================================================
// LOGIN
// =====================================================

router.post("/login", async(req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check required fields
        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required"

            });

        }


        // Find user
        const user = await User.findOne({

            email: email.toLowerCase().trim()

        });


        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });

        }


        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });

        }


        // Create JWT
        const token = jwt.sign(

            {
                userId: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        res.status(200).json({

            success: true,

            message: "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone

            }

        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Login failed"

        });

    }

});


module.exports = router;