const express = require("express");
const router = express.Router();
const problemController = require("../controller/problemController");
// console.log(problemController);

const { getAllProblems, getProblemById } = problemController;
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, getAllProblems);
router.get("/:id", verifyToken, getProblemById);

module.exports = router;
