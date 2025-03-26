import express from "express";
import {
    registerDocGia,
    loginDocGia,
    logoutDocGia,
    getAllDocGia,
    getDocGia,
    updateDocGia,
    deleteDocGia,
    changePasswordDocGia,
    resetPasswordDocGia
} from "../controllers/docGia.controller";
import { authorize } from "../middleware/auth.middleware";
import { USER_GROUPS } from "../config/constants";

const router = express.Router();

router.post("/register", registerDocGia);
router.post("/login", loginDocGia);
router.post("/logout", logoutDocGia);

router.get("/get-one", authorize(), getDocGia);
router.get("/", authorize(USER_GROUPS.NV_QL), getAllDocGia);
router.put("/:id", authorize(USER_GROUPS.DG_QL), updateDocGia);
router.patch("/:id/change-password", authorize(), changePasswordDocGia);
router.patch("/:id/reset-password", authorize(USER_GROUPS.QUANLY), resetPasswordDocGia);
router.delete("/:id", authorize(USER_GROUPS.QUANLY), deleteDocGia);

export default router;
