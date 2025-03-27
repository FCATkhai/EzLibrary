<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="p-6 w-md bg-white rounded-lg shadow">
            <h2 class="text-xl font-semibold text-center mb-4">Đăng Nhập Độc Giả</h2>

            <div class="mb-4">
                <label class="block">Số điện thoại:</label>
                <input v-model="soDienThoai" type="tel" class="input validator tabular-nums w-full p-2 "
                    pattern="[0-9]*" minlength="10" maxlength="10" title="Số điện thoại phải là 10 con số"
                    placeholder="Nhập số điện thoại" />
                    <p class="validator-hint">Số điện thoại phải là 10 con số</p>
            </div>

            <div class="mb-4">
                <label class="block">Mật khẩu:</label>
                <input v-model="password" type="password" class="input validator w-full p-2"
                    pattern="^[A-Za-z0-9]{5,}$" title="Mật khẩu phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt"
                    placeholder="Nhập mật khẩu" />
                <p class="validator-hint">Mật khẩu phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt</p>
            </div>

            <p v-if="errorMsg" class="text-red-500 text-center">{{ errorMsg }}</p>

            <button @click="handleLogin" class="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Đăng nhập
            </button>

            <p class="text-center mt-3">
                Chưa có tài khoản?
                <RouterLink to="/register" class="text-blue-500 underline">Đăng ký</RouterLink>
            </p>
            <p class="text-center mt-3">
                Quay về trang chủ
                <RouterLink to="/" class="text-blue-500 underline">Trang chủ</RouterLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { RouterLink, useRouter } from "vue-router";
import { USER_ROLES } from "~/shared/userRoles";

const authStore = useAuthStore();
const router = useRouter();

const soDienThoai = ref("");
const password = ref("");
const errorMsg = ref("");

const handleLogin = async () => {
    try {
        await authStore.login(soDienThoai.value, password.value, USER_ROLES.DOCGIA);
        router.push("/");
    } catch (error) {
          errorMsg.value = error.message;
    }
};
</script>
