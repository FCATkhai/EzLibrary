export const USER_ROLES = {
    DOCGIA: "Độc giả",
    NHANVIEN: "Nhân viên",
    QUANLY: "Quản lý",
} as const;
  
  export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];