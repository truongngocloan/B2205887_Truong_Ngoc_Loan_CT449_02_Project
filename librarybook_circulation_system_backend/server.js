// -----> Kết nối vào Cơ sở dữ liệu trước, nếu thành công thì mới mở Server đón khách
const app = require("./app"); // Ý nghĩa: Nhập toàn bộ cấu hình ứng dụng Express mà bạn đã viết trong file app.js
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

async function startServer() { // asyn: kết nối bất đồng bộ
    try {
        // Thử kết nối đến MongoDB
        // await: Server sẽ đứng chờ ở dòng này. Nó không chạy tiếp cho đến khi kết nối DB thành công.
        // config.db: kết nối đến database
        // Tại sao phải chờ?---> Vì nếu Server chạy lên mà chưa kết nối được Database, người dùng vào web sẽ bị lỗi ngay lập tức.
        await MongoDB.connect(config.db.uri);
        console.log("Connected to the database!");//Thông báo thành công để bạn nhìn thấy trên màn hình đen (Terminal).

        // Nếu kết nối thành công thì mới chạy server
        const PORT = config.app.port;
        // app.listen(PORT, ...): Chính thức "Mở cửa". Lúc này máy tính của bạn bắt đầu lắng nghe các request gửi vào cổng 3000 (hoặc cổng khác trong config).
        // () => { ... } - Hàm báo cáo (Callback). Đây là một hàm gọi lại (callback function). Khi nào nó chạy? Nó chỉ chạy một lần duy nhất ngay sau khi server đã mở cổng thành công. Tại sao cần nó? Để lập trình viên biết chắc chắn rằng server đã khởi động xong xuôi mà không bị lỗi. Nếu không có dòng này, màn hình đen (terminal) sẽ im lìm, bạn sẽ không biết server đã chạy hay chưa.
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();