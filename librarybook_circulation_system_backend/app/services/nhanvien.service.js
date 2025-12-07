const { ObjectId } = require("mongodb");

class NhanVienService {
    constructor(client) {
        this.NhanVien = client.db().collection("nhanvien");
    }

    extractData(payload) {
        const nv = {
            hoTenNV: payload.hoTenNV,
            password: payload.password,
            chucVu: payload.chucVu,
            diaChi: payload.diaChi,
            soDienThoai: payload.soDienThoai
        };
        Object.keys(nv).forEach(key => nv[key] === undefined && delete nv[key]);
        return nv;
    }

    async create(payload) {
        const nv = this.extractData(payload);
        return await this.NhanVien.insertOne(nv);
    }

    async login(soDienThoai, password) {
        return await this.NhanVien.findOne({ soDienThoai, password });
    }
}
module.exports = NhanVienService;