const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authmiddleware");

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "User authenticated",
    uid: req.user.uid,
    email: req.user.email,
  });
});

module.exports = router;
