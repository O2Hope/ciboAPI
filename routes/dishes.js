const express = require("express");
const {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
} = require("../controllers/dishes");

const { protect, authorize } = require("../middleware/auth");

const advancedResults = require("../middleware/advancedResults");

const Dish = require("../models/Dish");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Dish, { path: "restaurant", select: "name description" }),
    getDishes
  )
  .post(protect, authorize("publisher", "admin"), createDish);
router
  .route("/:id")
  .get(getDish)
  .put(protect, authorize("publisher", "admin"), updateDish)
  .delete(protect, authorize("publisher", "admin"), deleteDish);

module.exports = router;