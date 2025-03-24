import { defineStore } from "pinia";
import { loginDG, logoutDG, loginNV, logoutNV } from "@/api/auth.api";
import type { IDocGia, INhanVien, IUser } from "~/shared/interface";
import { USER_ROLES, type UserRole } from "~/shared/userRoles";

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

                    const data: IDocGia = await loginDG(soDienThoai, password);
                    console.log(data);
                    this.user = {
                        maNguoiDung: data.maDG,
                        hoTen: data.hoLot + " " + data.ten,
                        role
                    };
                    this.isAuthenticated = true;
                }
                if (role == USER_ROLES.NHANVIEN) {
                    const data = await loginNV(soDienThoai, password);
                    const nhanVien: INhanVien = data.nhanVien;
                    this.user = {
                        maNguoiDung: nhanVien.maNV,
                        hoTen: nhanVien.hoTenNV,
                        role: nhanVien.chucVu as UserRole
                    };
                    this.isAuthenticated = true;
                }

            } catch (error) {
                throw new Error(`Đăng nhập thất bại, Error: ${error}`);
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


// export const useAuthStore = defineStore("auth", () => {
//     const user = ref<IUser | null>(null);
//     const isAuthenticated = ref(false);

//     async function login(soDienThoai: string, password: string, role: UserRole) {
//         try {
//             if (role == USER_ROLES.DOCGIA) {

//                 const data: IDocGia = await loginDG(soDienThoai, password);
//                 user.value = {
//                     maNguoiDung: data.maDG,
//                     hoTen: data.hoLot + " " + data.ten,
//                     role
//                 };
//                 isAuthenticated.value = true;
//             }
//             if (role == USER_ROLES.NHANVIEN) {
//                 const data: INhanVien = await loginNV(soDienThoai, password);
//                 user.value = {
//                     maNguoiDung: data.maNV,
//                     hoTen: data.hoTenNV,
//                     role: data.chucVu as UserRole
//                 };
//                 isAuthenticated.value = true;
//             }

//         } catch (error) {
//             throw new Error(`Đăng nhập thất bại, Error: ${error}`);
//         }
//     }
//     async function logout() {
//         try {
//             if (user.value?.role === USER_ROLES.DOCGIA) {
//                 await logoutDG();
//             } else {
//                 await logoutNV();
//             }
//             user.value = null;
//             isAuthenticated.value = false;
//         } catch (error) {
//             throw new Error(`Đăng xuất thất bại, Error: ${error}`);
//         }
//     }
// },
// );
