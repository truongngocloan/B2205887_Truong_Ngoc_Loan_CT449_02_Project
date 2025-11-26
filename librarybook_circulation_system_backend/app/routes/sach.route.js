// Tạo Route định nghĩa đường dẫn
const express = require("express");
const sach = require("../controllers/sach.controller");

const router = express.Router();

router.route("/")
    .get(sach.findAll);

module.exports = router;