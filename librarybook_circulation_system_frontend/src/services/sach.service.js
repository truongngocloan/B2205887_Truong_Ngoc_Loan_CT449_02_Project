import createApiClient from "./api.service";

class SachService {
    constructor(baseUrl = "/api/sach") {
        this.api = createApiClient(baseUrl);
    }

    async getAll(query = "") {
        return (await this.api.get(`/${query}`)).data;
    }

    // --- SỬA HÀM CREATE ---
    // Thêm tham số thứ 3 là config header
    async create(data) {
        return (await this.api.post("/", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    // --- SỬA HÀM UPDATE ---
    // Thêm tham số thứ 3 là config header
    async update(id, data) {
        return (await this.api.put(`/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new SachService();