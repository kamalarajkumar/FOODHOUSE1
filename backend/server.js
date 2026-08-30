const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// ROUTES
// =====================================================

const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FOODHOUSE backend is running!"
    });
});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// =====================================================
// MONGODB CONNECTION + SERVER START
// =====================================================

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`FOODHOUSE server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
        process.exit(1);
    });