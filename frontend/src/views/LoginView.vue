<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import {USER_ROLES} from "~/shared/userRoles"

const authStore = useAuthStore();
const router = useRouter();

const soDienThoai = ref("");
const password = ref("");
const role = ref(USER_ROLES.DOCGIA);
const errorMsg = ref("");

const handleLogin = async () => {
    try {
        await authStore.login(soDienThoai.value, password.value, role.value);
        router.push("/"); // Chuyển hướng về trang chủ
    } catch (error) {
        errorMsg.value = (error as Error).message;
    }
};
</script>

<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="p-6 max-w-sm bg-white rounded-lg shadow">
            <h2 class="text-xl font-semibold text-center">Đăng Nhập</h2>
            <div class="mt-4">
                <label class="block">Số điện thoại:</label>
                <input v-model="soDienThoai" type="text" class="w-full p-2 border rounded" />
            </div>
            <div class="mt-4">
                <label class="block">Mật khẩu:</label>
                <input v-model="password" type="password" class="w-full p-2 border rounded" />
            </div>
            <div class="mt-4">
                <label class="block">Loại tài khoản:</label>
                <select v-model="role" class="w-full p-2 border rounded">
                    <option value="Độc giả">Độc Giả</option>
                    <option value="Nhân viên">Nhân Viên</option>
                </select>
            </div>
            <p v-if="errorMsg" class="text-red-500 mt-2 text-center">{{ errorMsg }}</p>
            <button @click="handleLogin" class="w-full mt-4 bg-blue-500 text-white p-2 rounded">Đăng nhập</button>
        </div>
    </div>
</template>
