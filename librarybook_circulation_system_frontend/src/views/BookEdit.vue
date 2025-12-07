<template>
    <div class="container mt-3" style="max-width: 700px;">
        <div v-if="book">
            <h4 class="mb-3 text-center">Hiệu chỉnh Sách</h4>
            <BookForm 
                :book="book" 
                :authors="authors"
                :genres="genres"
                :publishers="publishers"
                @submit:book="updateBook" 
            />
            <p class="text-danger text-center mt-2">{{ message }}</p>
        </div>
        <div v-else class="text-center">
            <p>Đang tải dữ liệu...</p>
        </div>
    </div>
</template>

<script>
import BookForm from "@/components/BookForm.vue";
import SachService from "@/services/sach.service";
// Import thêm các service khác
import TacGiaService from "@/services/tacgia.service";
import TheLoaiService from "@/services/theloai.service";
import NXBService from "@/services/nxb.service";

export default {
    components: { BookForm },
    props: { id: { type: String, required: true } },
    data() {
        return {
            book: null,
            message: "",
            // Khai báo các biến chứa danh sách
            authors: [],
            genres: [],
            publishers: []
        };
    },
    methods: {
        async fetchData() {
            try {
                // Gọi song song tất cả API để tiết kiệm thời gian
                const [book, authors, genres, nxbs] = await Promise.all([
                    SachService.get(this.id),
                    TacGiaService.getAll(),
                    TheLoaiService.getAll(),
                    NXBService.getAll()
                ]);

                this.book = book;
                this.authors = authors;
                this.genres = genres;
                this.publishers = nxbs;

            } catch (error) {
                console.log(error);
                // Xử lý lỗi (ví dụ chuyển trang nếu không tìm thấy sách)
                if(!this.book) {
                     this.$router.push({ name: "notfound", params: { pathMatch: this.$route.path.split("/").slice(1) }, query: this.$route.query, hash: this.$route.hash });
                }
            }
        },
        async updateBook(data) {
            try {
                await SachService.update(this.book._id, data);
                alert("Cập nhật sách thành công!");
                this.$router.push({ name: "admin.dashboard" });
            } catch (error) {
                console.log(error);
                this.message = "Lỗi cập nhật sách.";
            }
        },
    },
    created() {
        this.fetchData(); // Gọi hàm lấy toàn bộ dữ liệu
    },
};
</script>