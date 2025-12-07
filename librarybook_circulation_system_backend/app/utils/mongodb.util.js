const { MongoClient } = require("mongodb");

class MongoDB {
    static connect = async (uri) => { // MongoDB.client là một biến lưu trữ kết nối đã thành công giữa Server của bạn và Database MongoDB.
        if (this.client) return this.client; // Nó kiểm tra xem biến this.client đã tồn tại chưa (tức là đã kết nối Database lần nào chưa).
        this.client = await MongoClient.connect(uri); // Nếu chưa có: Nó mới thực hiện lệnh MongoClient.connect(uri) để mở kết nối mới.
        return this.client;
    };
}

module.exports = MongoDB;