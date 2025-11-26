// Tạo Service truy xuất Database
const { ObjectId } = require("mongodb");

class SachService {
    constructor(client) {
        this.Sach = client.db().collection("sach");
    }

    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    async find(filter) {
        const cursor = await this.Sach.find(filter);
        return await cursor.toArray();
    }
}

module.exports = SachService;