import { ref, watch } from "vue";
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

    const fetchPhieuMuons = async (reset = false) => {
        if (loading.value) return;

        if (reset) {
            page.value = 1;
            hasMore.value = true;
        }

        loading.value = true;
        try {
            const response = await getAllPhieuMuon({
                page: page.value,
                limit: limit.value,
                search: searchTerm.value,
                trangThai: trangThai.value,
            });
            // console.log(response);
            phieuMuons.value = response.data;
            totalPages.value = response.totalPages;
            hasMore.value = page.value < totalPages.value;

            if (phieuMuons.value.length === 0 && page.value > 1) {
                page.value--;
                await fetchPhieuMuons();
            }
        } catch (error) {
            console.error("Lỗi tải danh sách phiếu mượn:", error);
        } finally {
            loading.value = false;
        }
    };

    const addPhieuMuonDG = async (maSach: string) => {
        loading.value = true;
        try {
            const result = await createPhieuMuon_DG({ maSach });
            phieuMuon.value = result.phieuMuon;
            return result.phieuMuon;
        } catch (error) {
            console.error("Lỗi khi độc giả tạo phiếu mượn:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchPhieuMuons(true);
        }
    };

    const addPhieuMuonNV = async (maSach: string, soDienThoai_DG: string) => {
        loading.value = true;
        try {
            const result = await createPhieuMuon_NV({ maSach, soDienThoai_DG });
            phieuMuon.value = result.phieuMuon;
            return result.phieuMuon;
        } catch (error) {
            console.error("Lỗi khi nhân viên tạo phiếu mượn:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchPhieuMuons(true);
        }
    };

    const approvePhieuMuon = async (id: string, status: "borrowing" | "rejected") => {
        loading.value = true;
        try {
            const result = await duyetPhieuMuon(id, { status });
            phieuMuon.value = result.phieuMuon;
            return result.phieuMuon;
        } catch (error) {
            console.error("Lỗi khi duyệt phiếu mượn:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchPhieuMuons();
        }
    };

    const returnSach = async (id: string) => {
        loading.value = true;
        try {
            const result = await traSach(id);
            phieuMuon.value = result.phieuMuon;
            return result.phieuMuon;
        } catch (error) {
            console.error("Lỗi khi cập nhật trả sách:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchPhieuMuons();
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
        addPhieuMuonDG,
        addPhieuMuonNV,
        approvePhieuMuon,
        returnSach,
        removePhieuMuon,
    };
}
