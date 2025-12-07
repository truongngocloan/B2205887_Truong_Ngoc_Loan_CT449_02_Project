<template>
    <div class="container mt-4 mb-5">
        <h2 class="text-center text-primary fw-bold mb-4">
            <i class="fas fa-cogs me-2"></i>DASHBOARD QUẢN TRỊ
        </h2>
        
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-white py-3">
                <ul class="nav nav-pills card-header-pills justify-content-center gap-2">
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: activeTab === 'stats' }" @click="switchTab('stats')">
                            <i class="fas fa-chart-pie me-1"></i> Thống kê
                        </button>
                    </li>
                    <li class="nav-item" v-for="tab in tabs" :key="tab.id">
                        <button class="nav-link" :class="{ active: activeTab === tab.id }" @click="switchTab(tab.id)">
                            <i :class="tab.icon" class="me-1"></i> {{ tab.name }}
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else>
            <div v-if="activeTab === 'stats'" class="fade-in">
                <div class="row g-4 mb-4">
                    <div class="col-md-3">
                        <div class="card bg-primary text-white h-100 shadow-sm border-0">
                            <div class="card-body position-relative">
                                <h6 class="card-title opacity-75">Tổng đầu sách</h6>
                                <h2 class="fw-bold">{{ stats.totalBooks }}</h2>
                                <i class="fas fa-book position-absolute top-50 end-0 translate-middle-y me-3 opacity-25 fa-3x"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-success text-white h-100 shadow-sm border-0">
                            <div class="card-body position-relative">
                                <h6 class="card-title opacity-75">Độc giả thành viên</h6>
                                <h2 class="fw-bold">{{ stats.totalReaders }}</h2>
                                <i class="fas fa-users position-absolute top-50 end-0 translate-middle-y me-3 opacity-25 fa-3x"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-warning text-dark h-100 shadow-sm border-0">
                            <div class="card-body position-relative">
                                <h6 class="card-title opacity-75">Đơn chờ duyệt</h6>
                                <h2 class="fw-bold">{{ stats.pending }}</h2>
                                <i class="fas fa-clock position-absolute top-50 end-0 translate-middle-y me-3 opacity-25 fa-3x"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-danger text-white h-100 shadow-sm border-0">
                            <div class="card-body position-relative">
                                <h6 class="card-title opacity-75">Sách quá hạn</h6>
                                <h2 class="fw-bold">{{ stats.overdue }}</h2>
                                <i class="fas fa-exclamation-triangle position-absolute top-50 end-0 translate-middle-y me-3 opacity-25 fa-3x"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm border-0 h-100">
                            <div class="card-header bg-white py-3">
                                <h6 class="fw-bold m-0 text-secondary"><i class="fas fa-chart-bar me-2"></i>Hoạt động thư viện</h6>
                            </div>
                            <div class="card-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                                        Tổng số lượt mượn (từ trước đến nay)
                                        <span class="badge bg-primary rounded-pill">{{ stats.totalBorrows }}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                                        Đang mượn (chưa trả)
                                        <span class="badge bg-info text-dark rounded-pill">{{ stats.borrowing }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card shadow-sm border-0 h-100">
                            <div class="card-header bg-white py-3">
                                <h6 class="fw-bold m-0 text-secondary"><i class="fas fa-crown me-2 text-warning"></i>Top 5 Sách Hot nhất</h6>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover mb-0 align-middle">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Tên sách</th>
                                            <th class="text-center" style="width: 100px;">Lượt mượn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(book, index) in stats.topBooks" :key="index">
                                            <td>
                                                <span class="badge bg-light text-secondary border me-2">#{{ index + 1 }}</span>
                                                <span class="fw-semibold text-dark">{{ book.tenSach }}</span>
                                            </td>
                                            <td class="text-center">
                                                <span class="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2">
                                                    {{ book.soLuotMuon }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="!stats.topBooks || stats.topBooks.length === 0">
                                            <td colspan="2" class="text-center text-muted py-4">Chưa có dữ liệu</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'books'" class="fade-in">
                 <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold text-secondary">Danh sách Sách ({{ books.length }})</h5>
                    <button class="btn btn-success shadow-sm" @click="$router.push('/admin/books/add')"><i class="fas fa-plus"></i> Thêm</button>
                 </div>
                 <div class="table-responsive card shadow-sm border-0" style="max-height: 70vh; overflow-y: auto;">
                     <table class="table table-hover mb-0 align-middle">
                         <thead class="table-light text-secondary sticky-top">
                            <tr><th>Hình ảnh</th><th>Thông tin</th><th>Phân loại</th><th>Kho</th><th>Thao tác</th></tr>
                         </thead>
                         <tbody>
                            <tr v-for="book in books" :key="book._id">
                                <td style="width: 80px;"><img :src="book.hinhAnh" class="rounded border" style="width: 60px; height: 80px; object-fit: cover;"></td>
                                <td>
                                    <div class="fw-bold text-primary">{{ book.tenSach }}</div>
                                    <small class="text-muted">Mã: {{ book._id }}</small>
                                </td>
                                <td><span class="badge bg-light text-dark border">{{ book.theLoaiInfo?.[0]?.tenTheLoai }}</span></td>
                                <td><span class="badge" :class="book.soQuyen>0?'bg-success':'bg-danger'">{{ book.soQuyen }}</span></td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-outline-warning btn-sm" @click="$router.push(`/admin/books/${book._id}`)"><i class="fas fa-edit"></i></button>
                                        <button class="btn btn-outline-danger btn-sm" @click="deleteItem(SachService, book._id, 'sách')"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                     </table>
                 </div>
            </div>

            <div v-if="activeTab === 'borrows'" class="fade-in">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold text-secondary">Lịch sử Mượn Trả ({{ borrows.length }})</h5>
                </div>
                <div class="table-responsive card shadow-sm border-0" style="max-height: 70vh; overflow-y: auto;">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light text-secondary sticky-top">
                            <tr>
                                <th>Độc giả</th>
                                <th>Sách</th>
                                <th>Ngày Mượn</th>
                                <th>Hạn Trả</th>
                                <th>Ngày Trả TT</th>
                                <th>Trạng thái</th>
                                <th>Xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in borrows" :key="item._id">
                                <td>
                                    <div class="fw-bold">{{ item.docGiaInfo?.[0]?.ten || 'Ẩn danh' }}</div>
                                    <small class="text-muted">{{ item.docGiaInfo?.[0]?.dienThoai }}</small>
                                </td>
                                <td class="text-primary">{{ item.sachInfo?.[0]?.tenSach || 'Sách đã xóa' }}</td>
                                <td><span v-if="item.ngayMuon">{{ formatDate(item.ngayMuon) }}</span><span v-else class="text-muted small">Chờ duyệt...</span></td>
                                <td><span v-if="item.ngayTra">{{ formatDate(item.ngayTra) }}</span><span v-else>---</span></td>
                                <td :class="{ 'text-danger fw-bold': isLate(item) }">
                                    <span v-if="item.ngayTraThucTe">{{ formatDate(item.ngayTraThucTe) }} <i v-if="isLate(item)" class="fas fa-exclamation-triangle"></i></span>
                                    <span v-else>---</span>
                                </td>
                                <td>
                                    <span v-if="item.trangThai==='cho_duyet'" class="badge bg-warning text-dark">Chờ duyệt</span>
                                    <span v-else-if="item.trangThai==='dang_muon'" class="badge bg-primary">Đang mượn</span>
                                    <span v-else-if="item.trangThai==='da_tra'" class="badge bg-success">Đã trả</span>
                                    <div v-else-if="item.trangThai==='da_huy'">
                                        <span class="badge bg-danger mb-1">Đã từ chối</span>
                                        <div class="small text-danger fst-italic border-top pt-1 mt-1" style="max-width: 150px;">{{ item.lyDoTuChoi }}</div>
                                    </div>
                                </td>
                                <td>
                                    <div v-if="item.trangThai==='cho_duyet'" class="d-flex gap-2">
                                        <button class="btn btn-success btn-sm" @click="approve(item._id)"><i class="fas fa-check"></i></button>
                                        <button class="btn btn-outline-danger btn-sm" @click="reject(item._id)"><i class="fas fa-times"></i></button>
                                    </div>
                                    <button v-if="item.trangThai==='dang_muon'" class="btn btn-primary btn-sm" @click="confirmReturn(item._id)"><i class="fas fa-undo"></i> Trả</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="activeTab === 'readers'" class="fade-in">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold text-secondary">Danh sách Độc Giả ({{ readers.length }})</h5>
                </div>
                <div class="table-responsive card shadow-sm border-0">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light text-secondary">
                            <tr>
                                <th>Họ Tên</th>
                                <th>Liên hệ</th>
                                <th>Trạng thái Vi phạm</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in readers" :key="user._id">
                                <td>
                                    <div class="fw-bold">{{ user.hoTen || user.ten }}</div> 
                                    <small class="text-muted">Mã: {{ user._id }}</small>
                                </td>
                                <td>
                                    <div><i class="fas fa-phone me-1"></i> {{ user.dienThoai }}</div> 
                                    <small>{{ user.diaChi }}</small>
                                </td>
                                <td>
                                    <div v-if="user.biKhoa" class="text-danger fw-bold">
                                        <i class="fas fa-lock"></i> 
                                        {{ (user.soLanViPham >= 3) ? 'KHÓA VĨNH VIỄN' : 'Đang bị khóa (7 ngày)' }}
                                    </div>
                                    <div v-else class="text-success">
                                        <i class="fas fa-check-circle"></i> Hoạt động
                                    </div>
                                    <small class="text-muted">Vi phạm: {{ user.soLanViPham || 0 }}/3 lần</small>
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-outline-primary btn-sm" @click="viewHistory(user._id)"><i class="fas fa-history"></i> Xem LS</button>
                                        
                                        <button v-if="user.biKhoa && (user.soLanViPham || 0) < 3" class="btn btn-warning btn-sm" @click="unlockUser(user._id)">
                                            <i class="fas fa-unlock"></i> Mở khóa
                                        </button>
                                        
                                        <button v-if="(user.soLanViPham || 0) >= 3" class="btn btn-secondary btn-sm" disabled>
                                            <i class="fas fa-ban"></i> Cấm vĩnh viễn
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="activeTab === 'nxbs'" class="fade-in">
                 <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold text-secondary">Nhà Xuất Bản ({{ nxbs.length }})</h5>
                    <button class="btn btn-success shadow-sm" @click="$router.push('/admin/publishers/add')"><i class="fas fa-plus"></i> Thêm</button>
                </div>
                <div class="table-responsive card shadow-sm border-0" style="max-height: 70vh; overflow-y: auto;">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light text-secondary sticky-top"><tr><th>Mã</th><th>Tên NXB</th><th>Địa Chỉ</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            <tr v-for="nxb in nxbs" :key="nxb._id">
                                <td><span class="badge bg-light text-dark border">{{ nxb._id }}</span></td>
                                <td class="fw-bold">{{ nxb.tenNXB }}</td>
                                <td>{{ nxb.diaChi }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-outline-warning btn-sm" @click="$router.push(`/admin/publishers/${nxb._id}`)"><i class="fas fa-edit"></i></button>
                                        <button class="btn btn-outline-danger btn-sm" @click="deleteItem(NXBService, nxb._id, 'NXB')"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div v-if="activeTab === 'authors'" class="fade-in">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold text-secondary">Tác Giả ({{ authors.length }})</h5>
                    <button class="btn btn-success shadow-sm" @click="$router.push('/admin/authors/add')"><i class="fas fa-plus"></i> Thêm</button>
                </div>
                <div class="table-responsive card shadow-sm border-0" style="max-height: 70vh; overflow-y: auto;">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light text-secondary sticky-top"><tr><th>Mã</th><th>Tên Tác Giả</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            <tr v-for="author in authors" :key="author._id">
                                <td><span class="badge bg-light text-dark border">{{ author._id }}</span></td>
                                <td class="fw-bold">{{ author.tenTacGia }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-outline-warning btn-sm" @click="$router.push(`/admin/authors/${author._id}`)"><i class="fas fa-edit"></i></button>
                                        <button class="btn btn-outline-danger btn-sm" @click="deleteItem(TacGiaService, author._id, 'tác giả')"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="activeTab === 'genres'" class="fade-in">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold text-secondary">Thể Loại ({{ genres.length }})</h5>
                    <button class="btn btn-success shadow-sm" @click="$router.push('/admin/genres/add')"><i class="fas fa-plus"></i> Thêm</button>
                </div>
                <div class="table-responsive card shadow-sm border-0" style="max-height: 70vh; overflow-y: auto;">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light text-secondary sticky-top"><tr><th>Mã</th><th>Tên Thể Loại</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            <tr v-for="genre in genres" :key="genre._id">
                                <td><span class="badge bg-light text-dark border">{{ genre._id }}</span></td>
                                <td class="fw-bold">{{ genre.tenTheLoai }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-outline-warning btn-sm" @click="$router.push(`/admin/genres/${genre._id}`)"><i class="fas fa-edit"></i></button>
                                        <button class="btn btn-outline-danger btn-sm" @click="deleteItem(TheLoaiService, genre._id, 'thể loại')"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
// --- IMPORT ĐẦY ĐỦ CÁC SERVICE ---
import ThongKeService from "@/services/thongke.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import MuonSachService from "@/services/muon.service";
import NXBService from "@/services/nxb.service";
import TacGiaService from "@/services/tacgia.service";
import TheLoaiService from "@/services/theloai.service";

export default {
    data() {
        return {
            activeTab: 'stats',
            tabs: [
                { id: 'books', name: 'Sách', icon: 'fas fa-book' },
                { id: 'borrows', name: 'Mượn Trả', icon: 'fas fa-exchange-alt' },
                { id: 'readers', name: 'Độc Giả', icon: 'fas fa-users' },
                { id: 'nxbs', name: 'NXB', icon: 'fas fa-building' },
                { id: 'authors', name: 'Tác Giả', icon: 'fas fa-pen-nib' },
                { id: 'genres', name: 'Thể Loại', icon: 'fas fa-tags' },
            ],

            // Dữ liệu Thống kê
            stats: {
                totalBooks: 0, totalReaders: 0, totalBorrows: 0,
                borrowing: 0, pending: 0, overdue: 0, topBooks: []
            },

            // Dữ liệu các tab khác
            books: [],
            borrows: [],
            readers: [],
            nxbs: [],
            authors: [],
            genres: [],

            isLoading: false,

            // Expose services
            SachService, NXBService, TacGiaService, TheLoaiService, DocGiaService
        };
    },
    methods: {
        async fetchData() {
            this.isLoading = true;
            try {
                if (this.activeTab === 'stats') this.stats = await ThongKeService.getStats();
                else if (this.activeTab === 'books') this.books = await SachService.getAll();
                else if (this.activeTab === 'borrows') this.borrows = await MuonSachService.getAll();
                else if (this.activeTab === 'readers') this.readers = await DocGiaService.getAll();
                else if (this.activeTab === 'nxbs') this.nxbs = await NXBService.getAll();
                else if (this.activeTab === 'authors') this.authors = await TacGiaService.getAll();
                else if (this.activeTab === 'genres') this.genres = await TheLoaiService.getAll();

                const data = Array.isArray(this.books) ? this.books : (this.books.data || []);
                if (this.activeTab === 'books') this.books = data;

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                this.isLoading = false;
            }
        },

        switchTab(tabId) {
            this.activeTab = tabId;
            this.fetchData();
        },

        async unlockUser(id) {
            if(confirm("Mở khóa cho độc giả này?")) {
                try { await DocGiaService.unlock(id); alert("Đã mở khóa!"); this.fetchData(); } 
                catch(e) { alert("Lỗi: " + e.message); }
            }
        },
        viewHistory(userId) {
            this.activeTab = 'borrows';
            this.isLoading = true;
            MuonSachService.getHistory(userId).then(data => {
                this.borrows = data; 
                this.isLoading = false;
            });
        },
        async deleteItem(service, id, name) {
            if (confirm(`Xóa ${name} này?`)) {
                try { await service.delete(id); this.fetchData(); } 
                catch (e) { alert("Lỗi xóa: " + e.message); }
            }
        },
        async approve(id) { try { await MuonSachService.approve(id); this.fetchData(); } catch(e){ alert(e.message); } },
        async reject(id) { 
            const lyDo = prompt("Lý do từ chối:");
            if(lyDo) try { await MuonSachService.reject(id, lyDo); this.fetchData(); } catch(e){ alert(e.message); }
        },
        async confirmReturn(id) { 
            if(confirm("Xác nhận đã trả sách?")) try { await MuonSachService.returnBook(id); this.fetchData(); } catch(e){ alert(e.message); }
        },
        formatDate(d) { return d ? new Date(d).toLocaleDateString('vi-VN') : "" },
        isLate(item) {
            if (item.ngayTra && item.ngayTraThucTe) {
                return new Date(item.ngayTraThucTe).getTime() > new Date(item.ngayTra).getTime();
            }
            return false;
        },
    },
    mounted() {
        this.fetchData();
    }
};
</script>

<style scoped>
.nav-pills .nav-link { color: #555; font-weight: 600; border-radius: 20px; padding: 8px 20px; transition: all 0.2s; }
.nav-pills .nav-link:hover { background-color: #f0f0f0; }
.nav-pills .nav-link.active { background-color: #0d6efd; color: white; box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3); }
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.sticky-top { z-index: 1; }
/* Style mới cho card thống kê */
.card-body { position: relative; overflow: hidden; }
.card-body i { transition: transform 0.3s ease; }
.card:hover .card-body i { transform: translateY(-50%) scale(1.2); opacity: 0.4; }
</style>