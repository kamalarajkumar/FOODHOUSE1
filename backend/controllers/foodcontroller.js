const Food = require("../models/Food");

// GET all foods
const getFoods = async(req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get foods",
            error: error.message
        });
    }
};

// GET one food
const getFoodById = async(req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get food",
            error: error.message
        });
    }
};

// CREATE food
const createFood = async(req, res) => {
    try {
        const food = await Food.create(req.body);

        res.status(201).json({
            message: "Food created successfully",
            food
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create food",
            error: error.message
        });
    }
};

// UPDATE food
const updateFood = async(req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true,
                runValidators: true
            }
        );

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        res.status(200).json({
            message: "Food updated successfully",
            food
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update food",
            error: error.message
        });
    }
};

// DELETE food
const deleteFood = async(req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        res.status(200).json({
            message: "Food deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete food",
            error: error.message
        });
    }
};

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
};