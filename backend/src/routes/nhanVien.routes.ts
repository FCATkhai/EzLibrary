import express from "express";
import {
    getAllNhanVien,
    getNhanVienById,
    createNhanVien,
    updateNhanVien,
    deleteNhanVien,
    loginNhanVien,
    logoutNhanVien
} from "../controllers/nhanVien.controller";
import { authorize } from "../middleware/auth.middleware"; // Middleware xác thực

const router = express.Router();

router.post("/register", createNhanVien); // Đăng ký nhân viên mới
router.post("/login", loginNhanVien);
router.post("/logout", logoutNhanVien);

router.get("/", authorize(true), getAllNhanVien); // Lấy danh sách nhân viên (Chỉ Quản lý)
router.get("/:maNV", authorize(true), getNhanVienById); // Lấy thông tin nhân viên (Chỉ Quản lý)
router.put("/:maNV", authorize(true), updateNhanVien); // Cập nhật nhân viên (Chỉ Quản lý)
router.delete("/:maNV", authorize(true), deleteNhanVien); // Xóa nhân viên (Chỉ Quản lý)

export default router;
