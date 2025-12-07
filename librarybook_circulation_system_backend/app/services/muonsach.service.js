const { ObjectId } = require("mongodb");

class MuonSachService {
    constructor(client) {
        this.client = client;
        this.MuonSach = client.db().collection("theodoimuonsach");
        this.Sach = client.db().collection("sach");
        this.DocGia = client.db().collection("docgia");
    }

    // 1. ĐĂNG KÝ MƯỢN (User bấm)
    // 1. ĐĂNG KÝ MƯỢN (Đã cập nhật theo logic chặn mới)
    async create(payload) {
        const { maDocGia, maSach } = payload;

        // --- A. Kiểm tra Độc giả ---
        const user = await this.DocGia.findOne({ _id: new ObjectId(maDocGia) });
        if (!user) throw new Error("Độc giả không tồn tại");

        // --- KIỂM TRA KHÓA/CẤM (Logic Mới) ---
        if (user.biKhoa) {
            // Trường hợp 1: Bị khóa vĩnh viễn (Vi phạm >= 3 lần)
            if (!user.hanCheDenNgay && (user.soLanViPham || 0) >= 3) {
                throw new Error("Tài khoản bị KHÓA VĨNH VIỄN do vi phạm quá 3 lần.");
            }

            // Trường hợp 2: Bị khóa có thời hạn (Vi phạm 1-2 lần)
            if (user.hanCheDenNgay) {
                const today = new Date();
                const ngayMo = new Date(user.hanCheDenNgay);

                if (today < ngayMo) {
                    throw new Error(`Tài khoản đang bị tạm khóa đến ngày ${ngayMo.toLocaleDateString('vi-VN')}.`);
                } else {
                    // Đã qua ngày phạt nhưng chưa được Admin mở (trạng thái vẫn biKhoa=true)
                    throw new Error("Hết thời gian phạt. Vui lòng liên hệ Admin để mở khóa lại tài khoản.");
                }
            }
            
            // Trường hợp khác (bị khóa tay bởi admin)
            throw new Error("Tài khoản đang bị khóa. Vui lòng liên hệ Admin.");
        }

        // --- B. Kiểm tra Đơn trùng ---
        if (!maDocGia || !maSach) throw new Error("Thiếu thông tin");

        const donTrung = await this.MuonSach.findOne({
            maDocGia: maDocGia,
            maSach: maSach,
            trangThai: { $in: ["cho_duyet", "dang_muon"] }
        });

        if (donTrung) {
            throw new Error(donTrung.trangThai === "cho_duyet" 
                ? "Bạn đã đăng ký mượn cuốn này rồi. Vui lòng chờ duyệt!" 
                : "Bạn đang giữ cuốn sách này. Không thể mượn thêm!");
        }

        // --- C. Kiểm tra số lượng (Max 7) ---
        const count = await this.MuonSach.countDocuments({
            maDocGia: maDocGia,
            trangThai: { $in: ["dang_muon", "cho_duyet"] }
        });

        if (count >= 7) throw new Error("Bạn chỉ được mượn tối đa 7 cuốn.");

        // --- D. Kiểm tra Kho ---
        const book = await this.Sach.findOne({ _id: maSach });
        if (!book || book.soQuyen < 1) throw new Error("Sách đã hết hoặc không tồn tại");

        // --- E. Tạo đơn ---
        const donMuon = {
            maDocGia: maDocGia,
            maSach: maSach,
            ngayDangKy: new Date(),
            ngayMuon: null,
            ngayTra: null,
            ngayTraThucTe: null,
            trangThai: "cho_duyet",
            soLuong: 1
        };

        return await this.MuonSach.insertOne(donMuon);
    }

    // 2. ADMIN DUYỆT ĐƠN (Chuyển sang "dang_muon")
    async approve(id) {
        const don = await this.MuonSach.findOne({ _id: new ObjectId(id) });
        if (!don || don.trangThai !== "cho_duyet") throw new Error("Đơn không hợp lệ");

        // Kiểm tra lại kho lần nữa
        const book = await this.Sach.findOne({ _id: don.maSach });
        if (book.soQuyen < 1) throw new Error("Sách này hiện đã hết, không thể duyệt!");

        // Tính ngày trả dự kiến = Hôm nay + 7 ngày
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        // Cập nhật đơn
        await this.MuonSach.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    trangThai: "dang_muon",
                    ngayMuon: today,
                    ngayTra: nextWeek // Hạn trả
                } 
            }
        );

        // Trừ kho
        await this.Sach.updateOne({ _id: don.maSach }, { $inc: { soQuyen: -1 } });
        return { message: "Đã duyệt đơn thành công" };
    }

    // 3. ADMIN TỪ CHỐI (Chuyển sang "da_huy")
    async reject(id, lyDo) {
        await this.MuonSach.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    trangThai: "da_huy",
                    lyDoTuChoi: lyDo || "Không đủ điều kiện mượn"
                } 
            }
        );
        return { message: "Đã từ chối đơn" };
    }

    // 4. USER HỦY ĐƠN (Chỉ hủy được khi còn chờ duyệt)
    async userCancel(id, userId) {
        const don = await this.MuonSach.findOne({ _id: new ObjectId(id) });
        if (!don) throw new Error("Đơn không tồn tại");
        
        // Kiểm tra quyền sở hữu
        if (don.maDocGia.toString() !== userId.toString()) throw new Error("Không có quyền");
        
        // Chỉ cho phép xóa khi đang chờ duyệt
        if (don.trangThai !== "cho_duyet") throw new Error("Chỉ hủy được đơn đang chờ duyệt");

        // DÙNG deleteOne ĐỂ XÓA VĨNH VIỄN
        return await this.MuonSach.deleteOne({ _id: new ObjectId(id) });
    }

    // 5. ADMIN XÁC NHẬN TRẢ
    async returnBook(id) {
        const don = await this.MuonSach.findOne({ _id: new ObjectId(id) });
        if (!don || don.trangThai !== "dang_muon") throw new Error("Đơn không hợp lệ");

        const today = new Date();
        const hanTra = new Date(don.ngayTra);
        let biPhat = false;

        // --- KIỂM TRA TRẢ TRỄ ---
        if (today.getTime() > hanTra.getTime()) {
            biPhat = true;
            
            const user = await this.DocGia.findOne({ _id: new ObjectId(don.maDocGia) });
            
            if (user) {
                // Tăng số lần vi phạm & điểm xấu
                const newViPham = (user.soLanViPham || 0) + 1;
                const newDiemXau = (user.diemXau || 0) + 1;
                
                let updateData = {
                    soLanViPham: newViPham,
                    diemXau: newDiemXau,
                    biKhoa: true // Cứ vi phạm là khóa trước đã
                };

                // --- LOGIC PHÂN LOẠI KHÓA ---
                if (newViPham < 3) {
                    // Vi phạm lần 1 hoặc 2: Khóa 7 ngày
                    const ngayMoKhoa = new Date();
                    ngayMoKhoa.setDate(ngayMoKhoa.getDate() + 7);
                    updateData.hanCheDenNgay = ngayMoKhoa; 
                    console.log(`User vi phạm lần ${newViPham}. Khóa đến ${ngayMoKhoa.toLocaleDateString()}`);
                } else {
                    // Vi phạm lần 3 trở lên: Khóa vĩnh viễn (Không set ngày mở)
                    updateData.hanCheDenNgay = null; 
                    console.log(`User vi phạm lần ${newViPham}. KHÓA VĨNH VIỄN.`);
                }

                await this.DocGia.updateOne(
                    { _id: new ObjectId(don.maDocGia) },
                    { $set: updateData }
                );
            }
        }

        // Cập nhật đơn mượn
        await this.MuonSach.updateOne(
            { _id: new ObjectId(id) },
            { $set: { trangThai: "da_tra", ngayTraThucTe: today, viPham: biPhat } }
        );

        // Cộng kho
        await this.Sach.updateOne({ _id: don.maSach }, { $inc: { soQuyen: 1 } });

        return { message: biPhat ? "Đã trả (Quá hạn - Tài khoản bị khóa)" : "Đã trả đúng hạn" };
    }

    async findAll() {
        try {
            // 1. Lấy dữ liệu thô
            const borrows = await this.MuonSach.find({}).sort({ ngayDangKy: -1 }).toArray();
            
            // 2. Lấy danh sách Độc giả và Sách (Giờ this.client đã có giá trị nên sẽ không lỗi nữa)
            const users = await this.client.db().collection("docgia").find({}).toArray();
            const books = await this.client.db().collection("sach").find({}).toArray();

            // 3. Ghép dữ liệu
            return borrows.map(borrow => {
                const user = users.find(u => u._id.toString() === borrow.maDocGia.toString());
                const book = books.find(b => b._id.toString() === borrow.maSach.toString());

                return {
                    ...borrow,
                    docGiaInfo: user ? [user] : [], 
                    sachInfo: book ? [book] : []
                };
            });

        } catch (error) {
            console.error("Lỗi findAll:", error);
            return [];
        }
    }
    
    // Lấy lịch sử theo User ID
    async getHistory(userId) {
        const all = await this.findAll();
        return all.filter(item => item.maDocGia.toString() === userId.toString());
    }
}

module.exports = MuonSachService;