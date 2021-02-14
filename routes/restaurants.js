const express = require("express");
const {
  getRestaurant,
  getRestaurants,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} = require("../controllers/restaurants");

const router = express.Router();

router.route("/").get(getRestaurants).post(createRestaurant);

router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);

module.exports = router;
