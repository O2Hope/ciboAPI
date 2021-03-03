const express = require("express");
const {
    getDishes,
} = require("../controllers/dishes");

const router = express.Router({mergeParams: true});

router.route("/").get(getDishes)
router.route("/restaurants/:restaurantId/dishes").get(getDishes)

module.exports = router;