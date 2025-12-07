<template>
    <div class="container py-4">
        <div class="text-center mb-5 mt-4 header-section">
            <h1 class="display-4 fw-bold main-title">
                <span class="text-highlight">The digital library</span>
            </h1>
            <h1>
                <br class="d-md-none"> that powers your learning.
            </h1>
        </div>
        
        <div class="row justify-content-center mb-4">
            <div class="col-md-8">
                <InputSearch 
                    v-model="searchText" 
                    @submit="handleEnter" 
                />
            </div>
        </div>

        <div class="dynamic-section mb-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="fw-bold m-0 text-primary">
                    <i class="fas" :class="searchText ? 'fa-search' : 'fa-book-open'"></i>
                    {{ searchText ? `Kết quả cho: "${searchText}"` : "Sách mới cập nhật" }}
                </h3>
                
                <button 
                    class="btn btn-sm btn-outline-primary rounded-pill px-3"
                    @click="goToSearchPage"
                >
                    {{ searchText ? `Xem tất cả kết quả (${totalResultCount})` : 'Xem tất cả sách trong thư viện' }} 
                    <i class="fas fa-arrow-right ms-1"></i>
                </button>
            </div>

            <div v-if="displayedTopBooks.length > 0">
                <BookList :books="displayedTopBooks" />
            </div>
            
            <div v-else class="text-center py-4 text-muted bg-light rounded-3">
                <p class="m-0">Không tìm thấy sách nào phù hợp.</p>
            </div>
        </div>
        
        <hr class="my-5 text-secondary opacity-25"> <div class="category-scroll-container mb-4">
            <h4 class="fw-bold mb-3">Khám phá theo thể loại</h4>
            <div class="d-flex gap-2 category-list">
                <button 
                    v-for="genre in genres" 
                    :key="genre._id"
                    class="btn btn-category d-flex align-items-center gap-2"
                    :class="{ active: selectedGenre?._id === genre._id }"
                    @click="selectedGenre = genre"
                >
                    <i class="fas fa-book"></i> 
                    <span>{{ genre.tenTheLoai }}</span>
                </button>
            </div>
            <div class="scroll-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>

        <div v-if="selectedGenre" class="bg-light p-4 rounded-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold m-0">{{ selectedGenre.tenTheLoai }}</h2>
                <button class="btn btn-view-all" @click="goToCategoryDetail">
                    Chi tiết <i class="fas fa-arrow-right ms-2"></i>
                </button>
            </div>

            <div v-if="genreBooks.length > 0">
                <BookList :books="genreBooks" />
            </div>
            <div v-else class="text-center py-5 text-muted">
                <p>Chưa có sách nào thuộc thể loại này.</p>
            </div>
        </div>
        
        <div v-else class="text-center mt-5">
            <div class="spinner-border text-primary"></div>
        </div>
    </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import BookList from "@/components/BookList.vue";
import SachService from "@/services/sach.service";
import TheLoaiService from "@/services/theloai.service";

export default {
    components: { BookList, InputSearch },
    data() {
        return {
            allBooks: [],
            genres: [],
            selectedGenre: null,
            searchText: "",
        };
    },
    computed: {
        // --- LOGIC CHO PHẦN TRÊN (Dynamic Section) ---
        
        // 1. Tạo danh sách đã lọc và sắp xếp (Toàn bộ)
        filteredFullList() {
            // --- THÊM DÒNG BẢO VỆ NÀY ---
            if (!Array.isArray(this.allBooks)) return [];
            // ----------------------------

            let list = [...this.allBooks]; // Copy mảng để không ảnh hưởng gốc

            // Nếu có tìm kiếm -> Lọc theo tên
            if (this.searchText) {
                const lowerSearch = this.searchText.toLowerCase();
                list = list.filter(b => b.tenSach.toLowerCase().includes(lowerSearch));
            }

            // Luôn sắp xếp mới nhất lên đầu
            return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        },

        // 2. Cắt lấy 6 cuốn để hiển thị
        displayedTopBooks() {
            return this.filteredFullList.slice(0, 6);
        },

        // 3. Đếm tổng số kết quả để quyết định hiện nút "View All"
        totalResultCount() {
            return this.filteredFullList.length;
        },

        // 4. Tiêu đề thay đổi động
        sectionTitle() {
            return this.searchText 
                ? `Kết quả tìm kiếm cho: "${this.searchText}"` 
                : "Sách mới cập nhật";
        },

        // --- LOGIC CHO PHẦN DƯỚI (Category Section) ---
        genreBooks() {
            if (!this.selectedGenre) return [];
            // Lọc sách theo thể loại đang chọn
            const books = this.allBooks.filter(book => {
                const genreId = this.selectedGenre._id;
                if (Array.isArray(book.maTheLoai)) {
                    return book.maTheLoai.includes(genreId);
                }
                return book.maTheLoai === genreId;
            });
            // Sắp xếp và lấy 6 cuốn preview cho thể loại
            return books
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6);
        }
    },
    methods: {
        // Trong methods:
        async fetchData() {
            try {
                const [response, genres] = await Promise.all([
                    SachService.getAll(), // API này giờ trả về { books: [], totalPages: ... }
                    TheLoaiService.getAll()
                ]);

                // --- SỬA ĐOẠN NÀY ---
                // Kiểm tra xem response có phải là dạng phân trang mới không
                if (response.books && Array.isArray(response.books)) {
                    this.allBooks = response.books; // Lấy mảng sách bên trong object
                } else if (Array.isArray(response)) {
                    this.allBooks = response; // Trường hợp API cũ trả về mảng
                } else {
                    this.allBooks = []; // Fallback nếu dữ liệu lỗi
                }
                // --------------------

                this.genres = genres;
                if (genres.length > 0) this.selectedGenre = genres[0];
            } catch (error) { 
                console.log(error); 
                this.allBooks = []; // Đảm bảo không bị null khi lỗi
            }
        },
        
        // Chuyển hướng đến trang Category Detail
        goToCategoryDetail() {
            if(this.selectedGenre) {
                this.$router.push({ 
                    name: 'category.detail', 
                    params: { id: this.selectedGenre._id } 
                });
            }
        },

        handleEnter() {
            // Chỉ in ra log hoặc thực hiện cuộn trang xuống kết quả (nếu muốn)
            console.log("Đã nhấn Enter. Kết quả xem trước đang hiển thị bên dưới.");
            
            // Mẹo UX: Bạn có thể bỏ focus khỏi ô input để ẩn bàn phím ảo trên điện thoại
            // document.activeElement.blur(); 
        },

        // Chuyển hướng đến trang Search Page (Khi bấm Enter hoặc nút View All)
        goToSearchPage() {
            // Nếu có từ khóa -> sang trang search kèm query
            // Nếu không có từ khóa (đang xem Newest) -> sang trang search rỗng (để xem tất cả)
            // Logic Mới: Luôn cho phép chuyển trang
            // Nếu có searchText -> Trang SearchResults sẽ lọc.
            // Nếu KHÔNG có searchText -> Trang SearchResults sẽ hiện tất cả sách.
            const queryParams = {};
            if (this.searchText) {
                queryParams.q = this.searchText;
            }

            this.$router.push({ 
                name: 'search', 
                query: queryParams 
            });
        }
    },
    mounted() {
        this.fetchData();
    }
};
</script>

<style scoped>
/* --- PHẦN STYLE MỚI CHO TIÊU ĐỀ --- */
.main-title {
    font-family: 'Times New Roman', serif; /* Dùng font có chân để giống ảnh mẫu */
    color: #000;
    line-height: 1.2;
}

.text-highlight {
    color: #3b4cca; /* Màu xanh tím giống Perlego */
    font-style: italic; /* Thêm in nghiêng nhẹ cho phần này nếu thích */
}
/* Style cũ giữ nguyên */
.category-scroll-container {
    position: relative;
    padding-right: 40px; 
}
.category-list {
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: none; 
}
.category-list::-webkit-scrollbar { display: none; }

.btn-category {
    white-space: nowrap; 
    border: 1px solid #e0e0e0;
    background: white;
    color: #333;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s;
}
.btn-category:hover { background: #f5f5f5; }
.btn-category.active {
    background: #333; /* Đổi màu active thành đen cho nổi bật */
    border-color: #333;
    color: #fff;
}

.scroll-arrow {
    position: absolute; right: 0; top: 40px; /* Chỉnh lại vị trí mũi tên */
    height: 42px; width: 40px;
    background: linear-gradient(to right, transparent, white 40%);
    display: flex; align-items: center; justify-content: center;
    color: #666; pointer-events: none;
}

.btn-view-all {
    background: white;
    border: 1px solid #ddd;
    color: #222;
    font-weight: 700;
    padding: 8px 20px;
    border-radius: 20px;
    transition: all 0.2s;
}
.btn-view-all:hover {
    border-color: #333;
    background: #f8f9fa;
}
</style>