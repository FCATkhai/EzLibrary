import { getTotal} from "@/api/statistics.api";
import { ref } from "vue";

export const useStatistics = () => {
    const loading = ref(false);


    const fetchTotal = async () => {
        loading.value = true;
        try {
            const total = await getTotal();
            return total;
        } catch (error) {
            console.error("Lỗi tải tổng số lượng", error);
            throw error;
        } finally {
            loading.value = false;
        }

    }

    return { fetchTotal, loading };
}


