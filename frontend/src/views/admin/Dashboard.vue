<template>
    <div>
        <h1 class="text-2xl font-bold">📊 Dashboard</h1>
        <p>Chào mừng {{ authStore.user?.hoTen }} đến trang quản lý.</p>
    </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.store";
const authStore = useAuthStore();
</script>
