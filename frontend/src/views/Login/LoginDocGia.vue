<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="p-6 max-w-sm bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold text-center mb-4">Đăng Nhập Độc Giả</h2>

        <div class="mb-4">
          <label class="block">Số điện thoại:</label>
          <input v-model="soDienThoai" type="text" class="w-full p-2 border rounded" minlength=10 maxlength=10 size=10/>
        </div>

        <div class="mb-4">
          <label class="block">Mật khẩu:</label>
          <input v-model="password" type="password" class="w-full p-2 border rounded" />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-center">{{ errorMsg }}</p>

        <button @click="handleLogin" class="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Đăng nhập
        </button>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from "vue";
  import { useAuthStore } from "@/stores/auth.store";
  import { useRouter } from "vue-router";
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
    //   errorMsg.value = (error as Error).message;
    }
  };
  </script>
