import { ref, watch, computed } from "vue";
import {
    getAllPhieuMuon,
    getPhieuMuonByMaDG,
    createPhieuMuon_DG,
    createPhieuMuon_NV,
    duyetPhieuMuon,
    traSach,
    deletePhieuMuon,
} from "@/api/phieuMuon.api";
import type { ITheoDoiMuonSach } from "~/shared/interface";

import { useAuthStore } from "@/stores/auth.store";
const authStore = useAuthStore();
const userId = computed(() => authStore.user?.maNguoiDung);

export function usePhieuMuon() {
    const phieuMuons = ref<ITheoDoiMuonSach[]>([]);
    const phieuMuon = ref<ITheoDoiMuonSach | null>(null);
    const page = ref(1);
    const limit = ref(10);
    const totalPages = ref(1);
    const hasMore = ref(true);
    const loading = ref(false);
    const searchTerm = ref("");
    const trangThai = ref<string | string[]>("");

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchPhieuMuons= async ( reset = false) => {
        if (loading.value || !userId.value) return;

        if (reset) {
            page.value = 1;
            hasMore.value = true;
        }

        loading.value = true;
        try {
            const response = await getPhieuMuonByMaDG(userId.value, {
                page: page.value,
                limit: limit.value,
                search: searchTerm.value,
                trangThai: trangThai.value,
            });
            phieuMuons.value = response.data;
            totalPages.value = response.totalPages;
            hasMore.value = page.value < totalPages.value;
        } catch (error) {
            console.error("Lỗi khi tải phiếu mượn theo mã độc giả:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const removePhieuMuon = async (id: string) => {
        loading.value = true;
        try {
            await deletePhieuMuon(id);
        } catch (error) {
            console.error("Lỗi khi xóa phiếu mượn:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchPhieuMuons();
        }
    };

    watch([searchTerm, trangThai], () => {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchPhieuMuons(true);
        }, 500);
    });

    return {
        phieuMuons,
        phieuMuon,
        page,
        limit,
        totalPages,
        hasMore,
        loading,
        searchTerm,
        trangThai,
        fetchPhieuMuons,
        removePhieuMuon,
    };
}
