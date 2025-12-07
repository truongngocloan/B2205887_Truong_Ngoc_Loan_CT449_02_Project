class NhaXuatBanService {
    constructor(client) {
        this.NXB = client.db().collection("nhaxuatban");
    }

    extractData(payload) {
        const nxb = {
            _id: payload.maNXB, // Dùng mã nhập tay làm ID
            tenNXB: payload.tenNXB,
            diaChi: payload.diaChi
        };
        Object.keys(nxb).forEach(key => nxb[key] === undefined && delete nxb[key]);
        return nxb;
    }

    async create(payload) {
        const nxb = this.extractData(payload);
        const existing = await this.NXB.findOne({ _id: nxb._id });
        if (existing) throw new Error("Mã NXB đã tồn tại!");
        return await this.NXB.insertOne(nxb);
    }

    async findAll() {
        // Chỉ đơn giản là find và toArray
        return await this.NXB.find({}).toArray();
    }

    async findById(id) {
        return await this.NXB.findOne({ _id: id });
    }

    async update(id, payload) {
        const update = this.extractData(payload);
        delete update._id; // Không cho sửa mã
        return await this.NXB.findOneAndUpdate({ _id: id }, { $set: update }, { returnDocument: "after" });
    }

    async delete(id) {
        return await this.NXB.findOneAndDelete({ _id: id });
    }
}
module.exports = NhaXuatBanService;