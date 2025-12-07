<template>
    <div class="container mt-4" style="max-width: 600px;">
        <h4 class="text-center mb-4 text-warning fw-bold">Cập nhật Tác Giả</h4>
        <div v-if="author">
            <AuthorForm :author="author" @submit:author="updateAuthor" />
        </div>
        <p v-else class="text-center">Đang tải dữ liệu...</p>
    </div>
</template>

<script>
import AuthorForm from "@/components/AuthorForm.vue";
import TacGiaService from "@/services/tacgia.service";

export default {
    components: { AuthorForm },
    props: { id: { type: String, required: true } },
    data() {
        return { author: null };
    },
    methods: {
        async getAuthor(id) {
            try {
                this.author = await TacGiaService.get(id);
            } catch (error) {
                console.log(error);
                this.$router.push("/notfound");
            }
        },
        async updateAuthor(data) {
            try {
                await TacGiaService.update(this.id, data);
                alert("Cập nhật thành công!");
                this.$router.push("/admin");
            } catch (error) {
                alert("Lỗi cập nhật");
            }
        },
    },
    created() {
        this.getAuthor(this.id);
    },
};
</script>