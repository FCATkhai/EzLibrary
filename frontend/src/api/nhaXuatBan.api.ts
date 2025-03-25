import axios from "@/utils/axios";
import type { INhaXuatBan } from "~/shared/interface";

const API_URL = "/api/nxb";

/**
 * Lấy danh sách nhà xuất bản
 * @returns Danh sách nhà xuất bản
 */
export const getAllNhaXuatBan = async (params: {page: number, limit: number, search: string} | {}) => {
    const response = await axios.get(API_URL, {params});
    return response.data;
};

/**
 * Lấy thông tin nhà xuất bản theo ID
 * @param id Mã ID của nhà xuất bản
 * @returns Thông tin chi tiết của nhà xuất bản
 */
export const getNhaXuatBanById = async (id: string) => {
    const response = await axios.get<INhaXuatBan>(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Tạo nhà xuất bản mới
 * @param data Thông tin nhà xuất bản cần tạo
 * @returns Nhà xuất bản vừa được tạo
 */
export const createNhaXuatBan = async (data: { tenNXB: string; diaChi?: string }) => {
    const response = await axios.post<{message: string; nhaXuatBan: INhaXuatBan}>(API_URL, data);
    return response.data;
};

/**
 * Cập nhật thông tin nhà xuất bản
 * @param id ID của nhà xuất bản
 * @param data Dữ liệu cần cập nhật
 * @returns Nhà xuất bản sau khi cập nhật
 */
export const updateNhaXuatBan = async (id: string, data: Partial<INhaXuatBan>) => {
    const response = await axios.put<{message: string; nhaXuatBan: INhaXuatBan}>(`${API_URL}/${id}`, data);
    return response.data;
};

/**
 * Xóa nhà xuất bản
 * @param id ID của nhà xuất bản cần xóa
 * @returns Thông báo xóa thành công
 */
export const deleteNhaXuatBan = async (id: string) => {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${id}`);
    return response.data;
};
