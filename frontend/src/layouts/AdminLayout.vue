<template>
    <Navbar />
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 text-white p-4">
            <h2 class="text-xl font-bold">Quản lý</h2>
            <p>todo: Thêm yup với vee-validate</p>
            <nav>
                <RouterLink to="/admin" class="block py-2">📊 Dashboard</RouterLink>
                <RouterLink to="/admin/nxb" class="block py-2">📚 Quản lý NXB</RouterLink>
                <RouterLink to="/admin/sach" class="block py-2">📚 Quản lý Sách</RouterLink>
                <RouterLink to="/admin/phieu-muon" class="block py-2">📄 Quản lý Phiếu Mượn</RouterLink>
                <RouterLink to="/admin/doc-gia" class="block py-2">👤 Quản lý Độc Giả</RouterLink>
                <RouterLink v-if="isManager" to="/admin/nhan-vien" class="block py-2">👔 Quản lý Nhân Viên</RouterLink>
            </nav>
        </aside>

        <!-- Nội dung chính -->
        <main class="flex-1 p-4">
            <RouterView />
        </main>
    </div>
</template>


<script lang="ts" setup>
import Navbar from "@/components/Navbar.vue";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { USER_ROLES } from "~/shared/userRoles";

const authStore = useAuthStore();
const isManager = computed(() => authStore.user?.role === USER_ROLES.QUANLY);
</script>
