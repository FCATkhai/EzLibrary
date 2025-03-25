// root/frontend/src/composables/useSachAdmin.ts
import { ref, watch } from "vue";
import {
    getAllSach,
    getSachById,
    createSach,
    updateSach,
    deleteSach
} from "@/api/sach.api";
import type { ISach } from "~/shared/interface";

export function useSachAdmin() {
    const books = ref<ISach[]>([]);
    const book = ref<ISach | null>(null);
    const page = ref(1);
    const limit = ref(10);
    const totalPages = ref(1);
    const hasMore = ref(true);
    const loading = ref(false);
    const searchTerm = ref("");

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchBooks = async (reset = false) => {
        if (loading.value) return;

        if (reset) {
            page.value = 1;
            hasMore.value = true;
        }

        loading.value = true;
        try {
            const response = await getAllSach({
                page: page.value,
                limit: limit.value,
                search: searchTerm.value,
            });
            // console.log("response: ", response);
            books.value = response.data; // Replace for pagination
            totalPages.value = response.totalPages;
            hasMore.value = page.value < totalPages.value;

            if (books.value.length === 0 && page.value > 1) {
                page.value--;
                await fetchBooks();
            }
        } catch (error) {
            console.error("Lỗi tải sách (admin):", error);
        } finally {
            loading.value = false;
        }
    };

    const fetchBookById = async (id: string) => {
        loading.value = true;
        try {
            const res = await getSachById(id);
            book.value = res.data;
        } catch (error) {
            console.error("Lỗi khi tải sách", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    const addSach = async (formData: FormData) => {
        loading.value = true;
        try {
            const newSach = await createSach(formData);
            return newSach;
        } catch (error) {
            console.error("Lỗi khi tạo sách:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchBooks(true);
        }
    };

    const editSach = async (maSach: string, formData: FormData) => {
        loading.value = true;
        try {
            const updatedSach = await updateSach(maSach, formData);
            return updatedSach;
        } catch (error) {
            console.error("Lỗi khi cập nhật sách:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchBooks();
        }
    };

    const removeSach = async (maSach: string) => {
        loading.value = true;
        try {
            await deleteSach(maSach);
        } catch (error) {
            console.error("Lỗi khi xóa sách:", error);
            throw error;
        } finally {
            loading.value = false;
            await fetchBooks();
        }
    };

    watch(searchTerm, () => {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchBooks(true);
        }, 500);
    });

    // watch(page, () => {
    //     console.log(page.value)
    // })

    return {
        books,
        page,
        limit,
        totalPages,
        hasMore,
        loading,
        searchTerm,
        fetchBooks,
        fetchBookById,
        addSach,
        editSach,
        removeSach,
    };
}
