import { Request, Response, NextFunction } from "express";
import DocGia from "../models/DocGia.model";
import Sach from "../models/Sach.model";
import TheoDoiMuonSach from "../models/TheoDoiMuonSach.model";
import NhaXuatBan from "../models/NhaXuatBan.model";
import NhanVien from "../models/NhanVien.model";

/**
 *  lấy tổng hợp về số lượng
 *  @route GET /api/statistics/total
 *  @access Public
 */
export const getTotal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalDocGia = await DocGia.countDocuments();
        const totalNhanVien = await NhanVien.countDocuments();
        const totalNhaXuatBan = await NhaXuatBan.countDocuments();
        const totalSach = await Sach.countDocuments();
        const totalPhieuMuon = await TheoDoiMuonSach.countDocuments();
        
        res.status(201).json({ totalDocGia, totalNhanVien, totalNhaXuatBan, totalSach, totalPhieuMuon });
    } catch (error) {
        next(error);
    }
};

/**
 *  lấy tổng số độc giả
 *  @route GET /api/statistics/doc-gia
 *  @access Public
 */
export const getTotalDocGia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalDocGia = await DocGia.countDocuments();
        res.status(201).json({ totalDocGia });
    } catch (error) {
        next(error);
    }
};

/**
 *  lấy tổng số nhân viên
 *  @route GET /api/statistics/nhan-vien
 *  @access Public
 */
export const getTotalNhanVien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalNhanVien = await NhanVien.countDocuments();
        res.status(201).json({ totalNhanVien });
    } catch (error) {
        next(error);
    }
};

/**
 *  lấy tổng số NXB
 *  @route GET /api/statistics/nxb
 *  @access Public
 */
export const getTotalNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalNhaXuatBan = await NhaXuatBan.countDocuments();
        res.status(201).json({ totalNhaXuatBan });
    } catch (error) {
        next(error);
    }
};

/**
 *  lấy tổng số sách
 *  @route GET /api/statistics/sach
 *  @access Public
 */
export const getTotalSach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalSach = await Sach.countDocuments();
        res.status(201).json({ totalSach });
    } catch (error) {
        next(error);
    }
};

/**
 *  lấy tổng số phiếu mượn
 *  @route GET /api/statistics/phieu-muon
 *  @access Public
 */
export const getTotalPhieuMuon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalPhieuMuon = await TheoDoiMuonSach.countDocuments();
        res.status(201).json({ totalPhieuMuon });
    } catch (error) {
        next(error);
    }
};

