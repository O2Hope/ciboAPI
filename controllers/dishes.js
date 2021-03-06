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

// @desc    Get a single dishes
// @route   GET /api/v1/dishes/:id
// @access  Public
exports.getDish = asyncHandler(async(req, res, next) => {
  const {id} = req.params

  const dish = await Dish.findById(id).populate({
    path: 'restaurant',
    select: 'name'
  })

  if (!dish) {
    return next(
        new ErrorResponse(`Dish not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({success: true, data: dish})
})

// @desc    Create new dish
// @route   POST /api/v1/restaurants/:restaurantId/dishes
// @access  Private
exports.createDish = asyncHandler(async (req, res, next) => {
  const {restaurantId} = req.params
  req.body.restaurant = restaurantId

  const restaurant = await Restaurant.findById(restaurantId)

  if(!restaurant){
    return next(
        new ErrorResponse(`Restaurant not found with id of ${restaurantId}`, 404)
    );
  }

  const dish = await Dish.create(req.body);

  res.status(201).json({ success: true, data: dish });
});

// @desc    Update dish
// @route   PUT /api/v1/restaurants/:restaurantId/dishes
// @access  Private
exports.updateDish = asyncHandler(async(req,res,next) => {
  const {id} = req.params

  let dish = await Dish.findById(id)

  if(!dish){
    return next(
        new ErrorResponse(`Dish not found with id of ${id}`, 404)
    );
  }

  dish = await Dish.findByIdAndUpdate(id, req.body,{
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: dish });
})

// @desc    Delete dish
// @route   DELETE /api/v1/dishes/:id
exports.deleteDish = asyncHandler(async(req,res,next) => {
  const {id} = req.params;

  const dish = await Dish.remove(id)

  if(!dish){
    return next(
        new ErrorResponse(`Dish not found with id of ${id}`, 404)
    );
  }

  await dish.remove();

  res.status(200).json({success: true, data: {}})

})