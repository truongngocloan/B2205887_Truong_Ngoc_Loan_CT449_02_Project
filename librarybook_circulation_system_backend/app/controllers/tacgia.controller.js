const TacGiaService = require("../services/tacgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try {
        const service = new TacGiaService(MongoDB.client);
        const document = await service.create(req.body);
        return res.send(document);
    } catch (error) { 
        return next(new ApiError(500, error.message || "Lỗi tạo tác giả")); 
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = new TacGiaService(MongoDB.client); 
        
        // --- SỬA Ở ĐÂY ---
        // Không lấy page/limit nữa, gọi hàm findAll() trống
        const documents = await service.findAll(); 
        
        return res.send(documents);
    } catch (error) { 
        console.log("Lỗi findAll:", error); 
        return next(new ApiError(500, "Lỗi lấy danh sách")); 
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const service = new TacGiaService(MongoDB.client);
        const document = await service.findById(req.params.id);
        if (!document) return next(new ApiError(404, "Không tìm thấy"));
        return res.send(document);
    } catch (error) { 
        return next(new ApiError(500, "Lỗi tìm kiếm")); 
    }
};

exports.update = async (req, res, next) => {
    try {
        const service = new TacGiaService(MongoDB.client);
        const document = await service.update(req.params.id, req.body);
        if (!document) return next(new ApiError(404, "Không tìm thấy"));
        return res.send({ message: "Cập nhật thành công" });
    } catch (error) { 
        return next(new ApiError(500, "Lỗi cập nhật")); 
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = new TacGiaService(MongoDB.client);
        const document = await service.delete(req.params.id);
        if (!document) return next(new ApiError(404, "Không tìm thấy"));
        return res.send({ message: "Đã xóa thành công" });
    } catch (error) { 
        return next(new ApiError(500, "Lỗi xóa")); 
    }
};