<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Danh sách sách</h1>

        <!-- Ô tìm kiếm -->
        <input v-model="searchTerm" type="text" placeholder="Tìm kiếm sách hoặc tác giả..."
            class="input input-bordered w-full mb-4" />
        <SachList :sach-list="books" />

        <div v-if="loading" class="text-center text-blue-500">Đang tải...</div>
        <div v-if="!hasMore && books.length > 0" class="text-center text-gray-500">Hết sách</div>
        <div v-if="!loading && books.length === 0" class="text-center text-red-500">Không tìm thấy sách</div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { useSach } from "@/composables/useSach";
import SachList from "@/components/SachList.vue";

const { books, fetchBooks, hasMore, loading, searchTerm } = useSach();

const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchBooks();
    }
};

onMounted(() => {
    fetchBooks();
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
