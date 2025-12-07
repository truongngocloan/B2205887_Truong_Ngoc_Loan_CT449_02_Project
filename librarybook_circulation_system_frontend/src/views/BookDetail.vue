<template>
    <div class="container mt-5 mb-5" v-if="book">
        <div class="row">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <img :src="book.hinhAnh" class="card-img-top rounded" style="height: 750px;width: 450px;" alt="Bìa sách">
                </div>
            </div>

            <div class="col-md-8 ps-md-5">
                <h2 class="fw-bold text-primary mb-3">{{ book.tenSach }}</h2>
                
                <p class="text-muted fs-5 mb-4">
                    Tác giả: <strong class="text-dark">{{ book.tacGiaInfo?.map(t => t.tenTacGia).join(', ') || 'Đang cập nhật' }}</strong>
                </p>

                <div class="row mb-4">
                    <div class="col-md-6">
                        <ul class="list-unstyled">
                            <li class="mb-2"><strong>Mã sách:</strong> {{ book._id }}</li>
                            <li class="mb-2">
                                <strong>Thể loại:</strong> 
                                <span v-for="tl in book.theLoaiInfo" :key="tl._id" class="badge bg-info text-dark ms-1">
                                    {{ tl.tenTheLoai }}
                                </span>
                            </li>
                            <li class="mb-2"><strong>Nhà xuất bản:</strong> {{ book.nxbInfo?.[0]?.tenNXB || 'Chưa rõ' }}</li>
                            <li class="mb-2"><strong>Năm xuất bản:</strong> {{ book.namXuatBan || '---' }}</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded border">
                            <h3 class="text-danger fw-bold mb-0">{{ book.donGia.toLocaleString() }} đ</h3>
                            <div class="mt-2">
                                <strong>Tình trạng:</strong> 
                                <span v-if="book.soQuyen > 0" class="text-success fw-bold ms-1">
                                    <i class="fas fa-check-circle"></i> Còn {{ book.soQuyen }} quyển
                                </span>
                                <span v-else class="text-danger fw-bold ms-1">
                                    <i class="fas fa-times-circle"></i> Hết hàng
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <div class="d-flex gap-3">
                    <button class="btn btn-outline-secondary px-4 rounded-pill" @click="$router.go(-1)">
                        <i class="fas fa-arrow-left me-2"></i> Quay lại
                    </button>
                    
                    <div v-if="currentUser && currentUser.role === 'nhanvien'" class="d-flex gap-2">
                        <button class="btn btn-warning px-4 rounded-pill fw-bold" @click="goToEdit">
                            <i class="fas fa-edit me-2"></i> Chỉnh sửa
                        </button>
                        <button class="btn btn-danger px-4 rounded-pill fw-bold" @click="deleteBook">
                            <i class="fas fa-trash-alt me-2"></i> Xóa sách
                        </button>
                    </div>

                    <button 
                        v-else
                        class="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm" 
                        @click="handleBorrow"
                        :disabled="book.soQuyen <= 0"
                    >
                        <i class="fas fa-book-reader me-2"></i> 
                        {{ book.soQuyen > 0 ? 'ĐĂNG KÝ MƯỢN NGAY' : 'TẠM HẾT HÀNG' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <div v-else class="text-center mt-5 py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Đang tải dữ liệu sách...</p>
    </div>
</template>

<script>
import SachService from "@/services/sach.service";
import MuonSachService from "@/services/muon.service";

export default {
    props: { id: { type: String, required: true } },
    data() {
        return {
            book: null,
            currentUser: null,
        };
    },
    methods: {
        async getBook() {
            try {
                this.book = await SachService.get(this.id);
            } catch (error) {
                console.log(error);
                this.$router.push({ name: "notfound" });
            }
        },
        async handleBorrow() {
            // 1. Kiểm tra xem đã lấy được User từ localStorage chưa
            this.currentUser = JSON.parse(localStorage.getItem("user"));
            console.log("User đang đăng nhập:", this.currentUser);

            if (!this.currentUser) {
                const wantLogin = confirm("Bạn cần đăng nhập để mượn sách. Đến trang đăng nhập ngay?");
                if (wantLogin) this.$router.push({ name: "user.login" });
                return;
            }
            if (confirm(`Xác nhận đăng ký mượn cuốn: "${this.book.tenSach}"?`)) {
                try {
                    await MuonSachService.create({
                        maDocGia: this.currentUser._id,
                        maSach: this.book._id,
                    });

                    // CHỈ KHI NÀO BACKEND KHÔNG LỖI MỚI CHẠY DÒNG NÀY
                    alert("🎉 Đăng ký thành công! Vui lòng chờ Admin duyệt.");
                    this.getBook(); 
                    
                } catch (error) {
                    // NẾU BACKEND TRẢ VỀ LỖI (VÍ DỤ: ĐÃ MƯỢN RỒI), NÓ SẼ NHẢY VÀO ĐÂY
                    console.log("Lỗi:", error);
                    const message = error.response?.data?.message || "Lỗi không xác định";
                    alert("⚠️ Cảnh báo: " + message);
                }
            }
        },
        goToEdit() {
                // Chuyển hướng đến trang sửa sách (admin)
                // Giả sử route admin sửa sách là /admin/books/:id
                this.$router.push(`/admin/books/${this.book._id}`);
            },

            async deleteBook() {
                if (confirm(`CẢNH BÁO: Bạn có chắc muốn xóa cuốn sách "${this.book.tenSach}" vĩnh viễn không?`)) {
                    try {
                        await SachService.delete(this.book._id);
                        alert("Đã xóa sách thành công!");
                        this.$router.push("/"); // Quay về trang chủ hoặc trang quản lý
                    } catch (error) {
                        alert("Lỗi khi xóa: " + error.message);
                    }
                }
            }
        },
        created() {
            // Lấy thông tin user ngay khi tạo component
            this.currentUser = JSON.parse(localStorage.getItem("user"));
            this.getBook();
        },
    };
</script>