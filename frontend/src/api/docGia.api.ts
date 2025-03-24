import axios from "@/utils/axios";
import type { IDocGia } from "~/shared/interface";

const API_URL = "/api/doc-gia";

/**
 * Thêm độc giả mới
 * @param data Dữ liệu của độc giả mới
 * @returns Độc giả vừa được tạo
 */
export const createDocGia = async (data: {
    hoLot: string;
    ten: string;
    soDienThoai: string;
    password: string;
    ngaySinh: string;
    phai: string;
    diaChi: string;
}) => {
    const response = await axios.post<{ message: string; docGia: IDocGia }>(
        `${API_URL}/register`,
        data
    );
    return response.data;
};

/**
 * Lấy danh sách tất cả độc giả (Chỉ Quản lý)
 * @returns Danh sách độc giả
 */
export const getAllDocGia = async () => {
    const response = await axios.get<IDocGia[]>(API_URL);
    return response.data;
};

/**
 * Lấy thông tin độc giả theo mã (Chỉ Quản lý hoặc chính độc giả)
 * @param maDG Mã độc giả
 * @returns Thông tin độc giả
 */
export const getDocGiaById = async (maDG: string) => {
    const response = await axios.get<IDocGia>(`${API_URL}/${maDG}`);
    return response.data;
};

/**
 * Cập nhật thông tin độc giả (Chỉ chính độc giả)
 * @param maDG Mã độc giả cần cập nhật
 * @param data Dữ liệu cập nhật
 * @returns Độc giả sau khi cập nhật
 */
export const updateDocGia = async (maDG: string, data: Partial<IDocGia>) => {
    const response = await axios.put<{ message: string; docGia: IDocGia }>(
        `${API_URL}/${maDG}`,
        data
    );
    return response.data;
};

/**
 * Xóa độc giả (Chỉ Quản lý)
 * @param maDG Mã độc giả cần xóa
 * @returns Thông báo xóa thành công
 */
export const deleteDocGia = async (maDG: string) => {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${maDG}`);
    return response.data;
};
