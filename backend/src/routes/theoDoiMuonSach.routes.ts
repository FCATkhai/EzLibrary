import express from "express";
import {
    getAllPhieuMuon,
    createPhieuMuon_DG,
    duyetPhieuMuon,
    traSach,
    deletePhieuMuon,
} from "../controllers/theoDoiMuonSach.controller";
import { authorize } from "../middleware/auth.middleware";
import { USER_GROUPS } from "../config/constants";

const router = express.Router();

router.get("/", authorize(USER_GROUPS.NV_QL), getAllPhieuMuon); 
router.post("/", authorize(USER_GROUPS.DOCGIA), createPhieuMuon_DG);
router.put("/duyet/:id", authorize(USER_GROUPS.NV_QL), duyetPhieuMuon); 
router.put("/tra/:id", authorize(USER_GROUPS.NV_QL), traSach); 
router.delete("/:id", authorize(), deletePhieuMuon); 

export default router;
