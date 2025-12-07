const MuonSachService = require("../services/muonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try {
        const service = new MuonSachService(MongoDB.client);
        const result = await service.create(req.body);
        return res.send(result);
    } catch (error) { return next(new ApiError(400, error.message)); }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = new MuonSachService(MongoDB.client); 
        const documents = await service.findAll();
        return res.send(documents);
    } catch (error) { 
        return next(new ApiError(500, "Lỗi lấy danh sách")); 
    }
};

// Admin Duyệt
exports.approve = async (req, res, next) => {
    try {
        const service = new MuonSachService(MongoDB.client);
        return res.send(await service.approve(req.params.id));
    } catch (error) { return next(new ApiError(400, error.message)); }
};

// Admin Từ chối
exports.reject = async (req, res, next) => {
    try {
        const service = new MuonSachService(MongoDB.client);
        return res.send(await service.reject(req.params.id, req.body.lyDo));
    } catch (error) { return next(new ApiError(400, error.message)); }
};

// Admin Xác nhận trả
exports.returnBook = async (req, res, next) => {
    try {
        const service = new MuonSachService(MongoDB.client);
        return res.send(await service.returnBook(req.params.id));
    } catch (error) { return next(new ApiError(400, error.message)); }
};

// User Hủy
exports.userCancel = async (req, res, next) => {
    try {
        const service = new MuonSachService(MongoDB.client);
        const { userId } = req.body; // Cần gửi ID user lên để bảo mật
        return res.send(await service.userCancel(req.params.id, userId));
    } catch (error) { return next(new ApiError(400, error.message)); }
};