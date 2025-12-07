import createApiClient from "./api.service";

class MuonSachService {
    constructor(baseUrl = "/api/muon") { 
        this.api = createApiClient(baseUrl); 
    }
    
    async create(data) { return (await this.api.post("/", data)).data; }
    async getAll() { return (await this.api.get("/")).data; }
    
    // --- CÁC HÀM XỬ LÝ (Sửa lại tên hàm và URL cho chuẩn) ---

    // 1. Duyệt đơn (Backend: PUT /:id/approve)
    async approve(id) { 
        return (await this.api.put(`/${id}/approve`)).data; 
    }

    // 2. Từ chối (Backend: PUT /:id/reject)
    async reject(id, lyDo) { 
        return (await this.api.put(`/${id}/reject`, { lyDo })).data; 
    }

    // 3. Trả sách (Backend: PUT /:id/return)
    // SỬA: Đổi tên từ 'traSach' thành 'returnBook' để khớp với Component
    async returnBook(id) { 
        return (await this.api.put(`/${id}/return`)).data; 
    }

    // 4. Hủy đơn (Backend: PUT /:id/cancel hoặc userCancel)
    async userCancel(id, userId) { 
        // Lưu ý: Backend controller dùng hàm userCancel, kiểm tra lại route backend xem là /cancel hay /user-cancel
        return (await this.api.put(`/${id}/cancel`, { userId })).data; 
    }

    async getHistory(userId) {
        const all = (await this.api.get("/")).data;
        return all.filter(e => e.maDocGia === userId);
    }
}
export default new MuonSachService();