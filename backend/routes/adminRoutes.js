const express = require("express");

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        return res.json({
            success: true,
            message: "Admin login successful"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password"
    });
});

module.exports = router;