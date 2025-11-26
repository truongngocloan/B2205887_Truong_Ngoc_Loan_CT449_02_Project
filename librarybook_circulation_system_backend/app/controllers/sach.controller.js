// Tạo Controller xử lý logic
const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const sachService = new SachService(MongoDB.client);
        // Lấy tất cả sách (filter rỗng {})
        documents = await sachService.find({});
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi lấy danh sách sách")
        );
    }
};