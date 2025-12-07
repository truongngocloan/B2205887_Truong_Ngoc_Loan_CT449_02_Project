const express = require("express");
const thongke = require("../controllers/thongke.controller");
const router = express.Router();

router.get("/", thongke.getStats);

module.exports = router;