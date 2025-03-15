export const USER_ROLES = {
    DOCGIA: "Độc giả",
    NHANVIEN: "Nhân viên",
    QUANLY: "Quản lý",
} as const;

export const USER_GROUPS = {
    ALL_USERS: [USER_ROLES.DOCGIA, USER_ROLES.NHANVIEN, USER_ROLES.QUANLY],
    NV_QL: [USER_ROLES.NHANVIEN, USER_ROLES.QUANLY], 
    DG_QL: [USER_ROLES.DOCGIA, USER_ROLES.QUANLY], 
    DOCGIA: [USER_ROLES.DOCGIA],
    QUANLY: [USER_ROLES.QUANLY],
};

export const DEFAULT_COVER_URL = 
"https://res.cloudinary.com/dpzwsiz0s/image/upload/v1742028355/EzLibrary/book-cover/default-book-cover.jpg";