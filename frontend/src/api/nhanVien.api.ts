import axios from "@/utils/axios";
import type { INhanVien } from "~/shared/interface";

const API_URL = "/api/nhan-vien";

/**
 * Thêm nhân viên mới
 * @param data Dữ liệu của nhân viên mới
 * @returns Nhân viên vừa được tạo
 */
export const createNhanVien = async (data: {
    hoTenNV: string;
    password: string;
    chucVu: string;
    diaChi: string;
    soDienThoai: string;
}) => {
    const response = await axios.post<{ message: string; NhanVien: INhanVien }>(
        `${API_URL}/register`,
        data
    );
    return response.data;
};

/**
 * Lấy danh sách tất cả nhân viên (Chỉ Quản lý)
 * @returns Danh sách nhân viên
 */
export const getAllNhanVien = async () => {
    const response = await axios.get<INhanVien[]>(API_URL);
    return response.data;
};

/**
 * Lấy thông tin nhân viên theo mã (Chỉ Quản lý)
 * @param maNV Mã nhân viên
 * @returns Thông tin nhân viên
 */
export const getNhanVienById = async (maNV: string) => {
    const response = await axios.get<INhanVien>(`${API_URL}/${maNV}`);
    return response.data;
};

/**
 * Cập nhật thông tin nhân viên (Chỉ Quản lý)
 * @param maNV Mã nhân viên cần cập nhật
 * @param data Dữ liệu cập nhật
 * @returns Nhân viên sau khi cập nhật
 */
export const updateNhanVien = async (maNV: string, data: Partial<INhanVien>) => {
    const response = await axios.put<INhanVien>(`${API_URL}/${maNV}`, data);
    return response.data;
};

/**
 * Xóa nhân viên (Chỉ Quản lý)
 * @param maNV Mã nhân viên cần xóa
 * @returns Thông báo xóa thành công
 */
export const deleteNhanVien = async (maNV: string) => {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${maNV}`);
    return response.data;
};
