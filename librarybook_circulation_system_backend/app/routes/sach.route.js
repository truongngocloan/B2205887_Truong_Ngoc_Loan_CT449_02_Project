const express = require("express");
const controller = require("../controllers/sach.controller");
const upload = require("../middleware/upload"); // Import middleware vừa tạo

const router = express.Router();

router.route("/")
    .get(controller.findAll)
    // Thêm upload.single("hinhAnh") để xử lý file từ form có name="hinhAnh"
    .post(upload.single("hinhAnh"), controller.create);

router.route("/:id")
    .get(controller.findOne)
    // Cũng thêm vào update
    .put(upload.single("hinhAnh"), controller.update)
    .delete(controller.delete);

module.exports = router;