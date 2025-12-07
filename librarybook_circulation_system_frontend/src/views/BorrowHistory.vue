<template>
    <div class="container mt-4">
        <h3>Lịch sử mượn sách</h3>
        <div class="table-responsive">
            <table class="table table-hover mt-3 align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Sách</th>
                        <th>Ngày Mượn</th>
                        <th>Hạn Trả</th>
                        <th>Ngày Trả TT</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in history" :key="item._id">
                        <td class="fw-bold text-primary">{{ item.sachInfo?.[0]?.tenSach }}</td>

                        <td>
                            <span v-if="item.ngayMuon">{{ formatDate(item.ngayMuon) }}</span>
                            <span v-else class="text-muted fst-italic small">Chờ duyệt</span>
                        </td>

                        <td>
                            <span v-if="item.ngayTra">{{ formatDate(item.ngayTra) }}</span>
                            <span v-else>---</span>
                        </td>

                        <td :class="{ 'text-danger fw-bold': isLate(item) }">
                            <span v-if="item.ngayTraThucTe">
                                {{ formatDate(item.ngayTraThucTe) }}
                                <i v-if="isLate(item)" class="fas fa-exclamation-circle ms-1" title="Trễ hạn"></i>
                            </span>
                            <span v-else>---</span>
                        </td>

                        <td>
                            <span v-if="item.trangThai==='cho_duyet'" class="badge bg-warning text-dark">Chờ duyệt</span>
                            <span v-else-if="item.trangThai==='dang_muon'" class="badge bg-primary">Đang mượn</span>
                            <span v-else-if="item.trangThai==='da_tra'" class="badge bg-success">Đã trả</span>
                            <span v-else-if="item.trangThai==='da_huy'" class="badge bg-danger">Bị từ chối</span>
                            
                            <div v-if="item.trangThai==='da_huy'" class="small text-danger mt-1">
                                <i class="fas fa-info-circle"></i> {{ item.lyDoTuChoi }}
                            </div>
                        </td>

                        <td>
                            <button 
                                v-if="item.trangThai==='cho_duyet'" 
                                class="btn btn-outline-danger btn-sm"
                                @click="cancelRequest(item._id)"
                            >
                                <i class="fas fa-times"></i> Hủy
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import MuonSachService from "@/services/muon.service";

export default {
    data() { 
        return { 
            history: [], 
            currentUser: null 
        }; 
    },
    methods: {
        async fetchHistory() {
            if(this.currentUser) {
                try {
                    this.history = await MuonSachService.getHistory(this.currentUser._id);
                } catch (e) { console.error(e); }
            }
        },
        
        async cancelRequest(id) {
            if(confirm("Bạn muốn hủy yêu cầu mượn này?")) {
                try {
                    await MuonSachService.userCancel(id, this.currentUser._id);
                    alert("Đã hủy thành công.");
                    this.fetchHistory();
                } catch(e) { alert("Lỗi: " + (e.response?.data?.message || "Lỗi hệ thống")); }
            }
        },

        // Hàm format ngày tháng cho gọn
        formatDate(dateString) {
            if (!dateString) return "";
            return new Date(dateString).toLocaleDateString('vi-VN');
        },

        // Hàm kiểm tra trễ hạn để tô màu
        isLate(item) {
            // Chỉ kiểm tra khi đã trả sách và có đủ ngày tháng
            if (item.ngayTra && item.ngayTraThucTe) {
                const duKien = new Date(item.ngayTra);
                const thucTe = new Date(item.ngayTraThucTe);
                // Reset giờ phút giây về 0 để chỉ so sánh ngày (nếu muốn chính xác tuyệt đối)
                // Hoặc so sánh timestamp như backend
                return thucTe.getTime() > duKien.getTime();
            }
            return false;
        }
    },
    mounted() {
        const userStr = localStorage.getItem("user");
        if(userStr) {
            this.currentUser = JSON.parse(userStr);
            this.fetchHistory();
        } else {
            this.$router.push("/login");
        }
    }
};
</script>