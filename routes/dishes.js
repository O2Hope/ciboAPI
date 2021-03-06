const express = require("express");
const {
    getDishes,
    getDish,
    createDish,
    updateDish,
    deleteDish
} = require("../controllers/dishes");

const router = express.Router({mergeParams: true});

router.route("/").get(getDishes).post(createDish)
router.route("/:id").get(getDish).put(updateDish).delete(deleteDish)


module.exports = router;