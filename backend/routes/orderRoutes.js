const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Order = require("../models/Order");


// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

router.get("/", async(req, res) => {
    console.log("🔥 NEW MY-ORDERS ROUTE IS RUNNING");
    try {

        const orders = await Order.find()
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        console.error(
            "GET ALL ORDERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });

    }

});


// =====================================================
// GET CUSTOMER MY ORDERS
// =====================================================

router.get("/my-orders", async(req, res) => {

    try {

        const { userId } = req.query;

        console.log(
            "===================================="
        );

        console.log(
            "MY ORDERS REQUEST RECEIVED"
        );

        console.log(
            "USER ID:",
            userId
        );


        // -------------------------------------------------
        // CHECK USER ID
        // -------------------------------------------------

        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required"

            });

        }


        // -------------------------------------------------
        // CHECK VALID MONGODB OBJECT ID
        // -------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(userId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid user ID"

            });

        }


        // -------------------------------------------------
        // FIND CUSTOMER ORDERS
        // -------------------------------------------------

        const orders = await Order.find({

            userId: new mongoose.Types.ObjectId(userId)

        }).sort({

            createdAt: -1

        });


        console.log(
            "CUSTOMER ORDERS FOUND:",
            orders.length
        );


        console.log(
            "===================================="
        );


        return res.status(200).json({

            success: true,

            orders: orders

        });


    } catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "GET MY ORDERS ERROR:"
        );

        console.error(
            error
        );

        console.error(
            "===================================="
        );


        return res.status(500).json({

            success: false,

            message: "Failed to fetch orders",

            error: error.message

        });

    }

});


// =====================================================
// CREATE ORDER
// =====================================================

router.post("/", async(req, res) => {

    try {

        console.log(
            "CREATE ORDER REQUEST:"
        );

        console.log(
            req.body
        );


        const {

            userId,

            customerName,

            phone,

            address,

            notes,

            items,

            totalAmount,

            paymentMethod,

            paymentStatus,

            transactionId,

            status

        } = req.body;


        // -------------------------------------------------
        // REQUIRED FIELDS
        // -------------------------------------------------

        if (!customerName ||
            !phone ||
            !address ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0 ||
            totalAmount === undefined
        ) {

            return res.status(400).json({

                success: false,

                message: "Customer details, items and total amount are required"

            });

        }


        // -------------------------------------------------
        // PREPARE ORDER DATA
        // -------------------------------------------------

        const orderData = {

            customerName,

            phone,

            address,

            notes: notes || "",

            items,

            totalAmount: Number(totalAmount),

            paymentMethod: paymentMethod || "COD",

            paymentStatus: paymentStatus || "Pending",

            transactionId: transactionId || "",

            status: status || "Pending"

        };


        // -------------------------------------------------
        // ADD USER ID IF AVAILABLE
        // -------------------------------------------------

        if (
            userId &&
            mongoose.Types.ObjectId.isValid(userId)
        ) {

            orderData.userId =
                new mongoose.Types.ObjectId(userId);

        }


        // -------------------------------------------------
        // CREATE ORDER
        // -------------------------------------------------

        const order =
            await Order.create(orderData);


        console.log(
            "ORDER CREATED:",
            order._id
        );


        res.status(201).json({

            success: true,

            message: "Order created successfully",

            order

        });


    } catch (error) {

        console.error(
            "CREATE ORDER ERROR:"
        );

        console.error(
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to create order",

            error: error.message

        });

    }

});


// =====================================================
// GET SINGLE ORDER
// =====================================================

router.get("/:id", async(req, res) => {

    try {

        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order ID"

            });

        }


        const order =
            await Order.findById(id);


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        res.status(200).json({

            success: true,

            order

        });


    } catch (error) {

        console.error(
            "GET SINGLE ORDER ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to fetch order",

            error: error.message

        });

    }

});


// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================

router.put("/:id/status", async(req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;


        const allowedStatuses = [

            "Pending",

            "Preparing",

            "Out for Delivery",

            "Delivered"

        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order status"

            });

        }


        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order ID"

            });

        }


        const order =
            await Order.findByIdAndUpdate(

                id,

                {
                    status: status
                },

                {
                    new: true
                }

            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        res.status(200).json({

            success: true,

            message: "Order status updated successfully",

            order

        });


    } catch (error) {

        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to update order status",

            error: error.message

        });

    }

});


module.exports = router;