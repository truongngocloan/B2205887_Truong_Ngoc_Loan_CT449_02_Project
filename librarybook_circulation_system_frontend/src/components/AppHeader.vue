<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
        <div class="container-fluid px-4">
            <router-link to="/" class="navbar-brand fw-bold fs-3 text-primary me-4">
                <i class="fas fa-book-open me-2"></i>EasyRead
            </router-link>
            
            <div class="d-none d-lg-block flex-grow-1 mx-5">
                <div class="header-search">
                    <input 
                        type="text" 
                        class="form-control rounded-pill border-1 bg-light px-4" 
                        placeholder="Tìm kiếm sách, tác giả, ISBN..."
                        v-model="searchText"
                        @keyup.enter="handleSearch"
                    >
                    <i class="fas fa-search search-icon text-muted"></i>
                </div>
            </div>

            <div class="collapse navbar-collapse flex-grow-0" id="navbarContent">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item me-3"><router-link to="/" class="nav-link fw-semibold">Khám phá</router-link></li>
                    <li class="nav-item me-3"><router-link to="/admin" class="nav-link fw-semibold" v-if="user?.role === 'nhanvien'">Quản lý</router-link></li>
                    <li class="nav-item me-3">
                        <router-link to="/history" class="nav-link fw-semibold" v-if="user?.role === 'docgia'">
                            <i class="fas fa-bookmark me-1"></i> Tủ sách
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="!user">
                        <router-link to="/login" class="btn btn-outline-primary rounded-pill px-4">Đăng nhập</router-link>
                    </li>
                    <li class="nav-item dropdown" v-else>
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" data-bs-toggle="dropdown">
                            <div class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2" style="width: 35px; height: 35px;">
                                {{ (user.ten || 'L')[0] }}
                            </div>
                            <span class="fw-semibold">{{ user.ten || user.hoTenNV }}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end border-0 shadow mt-2">
                            <li><a class="dropdown-item text-danger" href="#" @click="logout">Đăng xuất</a></li>
                        </ul>
                        <!-- <ul class="dropdown-menu dropdown-menu-end border-0 shadow mt-2">
                            <li v-if="user.role === 'docgia'"><router-link to="/history" class="dropdown-item">Tủ sách</router-link></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" @click="logout">Đăng xuất</a></li>
                        </ul> -->
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    data() { return { user: JSON.parse(localStorage.getItem("user")), searchText: "" }; },
    methods: {
        logout() { 
            // 1. Xóa thông tin user trong LocalStorage
            localStorage.removeItem("user"); 
            
            // 2. Set user về null để giao diện cập nhật ngay lập tức
            this.user = null; 

            // 3. SỬA Ở ĐÂY: Dùng window.location.href thay vì router.push
            // Lệnh này sẽ buộc trình duyệt tải lại trang và chuyển về /login
            // Giúp xóa sạch các state cũ còn lưu trong Vuex hoặc component khác
            window.location.href = "/login"; 
        },

        checkUser() { 
            this.user = JSON.parse(localStorage.getItem("user")); 
        },
        handleSearch() {
            // Kiểm tra nếu ô tìm kiếm không rỗng
            if (this.searchText.trim()) {
                // Chuyển hướng sang router có name là 'search' (đã định nghĩa ở bước trước)
                this.$router.push({ 
                    name: 'search', 
                    query: { q: this.searchText } 
                });
            }
        }
    },
    watch: { 
        $route(to) { 
            this.checkUser(); 
            // Nếu người dùng không ở trang search, có thể muốn reset ô tìm kiếm (tùy chọn)
            if (to.name !== 'search') {
                this.searchText = "";
            }
        } 
    },
    mounted() { 
        this.checkUser(); 
        // Nếu người dùng F5 tại trang search, điền lại text vào ô input
        if (this.$route.name === 'search' && this.$route.query.q) {
            this.searchText = this.$route.query.q;
        }
    }
};
</script>

<style scoped>
.header-search { position: relative; max-width: 600px; }
.search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); pointer-events: none; }
input:focus { box-shadow: none; border-color: #2e59d9; background: white !important; }
</style>
