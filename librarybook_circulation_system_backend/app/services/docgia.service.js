const { ObjectId } = require("mongodb");

class DocGiaService {
    constructor(client) {
        this.DocGia = client.db().collection("docgia");
    }

    extractData(payload) {
        const docgia = {
            hoLot: payload.hoLot,
            ten: payload.ten,
            ngaySinh: payload.ngaySinh,
            phai: payload.phai,
            diaChi: payload.diaChi,
            dienThoai: payload.dienThoai,
            password: payload.password
        };
        Object.keys(docgia).forEach(key => docgia[key] === undefined && delete docgia[key]);
        return docgia;
    }

    async create(payload) {
        const docgia = this.extractData(payload);
        return await this.DocGia.insertOne(docgia);
    }

    async findByPhone(dienThoai) {
        return await this.DocGia.findOne({ dienThoai: dienThoai });
    }

    async findAll() {
        return await this.DocGia.find({}).toArray();
    }

    async findById(id) {
        return await this.DocGia.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
    }
    
    async login(dienThoai, password) {
        return await this.DocGia.findOne({ dienThoai: dienThoai, password: password });
    }
    
    async update(id, payload) {
        const update = this.extractData(payload);
        return await this.DocGia.findOneAndUpdate(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
            { $set: update },
            { returnDocument: "after" }
        );
    }

    async findByDienThoai(dienThoai) {
        return await this.DocGia.findOne({ dienThoai: dienThoai });
    }

    // Hàm mở khóa cho độc giả
    async unlock(id) {
        if (!ObjectId.isValid(id)) throw new Error("ID không hợp lệ");

        // 1. Kiểm tra xem có bị khóa vĩnh viễn không
        const user = await this.DocGia.findOne({ _id: new ObjectId(id) });
        if (!user) throw new Error("Không tìm thấy độc giả");

        // NẾU VI PHẠM >= 3 LẦN -> KHÔNG CHO MỞ
        if ((user.soLanViPham || 0) >= 3) {
            throw new Error("Tài khoản này bị khóa vĩnh viễn do vi phạm 3 lần. Không thể mở khóa!");
        }

        // 2. Nếu < 3 lần thì cho mở
        return await this.DocGia.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    biKhoa: false, 
                    hanCheDenNgay: null // Xóa ngày hạn chế
                    // Lưu ý: KHÔNG reset soLanViPham về 0 nữa, để cộng dồn cho lần sau
                } 
            },
            { returnDocument: "after" }
        );
    }
    
}
module.exports = DocGiaService;