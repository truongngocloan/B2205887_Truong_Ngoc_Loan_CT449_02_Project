const ThongKeService = require("../services/thongke.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.getStats = async (req, res, next) => {
    try {
        const service = new ThongKeService(MongoDB.client);
        const stats = await service.getStats();
        return res.send(stats);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Lỗi lấy thống kê"));
    }
};