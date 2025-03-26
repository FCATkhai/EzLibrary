import { defineStore } from "pinia";
import { loginDG, logoutDG, loginNV, logoutNV } from "@/api/auth.api";
import type { IDocGia, INhanVien, IUser } from "~/shared/interface";
import { USER_ROLES, type UserRole } from "~/shared/userRoles";
import type { AxiosError } from "axios";

interface AuthState {
    user: { maNguoiDung: string; hoTen: string; role: UserRole } | null;
    isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false
    }),

    actions: {
        async login(soDienThoai: string, password: string, role: UserRole) {
            try {
                if (role == USER_ROLES.DOCGIA) {
                    const res = await loginDG(soDienThoai, password);
                    //@ts-ignore
                    if (!res.success) throw new Error(res.message);
                    const docGia: IDocGia = res.docGia;
                    this.user = {
                        maNguoiDung: docGia.maDG,
                        hoTen: docGia.hoLot + " " + docGia.ten,
                        role
                    };
                    this.isAuthenticated = true;
                }
                if (role == USER_ROLES.NHANVIEN) {
                    const res = await loginNV(soDienThoai, password);
                    //@ts-ignore
                    if (!res.success) throw new Error(res.message);
                    const nhanVien: INhanVien = res.nhanVien;
                    this.user = {
                        maNguoiDung: nhanVien.maNV,
                        hoTen: nhanVien.hoTenNV,
                        role: nhanVien.chucVu as UserRole
                    };
                    this.isAuthenticated = true;
                }

            } catch (error) {
                //@ts-ignore
                throw new Error(error?.response?.data?.message || "Đăng nhập thất bại");
            }
        },

        async logout() {
            try {
                if (this.user?.role === USER_ROLES.DOCGIA) {
                    await logoutDG();
                } else {
                    await logoutNV();
                }
                this.user = null;
                this.isAuthenticated = false;
            } catch (error) {
                throw new Error(`Đăng xuất thất bại, Error: ${error}`);
            }
        }
    },
    persist: true
});
