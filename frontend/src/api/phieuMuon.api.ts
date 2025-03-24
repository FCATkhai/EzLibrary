import axios from "@/utils/axios";

const API_URL = "/api/muon-sach";

/**
 * Lấy danh sách tất cả phiếu mượn
 * @returns Danh sách phiếu mượn
 */
export const getAllPhieuMuon = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Độc giả tạo phiếu mượn sách
 * @param maSach Mã sách muốn mượn
 * @returns Thông tin phiếu mượn mới
 */
export const createPhieuMuon_DG = async (maSach: string) => {
    return await axios.post(`${API_URL}/doc-gia`, { maSach });
}

/**
 * Nhân viên tạo phiếu mượn sách
 * @param maSach Mã sách cần mượn
 * @param soDienThoai_DG Số điện thoại của độc giả
 * @returns Thông tin phiếu mượn mới
 */
export const muonSachNV = async (maSach: string, soDienThoai_DG: string) => {
    return await axios.post(`${API_URL}/nhan-vien`, { maSach, soDienThoai_DG });
}

/**
 * Nhân viên duyệt phiếu mượn
 * @param id Mã phiếu mượn
 * @param status Trạng thái duyệt ('borrowing' hoặc 'rejected')
 * @returns Thông tin phiếu mượn sau khi duyệt
 */
export const duyetPhieuMuon = async (id: string, status: "borrowing" | "rejected") => {
    const response = await axios.put(
        `${API_URL}/duyet/${id}`,
        { status },
    );
    return response.data;
};

/**
 * Nhân viên cập nhật ngày trả sách
 * @param id Mã phiếu mượn
 * @returns Thông tin phiếu mượn sau khi trả sách
 */
export const traSach = async (id: string) => {
    const response = await axios.put(`${API_URL}/tra/${id}`, {});
    return response.data;
};

/**
 * Xóa phiếu mượn (chỉ khi ở trạng thái 'pending')
 * @param id Mã phiếu mượn
 * @returns Thông báo xóa phiếu mượn thành công
 */
export const deletePhieuMuon = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
