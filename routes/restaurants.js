const express = require("express");
const {
  getRestaurant,
  getRestaurants,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getRestaurantsInRadius,
  restaurantUploadPhoto,
} = require("../controllers/restaurants");

const Restaurant = require("../models/Restaurant");

const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const courseRouter = require("./dishes");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:restaurantId/dishes", courseRouter);

router.route("/radius/:city/:distance").get(getRestaurantsInRadius);

router
  .route("/")
  .get(advancedResults(Restaurant, "dishes"), getRestaurants)
  .post(protect, authorize("publisher", "admin"), createRestaurant);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), restaurantUploadPhoto);

router
  .route("/:id")
  .get(getRestaurant)
  .put(protect, authorize("publisher", "admin"), updateRestaurant)
  .delete(protect, authorize("publisher", "admin"), deleteRestaurant);

module.exports = router;
