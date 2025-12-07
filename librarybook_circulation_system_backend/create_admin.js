const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb://127.0.0.1:27017/quanlymuonsach";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("quanlymuonsach");

        // Xóa admin cũ (nếu có) để tránh trùng
        await db.collection("nhanvien").deleteMany({ soDienThoai: "admin" });

        // Tạo Admin mới
        await db.collection("nhanvien").insertOne({
            hoTenNV: "Quản Trị Viên Chính",
            chucVu: "Thủ Thư Trưởng",
            diaChi: "Thư Viện Trung Tâm",
            soDienThoai: "admin", // Đây là username đăng nhập
            password: "123"       // Đây là mật khẩu
        });

        console.log("Đã tạo tài khoản Admin thành công!");
        console.log("User: admin / Pass: 123");

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();