<template>
    <div class="card p-4 shadow-sm border-0">
        <form @submit.prevent="submitBookLocal">
            
            <div class="mb-3">
                <label class="form-label fw-bold">Mã Sách (ID)</label>
                <div class="input-group">
                    <input type="text" class="form-control" v-model="bookLocal.maSach" :disabled="bookLocal._id" placeholder="VD: S001" required />
                    <button type="button" class="btn btn-outline-secondary" v-if="!bookLocal._id" @click="resetId"><i class="fas fa-magic"></i> Auto ID</button>
                </div>
            </div>
            <div class="mb-3"><label class="form-label fw-bold">Tên sách</label><input type="text" class="form-control" v-model="bookLocal.tenSach" required /></div>
            <div class="row">
                <div class="col-md-6 mb-3"><label class="form-label fw-bold">Đơn giá</label><input type="number" class="form-control" v-model="bookLocal.donGia" required /></div>
                <div class="col-md-6 mb-3"><label class="form-label fw-bold">Số quyển</label><input type="number" class="form-control" v-model="bookLocal.soQuyen" required /></div>
            </div>

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label fw-bold">Năm XB</label>
                    <input type="number" class="form-control" v-model="bookLocal.namXuatBan" placeholder="2024" />
                </div>
                
                <div class="col-md-8 mb-3">
                    <label class="form-label fw-bold">Tác giả</label>
                    <SearchSelect 
                        :options="authors" 
                        labelField="tenTacGia" 
                        valueField="_id"
                        v-model="bookLocal.maTacGia"
                        placeholder="Gõ để tìm tác giả..."
                        :multiple="true"
                    />
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Thể Loại</label>
                <SearchSelect 
                    :options="genres" 
                    labelField="tenTheLoai" 
                    valueField="_id"
                    v-model="bookLocal.maTheLoai"
                    placeholder="Gõ để tìm thể loại..."
                    :multiple="true"
                />
            </div>
            
            <div class="mb-3">
                <label class="form-label fw-bold">Nhà Xuất Bản</label>
                <SearchSelect 
                    :options="publishers" 
                    labelField="tenNXB" 
                    valueField="_id"
                    v-model="bookLocal.maNXB"
                    placeholder="Gõ để tìm nhà xuất bản..."
                />
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Hình ảnh</label>
                <input type="file" class="form-control" @change="onFileChange" accept="image/*" />
                <div v-if="previewImage" class="mt-3 text-center"><img :src="previewImage" class="img-thumbnail" style="height: 150px;"></div>
            </div>

            <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary px-4" @click="$router.push('/admin')">Hủy</button>
                <button class="btn btn-primary px-4">Lưu</button>
            </div>
        </form>
    </div>
</template>

<script>
// Import Component mới
import SearchSelect from "@/components/SearchSelect.vue";

export default {
    // Đăng ký component để dùng
    components: { SearchSelect },
    props: {
        book: { type: Object, required: true },
        authors: { type: Array, default: [] },
        genres: { type: Array, default: [] },
        publishers: { type: Array, default: [] },
    },
    emits: ["submit:book"],
    data() {
        return {
            bookLocal: { 
                ...this.book, 
                // Đảm bảo khởi tạo là mảng rỗng nếu chưa có dữ liệu
                maTacGia: this.book.maTacGia || [],
                maTheLoai: this.book.maTheLoai || []
            },
            selectedFile: null,
            previewImage: this.book.hinhAnh || null,
        };
    },
    watch: {
        book(newVal) {
            this.bookLocal = { ...newVal };
            // Đảm bảo dữ liệu từ API về được gán đúng là mảng
            this.bookLocal.maTacGia = newVal.maTacGia || [];
            this.bookLocal.maTheLoai = newVal.maTheLoai || [];
            // Copy các mã ID để component SearchSelect hiển thị đúng tên
            if(newVal.maSach) this.bookLocal.maSach = newVal.maSach;
            if(newVal.maTacGia) this.bookLocal.maTacGia = newVal.maTacGia;
            if(newVal.maTheLoai) this.bookLocal.maTheLoai = newVal.maTheLoai;
            if(newVal.maNXB) this.bookLocal.maNXB = newVal.maNXB;
            this.previewImage = newVal.hinhAnh;
        }
    },
    methods: {
        resetId() { this.bookLocal.maSach = this.book.maSach; },
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) { this.selectedFile = file; this.previewImage = URL.createObjectURL(file); }
        },
        submitBookLocal() {
            const formData = new FormData();
            formData.append("maSach", this.bookLocal.maSach || "");
            formData.append("tenSach", this.bookLocal.tenSach || "");
            formData.append("donGia", this.bookLocal.donGia || 0);
            formData.append("soQuyen", this.bookLocal.soQuyen || 0);
            formData.append("namXuatBan", this.bookLocal.namXuatBan || 2024);
            
            // --- QUAN TRỌNG: Gửi mảng dưới dạng JSON string ---
            formData.append("maTacGia", JSON.stringify(this.bookLocal.maTacGia));
            formData.append("maTheLoai", JSON.stringify(this.bookLocal.maTheLoai));
            formData.append("maNXB", this.bookLocal.maNXB || "");

            if (this.selectedFile) formData.append("hinhAnh", this.selectedFile);
            else if (this.bookLocal.hinhAnh) formData.append("hinhAnh", this.bookLocal.hinhAnh);

            this.$emit("submit:book", formData);
        },
    },
};
</script>