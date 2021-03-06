const express = require("express");
const {
  getRestaurant,
  getRestaurants,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getRestaurantsInRadius,
    restaurantUploadPhoto
} = require("../controllers/restaurants");

const Restaurant = require('../models/Restaurant')

const advancedResults = require('../middleware/advancedResults')

// Include other resource routers
const courseRouter = require('./dishes')

const router = express.Router();

// Re-route into other resource routers
router.use('/:restaurantId/dishes', courseRouter)



router.route("/radius/:city/:distance").get(getRestaurantsInRadius);


router.route("/").get(advancedResults(Restaurant, 'dishes'),getRestaurants).post(createRestaurant);

router.route("/:id/photo").put(restaurantUploadPhoto)

router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);


module.exports = router;
