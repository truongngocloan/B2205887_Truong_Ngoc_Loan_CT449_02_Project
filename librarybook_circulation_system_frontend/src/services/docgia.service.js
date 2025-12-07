// import createApiClient from "./api.service";
// class DocGiaService {
//     constructor(baseUrl = "/api/docgia") { this.api = createApiClient(baseUrl); }
//     async create(data) { return (await this.api.post("/", data)).data; }
//     async login(data) {
//         // Backend chưa có route login riêng cho độc giả, ta dùng tạm logic tìm kiếm
//         // (Lưu ý: Logic này chỉ dùng để học tập, thực tế phải có JWT)
//         const allUsers = (await this.api.get("/")).data;
//         return allUsers.find(u => u.dienThoai === data.dienThoai && u.password === data.password);
//     }
// }
// export default new DocGiaService();






import createApiClient from "./api.service";

class DocGiaService {
    constructor(baseUrl = "/api/docgia") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() { return (await this.api.get("/")).data; }
    
    // Gọi API mở khóa
    async unlock(id) {
        return (await this.api.put(`/${id}/unlock`)).data;
    }
}
export default new DocGiaService();