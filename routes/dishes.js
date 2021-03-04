const express = require("express");
const {
    getDishes,
    createDish
} = require("../controllers/dishes");

const router = express.Router({mergeParams: true});

router.route("/").get(getDishes).post(createDish)
router.route("/restaurants/:restaurantId/dishes").get(getDishes)

module.exports = router;