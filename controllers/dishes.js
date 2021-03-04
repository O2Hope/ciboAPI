const Restaurant = require("../models/Restaurant");
const Dish = require("../models/Dish");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get dishes
// @route   GET /api/v1/dishes
// @route   GET /api/v1/restaurants/:restaurantId/dishes
// @access  Public
exports.getDishes = asyncHandler(async (req, res, next) => {
  let query;
  const { restaurantId } = req.params;

  if (restaurantId) {
    query = Dish.find({ restaurant: restaurantId });
  } else {
    query = Dish.find().populate({path: 'restaurant', select: "name description"});
  }

  const dishes = await query;

  res.status(200).json({ success: true, count: dishes.length, data: dishes });
});

// @desc    Create new dish
// @route   POST /api/v1/dishes
// @access  Public
exports.createDish = asyncHandler(async (req, res, next) => {
  const dish = await Dish.create(req.body);

  res.status(201).json({ success: true, data: dish });
});