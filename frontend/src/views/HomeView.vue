<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Danh sách sách</h1>

        <!-- Ô tìm kiếm -->
        <input v-model="searchTerm" type="text" placeholder="Tìm kiếm sách hoặc tác giả..."
            class="input input-bordered w-full mb-4" />

        <!-- <div v-for="sach in books" :key="sach.maSach" class="card bg-base-100 shadow-lg p-4 mb-4">
            <h2 class="text-lg font-semibold">{{ sach.tenSach }}</h2>
            <p class="text-gray-600">Tác giả: {{ sach.tacGia }}</p>
            <p class="text-gray-600">NXB: {{
            // @ts-ignore
            sach.maNXB?.tenNXB || "Không xác định" }}</p>
        </div> -->
        <SachList :sach-list="books" />

        <div v-if="loading" class="text-center text-blue-500">Đang tải...</div>
        <div v-if="!hasMore && books.length > 0" class="text-center text-gray-500">Hết sách</div>
        <div v-if="!loading && books.length === 0" class="text-center text-red-500">Không tìm thấy sách</div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
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
    console.log(books.value)
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
