const express = require("express");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", auth.register); // Chỉ độc giả
router.post("/login", auth.login);       // Cả hai

module.exports = router;