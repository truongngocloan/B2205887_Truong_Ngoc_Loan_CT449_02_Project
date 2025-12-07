const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const result = await service.create(req.body);
        return res.send(result);
    } catch (error) { return next(new ApiError(500, error.message)); }
};
exports.findAll = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        return res.send(await service.findAll());
    } catch (error) { return next(new ApiError(500, "Lỗi lấy danh sách")); }
};
exports.findOne = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const doc = await service.findById(req.params.id);
        return doc ? res.send(doc) : next(new ApiError(404, "Không tìm thấy"));
    } catch (error) { return next(new ApiError(500, "Lỗi tìm kiếm")); }
};
exports.update = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const doc = await service.update(req.params.id, req.body);
        return doc ? res.send(doc) : next(new ApiError(404, "Không tìm thấy"));
    } catch (error) { return next(new ApiError(500, "Lỗi cập nhật")); }
};
exports.delete = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const doc = await service.delete(req.params.id);
        return doc ? res.send({ message: "Đã xóa" }) : next(new ApiError(404, "Không tìm thấy"));
    } catch (error) { return next(new ApiError(500, "Lỗi xóa")); }
};
exports.unlock = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const result = await service.unlock(req.params.id);
        if(!result) return next(new ApiError(404, "Không tìm thấy độc giả"));
        return res.send({ message: "Đã mở khóa tài khoản thành công" });
    } catch (error) { return next(new ApiError(500, "Lỗi mở khóa")); }
};