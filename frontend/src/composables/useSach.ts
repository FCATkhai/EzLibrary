import { ref, watch } from "vue";
import { getAllSach } from "@/api/sach.api";
import type { ISach } from "~/shared/interface"

export function useSach() {
    const books = ref<ISach[]>([]);
    const page = ref(1);
    const limit = 10;
    const hasMore = ref(true);
    const loading = ref(false);
    const searchTerm = ref("");

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchBooks = async (reset = false) => {
        if (!reset && (!hasMore.value || loading.value)) return;
        if (reset) {
            books.value = [];
            page.value = 1;
            hasMore.value = true;
        }

        loading.value = true;
        try {
            const data = await getAllSach({ page: page.value, limit: limit, search: searchTerm.value });
            if (reset) {
                books.value = data.data;
            } else {
                books.value.push(...data.data);
            }
            hasMore.value = data.hasMore;
            page.value++;
        } catch (error) {
            console.error("Lỗi tải sách", error);
        }
        loading.value = false;
    };

    // Theo dõi searchTerm, nếu thay đổi thì reset dữ liệu và tìm kiếm lại
    watch(searchTerm, () => {
        if (searchTimeout) clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            fetchBooks(true);
        }, 500); // Đợi 500ms sau khi người dùng ngừng nhập
    });

    return { books, fetchBooks, hasMore, loading, searchTerm };
}
