import { ref, watch } from "vue";
import {
    getAllNhanVien,
    getNhanVienById,
    createNhanVien,
    updateNhanVien,
    deleteNhanVien,
    changePasswordNhanVien,
    resetPasswordNhanVien,
} from "@/api/nhanVien.api";
import type { INhanVien } from "~/shared/interface";



export function useNhanVienAdmin() {
    const nhanViens = ref<INhanVien[]>([]);
    const nhanVien = ref<INhanVien | null>(null);
    const page = ref(1);
    const limit = ref(10);
    const totalPages = ref(1);
    const hasMore = ref(true);
    const loading = ref(false);
    const searchTerm = ref("");

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchNhanViens = async (reset = false) => {
        if (loading.value) return;

        if (reset) {
            page.value = 1;
            hasMore.value = true;
        }

        loading.value = true;
        try {
            const response = await getAllNhanVien({
                page: page.value,
                limit: limit.value,
                search: searchTerm.value,
            });
            nhanViens.value = response.data;
            totalPages.value = response.totalPages;
            hasMore.value = response.hasMore;

            if (nhanViens.value.length === 0 && page.value > 1) {
                page.value--;
                await fetchNhanViens();
            }
        } catch (error) {
            console.error("Lỗi tải danh sách nhân viên:", error);
        } finally {
            loading.value = false;
        }
    };

    const fetchNhanVienById = async (maNV: string) => {
        loading.value = true;
        try {
            const res = await getNhanVienById(maNV);
            nhanVien.value = res;
            return res;
        } catch (error) {
            console.error("Lỗi khi tải nhân viên:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const addNhanVien = async (data: {
        hoTenNV: string;
        password: string;
        chucVu: string;
        diaChi: string;
        soDienThoai: string;
    }) => {
        loading.value = true;
        try {
            const result = await createNhanVien(data);
            return result.NhanVien; // API returns { message, NhanVien }
        } catch (error) {
            console.error("Lỗi khi tạo nhân viên:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchNhanViens(true);
        }
    };

    const editNhanVien = async (maNV: string, data: Partial<INhanVien>) => {
        loading.value = true;
        try {
            const result = await updateNhanVien(maNV, data);
            return result.nhanVien; // API returns { message, nhanVien }
        } catch (error) {
            console.error("Lỗi khi cập nhật nhân viên:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchNhanViens(); // Refresh current page
        }
    };

    const removeNhanVien = async (maNV: string) => {
        loading.value = true;
        try {
            await deleteNhanVien(maNV);
        } catch (error) {
            console.error("Lỗi khi xóa nhân viên:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchNhanViens(); // Refresh current page
        }
    };

    const changePassword = async (maNV: string, oldPassword: string, newPassword: string) => {
        loading.value = true;
        try {
            const result = await changePasswordNhanVien(maNV, {
                oldPassword,
                newPassword,
            });
            return result.message;
        } catch (error) {
            console.error("Lỗi khi thay đổi mật khẩu:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const resetPassword = async (maNV: string, newPassword: string) => {
        loading.value = true;
        try {
            const result = await resetPasswordNhanVien(maNV, {
                newPassword,
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
            fetchNhanViens(true);
        }, 500);
    });

    return {
        nhanViens,
        nhanVien,
        page,
        limit,
        totalPages,
        hasMore,
        loading,
        searchTerm,
        fetchNhanViens,
        fetchNhanVienById,
        addNhanVien,
        editNhanVien,
        removeNhanVien,
        changePassword,
        resetPassword,
    };
}
