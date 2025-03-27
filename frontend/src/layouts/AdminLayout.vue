<template>
    <Navbar />
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <div class="drawer lg:drawer-open">
            <input id="my-drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content">
                <!-- Page content here -->
                <label for="my-drawer" class="btn btn--soft drawer-button lg:hidden">
                    <i class="fa-solid fa-bars text-lg"></i>
                </label>
                <div class="flex flex-col items-center">
                    <RouterView />
                </div>
            </div>
            <div class="drawer-side">
                <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                <ul class="menu bg-base-200 text-base-content min-h-full w-60 p-4">
                    <!-- Sidebar content here -->
                    <h2 class="text-xl font-bold mb-2">Quản lý</h2>

                    <li><RouterLink to="/admin" class="block py-2"><i class="fa-solid fa-chart-simple"></i> Dashboard</RouterLink></li>
                    <li><RouterLink to="/admin/nxb" class="block py-2"><i class="fa-solid fa-building-user"></i> Quản lý NXB</RouterLink></li>
                    <li><RouterLink to="/admin/sach" class="block py-2"><i class="fa-solid fa-book"></i> Quản lý Sách</RouterLink></li>
                    <li><RouterLink to="/admin/phieu-muon" class="block py-2"><i class="fa-solid fa-receipt"></i> Quản lý Phiếu Mượn</RouterLink></li>
                    <li><RouterLink to="/admin/doc-gia" class="block py-2"><i class="fa-solid fa-users"></i> Quản lý Độc Giả</RouterLink></li>
                    <li>
                        <RouterLink v-if="isManager" to="/admin/nhan-vien" class="block py-2"><i class="fa-solid fa-user-tie"></i> Quản lý Nhân Viên
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
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
