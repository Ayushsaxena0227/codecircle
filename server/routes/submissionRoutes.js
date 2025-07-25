const express = require("express");
const router = express.Router();
const submissionController = require("../controller/submitController");
const authenticateUser = require("../middleware/authMiddleware");

const { saveSubmission } = submissionController;

router.post("/", authenticateUser, saveSubmission);

module.exports = router;
