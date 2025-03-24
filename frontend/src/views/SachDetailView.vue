<template>
    <div class="container mx-auto p-4">
        <div v-if="sach" class="bg-white p-6 rounded-lg shadow-lg">
            <img :src="sach.coverUrl" alt="Bìa sách" class="w-48 h-64 mx-auto mb-4 rounded-md" />
            <h1 class="text-2xl font-bold text-center">{{ sach.tenSach }}</h1>
            <p class="text-gray-600 text-center">Tác giả: {{ sach.tacGia }}</p>
            <p class="text-gray-600 text-center">Năm xuất bản: {{ sach.namXuatBan }}</p>
            <p class="text-gray-600 text-center">Nhà xuất bản:
                {{
                    // @ts-ignore
                    sach.maNXB?.tenNXB || "Không xác định"
                }}</p>
            <p class="text-gray-600 text-center">Mô tả: {{ sach.moTa }}</p>
            <button class="btn btn-primary w-full mt-4" :disabled="loading" @click="muonSach">
                {{ loading ? "Đang xử lý..." : "Mượn sách" }}
            </button>

            <p v-if="message" class="text-green-500 text-center mt-2">{{ message }}</p>
            <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
        </div>

        <div v-else class="text-center">
            <p>Đang tải chi tiết sách...</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getSachById } from "@/api/sach.api";
import { createPhieuMuon_DG } from "@/api/phieuMuon.api";
import type { ISach } from "~/shared/interface";

const sach = ref<ISach | null>(null);
const route = useRoute();
const loading = ref(false);
const message = ref("");
const error = ref("");

onMounted(async () => {
    try {
        sach.value = await getSachById(String(route.params.maSach));
    } catch (err) {
        error.value = "Không thể tải chi tiết sách.";
    }
});

const muonSach = async () => {
    loading.value = true;
    error.value = "";
    message.value = "";

    try {
        await createPhieuMuon_DG(sach.value!.maSach);
        message.value = "Mượn sách thành công! Vui lòng chờ xác nhận.";
    } catch (err) {
        error.value = "Không thể mượn sách. Vui lòng thử lại.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.btn-primary {
    background-color: #3b82f6;
    color: white;
    padding: 10px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
}

.btn-primary:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
}
</style>
