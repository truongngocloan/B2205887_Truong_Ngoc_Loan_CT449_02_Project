<template>
    <div class="container py-5" v-if="genreInfo">
        <div class="text-center mb-5">
            <h1 class="fw-bold display-5">{{ genreInfo.tenTheLoai }}</h1>
            <p class="text-muted">Khám phá bộ sưu tập sách {{ genreInfo.tenTheLoai }}</p>
        </div>

        <BookList :books="displayedBooks" />

        <div class="text-center mt-5" v-if="visibleCount < totalBooksInGenre">
            <button class="btn btn-outline-primary rounded-pill px-5 py-2" @click="loadMore">
                Show {{ remainingBooks }} more <i class="fas fa-chevron-down ms-2"></i>
            </button>
        </div>
        
        <div v-if="totalBooksInGenre === 0" class="text-center text-muted">
            Chưa có sách nào.
        </div>
    </div>
</template>

<script>
import BookList from "@/components/BookList.vue";
import SachService from "@/services/sach.service";
import TheLoaiService from "@/services/theloai.service";

export default {
    components: { BookList },
    props: { id: { type: String, required: true } }, // Nhận ID thể loại từ URL
    data() {
        return {
            allBooksInGenre: [], // Chứa toàn bộ sách của thể loại này
            genreInfo: null,     // Thông tin tên thể loại
            visibleCount: 12     // Mặc định hiển thị 12 cuốn
        };
    },
    computed: {
        // Cắt mảng để hiển thị
        displayedBooks() {
            return this.allBooksInGenre.slice(0, this.visibleCount);
        },
        totalBooksInGenre() {
            return this.allBooksInGenre.length;
        },
        remainingBooks() {
            const left = this.totalBooksInGenre - this.visibleCount;
            return left > 12 ? 12 : left; // Hiển thị số lượng sẽ load tiếp
        }
    },
    methods: {
        async fetchData() {
            try {
                // 1. Lấy thông tin Thể loại để hiện tên
                // (Backend TheLoaiService cần có hàm get(id), nếu chưa có dùng getAll rồi find)
                const genres = await TheLoaiService.getAll(); 
                this.genreInfo = genres.find(g => g._id === this.id);

                // 2. Lấy tất cả sách và lọc
                const books = await SachService.getAll();
                // Lọc sách thuộc thể loại này và Sắp xếp mới nhất
                this.allBooksInGenre = books
                    .filter(b => {
                        // Kiểm tra nếu là mảng thì dùng includes, nếu chuỗi thì so sánh bằng
                        if (Array.isArray(b.maTheLoai)) {
                            return b.maTheLoai.includes(this.id);
                        }
                        return b.maTheLoai === this.id;
                    })
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            } catch (error) { console.log(error); }
        },
        loadMore() {
            this.visibleCount += 12; // Cộng thêm 12 cuốn mỗi lần bấm
        }
    },
    created() {
        this.fetchData();
    },
    // Nếu người dùng đổi thể loại trên URL mà không load lại trang
    watch: {
        id() { 
            this.visibleCount = 12; 
            this.fetchData(); 
        }
    }
};
</script>