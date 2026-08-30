const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");


/* =====================================================
   GET ALL BOOKINGS / CHECK AVAILABILITY
===================================================== */

router.get("/", async(req, res) => {

    try {

        const { date, time } = req.query;

        let bookings;

        if (date && time) {

            bookings = await Booking.find({
                date: date,
                time: time,
                status: "Confirmed"
            }).sort({
                createdAt: -1
            });

        } else {

            bookings = await Booking.find()
                .sort({
                    createdAt: -1
                });

        }

        res.status(200).json(bookings);

    } catch (error) {

        console.error("GET BOOKINGS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch bookings"
        });

    }

});


/* =====================================================
   CREATE BOOKING
===================================================== */

router.post("/", async(req, res) => {

    try {

        const {
            tableId,
            capacity,
            date,
            time,
            customerName,
            phone,
            email,
            guests,
            requests
        } = req.body;


        if (!tableId ||
            !capacity ||
            !date ||
            !time ||
            !customerName ||
            !phone ||
            !email ||
            !guests
        ) {

            return res.status(400).json({
                message: "Please fill all required fields"
            });

        }


        const existingBooking =
            await Booking.findOne({

                tableId: tableId,

                date: date,

                time: time,

                status: "Confirmed"

            });


        if (existingBooking) {

            return res.status(409).json({

                message: `Table ${tableId} is already booked for ${date} at ${time}.`

            });

        }


        const booking =
            await Booking.create({

                tableId,
                capacity,
                date,
                time,
                customerName,
                phone,
                email,
                guests,
                requests

            });


        res.status(201).json({

            success: true,

            message: "Table booked successfully",

            booking

        });


    } catch (error) {

        console.error(
            "CREATE BOOKING ERROR:",
            error
        );

        res.status(500).json({

            message: "Failed to create booking"

        });

    }

});


/* =====================================================
   GET SINGLE BOOKING
===================================================== */

router.get("/:id", async(req, res) => {

    try {

        const booking =
            await Booking.findById(
                req.params.id
            );


        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }


        res.status(200).json({

            success: true,

            booking

        });


    } catch (error) {

        console.error(
            "GET SINGLE BOOKING ERROR:",
            error
        );

        res.status(500).json({

            message: "Failed to find booking"

        });

    }

});


/* =====================================================
   ADMIN UPDATE STATUS
===================================================== */

router.put("/:id/status", async(req, res) => {

    try {

        const { status } = req.body;


        const allowedStatuses = [
            "Confirmed",
            "Cancelled",
            "Completed"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                message: "Invalid booking status"

            });

        }


        const booking =
            await Booking.findByIdAndUpdate(

                req.params.id,

                {
                    status: status
                },

                {
                    new: true
                }

            );


        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }


        res.status(200).json({

            success: true,

            message: "Booking status updated",

            booking

        });


    } catch (error) {

        console.error(
            "UPDATE STATUS ERROR:",
            error
        );

        res.status(500).json({

            message: "Failed to update booking status"

        });

    }

});


/* =====================================================
   CUSTOMER CANCEL BOOKING
===================================================== */

router.put("/:id/cancel", async(req, res) => {

    console.log(
        "CANCEL REQUEST RECEIVED:",
        req.params.id
    );


    try {

        const booking =
            await Booking.findById(
                req.params.id
            );


        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }


        if (booking.status !== "Confirmed") {

            return res.status(400).json({

                message: `This booking is already ${booking.status}.`

            });

        }


        booking.status = "Cancelled";

        await booking.save();


        console.log(
            "BOOKING CANCELLED:",
            booking._id
        );


        return res.status(200).json({

            success: true,

            message: "Reservation cancelled successfully",

            booking

        });


    } catch (error) {

        console.error(
            "CANCEL BOOKING ERROR:",
            error
        );

        return res.status(500).json({

            message: "Failed to cancel reservation"

        });

    }

});


module.exports = router;