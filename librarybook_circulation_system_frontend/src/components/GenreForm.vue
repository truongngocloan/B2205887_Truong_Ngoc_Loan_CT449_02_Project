<template>
    <div class="card p-4 shadow-sm border-0">
        <form @submit.prevent="submitGenre">
            <div class="mb-3">
                <label class="form-label fw-bold">Mã Thể Loại (ID)</label>
                <input 
                    type="text" 
                    class="form-control" 
                    v-model="localGenre.maTheLoai" 
                    :disabled="localGenre._id" 
                    placeholder="Nhập mã (VD: TL01)" 
                    required 
                />
                <small v-if="localGenre._id" class="text-muted">Không thể sửa Mã</small>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Tên Thể Loại</label>
                <input 
                    type="text" 
                    class="form-control" 
                    v-model="localGenre.tenTheLoai" 
                    placeholder="Nhập tên thể loại" 
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
    props: {
        genre: { type: Object, required: true },
    },
    emits: ["submit:genre"],
    data() {
        return {
            localGenre: { ...this.genre },
        };
    },
    watch: {
        genre(newVal) {
            this.localGenre = { ...newVal };
            // Nếu là trang sửa (có _id), gán _id vào ô Mã để hiển thị
            if (newVal._id) {
                this.localGenre.maTheLoai = newVal._id;
            }
        }
    },
    methods: {
        submitGenre() {
            // Nếu là thêm mới, chưa có _id, backend sẽ tự lấy maTheLoai làm _id
            // Nếu là sửa, _id đã có sẵn, backend sẽ bỏ qua trường maTheLoai
            this.$emit("submit:genre", this.localGenre);
        },
    },
};
</script>