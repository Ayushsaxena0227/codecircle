const express = require("express");
const router = express.Router();
const statsCtrl = require("../controller/statsController");

router.get("/", statsCtrl.getPublicStats);

module.exports = router;
