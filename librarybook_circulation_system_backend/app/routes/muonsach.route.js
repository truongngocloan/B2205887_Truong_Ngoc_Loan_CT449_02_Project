const express = require("express");
const controller = require("../controllers/muonsach.controller");
const router = express.Router();

router.route("/")
    .get(controller.findAll)
    .post(controller.create);

// --- SỬA LẠI CÁC DÒNG DƯỚI ĐÂY ---

// 1. Duyệt: Frontend gọi /:id/approve
router.route("/:id/approve").put(controller.approve);

// 2. Từ chối: Frontend gọi /:id/reject
router.route("/:id/reject").put(controller.reject);

// 3. Trả sách: Frontend gọi /:id/return (map vào hàm controller.returnBook)
router.route("/:id/return").put(controller.returnBook);

// 4. Hủy: Frontend gọi /:id/cancel
router.route("/:id/cancel").put(controller.userCancel);

module.exports = router;