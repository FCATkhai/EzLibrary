import express from "express";
import { 
    getTotalDocGia,
    getTotalNhaXuatBan,
    getTotalNhanVien,
    getTotalSach,
    getTotalPhieuMuon,
    getTotal
} from "../controllers/thongKe.controller";

const router = express.Router();

router.get("/doc-gia", getTotalDocGia);
router.get("/nxb", getTotalNhaXuatBan);
router.get("/nhan-vien", getTotalNhanVien);
router.get("/sach", getTotalSach);
router.get("/phieu-muon", getTotalPhieuMuon);
router.get("/total", getTotal);

export default router;
