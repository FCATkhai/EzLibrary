import { ref, watch } from "vue";
import {
    getAllNhaXuatBan,
    getNhaXuatBanById,
    deleteNhaXuatBan,
    createNhaXuatBan,
    updateNhaXuatBan
} from "@/api/nhaXuatBan.api";
import type { INhaXuatBan } from "~/shared/interface";

export function useNXBAdmin() {
    const nhaXuatBan = ref<INhaXuatBan | null>(null);
    const nhaXuatBans = ref<INhaXuatBan[]>([]);
    const page = ref(1);
    const limit = ref(10);
    const hasMore = ref(true);
    const loading = ref(false);
    const searchTerm = ref("");
    const totalPages = ref(1);

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchNXBs = async (reset = false) => {

        if (loading.value) return;
        if (reset) {
            nhaXuatBans.value = [];
            page.value = 1;
            hasMore.value = true;
        }

        loading.value = true;
        try {
            const res = await getAllNhaXuatBan({
                page: page.value,
                limit: limit.value,
                search: searchTerm.value
            });
            // console.log("response: ", res);
            nhaXuatBans.value = res.data;
            totalPages.value = res.totalPages;
            hasMore.value = res.hasMore;

            // Adjust page if current page is empty or exceeds totalPages
            if (nhaXuatBans.value.length === 0 && page.value > 1) {
                page.value--;
                await fetchNXBs(); // Recursively fetch the previous page
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách nhà xuất bản", error);
        } finally {
            loading.value = false;
        }
    };

    const fetchNXBbyId = async (id: string) => {
        loading.value = true;
        try {
            const res = await getNhaXuatBanById(id);
            nhaXuatBan.value = res;
        } catch (error) {
            console.error("Lỗi khi tải nhà xuất bản", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    // Tạo NXB
    const addNXB = async (data: { tenNXB: string; diaChi?: string }) => {
        loading.value = true;
        try {
            const result = await createNhaXuatBan(data);
            return result.nhaXuatBan;
        } catch (error) {
            console.error('Lỗi khi tạo nhà xuất bản:', error);
            throw error;
        } finally {
            loading.value = false;
            await fetchNXBs(true);
        }
    };


    const editNXB = async (maNXB: string, data: Partial<INhaXuatBan>) => {
        loading.value = true;
        try {
            const result = await updateNhaXuatBan(maNXB, data);
            return result.nhaXuatBan;
        } catch (error) {
            console.error('Lỗi khi cập nhật nhà xuất bản:', error);
            throw error;
        } finally {
            loading.value = false;
            await fetchNXBs();
        }
    };

    const removeNXB = async (maNXB: string) => {
        loading.value = true;
        try {
            await deleteNhaXuatBan(maNXB);
        } catch (error) {
            console.error('Lỗi khi xóa nhà xuất bản:', error);
            throw error;
        } finally {
            loading.value = false;
            await fetchNXBs();
        }
    };



    // Theo dõi searchTerm, nếu thay đổi thì reset dữ liệu và tìm kiếm lại
    watch(searchTerm, () => {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchNXBs(true);
        }, 500);
    });

    return {
        nhaXuatBan,
        nhaXuatBans,
        totalPages,
        page,
        hasMore,
        loading,
        searchTerm,
        fetchNXBs,
        fetchNXBbyId,
        addNXB,
        editNXB,
        removeNXB
    };
};
