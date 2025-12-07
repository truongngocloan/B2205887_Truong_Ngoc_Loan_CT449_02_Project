const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const authRouter = require("./app/routes/auth.route");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Khi truy cập http://localhost:3000/public/uploads/ten_anh.jpg sẽ xem được ảnh
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.json({ message: "Welcome to Library App" }));

// Routes
app.use("/api/sach", require("./app/routes/sach.route"));
app.use("/api/nxb", require("./app/routes/nhaxuatban.route"));
app.use("/api/docgia", require("./app/routes/docgia.route"));
app.use("/api/nhanvien", require("./app/routes/nhanvien.route"));
app.use("/api/muon", require("./app/routes/muonsach.route"));
app.use("/api/auth", authRouter); // Đường dẫn sẽ là /api/auth/login
app.use("/api/nxb", require("./app/routes/nhaxuatban.route"));
app.use("/api/tacgia", require("./app/routes/tacgia.route"));
app.use("/api/theloai", require("./app/routes/theloai.route"));
app.use("/api/thongke", require("./app/routes/thongke.route"));
// Error Handling
app.use((req, res, next) => next(new ApiError(404, "Resource not found")));
app.use((err, req, res, next) => res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" }));

module.exports = app;


// const express = require("express"); // express: Thư viện chính để tạo web server.
// const cors = require("cors"); // cors: Thư viện giúp xử lý vấn đề CORS (Cross-Origin Resource Sharing). Nó cho phép trình duyệt từ một domain khác (ví dụ frontend chạy port 3000) gọi API tới backend này
// const sachRouter = require("./app/routes/sach.route"); // <--- Import router quản lý Sách. File này chứa danh sách các quy tắc đường đi cụ thể cho đối tượng "Sách" (ví dụ: muốn thêm sách thì đi đường nào, xóa sách đi đường nào).
// const ApiError = require("./app/api-error"); // <--- Import class xử lý lỗi tùy chỉnh

// const app = express(); // Tạo ra một "ứng dụng" Express. Biến app này chính là đại diện cho toàn bộ website backend của bạn.

// app.use(cors()); // Ý nghĩa: Kích hoạt CORS cho toàn bộ ứng dụng. Tác dụng: Mọi request gửi đến server này đều sẽ được cho phép truy cập (trừ khi bạn cấu hình chặn cụ thể). 
// app.use(express.json()); // Dòng này giúp chuyển đổi chuỗi JSON thành Object Javascript

// app.get("/", (req, res) => {
//     res.json({ message: "Xin chào! Đây là Backend quản lý mượn sách." });
// });

// // Đăng ký route API
// app.use("/api/sach", sachRouter); // Giải thích: Trong file sachRouter, nếu bạn định nghĩa đường dẫn con là / (lấy tất cả), thì đường dẫn thực tế sẽ là: /api/sach/. Nếu đường dẫn con là /create, thì thực tế là: /api/sach/create.

// // Xử lý lỗi 404 (Không tìm thấy route)
// app.use((req, res, next) => {
//     return next(new ApiError(404, "Resource not found"));
// });

// // Xử lý lỗi tập trung
// app.use((err, req, res, next) => {
//     return res.status(err.statusCode || 500).json({
//         message: err.message || "Internal Server Error",
//     });
// });

// module.exports = app; // Xuất biến app ra ngoài.  File server.js (file chạy chính) sẽ require file này để khởi động server lắng nghe ở cổng 3000. Điều này giúp tách biệt việc "cấu hình server" (file này) và việc "chạy server" (file server.js).