import createApiClient from "./api.service";

class ThongKeService {
    constructor(baseUrl = "/api/thongke") {
        this.api = createApiClient(baseUrl);
    }
    async getStats() {
        return (await this.api.get("/")).data;
    }
}
export default new ThongKeService();