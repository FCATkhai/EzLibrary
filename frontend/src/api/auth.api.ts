import axios from "@/utils/axios";
import type { IDocGia, INhanVien } from "~/shared/interface";

// Độc giả
export async function loginDG(soDienThoai: string, password: string) {
    const res = await axios.post<{message: string, docGia: IDocGia}>("/api/doc-gia/login", { soDienThoai, password });
    return res.data;
}

export async function logoutDG() {
    await axios.post("/api/doc-gia/logout");
}

// Nhân viên
export async function loginNV(soDienThoai: string, password: string) {
    const res = await axios.post<{message: string, nhanVien: INhanVien}>("/api/nhan-vien/login", { soDienThoai, password });
    return res.data;
}

export async function logoutNV() {
    await axios.post("/api/nhan-vien/logout");
}
