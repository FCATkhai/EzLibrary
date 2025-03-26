import axios from "@/utils/axios";
import type { ITheoDoiMuonSach } from "~/shared/interface"; // Adjust path to your interface

const API_URL = "/api/muon-sach";

/**
 * Lấy danh sách tất cả phiếu mượn
 * @param params Pagination, search, and status filter parameters
 * @returns Paginated list of phiếu mượn
 */
export const getAllPhieuMuon = async (params: { page?: number; limit?: number; search?: string; trangThai?: string | string[] } = {}) => {
    const response = await axios.get<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
        data: ITheoDoiMuonSach[];
    }>(API_URL, { params });
    return response.data;
};

/**
 * Lấy danh sách phiếu mượn theo mã độc giả
 * @param maDG Mã độc giả
 * @param params Pagination and status filter parameters
 * @returns Paginated list of phiếu mượn for the given độc giả
 */
export const getPhieuMuonByMaDG = async (maDG: string, params: { page?: number; limit?: number; search?: string; trangThai?: string | string[] } = {}) => {
    const response = await axios.get<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
        data: ITheoDoiMuonSach[];
    }>(`${API_URL}/doc-gia/${maDG}`, { params });
    return response.data;
};

/**
 * Độc giả tạo phiếu mượn sách
 * @param data Thông tin phiếu mượn (mã sách)
 * @returns Phiếu mượn vừa được tạo
 */
export const createPhieuMuon_DG = async (data: { maSach: string }) => {
    const response = await axios.post<{ message: string; phieuMuon: ITheoDoiMuonSach }>(`${API_URL}/doc-gia`, data);
    return response.data;
};

/**
 * Nhân viên tạo phiếu mượn sách
 * @param data Thông tin phiếu mượn (mã sách và số điện thoại độc giả)
 * @returns Phiếu mượn vừa được tạo
 */
export const createPhieuMuon_NV = async (data: { maSach: string; soDienThoai_DG: string }) => {
    const response = await axios.post<{ message: string; phieuMuon: ITheoDoiMuonSach }>(`${API_URL}/nhan-vien`, data);
    return response.data;
};

/**
 * Nhân viên duyệt phiếu mượn
 * @param id Mã phiếu mượn (maPM)
 * @param data Trạng thái duyệt (borrowing hoặc rejected)
 * @returns Phiếu mượn sau khi duyệt
 */
export const duyetPhieuMuon = async (id: string, data: { status: "borrowing" | "rejected" }) => {
    const response = await axios.patch<{ message: string; phieuMuon: ITheoDoiMuonSach }>(`${API_URL}/duyet/${id}`, data);
    return response.data;
};

/**
 * Cập nhật thông tin trả sách
 * @param id Mã phiếu mượn (maPM)
 * @returns Phiếu mượn sau khi cập nhật trả sách
 */
export const traSach = async (id: string) => {
    const response = await axios.patch<{ message: string; phieuMuon: ITheoDoiMuonSach }>(`${API_URL}/tra/${id}`);
    return response.data;
};

/**
 * Xóa phiếu mượn
 * @param id Mã phiếu mượn (maPM)
 * @returns Thông báo xóa thành công
 */
export const deletePhieuMuon = async (id: string) => {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${id}`);
    return response.data;
};
