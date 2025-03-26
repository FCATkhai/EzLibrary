<template>
    <div class="container mx-auto p-4">
        <div v-if="sach" class="flex bg-white p-6 rounded-lg shadow-lg">
            <img :src="sach.coverUrl" alt="Bìa sách" class="w-3/10 mx-auto mb-4 rounded-md" />
            <div class="flex flex-col ml-20 gap-3">
                <h1 class="text-2xl font-bold">{{ sach.tenSach }}</h1>
                <p class="text-gray-600">Tác giả: {{ sach.tacGia }}</p>

                <p class="text-gray-600">Nhà xuất bản:
                    {{
                        // @ts-ignore
                        sach.maNXB?.tenNXB || "Không xác định"
                    }}
                </p>
                <p class="text-gray-600">Số trang: {{ sach.soTrang }}</p>
                <p class="text-gray-600">Năm xuất bản: {{ sach.namXuatBan }}</p>
                <p class="text-gray-600">Mô tả: {{ sach.moTa }}</p>
                <p class="text-gray-600">Kho: {{ sach.soQuyen }}</p>
                <button class="btn btn-primary mt-4 w-30" :disabled="loading || sach.soQuyen <= 0" @click="muonSach">
                    {{ loading ? "Đang xử lý..." : "Mượn sách" }}
                </button>
                <p v-if="sach.soQuyen <= 0">Sách đã hết, vui lòng quay lại sau</p>

                <p v-if="message" class="text-green-500 text-center mt-2">{{ message }}</p>
                <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
            </div>
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
        await createPhieuMuon_DG({ maSach: sach.value!.maSach });
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
