import axios from "@/utils/axios";

const API_URL = "/api/sach";

export const getAllSach = async (params: {page: number, limit: number, search: string} | {}) => {
    const res = await axios.get(API_URL, { params });
    return res.data;
};

/**
 * Lấy sách theo maSach
 * @param id mã của sách cần tìm
 * @returns Thông tin sách tìm được
 */
export const getSachById = async (id: string) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

/**
 * Thêm sách mới
 * @param formData Dữ liệu sách (bao gồm cả ảnh nếu có)
 * @returns Thông tin sách mới
 */
export const createSach = async (formData: FormData) => {
    const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/**
 * Cập nhật sách
 * @param id Mã sách
 * @param formData Dữ liệu sách cần cập nhật
 * @returns Thông tin sách sau khi cập nhật
 */
export const updateSach = async (id: string, formData: FormData) => {
    const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/**
 * Xóa sách
 * @param id Mã sách cần xóa
 * @returns Thông báo xóa sách thành công
 */
export const deleteSach = async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`, {
    });
    return res.data;
};
