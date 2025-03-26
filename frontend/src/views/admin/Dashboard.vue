<template>
    <div>
        <h1 class="text-2xl font-bold">📊 Dashboard</h1>
        <p>Chào mừng {{ authStore.user?.hoTen }} đến trang quản lý.</p>

        <template v-if="loading">
            <p>Đang tải</p>
        </template>
        <div v-else class="mt-5">
            <h2 class="text-xl font-bold">Thống kê số lượng</h2>
            <div v-if="total" class="stats shadow">
                <div class="stat">
                    <div class="stat-figure text-secondary ">
                        <div class="text-2xl mt-3"><i class="fa-solid fa-users "></i></div>
                    </div>
                    <div class="stat-title">Độc giả</div>
                    <div class="stat-value">{{ total.totalDocGia }}</div>
                </div>

                <div class="stat">
                    <div class="stat-figure text-secondary">
                        <div class="text-2xl mt-3"><i class="fa-solid fa-users-gear "></i></div>
                    </div>
                    <div class="stat-title">Nhân viên</div>
                    <div class="stat-value">{{ total.totalNhanVien }}</div>
                </div>
                <div class="stat">
                    <div class="stat-figure text-secondary">
                        <div class="text-2xl mt-3"><i class="fa-solid fa-building-user"></i></div>
                    </div>
                    <div class="stat-title">NXB</div>
                    <div class="stat-value">{{ total.totalNhaXuatBan }}</div>
                </div>
                <div class="stat">
                    <div class="stat-figure text-secondary">
                        <div class="text-2xl mt-3"><i class="fa-solid fa-book"></i></div>
                    </div>
                    <div class="stat-title">Sách</div>
                    <div class="stat-value">{{ total.totalSach }}</div>
                </div>
                <div class="stat">
                    <div class="stat-figure text-secondary">
                        <div class="text-2xl mt-3"><i class="fa-solid fa-receipt"></i></div>
                    </div>
                    <div class="stat-title">Phiếu mượn</div>
                    <div class="stat-value">{{ total.totalPhieuMuon }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.store";
import { onMounted, ref } from "vue";
import {
    useStatistics
} from "@/composables/useStatistics"

const authStore = useAuthStore();

const total = ref(null);

const {
    loading,
    fetchTotal
} = useStatistics();

const loadData = async () => {

    total.value = await fetchTotal();
}

onMounted(async() => {
    await loadData();
});

</script>
