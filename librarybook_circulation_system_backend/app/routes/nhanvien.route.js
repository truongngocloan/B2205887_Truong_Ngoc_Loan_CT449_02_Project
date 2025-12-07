const express = require("express");
const controller = require("../controllers/nhanvien.controller");
const router = express.Router();

router.route("/").post(controller.create); // Tạo nhân viên
router.route("/login").post(controller.login); // Đăng nhập
module.exports = router;