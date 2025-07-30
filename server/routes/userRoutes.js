const express = require("express");
const router = express.Router();
const { createUser } = require("../controller/userController");
const verifyToken = require("../middleware/authMiddleware");
const { getOverview } = require("../controller/userController");
const { getSolvedProblems } = require("../controller/userController");

router.post("/create", verifyToken, createUser);
router.get("/overview", verifyToken, getOverview);
router.get("/solved", verifyToken, getSolvedProblems);

module.exports = router;
