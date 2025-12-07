const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const result = await service.create(req.body);
        return res.send(result);
    } catch (error) { return next(new ApiError(500, error.message)); }
};
exports.login = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const { soDienThoai, password } = req.body;
        const staff = await service.login(soDienThoai, password);
        return staff ? res.send(staff) : next(new ApiError(401, "Sai thông tin đăng nhập"));
    } catch (error) { return next(new ApiError(500, "Lỗi đăng nhập")); }
};