const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        // Cấu hình kết nối MongoDB
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quanlymuonsach"
    }
};

module.exports = config; //Lệnh này xuất biến config ra để các file khác (như server.js hoặc file kết nối CSDL) có thể import vào và sử dụng các thông số này.