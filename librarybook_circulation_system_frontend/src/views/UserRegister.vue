<!-- <template>
    <div class="container mt-5 w-50">
        <h3 class="text-center">Đăng Ký Thành Viên</h3>
        <form @submit.prevent="register">
            <div class="mb-3"><label>Họ</label><input type="text" class="form-control" v-model="user.hoLot"></div>
            <div class="mb-3"><label>Tên</label><input type="text" class="form-control" v-model="user.ten" required></div>
            <div class="mb-3"><label>Số điện thoại</label><input type="text" class="form-control" v-model="user.dienThoai" required></div>
            <div class="mb-3"><label>Mật khẩu</label><input type="password" class="form-control" v-model="user.password" required></div>
            <div class="mb-3"><label>Địa chỉ</label><input type="text" class="form-control" v-model="user.diaChi"></div>
            <button class="btn btn-success w-100">Đăng ký</button>
        </form>
    </div>
</template>
<script>
import DocGiaService from "@/services/docgia.service";
export default {
    data() { return { user: {} }; },
    methods: {
        async register() {
            try {
                await DocGiaService.create(this.user);
                alert("Đăng ký thành công!");
                this.$router.push("/login");
            } catch (e) { alert("Lỗi đăng ký"); }
        }
    }
};
</script> -->
<template>
    <div class="container mt-5 w-50">
        <h3 class="text-center text-primary">Đăng Ký Thành Viên</h3>
        <form @submit.prevent="register">
            <div class="mb-3">
                <label>Họ lót</label>
                <input type="text" class="form-control" v-model="user.hoLot">
            </div>
            <div class="mb-3">
                <label>Tên</label>
                <input type="text" class="form-control" v-model="user.ten" required>
            </div>
            <div class="mb-3">
                <label>Số điện thoại (Tên đăng nhập)</label>
                <input type="text" class="form-control" v-model="user.dienThoai" required>
            </div>
            <div class="mb-3">
                <label>Mật khẩu</label>
                <input type="password" class="form-control" v-model="user.password" required>
            </div>
            <div class="mb-3">
                <label>Địa chỉ</label>
                <input type="text" class="form-control" v-model="user.diaChi">
            </div>
            <button class="btn btn-success w-100">Đăng ký</button>
        </form>
        <p class="text-center mt-3">Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
    data() { return { user: {} }; },
    methods: {
        async register() {
            try {
                await AuthService.register(this.user);
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                this.$router.push("/login");
            } catch (e) { 
                alert(e.response?.data?.message || "Lỗi đăng ký"); 
            }
        }
    }
};
</script>