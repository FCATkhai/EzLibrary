<template>
    <!-- Navbar -->
    <nav class="navbar justify-between bg-base-300">
        <!-- Logo -->
        <a class="link w-40">
            <RouterLink :to="{name: 'home'}"><img alt="Logo" src="@/assets/Logo-Extend.svg" /></RouterLink>
        </a>

        <!-- Menu for mobile -->
        <div class="dropdown dropdown-end sm:hidden">
            <button class="btn btn-soft">
                <i class="fa-solid fa-bars text-lg"></i>
            </button>

            <ul tabindex="0" class="dropdown-content menu z-[1] bg-base-200 p-6 rounded-box shadow w-56 gap-2">
                <li><a>About</a></li>
                <li><a>Pricing</a></li>
                <li><a>Blog</a></li>
                <li><a>Contact</a></li>
                <button v-if="authStore.isAuthenticated" @click="authStore.logout()" class="bg-red-500 p-2 rounded">Đăng
                    xuất</button>
                <RouterLink v-else to="login" class="btn btn-sm btn-primary">Login</RouterLink>
            </ul>
        </div>

        <!-- Menu for desktop -->
        <ul class="hidden menu sm:menu-horizontal gap-2">
            <li><a>About</a></li>
            <li><a>Pricing</a></li>
            <li><a>Blog</a></li>
            <li><a>Contact</a></li>
            <div v-if="authStore.isAuthenticated" class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full align-middle">
                        <i class="fa-solid fa-user text-2xl pt-2"></i>
                    </div>
                </div>
                <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <a class="justify-between">
                            Hồ sơ
                        </a>
                    </li>
                    <li><a @click="authStore.logout()" class="bg-red-500">Logout</a></li>
                </ul>
            </div>
            <RouterLink v-else :to="{name: 'login'}" class="btn btn-sm btn-primary">Login</RouterLink>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();
</script>

<style scoped></style>
