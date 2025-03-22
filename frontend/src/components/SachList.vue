<template>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="sach in sachList" :key="sach.maSach"
            class="card cursor-pointer p-2 rounded-lg shadow-lg hover:shadow-xl transition"
            @click="goToDetail(sach.maSach)">
            <img :src="sach.coverUrl" alt="Bìa sách" class="w-full object-cover rounded-md" />
            <h3 class="mt-2 font-semibold text-center">{{ sach.tenSach }}</h3>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { ISach } from "~/shared/interface";
defineProps({
    sachList: Array<ISach>, // Nhận danh sách sách từ component cha
});

const router = useRouter();

const goToDetail = (maSach: string) => {
    router.push(`/sach/${maSach}`);
};
</script>

<style scoped>
.card {
    background: white;
    border: 1px solid #e0e0e0;
}
</style>
