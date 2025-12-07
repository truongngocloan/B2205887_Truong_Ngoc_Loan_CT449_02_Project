<template>
    <div class="container py-5">
        <div class="text-center mb-5">
            <h1 class="fw-bold display-5">
                {{ keyword ? 'Kết quả tìm kiếm' : 'Thư viện sách' }}
            </h1>
            
            <p class="text-muted" v-if="keyword">
                Tìm thấy {{ totalBooks }} kết quả cho từ khóa: 
                <span class="fw-bold text-primary">"{{ keyword }}"</span>
            </p>
            <p class="text-muted" v-else>
                Hiện có tất cả {{ totalBooks }} cuốn sách trong hệ thống.
            </p>
        </div>

        <BookList :books="books" />

        <div class="text-center mt-5" v-if="books.length < totalBooks">
            <button class="btn btn-outline-primary rounded-pill px-5 py-2" @click="loadMore" :disabled="isLoading">
                <span v-if="isLoading">Đang tải...</span>
                <span v-else>
                    Xem thêm {{ remainingBooks }} sách <i class="fas fa-chevron-down ms-2"></i>
                </span>
            </button>
        </div>
        
        <div v-if="!isLoading && books.length === 0" class="text-center text-muted mt-5">
            <i class="fas fa-search fa-3x mb-3"></i>
            <p>Không có dữ liệu sách.</p>
        </div>
    </div>
</template>

<script>
import BookList from "@/components/BookList.vue";
import SachService from "@/services/sach.service";

export default {
    components: { BookList },
    data() {
        return {
            books: [],
            keyword: "",
            totalBooks: 0,
            currentPage: 1,
            limit: 12,
            isLoading: false
        };
    },
    computed: {
        remainingBooks() {
            const left = this.totalBooks - this.books.length;
            return left > this.limit ? this.limit : left;
        }
    },
    methods: {
        async fetchData(reset = true) {
            this.isLoading = true;
            try {
                if (reset) {
                    this.currentPage = 1;
                    this.books = [];
                }

                // Xây dựng Query string
                // Nếu keyword rỗng, query chỉ là ?page=1&limit=12 (Backend sẽ trả về tất cả)
                let query = `?page=${this.currentPage}&limit=${this.limit}`;
                if (this.keyword) {
                    query += `&name=${this.keyword}`;
                }

                const response = await SachService.getAll(query);

                if (response.books) {
                    this.books = [...this.books, ...response.books];
                    this.totalBooks = response.totalBooks;
                } else {
                    this.books = response;
                    this.totalBooks = response.length;
                }

            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        },
        loadMore() {
            this.currentPage++;
            this.fetchData(false);
        }
    },
    created() {
        // Lấy query từ URL. Nếu không có q, keyword sẽ là undefined/rỗng
        this.keyword = this.$route.query.q || "";
        this.fetchData();
    },
    watch: {
        // Theo dõi sự thay đổi URL (Ví dụ đang ở trang search này mà tìm từ khóa khác)
        '$route.query.q'(newKeyword) {
            this.keyword = newKeyword || "";
            this.fetchData(true);
        }
    }
};
</script>