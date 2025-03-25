import express from "express";
import {
    getAllNhanVien,
    getNhanVienById,
    createNhanVien,
    updateNhanVien,
    deleteNhanVien,
    loginNhanVien,
    logoutNhanVien,
    changePasswordNhanVien,
    resetPasswordNhanVien
} from "../controllers/nhanVien.controller";
import { authorize } from "../middleware/auth.middleware"; 
import { USER_GROUPS } from "../config/constants";
const router = express.Router();

router.post("/register", createNhanVien);
router.post("/login", loginNhanVien);
router.post("/logout", logoutNhanVien);

router.get("/:maNV", authorize(USER_GROUPS.QUANLY), getNhanVienById);
router.get("/", authorize(USER_GROUPS.QUANLY), getAllNhanVien);
router.put("/:maNV", authorize(USER_GROUPS.QUANLY), updateNhanVien);
router.patch("/:maNV/change-password", authorize(USER_GROUPS.NV_QL), changePasswordNhanVien);
router.patch("/:maNV/reset-password", authorize(USER_GROUPS.QUANLY), resetPasswordNhanVien);
router.delete("/:maNV", authorize(USER_GROUPS.QUANLY), deleteNhanVien);

export default router;
