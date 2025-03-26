import axios from "@/utils/axios";

const API_URL = "/api/statistics";


type ITotalResponse = {
    totalDocGia: number;
    totalNhanVien: number;
    totalNhaXuatBan: number;
    totalSach: number;
    totalPhieuMuon: number;
};

/**
 * Lấy tổng hợp số lượng
 * @returns Thông tin thống kê về số lượng
 */
export const getTotal = async () => {
    const res = await axios.get<ITotalResponse>(`${API_URL}/total`);
    return res.data;
};

