import { Request, Response, NextFunction } from "express";
import TheoDoiMuonSach from "../models/TheoDoiMuonSach.model";
import { IDocGia, INhanVien } from "../../../shared/interface";
import DocGia from "../models/DocGia.model";
import Sach from "../models/Sach.model";
import generateId from "../utils/generateId.util";

/**
 *  @route GET /api/muon-sach
 *  @desc Lấy danh sách tất cả phiếu mượn
 *  @access Private (chỉ nhân viên và quản lý)
 */
export const getAllPhieuMuon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const phieuMuons = await TheoDoiMuonSach.find().populate("maDG maNV maSach");
        const phieuMuons = await TheoDoiMuonSach.find().populate([
        {
            path: "maDG",
            model: "DocGia",
            foreignField: "maDG",
            localField: "maDG",
            justOne: true,
            select: "hoLot ten -_id"
        },
        {
            path: "maNV",
            model: "NhanVien",
            foreignField: "maNV",
            localField: "maNV",
            justOne: true,
            select: "hoTenNV -_id"
        },
        {
            path: "maSach",
            model: "Sach",
            foreignField: "maSach",
            localField: "maSach",
            justOne: true,
            select: "tenSach -_id"
        }
        ]);
        res.status(200).json(phieuMuons);
    } catch (error) {
        next(error);
    }
};

/**
 *  @route POST /api/muon-sach/doc-gia
 *  @desc Độc giả tạo phiếu mượn sách
 *  @access DocGia
 */
export const createPhieuMuon_DG = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { maSach } = req.body;
        if (!req.user) {
            res.status(403);
            throw new Error("Cần đăng nhập để thực hiện chức năng này");
        }
        const user = req.user as IDocGia;
        const maDG = user.maDG;
        const maPM = "PM-" + generateId();
        const newPhieuMuon = new TheoDoiMuonSach({
            maPM,
            maDG,
            maSach,
            ngayMuon: new Date(),
            trangThai: "pending",
        });

        await newPhieuMuon.save();
        res.status(201).json({ message: "Phiếu mượn đã được tạo", phieuMuon: newPhieuMuon });
    } catch (error) {
        next(error);
    }
};

/**
 *  @route POST /api/muon-sach/nhan-vien
 *  @desc Nhân viên tạo phiếu mượn sách
 *  @access NV_QL
 *  @param req.body = { maSach, soDienThoai_DG }
 */
export const createPhieuMuon_NV = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { maSach, soDienThoai_DG } = req.body;
        if (!req.user) {
            res.status(403);
            throw new Error("Cần đăng nhập để thực hiện chức năng này");
        }

        const sach = await Sach.findOne({maSach});
        if (!sach) {
            res.status(404);
            throw new Error("Sách cần mượn không tồn tại");
        }
        if (sach.soQuyen == 0) {
            res.status(400);
            throw new Error("Sách đã hết, không thể cho mượn");
        }
        sach.soQuyen -= 1;
        await sach.save();

        const docGia = await DocGia.findOne({soDienThoai: soDienThoai_DG});
        if (!docGia) {
            res.status(404);
            throw new Error("Số điện thoại của độc giả không đúng");
        }
        const user = req.user as INhanVien;
        const maNV =user.maNV;
        const maPM = "PM-" + generateId();
        const newPhieuMuon = new TheoDoiMuonSach({
            maPM,
            maDG: docGia.maDG,
            maNV,
            maSach,
            ngayMuon: new Date(),
            ngayHenTra: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Hẹn trả sau 7 ngày
            trangThai: "borrowing",
        });

        await newPhieuMuon.save();
        res.status(201).json({ message: "Phiếu mượn đã được tạo", phieuMuon: newPhieuMuon });
    } catch (error) {
        next(error);
    }
};


/**
 *  @route PUT /api/muon-sach/duyet/:id
 *  @desc Nhân viên duyệt phiếu mượn
 *  @access Private (chỉ nhân viên)
 *  @param req.body = {status: "borrowing" | "rejected"}
 */
export const duyetPhieuMuon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body;
        if (!req.user) {
            res.status(403);
            throw new Error("Cần đăng nhập để thực hiện chức năng này");
        }
        const user = req.user as INhanVien; // Nhân viên duyệt

        if (!["borrowing", "rejected"].includes(status)) {
            res.status(400);
            throw new Error("Trạng thái duyệt không hợp lệ - ['borrowing', 'rejected']");
        }
        const phieuMuon = await TheoDoiMuonSach.findOne({ maPM: req.params.id });
        if (!phieuMuon) {
            res.status(404);
            throw new Error("Không tìm thấy phiếu mượn");
        }
        if (phieuMuon.trangThai !== "pending") {
            res.status(400);
            throw new Error("Phiếu mượn đã được xử lý");
        }

        // Thao tác xử lý
        const sach = await Sach.findOne({maSach: phieuMuon.maSach});
        if (!sach) {
            res.status(404);
            throw new Error("Sách cần mượn không tồn tại");
        }
        if (sach.soQuyen == 0) {
            res.status(400);
            throw new Error("Sách đã hết, không thể cho mượn");
        }
        sach.soQuyen -= 1;
        await sach.save();
        
        phieuMuon.trangThai = status;
        phieuMuon.maNV = user.maNV; 
        phieuMuon.ngayHenTra = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Hẹn trả sau 7 ngày

        await phieuMuon.save();
        res.status(200).json({ message: "Phiếu mượn đã được duyệt", phieuMuon });
    } catch (error) {
        next(error);
    }
};

/**
 *  @route PUT /api/muon-sach/tra/:id
 *  @desc Cập nhật ngày trả sách khi độc giả trả sách
 *  @access Private (chỉ nhân viên)
 */
export const traSach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const phieuMuon = await TheoDoiMuonSach.findOne({ maPM: req.params.id });
        if (!phieuMuon) {
            res.status(404);
            throw new Error("Không tìm thấy phiếu mượn");
        }

        if (phieuMuon.trangThai !== "borrowing") {
            res.status(400);
            throw new Error("Sách chưa được mượn hoặc đã trả");
        }

        const sach = await Sach.findOne({maSach: phieuMuon.maSach});
        if (!sach) {
            res.status(404);
            throw new Error("Sách đã mượn không tồn tại");
        }
        sach.soQuyen += 1;
        await sach.save();

        phieuMuon.trangThai = "returned";
        phieuMuon.ngayTra = new Date(); // Cập nhật ngày trả

        await phieuMuon.save();
        res.status(200).json({ message: "Độc giả đã trả sách", phieuMuon });
    } catch (error) {
        next(error);
    }
};

/**
 *  @route DELETE /api/muon-sach/:id
 *  @desc Xóa phiếu mượn (chỉ khi đang ở trạng thái pending)
 *  @access Private (chỉ độc giả hoặc quản lý)
 */
export const deletePhieuMuon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const phieuMuon = await TheoDoiMuonSach.findOne({ maPM: req.params.id });
        if (!phieuMuon) {
            res.status(404);
            throw new Error("Không tìm thấy phiếu mượn");
        }

        if (phieuMuon.trangThai !== "pending") {
            res.status(400);
            throw new Error("Không thể xóa phiếu mượn đã được xử lý");
        }

        await TheoDoiMuonSach.deleteOne({ maPM: req.params.id });
        res.status(200).json({ message: "Đã xóa phiếu mượn thành công" });
    } catch (error) {
        next(error);
    }
};
