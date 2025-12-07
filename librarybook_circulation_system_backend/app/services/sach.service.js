const { ObjectId } = require("mongodb");

class SachService {
    constructor(client) {
        this.Sach = client.db().collection("sach");
    }

    extractData(payload) {
        const sach = {
            _id: payload.maSach,
            tenSach: payload.tenSach,
            donGia: parseInt(payload.donGia),
            soQuyen: parseInt(payload.soQuyen),
            namXuatBan: parseInt(payload.namXuatBan),
            hinhAnh: payload.hinhAnh,
            
            maNXB: payload.maNXB,
            // Xử lý mảng JSON nếu có
            maTacGia: payload.maTacGia ? (typeof payload.maTacGia === 'string' ? JSON.parse(payload.maTacGia) : payload.maTacGia) : [],
            maTheLoai: payload.maTheLoai ? (typeof payload.maTheLoai === 'string' ? JSON.parse(payload.maTheLoai) : payload.maTheLoai) : [],
            createdAt: payload.createdAt || new Date()
        };

        // Xóa các trường undefined
        Object.keys(sach).forEach(key => sach[key] === undefined && delete sach[key]);
        return sach;
    }

    async create(payload) {
        const sach = this.extractData(payload);
        const existing = await this.Sach.findOne({ _id: sach._id });
        if (existing) throw new Error("Mã sách đã tồn tại!");
        return await this.Sach.insertOne(sach);
    }

    // --- MỚI THÊM: Hàm tìm kiếm theo tên (Có lookup đầy đủ) ---
    async findByName(name) {
        return await this.Sach.aggregate([
            {
                // Bước 1: LỌC TRƯỚC (Quan trọng)
                // Chỉ lấy những sách có tên chứa từ khóa (không phân biệt hoa thường)
                $match: { 
                    tenSach: { $regex: new RegExp(name, "i") } 
                }
            },
            {
                // Bước 2: Sau đó mới ghép bảng (Nhanh hơn)
                $lookup: {
                    from: "nhaxuatban",
                    localField: "maNXB",
                    foreignField: "_id",
                    as: "nxbInfo"
                }
            },
            {
                $lookup: {
                    from: "tacgia",
                    localField: "maTacGia",
                    foreignField: "_id",
                    as: "tacGiaInfo"
                }
            },
            {
                $lookup: {
                    from: "theloai",
                    localField: "maTheLoai",
                    foreignField: "_id",
                    as: "theLoaiInfo"
                }
            },
            { $sort: { createdAt: -1 } }
        ]).toArray();
    }

    async findAll() {
        return await this.Sach.aggregate([
            {
                $lookup: {
                    from: "nhaxuatban",
                    localField: "maNXB",
                    foreignField: "_id",
                    as: "nxbInfo"
                }
            },
            {
                $lookup: {
                    from: "tacgia",
                    localField: "maTacGia",
                    foreignField: "_id",
                    as: "tacGiaInfo"
                }
            },
            {
                $lookup: {
                    from: "theloai",
                    localField: "maTheLoai",
                    foreignField: "_id",
                    as: "theLoaiInfo"
                }
            },
            { $sort: { createdAt: -1 } }
        ]).toArray();
    }

    async findById(id) {
        const result = await this.Sach.aggregate([
            { $match: { _id: id } },
            {
                $lookup: {
                    from: "nhaxuatban",
                    localField: "maNXB",
                    foreignField: "_id",
                    as: "nxbInfo"
                }
            },
            {
                $lookup: {
                    from: "tacgia",
                    localField: "maTacGia",
                    foreignField: "_id",
                    as: "tacGiaInfo"
                }
            },
            {
                $lookup: {
                    from: "theloai",
                    localField: "maTheLoai",
                    foreignField: "_id",
                    as: "theLoaiInfo"
                }
            }
        ]).toArray();
        
        return result[0];
    }

    async update(id, payload) {
        const update = this.extractData(payload);
        delete update._id;
        return await this.Sach.findOneAndUpdate(
            { _id: id },
            { $set: update },
            { returnDocument: "after" }
        );
    }

    async delete(id) {
        return await this.Sach.findOneAndDelete({ _id: id });
    }
}

module.exports = SachService;