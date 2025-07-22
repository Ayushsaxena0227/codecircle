const express = require("express");
const router = express.Router();
const { createUser } = require("../controller/userController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/create", verifyToken, createUser);

module.exports = router;
