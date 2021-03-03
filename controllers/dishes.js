const Restaurant = require("../models/Restaurant");
const Dish = require("../models/Dish")
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get dishes
// @route   GET /api/v1/dishes
// @route   GET /api/v1/restaurants/:restaurantId/dishes
// @access  Public
exports.getDishes = asyncHandler(async(req, res, next) => {
    let query;
    const {restaurantId} = req.params;

    if(restaurantId){
        query = Dish.find({restaurant: restaurantId})
    }else{
        query = Dish.find();
    }

    const dishes = await query;

    res.status(200).json({ success: true, count: dishes.length, data: dishes})
})