<template>
    <div class="login-wrapper">
        
        <div class="animated-background">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
        </div>

        <div class="container d-flex justify-content-center align-items-center min-vh-100 position-relative z-10">
            <div class="card login-card shadow-lg p-4">
                <div class="card-body">
                    <h3 class="text-center text-primary mb-4 fw-bold">Đăng Nhập</h3>
                    
                    <div class="d-flex justify-content-center mb-4">
                        <div class="btn-group w-100" role="group">
                            <input type="radio" class="btn-check" name="role" id="role1" value="docgia" v-model="user.role" checked>
                            <label class="btn btn-outline-primary" for="role1">📖 Độc Giả</label>

                            <input type="radio" class="btn-check" name="role" id="role2" value="nhanvien" v-model="user.role">
                            <label class="btn btn-outline-primary" for="role2">👔 Thủ Thư</label>
                        </div>
                    </div>

                    <form @submit.prevent="handleLogin">
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-bold">Tài khoản</label>
                            <input type="text" class="form-control rounded-pill bg-light border-0 px-3 py-2" v-model="user.username" required placeholder="Số điện thoại...">
                        </div>
                        <div class="mb-4">
                            <label class="form-label text-muted small fw-bold">Mật khẩu</label>
                            <input type="password" class="form-control rounded-pill bg-light border-0 px-3 py-2" v-model="user.password" required placeholder="••••••">
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm">
                            Đăng Nhập {{ user.role === 'nhanvien' ? '(Admin)' : '' }}
                        </button>
                    </form>

                    <div v-if="user.role === 'docgia'" class="text-center mt-3">
                        <span class="text-muted small">Chưa có tài khoản? </span>
                        <router-link to="/register" class="fw-bold text-decoration-none">Đăng ký ngay</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
    data() {
        return {
            user: {
                username: "",
                password: "",
                role: "docgia",
            },
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await AuthService.login(this.user);
                localStorage.setItem("user", JSON.stringify(response.user));
                alert(`Xin chào ${response.user.ten || response.user.hoTenNV}!`);
                
                if (response.user.role === 'nhanvien') {
                    this.$router.push({ name: 'admin.dashboard' });
                } else {
                    this.$router.push({ name: 'book.app' });
                }
            } catch (error) {
                console.log(error);
                alert(error.response?.data?.message || "Đăng nhập thất bại");
            }
        },
    },
};
</script>

<style scoped>
/* --- Cấu hình riêng cho trang Login --- */
.login-wrapper {
    position: fixed; /* Che phủ toàn màn hình */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    z-index: 100; /* Nằm đè lên Header cũ */
}

/* Card đăng nhập kính mờ (Glassmorphism) */
.login-card {
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.85); /* Trắng trong suốt */
    backdrop-filter: blur(20px); /* Làm mờ nền phía sau */
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
}

.z-10 {
    z-index: 10;
}

/* --- Hiệu ứng Blobs (Copy từ cũ qua) --- */
.animated-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.6;
    animation: float 20s infinite ease-in-out alternate;
}

.blob-1 {
    top: -10%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: #a2d2ff;
    animation-delay: 0s;
}

.blob-2 {
    bottom: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: #ffc8dd;
    animation-delay: -5s;
}

.blob-3 {
    top: 40%;
    left: 40%;
    width: 400px;
    height: 400px;
    background: #e2dbf5;
    animation-delay: -10s;
}

@keyframes float {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(20px, -20px) scale(1.1); }
}
</style>