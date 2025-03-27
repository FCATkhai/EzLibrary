<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="p-6 max-w-md bg-white rounded-lg shadow-lg">
            <h2 class="text-2xl font-semibold text-center mb-4">Đăng Ký Độc Giả</h2>

            <div class="flex gap-3">

                <div class="mb-3">
                    <label class="block font-medium">Họ lót<span class="text-error">*</span></label>
                    <input v-model="hoLot" type="text" class="w-full p-2 border rounded" placeholder="Nhập họ lót" />
                </div>

                <div class="mb-3">
                    <label class="block font-medium">Tên<span class="text-error">*</span></label>
                    <input v-model="ten" type="text" class="w-full p-2 border rounded" placeholder="Nhập tên" />
                </div>
            </div>

            <div class="mb-3">
                <label class="block font-medium">Số điện thoại<span class="text-error">*</span></label>
                <input v-model="soDienThoai" type="tel" class="input validator tabular-nums w-full p-2 "
                    pattern="[0-9]*" minlength="10" maxlength="10" title="Số điện thoại phải là 10 con số"
                    placeholder="Nhập số điện thoại" />
                <p class="validator-hint">Số điện thoại phải là 10 con số</p>
            </div>

            <div class="mb-3">
                <label class="block font-medium">Mật khẩu<span class="text-error">*</span></label>
                <input v-model="password" type="password" class="input validator w-full p-2"
                    pattern="^[A-Za-z0-9]{5,}$" title="Mật khẩu phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt"
                    placeholder="Nhập mật khẩu" />
                <p class="validator-hint">Mật khẩu phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt</p>
            </div>

            <div class="mb-3">
                <label class="block font-medium">Ngày sinh</label>
                <input v-model="ngaySinh" type="date" class="w-full p-2 border rounded" />
            </div>

            <div class="mb-3">
                <label class="block font-medium">Giới tính</label>
                <select v-model="phai" class="w-full p-2 border rounded">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="block font-medium">Địa chỉ</label>
                <input v-model="diaChi" type="text" class="w-full p-2 border rounded" placeholder="Nhập địa chỉ" />
            </div>

            <p v-if="errorMsg" class="text-red-500 text-center">{{ errorMsg }}</p>
            <p v-if="successMsg" class="text-green-500 text-center">{{ successMsg }}</p>

            <button @click="handleRegister" class="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                :disabled="loading">
                {{ loading ? "Đang đăng ký..." : "Đăng Ký" }}
            </button>

            <p class="text-center mt-3">
                Đã có tài khoản?
                <router-link to="/login/doc-gia" class="text-blue-500 underline">Đăng nhập</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useDocGia } from "@/composables/useDocGia";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const { addDocGia } = useDocGia();
const toast = useToast();
const router = useRouter();

const hoLot = ref("");
const ten = ref("");
const soDienThoai = ref("");
const password = ref("");
const ngaySinh = ref("");
const phai = ref("Nam");
const diaChi = ref("");

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const handleRegister = async () => {
    if (!hoLot.value || !ten.value || !soDienThoai.value || !password.value) {
        errorMsg.value = "Vui lòng điền đầy đủ thông tin!";
        return;
    }

    loading.value = true;
    errorMsg.value = "";
    successMsg.value = "";

    try {
        await addDocGia({
            hoLot: hoLot.value,
            ten: ten.value,
            soDienThoai: soDienThoai.value,
            password: password.value,
            ngaySinh: ngaySinh.value || undefined,
            phai: phai.value,
            diaChi: diaChi.value || undefined,
        });

        successMsg.value = "🎉 Đăng ký thành công! Chuyển hướng...";
        toast.success("Đăng ký thành công!");

        setTimeout(() => {
            router.push("/login");
        }, 2000);
    } catch (error) {
        // console.error(error);
        errorMsg.value = error?.response?.data?.message || "Đăng ký thất bại!";
        toast.error("Đăng ký thất bại!");
    } finally {
        loading.value = false;
    }
};
</script>
