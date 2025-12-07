<template>
    <div class="container mt-3" style="max-width: 700px;">
        <h4 class="mb-3 text-center">Thêm Sách Mới</h4>
        <BookForm 
            :book="{ maSach: nextId }" 
            :authors="authors"
            :genres="genres"
            :publishers="publishers"
            @submit:book="addBook" 
        />
    </div>
</template>

<script>
import BookForm from "@/components/BookForm.vue";
import SachService from "@/services/sach.service";
import TacGiaService from "@/services/tacgia.service";
import TheLoaiService from "@/services/theloai.service";
import NXBService from "@/services/nxb.service";

export default {
    components: { BookForm },
    data() {
        return {
            nextId: "",
            authors: [],
            genres: [],
            publishers: []
        };
    },
    methods: {
        async fetchData() {
            try {
                // 1. Lấy tất cả dữ liệu cần thiết
                const [books, authors, genres, nxbs] = await Promise.all([
                    SachService.getAll(),
                    TacGiaService.getAll(),
                    TheLoaiService.getAll(),
                    NXBService.getAll()
                ]);

                this.authors = authors;
                this.genres = genres;
                this.publishers = nxbs;

                // 2. Tính toán ID kế tiếp
                this.generateNextId(books);

            } catch (error) {
                console.log(error);
            }
        },

        generateNextId(books) {
            if (!books || books.length === 0) {
                this.nextId = "MS?_0001"; // Mặc định nếu chưa có sách
                return;
            }

            // Lấy ra danh sách các mã sách (ví dụ: ['S001', 'S002', 'S010'])
            // Giả sử mã sách có dạng chữ + số (VD: S001)
            // Ta sẽ tìm số lớn nhất trong các mã
            let maxNum = 0;
            const regex = /(\d+)/; // Biểu thức tìm số

            books.forEach(b => {
                const match = b._id.match(regex);
                if (match) {
                    const num = parseInt(match[0]);
                    if (num > maxNum) maxNum = num;
                }
            });

            // Tạo mã mới: Tăng số lên 1 và giữ định dạng
            // Ví dụ: max là 10 -> 11 -> "S011"
            const nextNum = maxNum + 1;
            // PadStart(3, '0') để đảm bảo luôn có 3 chữ số (001, 010, 100)
            this.nextId = "MS_" + nextNum.toString().padStart(4, '0');
        },

        async addBook(data) {
            try {
                await SachService.create(data);
                alert("Thêm sách thành công!");
                this.$router.push({ name: "admin.dashboard" });
            } catch (error) {
                alert(error.response?.data?.message || "Lỗi thêm sách");
            }
        },
    },
    mounted() {
        this.fetchData();
    }
};
</script>