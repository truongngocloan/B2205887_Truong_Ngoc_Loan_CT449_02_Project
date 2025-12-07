<template>
    <div class="container mt-4" style="max-width: 600px;">
        <h4 class="text-center mb-4 text-primary fw-bold">Thêm Tác Giả Mới</h4>
        <AuthorForm :author="{}" @submit:author="addAuthor" />
    </div>
</template>

<script>
import AuthorForm from "@/components/AuthorForm.vue";
import TacGiaService from "@/services/tacgia.service";

export default {
    components: { AuthorForm },
    methods: {
        async addAuthor(data) {
            try {
                await TacGiaService.create(data);
                alert("Thêm tác giả thành công!");
                this.$router.push("/admin");
            } catch (error) {
                console.log(error);
                alert(error.response?.data?.message || "Lỗi khi thêm tác giả");
            }
        },
    },
};
</script>