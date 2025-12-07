class TheLoaiService {
    constructor(client) {
        this.TheLoai = client.db().collection("theloai");
    }

    // Hàm này giúp đồng bộ dữ liệu
    extractData(payload) {
        const theloai = {
            _id: payload.maTheLoai, // Lấy mã nhập tay làm ID chính
            tenTheLoai: payload.tenTheLoai
        };
        // Xóa các trường undefined
        Object.keys(theloai).forEach(key => theloai[key] === undefined && delete theloai[key]);
        return theloai;
    }

    async create(payload) {
        const theloai = this.extractData(payload);
        
        // Kiểm tra trùng mã
        const existing = await this.TheLoai.findOne({ _id: theloai._id });
        if (existing) {
            throw new Error("Mã thể loại này đã tồn tại!");
        }

        return await this.TheLoai.insertOne(theloai);
    }

    async findAll() {
        return await this.TheLoai.find({}).toArray();
    }

    async findById(id) {
        return await this.TheLoai.findOne({ _id: id });
    }

    async update(id, payload) {
        const update = this.extractData(payload);
        delete update._id; // Không cho phép sửa mã ID
        return await this.TheLoai.findOneAndUpdate(
            { _id: id },
            { $set: update },
            { returnDocument: "after" }
        );
    }

    async delete(id) {
        return await this.TheLoai.findOneAndDelete({ _id: id });
    }
}

module.exports = TheLoaiService;