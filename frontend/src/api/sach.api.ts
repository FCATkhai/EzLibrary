import axios from "axios";

export const getAllSach = async (params = {}) => {
    const res = await axios.get("/api/sach", { params });
    return res.data;
};

export const getSachById = async (maSach: string) => {
    const res = await axios.get(`/api/sach/${maSach}`);
    return res.data;
};
