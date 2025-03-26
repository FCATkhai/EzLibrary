<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="p-6 max-w-md bg-white rounded-lg shadow-lg text-center">
        <h2 class="text-xl font-semibold mb-4">Bạn là ai?</h2>
        <button
          @click="goToLogin('doc-gia')"
          class="w-full mb-4 bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          📖 Bạn là Độc Giả?
        </button>
        <button
          @click="goToLogin('nhan-vien')"
          class="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
        >
          🏢 Bạn là Nhân Viên?
        </button>
      </div>
    </div>
  </template>

  <script setup>
  import { useRouter } from "vue-router";

  const router = useRouter();

  const goToLogin = (role) => {
    router.push(`/login/${role}`);
  };
  </script>
