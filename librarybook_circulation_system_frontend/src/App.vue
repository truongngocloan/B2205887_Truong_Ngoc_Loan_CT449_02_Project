<script>
import AppHeader from "@/components/AppHeader.vue";
export default {
    components: { AppHeader },
};
</script>

<template>
    <div class="app-container">
        <AppHeader />
        <div class="main-content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style>
/* Cấu hình chung cho toàn App */
body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f9f9f9; /* Màu nền mặc định sạch sẽ */
    color: #333;
}

/* Hiệu ứng chuyển trang nhẹ nhàng */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>






















<!-- <script>
import AppHeader from "@/components/AppHeader.vue";
export default {
    components: { AppHeader },
};
</script>

<template>
    <div class="animated-background">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
    </div>

    <div class="main-content">
        <AppHeader />
        <div class="container py-4 fade-in">
            <router-view />
        </div>
    </div>
</template>

<style>
/* --- Cấu hình chung --- */
body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f8f9fa; /* Màu nền cơ bản */
    overflow-x: hidden;
}

/* --- 1. CSS cho Background Động --- */
.animated-background {
    position: fixed; /* Cố định để không trôi khi cuộn chuột */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1; /* Nằm dưới cùng */
    overflow: hidden;
    background: #ffffff; /* Nền trắng gốc */
}

/* Các đốm màu (Blobs) */
.blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px); /* Làm nhòe cực mạnh để tạo hiệu ứng khói/mây */
    opacity: 0.6; /* Độ trong suốt */
    animation: float 20s infinite ease-in-out alternate; /* Chuyển động lặp lại */
}

/* Đốm 1: Màu Xanh Dương (Góc trên trái) */
.blob-1 {
    top: -10%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: #a2d2ff;
    animation-delay: 0s;
}

/* Đốm 2: Màu Hồng Phấn (Góc dưới phải) */
.blob-2 {
    bottom: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: #ffc8dd;
    animation-delay: -5s; /* Chạy lệch nhịp cho tự nhiên */
}

/* Đốm 3: Màu Tím Nhạt (Di chuyển ở giữa) */
.blob-3 {
    top: 40%;
    left: 40%;
    width: 400px;
    height: 400px;
    background: #e2dbf5;
    animation-delay: -10s;
}

/* --- Animation di chuyển --- */
@keyframes float {
    0% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(50px, -50px) scale(1.1);
    }
    66% {
        transform: translate(-30px, 40px) scale(0.9);
    }
    100% {
        transform: translate(20px, -20px) scale(1);
    }
}

/* --- 2. Hiệu ứng kính mờ cho nội dung (Glassmorphism) --- */
/* (Tùy chọn: Nếu bạn muốn các thẻ Card nổi bật hơn trên nền này) */
.card {
    background: rgba(255, 255, 255, 0.85) !important; /* Trắng trong suốt */
    backdrop-filter: blur(10px); /* Hiệu ứng kính mờ */
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
}

/* Hiệu ứng Fade In khi chuyển trang cho mượt */
.fade-in {
    animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style> -->












<!-- <script>
import SachService from "@/services/sach.service";

export default {
    data() {
        return {
            books: [],
            error: null,
        };
    },
    methods: {
        async retrieveBooks() {
            try {
                this.books = await SachService.getAll();
                console.log("Dữ liệu lấy được:", this.books); // Kiểm tra log
            } catch (error) {
                console.log(error);
                this.error = "Không thể kết nối tới Server Backend!";
            }
        },
    },
    mounted() {
        // Hàm này chạy ngay khi trang web tải xong
        this.retrieveBooks();
    },
};
</script>

<template>
    <div class="container mt-3">
        <div class="header-section text-center mb-4">
            <h1 class="text-primary">📚 Thư Viện Trực Tuyến</h1>
            <p class="lead">Hệ thống quản lý mượn sách Online</p>
        </div>

        <div v-if="error" class="alert alert-danger text-center">
            {{ error }} <br>
            (Bạn đã chạy server backend ở cổng 3000 chưa?)
        </div>

        <div class="row" v-else>
            <div class="col-md-4 mb-4" v-for="book in books" :key="book._id">
                <div class="card h-100 shadow-sm">
                    <img 
                        :src="book.hinhAnh" 
                        class="card-img-top" 
                        alt="Bìa sách"
                        style="height: 300px; object-fit: cover;"
                    >
                    
                    <div class="card-body">
                        <h5 class="card-title text-success">{{ book.tenSach }}</h5>
                        <p class="card-text">
                            <strong>Tác giả:</strong> {{ book.tacGia }} <br>
                            <strong>Năm XB:</strong> {{ book.namXuatBan }}
                        </p>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-danger fw-bold">{{ book.donGia }} đ</span>
                            <span class="badge bg-info text-dark">Kho: {{ book.soQuyen }}</span>
                        </div>
                    </div>

                    <div class="card-footer bg-white border-top-0">
                        <button class="btn btn-primary w-100">
                            <i class="fas fa-book-reader"></i> Mượn Sách
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.card {
    transition: transform 0.2s;
}
.card:hover {
    transform: translateY(-5px);
}
</style> -->