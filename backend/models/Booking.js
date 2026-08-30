const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
        tableId: {
            type: String,
            required: true
        },

        capacity: {
            type: Number,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        customerName: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        guests: {
            type: Number,
            required: true
        },

        requests: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Confirmed",
                "Cancelled",
                "Completed"
            ],
            default: "Confirmed"
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Booking",
        bookingSchema
    );