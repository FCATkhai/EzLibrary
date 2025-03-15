import express from "express";
import { 
    getAllNhaXuatBan, 
    getNhaXuatBanById, 
    createNhaXuatBan, 
    updateNhaXuatBan, 
    deleteNhaXuatBan 
} from "../controllers/nhaXuatBan.controller";
import { authorize } from "../middleware/auth.middleware";
import { USER_GROUPS } from "../config/constants";

const router = express.Router();

router.get("/", getAllNhaXuatBan);
router.get("/:id", getNhaXuatBanById);
router.post("/", authorize(USER_GROUPS.NV_QL), createNhaXuatBan);
router.put("/:id", authorize(USER_GROUPS.NV_QL), updateNhaXuatBan);
router.delete("/:id", authorize(USER_GROUPS.NV_QL), deleteNhaXuatBan);

export default router;
