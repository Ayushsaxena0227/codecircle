const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const favoriteController = require("../controller/favouriteController");

router.post("/:problemId", authenticateUser, favoriteController.toggleFavorite);

router.get("/", authenticateUser, favoriteController.getFavorites);

module.exports = router;
