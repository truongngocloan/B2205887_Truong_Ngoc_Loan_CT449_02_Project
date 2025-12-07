const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lưu vào thư mục 'public/uploads'
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        // Đặt tên file = thời gian hiện tại + đuôi file gốc (để tránh trùng)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });
module.exports = upload;