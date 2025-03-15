import express from "express";
import {
    getAllSach,
    getSachById,
    createSach,
    updateSach,
    deleteSach,
} from "../controllers/sach.controller";
import { authorize } from "../middleware/auth.middleware";
import { USER_GROUPS } from "../config/constants";
import {upload, uploadBookCover} from "../middleware/upload.middleware"

const router = express.Router();

router.get("/", getAllSach);
router.get("/:id", getSachById);
router.post("/", authorize(USER_GROUPS.NV_QL), upload.single('file'), uploadBookCover, createSach);
router.put("/:id", authorize(USER_GROUPS.NV_QL), upload.single('file'), uploadBookCover, updateSach);
router.delete("/:id", authorize(USER_GROUPS.NV_QL), deleteSach);

export default router;
