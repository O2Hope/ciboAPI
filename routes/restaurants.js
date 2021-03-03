const express = require("express");
const {
  getRestaurant,
  getRestaurants,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getRestaurantsInRadius,
} = require("../controllers/restaurants");

// Include other resource routers
const courseRouter = require('./dishes')

const router = express.Router();

// Re-route into other resource routers
router.use('/:restaurantId/dishes', courseRouter)



router.route("/radius/:city/:distance").get(getRestaurantsInRadius);


router.route("/").get(getRestaurants).post(createRestaurant);

router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);


module.exports = router;
