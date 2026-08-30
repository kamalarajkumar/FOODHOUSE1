const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    // ================================
    // CUSTOMER ACCOUNT
    // ================================

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

    customerName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    notes: {
        type: String,
        default: ""
    },

    items: [{
        foodId: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        image: {
            type: String,
            default: ""
        }
    }],

    totalAmount: {
        type: Number,
        required: true
    },

    // ================================
    // PAYMENT INFORMATION
    // ================================

    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        default: "COD"
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    transactionId: {
        type: String,
        default: ""
    },

    // ================================
    // ORDER STATUS
    // ================================

    status: {
        type: String,
        default: "Pending"
    }

}, {
    timestamps: true
});


module.exports =
    mongoose.model("Order", orderSchema);