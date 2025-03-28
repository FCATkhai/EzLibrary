import express from "express";
import {
    getAllPhieuMuon,
    getPhieuMuonByMaDG,
    createPhieuMuon_DG,
    createPhieuMuon_NV,
    duyetPhieuMuon,
    traSach,
    deletePhieuMuon,
} from "../controllers/theoDoiMuonSach.controller";
import { authorize } from "../middleware/auth.middleware";
import { USER_GROUPS } from "../config/constants";

const router = express.Router();

router.get("/doc-gia/:maDG", authorize(USER_GROUPS.DG_QL), getPhieuMuonByMaDG); 
router.get("/", authorize(USER_GROUPS.NV_QL), getAllPhieuMuon); 
router.post("/doc-gia", authorize(USER_GROUPS.DOCGIA), createPhieuMuon_DG);
router.post("/nhan-vien", authorize(USER_GROUPS.NV_QL), createPhieuMuon_NV);
router.patch("/duyet/:id", authorize(USER_GROUPS.NV_QL), duyetPhieuMuon); 
router.patch("/tra/:id", authorize(USER_GROUPS.NV_QL), traSach); 
router.delete("/:id", authorize(), deletePhieuMuon); 

export default router;
