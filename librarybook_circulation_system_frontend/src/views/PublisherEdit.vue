<template>
    <div class="container mt-4" style="max-width: 600px;">
        <h4 class="text-center mb-4 text-warning fw-bold">Cập nhật Nhà Xuất Bản</h4>
        <div v-if="publisher">
            <PublisherForm :publisher="publisher" @submit:publisher="updatePublisher" />
        </div>
        <p v-else class="text-center">Đang tải dữ liệu...</p>
    </div>
</template>

<script>
import PublisherForm from "@/components/PublisherForm.vue";
import NXBService from "@/services/nxb.service";

export default {
    components: { PublisherForm },
    props: { id: { type: String, required: true } },
    data() {
        return { publisher: null };
    },
    methods: {
        async getPublisher(id) {
            try {
                this.publisher = await NXBService.get(id);
            } catch (error) {
                console.log(error);
                this.$router.push("/notfound");
            }
        },
        async updatePublisher(data) {
            try {
                await NXBService.update(this.id, data);
                alert("Cập nhật thành công!");
                this.$router.push("/admin");
            } catch (error) {
                alert("Lỗi cập nhật");
            }
        },
    },
    created() {
        this.getPublisher(this.id);
    },
};
</script>