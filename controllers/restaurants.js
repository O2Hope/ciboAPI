const path = require('path')
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
    const reqQuery = {...req.query};

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    // Finding resources
    query = Restaurant.find(JSON.parse(queryStr)).populate("dishes");

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit;
    const total = await Restaurant.countDocuments();

    query = query.skip(startIndex).limit(limit)

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    // Executing query
    const restaurants = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res
        .status(200)
        .json({success: true, count: restaurants.length, pagination, data: restaurants});
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

    res.status(200).json({success: true, data: restaurant});
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

    res.status(200).json({success: true, data: restaurant});
});

// @desc    Delete restaurant
// @route   DELETE /api/v1/restaurants/:id
// @access  Private
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        return next(
            new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
        );
    }

    await restaurant.remove();

    res.status(200).json({success: true, data: {}});
});

// @desc    Get restaurants within a radius
// @route   GET /api/v1/restaurants/radius/:city/:distance
// @access  Private
exports.getRestaurantsInRadius = asyncHandler(async (req, res, next) => {
    const {city, distance} = req.params;

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
        .json({success: true, count: restaurants.length, data: restaurants});
});

// @desc    Upload restaurant photo
// @route   PUT /api/v1/restaurants/:id/photo
// @access  Private

exports.restaurantUploadPhoto = asyncHandler(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        return next(
            new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
        );
    }

    if (!req.files) {
        return next(
            new ErrorResponse(`Please upload an image`, 400)
        );
    }

    const {file} = req.files;

    console.log(file)

    // Make sure the image is and Image file
    if (!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`File is not an image`, 400)
        );
    }

    // Check image size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`The image need to be less than ${process.env.MAX_FILE_UPLOAD}`, 400)
        );
    }

    // Create custom photo
    file.name = `photo_${restaurant._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.log(err)
            return next(
                new ErrorResponse(`Problem with file upload`, 500)
            );
        }

        await Restaurant.findByIdAndUpdate(req.params.id, {photo: file.name})

        res.status(200).json({success: true, data: file.name})
    })
});