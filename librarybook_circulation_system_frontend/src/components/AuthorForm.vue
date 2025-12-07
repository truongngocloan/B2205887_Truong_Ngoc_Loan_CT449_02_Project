<template>
    <div class="card p-4 shadow-sm border-0">
        <form @submit.prevent="submitAuthor">
            <div class="mb-3">
                <label class="form-label fw-bold">Mã Tác Giả (ID)</label>
                <input 
                    type="text" 
                    class="form-control" 
                    v-model="localAuthor.maTacGia" 
                    :disabled="localAuthor._id" 
                    placeholder="VD: TG01" 
                    required 
                />
                <small v-if="localAuthor._id" class="text-muted">Không thể sửa Mã</small>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Tên Tác Giả</label>
                <input 
                    type="text" 
                    class="form-control" 
                    v-model="localAuthor.tenTacGia" 
                    required 
                />
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-secondary" @click="$router.push('/admin')">Hủy</button>
                <button class="btn btn-primary px-4">Lưu lại</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: { author: { type: Object, required: true } },
    emits: ["submit:author"],
    data() {
        return {
            localAuthor: { ...this.author },
        };
    },
    watch: {
        author(newVal) {
            this.localAuthor = { ...newVal };
            // Nếu đang sửa (có _id), gán _id vào ô Mã để hiển thị
            if (newVal._id) {
                this.localAuthor.maTacGia = newVal._id;
            }
        }
    },
    methods: {
        submitAuthor() {
            this.$emit("submit:author", this.localAuthor);
        },
    },
};
</script>