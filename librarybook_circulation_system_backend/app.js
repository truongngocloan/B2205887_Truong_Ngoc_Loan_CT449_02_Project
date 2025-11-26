const express = require("express");
const cors = require("cors");
const sachRouter = require("./app/routes/sach.route"); // <--- Thêm dòng này
const ApiError = require("./app/api-error"); // <--- Thêm dòng này

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Xin chào! Đây là Backend quản lý mượn sách." });
});
// console.log("Gia tri cua sachRouter la:", sachRouter); // <--- THÊM DÒNG NÀY
// Đăng ký route API
app.use("/api/sach", sachRouter); // <--- Thêm dòng này

// Xử lý lỗi 404 (Không tìm thấy route)
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// Xử lý lỗi tập trung
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;