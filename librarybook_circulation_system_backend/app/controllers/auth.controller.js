const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Đăng ký (Chỉ dành cho Độc giả)
exports.register = async (req, res, next) => {
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        
        // Kiểm tra xem số điện thoại đã tồn tại chưa
        const existingUser = await docGiaService.findByPhone(req.body.dienThoai);
        if (existingUser) {
            return next(new ApiError(400, "Số điện thoại này đã được đăng ký!"));
        }

        const document = await docGiaService.create(req.body);
        return res.send({ message: "Đăng ký thành công", data: document });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi đăng ký tài khoản"));
    }
};

// Đăng nhập (Xử lý cho cả 2 vai trò)
exports.login = async (req, res, next) => {
    const { username, password, role } = req.body; 
    // role: 'docgia' hoặc 'nhanvien'
    // username: là số điện thoại

    if (!username || !password || !role) {
        return next(new ApiError(400, "Vui lòng nhập đầy đủ thông tin"));
    }

    try {
        let user = null;
        let service = null;

        if (role === 'docgia') {
            service = new DocGiaService(MongoDB.client);
            // DocGia dùng 'dienThoai'
            user = await service.findByPhone(username); 
        } else if (role === 'nhanvien') {
            service = new NhanVienService(MongoDB.client);
            // NhanVien dùng 'soDienThoai' (khác tên trường một chút tùy DB của bạn)
            user = await service.login(username, password);
        } else {
            return next(new ApiError(400, "Vai trò không hợp lệ"));
        }

        // Kiểm tra mật khẩu (Với Độc giả, vì findByPhone chỉ tìm user, cần check pass ở đây)
        // Lưu ý: Thực tế nên mã hóa password. Ở đây so sánh text thuần theo bài tập.
        if (!user || user.password !== password) {
            return next(new ApiError(401, "Sai số điện thoại hoặc mật khẩu"));
        }

        // Trả về thông tin user (đã loại bỏ password)
        const { password: p, ...userInfo } = user;
        return res.send({ 
            message: "Đăng nhập thành công", 
            user: { ...userInfo, role: role } // Gắn thêm role để frontend biết
        });

    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Lỗi máy chủ"));
    }
};