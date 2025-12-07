const { ObjectId } = require("mongodb");

class ThongKeService {
    constructor(client) {
        this.MuonSach = client.db().collection("theodoimuonsach");
        this.Sach = client.db().collection("sach");
        this.DocGia = client.db().collection("docgia");
    }

    async getStats() {
        // 1. Đếm tổng số lượng cơ bản
        const totalBooks = await this.Sach.countDocuments({});
        const totalReaders = await this.DocGia.countDocuments({});
        const totalBorrows = await this.MuonSach.countDocuments({}); // Tổng số lượt mượn từ trước tới nay

        // 2. Đếm trạng thái đơn mượn
        const borrowing = await this.MuonSach.countDocuments({ trangThai: "dang_muon" });
        const pending = await this.MuonSach.countDocuments({ trangThai: "cho_duyet" });
        
        // 3. Tính số đơn quá hạn (Đang mượn VÀ Ngày hiện tại > Hạn trả)
        const today = new Date();
        const overdue = await this.MuonSach.countDocuments({
            trangThai: "dang_muon",
            ngayTra: { $lt: today } // $lt: less than (nhỏ hơn hôm nay)
        });

        // 4. Tìm Top 5 sách được mượn nhiều nhất
        const topBooks = await this.MuonSach.aggregate([
            { $group: { _id: "$maSach", count: { $sum: 1 } } }, // Gom nhóm theo mã sách
            { $sort: { count: -1 } }, // Sắp xếp giảm dần
            { $limit: 5 }, // Lấy 5 cuốn đầu
            {
                $lookup: { // Nối với bảng Sách để lấy tên
                    from: "sach",
                    localField: "_id",
                    foreignField: "_id",
                    as: "info"
                }
            }
        ]).toArray();

        return {
            totalBooks,
            totalReaders,
            totalBorrows,
            borrowing,
            pending,
            overdue,
            topBooks: topBooks.map(t => ({
                maSach: t._id,
                soLuotMuon: t.count,
                tenSach: t.info[0]?.tenSach || "Sách đã xóa"
            }))
        };
    }
}

module.exports = ThongKeService;