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
    password?: string;
    ngaySinh?: string;
    phai?: string;
    diaChi?: string;
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
export const getAllDocGia = async (params: { page?: number; limit?: number; search?: string }) => {
    const response = await axios.get(API_URL, { params });
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
 * Cập nhật thông tin độc giả (Chỉ chính độc giả) hoặc quản lý
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
 * Thay đổi mật khẩu
 * @param maDG Mã độc giả cần cập nhật
 * @param data password cũ và password mới
 * @returns message thông báo
 */
export const changePasswordDocGia = async (maDG: string, data: { oldPassword: string, newPassword: string }) => {
    const response = await axios.patch<{ message: string }>(`${API_URL}/${maDG}/change-password`, data);
    return response.data;
};

/**
 * Reset mật khẩu
 * @param maDG Mã độc giả cần cập nhật
 * @param data password mới
 * @returns message thông báo
 */
export const resetPasswordDocGia = async (maDG: string, data: { newPassword: string }) => {
    const response = await axios.patch<{ message: string }>(`${API_URL}/${maDG}/reset-password`, data);
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
