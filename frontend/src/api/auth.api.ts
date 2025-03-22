import axios from "axios";

// Độc giả
export async function loginDG(soDienThoai: string, password: string) {
    const res = await axios.post("/api/doc-gia/login", { soDienThoai, password });
    return res.data;
}

export async function logoutDG() {
    await axios.post("/api/doc-gia/logout");
}

// Nhân viên
export async function loginNV(soDienThoai: string, password: string) {
    const res = await axios.post("/api/nhan-vien/login", { soDienThoai, password });
    return res.data;
}

export async function logoutNV() {
    await axios.post("/api/nhan-vien/logout");
}
