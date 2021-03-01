const Restaurant = require("../models/Restaurant");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// @desc    Get all restaurants
// @route   GET /api/v1/restaurants
// @access  Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = {...req.query}

  // Fields to exclude
  const removeFields = ['select', 'sort'];

  // Loop over removeFields and delete them
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resources
  query = Restaurant.find(JSON.parse(queryStr))

  // Select fields
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  }else{
    query = query.sort('-createdAt')
  }

  // Executing query
  const restaurants = await query;

  res
    .status(200)
    .json({ success: true, count: restaurants.length, data: restaurants });
});

// @desc    Get single restaurants
// @route   GET /api/v1/restaurants/:id
// @access  Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: restaurant });
});

// @desc    Create new restaurant
// @route   POST /api/v1/restaurants
// @access  Private
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);

  res.status(201).json({
    success: true,
    data: restaurant,
  });
});

// @desc    Update restaurant
// @route   PUT /api/v1/restaurants/:id
// @access  Private
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: restaurant });
});

// @desc    Delete restaurant
// @route   DELETE /api/v1/restaurants/:id
// @access  Private
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get restaurants within a radius
// @route   GET /api/v1/restaurants/radius/:city/:distance
// @access  Private
exports.getRestaurantsInRadius = asyncHandler(async (req, res, next) => {
  const { city, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(city);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  console.log(lat, lng);

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 6378;

  const restaurants = await Restaurant.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res
    .status(200)
    .json({ success: true, count: restaurants.length, data: restaurants });
});
