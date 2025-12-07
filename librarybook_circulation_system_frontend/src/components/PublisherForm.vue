<template>
    <div class="card p-4 shadow-sm border-0">
        <form @submit.prevent="submitPublisher">
            <div class="mb-3">
                <label for="maNXB" class="form-label fw-bold">Mã NXB (ID)</label>
                <input 
                    id="maNXB"
                    type="text" 
                    class="form-control" 
                    v-model="localPublisher.maNXB" 
                    :disabled="localPublisher._id" 
                    placeholder="Nhập mã (VD: NXB01)" 
                    required
                />
                <small v-if="localPublisher._id" class="text-muted">Không thể sửa Mã NXB</small>
            </div>

            <div class="mb-3">
                <label for="tenNXB" class="form-label fw-bold">Tên Nhà Xuất Bản</label>
                <input 
                    id="tenNXB"
                    type="text" 
                    class="form-control" 
                    v-model="localPublisher.tenNXB" 
                    required
                />
            </div>

            <div class="mb-3">
                <label for="diaChi" class="form-label fw-bold">Địa chỉ</label>
                <input 
                    id="diaChi"
                    type="text" 
                    class="form-control" 
                    v-model="localPublisher.diaChi" 
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
        publisher: { type: Object, required: true },
    },
    emits: ["submit:publisher"],
    data() {
        return {
            localPublisher: { ...this.publisher },
        };
    },
    watch: {
        // Cập nhật form khi dữ liệu props thay đổi (dùng cho trang Sửa)
        publisher(newVal) {
            this.localPublisher = { ...newVal };
            // Nếu là sửa (có _id), gán _id vào maNXB để hiển thị
            if (newVal._id) {
                this.localPublisher.maNXB = newVal._id;
            }
        }
    },
    methods: {
        submitPublisher() {
            // Nếu là tạo mới, gán maNXB vào _id để backend nhận diện
            if (!this.localPublisher._id) {
                this.localPublisher._id = this.localPublisher.maNXB;
            }
            this.$emit("submit:publisher", this.localPublisher);
        },
    },
};
</script>