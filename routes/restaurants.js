const express = require("express");
const {
  getRestaurant,
  getRestaurants,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getRestaurantsInRadius,
} = require("../controllers/restaurants");

const router = express.Router();

router.route("/radius/:city/:distance").get(getRestaurantsInRadius);


router.route("/").get(getRestaurants).post(createRestaurant);

router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);


module.exports = router;
