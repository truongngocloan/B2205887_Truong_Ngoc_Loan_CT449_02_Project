class TacGiaService {
    constructor(client) {
        this.TacGia = client.db().collection("tacgia");
    }

    // --- QUAN TRỌNG: Hàm xử lý dữ liệu ---
    extractData(payload) {
        const tacgia = {
            // Lấy mã nhập tay gán vào _id
            _id: payload.maTacGia, 
            tenTacGia: payload.tenTacGia
        };
        
        // Xóa trường undefined
        Object.keys(tacgia).forEach(key => tacgia[key] === undefined && delete tacgia[key]);
        return tacgia;
    }

    async create(payload) {
        const tacgia = this.extractData(payload);
        // Kiểm tra trùng mã
        const existing = await this.TacGia.findOne({ _id: tacgia._id });
        if (existing) {
            throw new Error("Mã tác giả này đã tồn tại!");
        }
        return await this.TacGia.insertOne(tacgia);
    }

    async findAll() {
        // Xóa tham số (page, limit)
        // Xóa .skip() và .limit()
        // Chỉ giữ lại find({}) và toArray()
        const documents = await this.TacGia.find({}).toArray();

        return documents; // Trả về mảng [] trực tiếp, không bọc trong object { data... }
    }

    async findById(id) {
        return await this.TacGia.findOne({ _id: id });
    }

    async update(id, payload) {
        const update = this.extractData(payload);
        delete update._id; // Không cho sửa mã ID
        return await this.TacGia.findOneAndUpdate(
            { _id: id },
            { $set: update },
            { returnDocument: "after" }
        );
    }

    async delete(id) {
        return await this.TacGia.findOneAndDelete({ _id: id });
    }
}

module.exports = TacGiaService;