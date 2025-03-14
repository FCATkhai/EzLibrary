import express from "express";
import {
    registerDocGia,
    loginDocGia,
    logoutDocGia,
    getAllDocGia,
    getDocGiaById,
    updateDocGia,
    deleteDocGia,
} from "../controllers/docGia.controller";
import { authorize } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerDocGia);
router.post("/login", loginDocGia);
router.post("/logout", logoutDocGia);

router.get("/", authorize(true), getAllDocGia);
router.get("/:id", authorize(), getDocGiaById);
router.put("/:id", authorize(), updateDocGia);
router.delete("/:id", authorize(true), deleteDocGia);

export default router;
