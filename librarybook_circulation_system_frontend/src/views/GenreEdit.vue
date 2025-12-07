<template>
    <div class="container mt-4" style="max-width: 600px;">
        <h4 class="text-center mb-4 text-warning fw-bold">Cập nhật Thể Loại</h4>
        <div v-if="genre">
            <GenreForm :genre="genre" @submit:genre="updateGenre" />
        </div>
        <p v-else class="text-center">Đang tải dữ liệu...</p>
    </div>
</template>

<script>
import GenreForm from "@/components/GenreForm.vue";
import TheLoaiService from "@/services/theloai.service";

export default {
    components: { GenreForm },
    props: { id: { type: String, required: true } },
    data() {
        return { genre: null };
    },
    methods: {
        async getGenre(id) {
            try {
                this.genre = await TheLoaiService.get(id);
            } catch (error) {
                console.log(error);
                this.$router.push("/notfound");
            }
        },
        async updateGenre(data) {
            try {
                await TheLoaiService.update(this.id, data);
                alert("Cập nhật thành công!");
                this.$router.push("/admin");
            } catch (error) {
                alert("Lỗi cập nhật");
            }
        },
    },
    created() {
        this.getGenre(this.id);
    },
};
</script>