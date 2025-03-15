import express from "express";
import nhanVienRoutes from "./nhanVien.routes";
import docGiaRoutes from "./docGia.routes";
import nhaXuatBanRoutes from "./nhaXuatBan.routes"
import sachRoutes from "./sach.routes";
import theoDoiMuonSachRoutes from "./theoDoiMuonSach.routes";

const router = express.Router();

router.use("/nhan-vien", nhanVienRoutes);
router.use("/doc-gia", docGiaRoutes);
router.use("/nxb", nhaXuatBanRoutes);
router.use("/sach", sachRoutes);
router.use("/muon-sach", theoDoiMuonSachRoutes);

export default router;