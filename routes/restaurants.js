const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "show all restaurants" });
});

router.get("/:id", (req, res) => {
  res.status(200).json({ success: true, message: `show restaurant ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(200).json({ success: true, message: "Create new restaurant" });
});

router.put("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Update restaurant ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Remove restaurant ${req.params.id}` });
});

module.exports = router;