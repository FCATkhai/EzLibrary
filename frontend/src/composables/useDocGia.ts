import { ref, watch } from "vue";
import {
    getAllDocGia,
    getDocGiaById,
    createDocGia,
    updateDocGia,
    deleteDocGia,
    changePasswordDocGia,
    resetPasswordDocGia,
} from "@/api/docGia.api";
import type { IDocGia } from "~/shared/interface";

export function useDocGia() {
    const docGias = ref<IDocGia[]>([]);
    const docGia = ref<IDocGia | null>(null);
    const page = ref(1);
    const limit = ref(10);
    const totalPages = ref(1);
    const hasMore = ref(true);
    const loading = ref(false);
    const searchTerm = ref("");

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchDocGias = async (reset = false) => {
        if (loading.value) return;

        if (reset) {
            page.value = 1;
            hasMore.value = true;
        }

        loading.value = true;
        try {
            const response = await getAllDocGia({
                page: page.value,
                limit: limit.value,
                search: searchTerm.value,
            });
            docGias.value = response.data;
            totalPages.value = response.totalPages;
            hasMore.value = page.value < totalPages.value;

            if (docGias.value.length === 0 && page.value > 1) {
                page.value--;
                await fetchDocGias();
            }
        } catch (error) {
            console.error("Lỗi tải danh sách độc giả:", error);
        } finally {
            loading.value = false;
        }
    };

    const fetchDocGiaById = async (maDG: string) => {
        loading.value = true;
        try {
            const res = await getDocGiaById(maDG);
            docGia.value = res;
            return res;
        } catch (error) {
            console.error("Lỗi khi tải độc giả:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const addDocGia = async (data: {
        hoLot: string;
        ten: string;
        soDienThoai: string;
        password?: string;
        ngaySinh?: string;
        phai?: string;
        diaChi?: string;
    }) => {
        loading.value = true;
        try {
            const result = await createDocGia(data);
            return result.docGia;
        } catch (error) {
            console.error("Lỗi khi tạo độc giả:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchDocGias(true);
        }
    };

    const editDocGia = async (maDG: string, data: Partial<IDocGia>) => {
        loading.value = true;
        try {
            const result = await updateDocGia(maDG, data);
            return result.docGia;
        } catch (error) {
            console.error("Lỗi khi cập nhật độc giả:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchDocGias();
        }
    };

    const removeDocGia = async (maDG: string) => {
        loading.value = true;
        try {
            await deleteDocGia(maDG);
        } catch (error) {
            console.error("Lỗi khi xóa độc giả:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchDocGias();
        }
    };

    const changePassword = async (maDG: string, oldPassword: string, newPassword: string) => {
        loading.value = true;
        try {
            const result = await changePasswordDocGia(maDG, {
                oldPassword,
                newPassword
            });
            return result.message;
        } catch (error) {
            console.error("Lỗi khi thay đổi mật khẩu:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const resetPassword = async (maDG: string, newPassword: string) => {
        loading.value = true;
        try {
            const result = await resetPasswordDocGia(maDG, {
                newPassword
            });
            return result.message;
        } catch (error) {
            console.error("Lỗi khi reset mật khẩu:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    watch(searchTerm, () => {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchDocGias(true);
        }, 500);
    });

    return {
        docGias,
        docGia,
        page,
        limit,
        totalPages,
        hasMore,
        loading,
        searchTerm,
        fetchDocGias,
        fetchDocGiaById,
        addDocGia,
        editDocGia,
        removeDocGia,
        changePassword,
        resetPassword,
    };
}
