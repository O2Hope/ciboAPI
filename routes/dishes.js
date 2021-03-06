const express = require("express");
const {
    getDishes,
    getDish,
    createDish,
    updateDish,
    deleteDish
} = require("../controllers/dishes");

const advancedResults = require('../middleware/advancedResults')

const Dish = require('../models/Dish')

const router = express.Router({mergeParams: true});

router.route("/").get(advancedResults(Dish,{path: 'restaurant', select: "name description"}),getDishes).post(createDish)
router.route("/:id").get(getDish).put(updateDish).delete(deleteDish)


module.exports = router;