<template>
    <div class="container mt-4" style="max-width: 600px;">
        <h4 class="text-center mb-4 text-primary fw-bold">Thêm Nhà Xuất Bản</h4>
        
        <div class="card shadow-sm border-0 p-4">
            <Form @submit="addPublisher" :validation-schema="nxbFormSchema">
                <div class="mb-3">
                    <label for="maNXB" class="form-label fw-bold">Mã NXB (ID)</label>
                    <Field 
                        name="maNXB" 
                        type="text" 
                        class="form-control" 
                        v-model="nxb.maNXB" 
                        placeholder="Ví dụ: NXB_0001" 
                    />
                    <ErrorMessage name="maNXB" class="text-danger small" />
                </div>

                <div class="mb-3">
                    <label for="tenNXB" class="form-label fw-bold">Tên Nhà Xuất Bản</label>
                    <Field 
                        name="tenNXB" 
                        type="text" 
                        class="form-control" 
                        v-model="nxb.tenNXB" 
                        placeholder="Ví dụ: NXB Kim Đồng" 
                    />
                    <ErrorMessage name="tenNXB" class="text-danger small" />
                </div>

                <div class="mb-3">
                    <label for="diaChi" class="form-label fw-bold">Địa chỉ</label>
                    <Field 
                        name="diaChi" 
                        type="text" 
                        class="form-control" 
                        v-model="nxb.diaChi" 
                        placeholder="Ví dụ: Hà Nội" 
                    />
                    <ErrorMessage name="diaChi" class="text-danger small" />
                </div>

                <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-secondary" @click="$router.push('/admin')">Hủy</button>
                    <button class="btn btn-primary">Lưu lại</button>
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import NXBService from "@/services/nxb.service";

export default {
    components: { Form, Field, ErrorMessage },
    data() {
        const nxbFormSchema = yup.object().shape({
            maNXB: yup.string().required("Mã NXB không được để trống."),
            tenNXB: yup.string().required("Tên NXB không được để trống."),
            diaChi: yup.string().required("Địa chỉ không được để trống."),
        });
        return {
            nxb: { maNXB: "", tenNXB: "", diaChi: "" },
            nxbFormSchema,
        };
    },
    methods: {
        async addPublisher(data) {
            try {
                await NXBService.create(data);
                alert("Thêm Nhà xuất bản thành công!");
                this.$router.push("/admin");
            } catch (error) {
                console.log(error);
                alert(error.response?.data?.message || "Lỗi khi thêm NXB (Có thể trùng Mã)");
            }
        },
    },
};
</script>