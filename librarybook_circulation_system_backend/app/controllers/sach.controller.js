// File: app/controllers/sach.controller.js

const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// 1. Hàm tạo sách mới (Quan trọng: Phải có exports.create)
exports.create = async (req, res, next) => {
    try {
        const service = new SachService(MongoDB.client);
        
        // Nếu có file ảnh được upload
        if (req.file) {
            // Tạo đường dẫn đầy đủ: http://localhost:3000/public/uploads/ten_file.jpg
            req.body.hinhAnh = `http://localhost:3000/public/uploads/${req.file.filename}`;
        }

        const result = await service.create(req.body);
        return res.send(result);
    } catch (error) { return next(new ApiError(500, error.message)); }
};


exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const service = new SachService(MongoDB.client);
        // Lấy từ khóa 'name' từ URL (ví dụ: .../sach?name=json)
        const { name } = req.query; 

        if (name) {
            // Nếu có từ khóa, gọi hàm tìm kiếm (Bạn cần đảm bảo bên Service có hàm findByName)
            // Hoặc dùng hàm find() chung nếu bạn đã viết sẵn logic filter
            documents = await service.findByName(name); 
        } else {
            // Nếu không có từ khóa, lấy tất cả
            documents = await service.findAll();
        }
        
        return res.send(documents);
    } catch (error) { 
        console.log(error); // Log lỗi ra để dễ debug
        return next(new ApiError(500, "Lỗi lấy danh sách sách")); 
    }
};

// 3. Hàm lấy 1 sách theo ID
exports.findOne = async (req, res, next) => {
    try {
        const service = new SachService(MongoDB.client);
        const document = await service.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send(document);
    } catch (error) { 
        return next(new ApiError(500, "Lỗi tìm kiếm sách")); 
    }
};

// 4. Hàm cập nhật sách
exports.update = async (req, res, next) => {
    try {
        const service = new SachService(MongoDB.client);

        if (req.file) {
            req.body.hinhAnh = `http://localhost:3000/public/uploads/${req.file.filename}`;
        }

        const document = await service.update(req.params.id, req.body);
        // ... giữ nguyên phần xử lý lỗi
        return res.send({ message: "Cập nhật thành công" });
    } catch (error) { return next(new ApiError(500, "Lỗi cập nhật")); }
};

// 5. Hàm xóa sách
exports.delete = async (req, res, next) => {
    try {
        const service = new SachService(MongoDB.client);
        const document = await service.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send({ message: "Đã xóa sách thành công" });
    } catch (error) { 
        return next(new ApiError(500, "Lỗi xóa sách")); 
    }
};
