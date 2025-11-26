const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        // Quan trọng: Phải đúng tên database bạn vừa tạo trong Compass
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quanlymuonsach"
    }
};

module.exports = config;