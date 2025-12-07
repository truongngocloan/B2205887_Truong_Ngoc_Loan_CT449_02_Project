const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const result = await service.create(req.body);
        return res.send(result);
    } catch (error) { return next(new ApiError(500, error.message)); }
};
exports.findAll = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client); 
        // Bỏ đoạn lấy page, limit
        const documents = await service.findAll(); // Gọi hàm không tham số
        return res.send(documents); // Trả về mảng []
    } catch (error) { 
        return next(new ApiError(500, "Lỗi lấy danh sách")); 
    }
};
exports.findOne = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const doc = await service.findById(req.params.id);
        return doc ? res.send(doc) : next(new ApiError(404, "Không tìm thấy"));
    } catch (error) { return next(new ApiError(500, "Lỗi tìm kiếm")); }
};
exports.update = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const doc = await service.update(req.params.id, req.body);
        return doc ? res.send(doc) : next(new ApiError(404, "Không tìm thấy"));
    } catch (error) { return next(new ApiError(500, "Lỗi cập nhật")); }
};
exports.delete = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const doc = await service.delete(req.params.id);
        return doc ? res.send({ message: "Đã xóa" }) : next(new ApiError(404, "Không tìm thấy"));
    } catch (error) { return next(new ApiError(500, "Lỗi xóa")); }
};