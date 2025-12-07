<template>
    <div class="container mt-4" style="max-width: 600px;">
        <h4 class="text-center mb-4 text-primary fw-bold">Thêm Thể Loại</h4>
        <GenreForm :genre="{}" @submit:genre="addGenre" />
    </div>
</template>

<script>
import GenreForm from "@/components/GenreForm.vue";
import TheLoaiService from "@/services/theloai.service";

export default {
    components: { GenreForm },
    methods: {
        async addGenre(data) {
            try {
                await TheLoaiService.create(data);
                alert("Thêm thể loại thành công!");
                this.$router.push("/admin");
            } catch (error) {
                console.log(error);
                alert(error.response?.data?.message || "Lỗi khi thêm thể loại");
            }
        },
    },
};
</script>