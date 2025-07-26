const express = require("express");
const router = express.Router();
const submissionController = require("../controller/submitController");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/", authenticateUser, submissionController.saveSubmission);

module.exports = router;
