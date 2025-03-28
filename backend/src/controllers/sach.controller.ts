import { Request, Response, NextFunction } from "express";
import Sach from "../models/Sach.model";
import { deleteImage } from "../middleware/upload.middleware";
import { DEFAULT_COVER_URL } from "../config/constants";
import { FilterQuery } from "mongoose";
import generateId from "../utils/generateId.util";
import TheoDoiMuonSach from "../models/TheoDoiMuonSach.model";
import { ITheoDoiMuonSach } from "~/shared/interface";

/**
 *  @route GET /api/sach
 *  @desc Lấy danh sách tất cả sách
 *  @access Public
 */
export const getAllSach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // eslint-disable-next-line prefer-const
        let { page = 1, limit = 10, search = "" } = req.query;
        
        page = Number(page);
        limit = Number(limit);
        const query: FilterQuery<unknown> = {};

        // Thêm điều kiện tìm kiếm
        if (search) {
            query.$or = [
                { tenSach: { $regex: search, $options: "i" } }, // Tìm theo tên sách
                { tacGia: { $regex: search, $options: "i" } } // Tìm theo tác giả
            ];
        }

        const total = await Sach.countDocuments(query);
        const sachList = await Sach.find(query)
            .populate({
                path: "maNXB",
                model: "NhaXuatBan",
                foreignField: "maNXB",
                localField: "maNXB",
                justOne: true,
                select: "tenNXB -_id"
            })
            .skip((page - 1) * limit)
            .limit(limit);

        const hasMore = page * limit < total;

        res.status(200).json({ 
            total, 
            page, 
            limit, 
            totalPages: Math.ceil(total / limit), 
            hasMore, 
            data: sachList 
        });
    } catch (error) {
        next(error);
    }
};

/**
 *  @route GET /api/sach/:id
 *  @desc Lấy thông tin một quyển sách theo mã sách
 *  @access Public
 */
export const getSachById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sach = await Sach.findOne({ maSach: req.params.id }).populate({
            path: "maNXB",
            model: "NhaXuatBan",
            foreignField: "maNXB",
            localField: "maNXB",
            justOne: true,
            select: "tenNXB -_id -maNXB"
        });
        if (!sach) {
            res.status(404);
            throw new Error("Không tìm thấy sách");
        }
        res.status(200).json(sach);
    } catch (error) {
        next(error);
    }
};

/**
 *  @route POST /api/sach
 *  @desc Thêm sách mới
 *  @access NhanVien
 */
export const createSach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tenSach, moTa, soTrang, soQuyen, namXuatBan, maNXB, tacGia } = req.body;
        
        const maSach = "S-" + generateId();
        const coverUrl = req.file?.path || DEFAULT_COVER_URL;
        const newSach = new Sach({
            maSach,
            tenSach,
            tacGia,
            moTa,
            namXuatBan,
            soTrang,
            soQuyen,
            maNXB,
            coverUrl
        });

        await newSach.save();
        res.status(201).json({ message: "Thêm sách thành công", sach: newSach });
    } catch (error) {
        deleteImage(req.file?.path);
        next(error);
    }
};

/**
 *  @route PUT /api/sach/:id
 *  @desc Cập nhật thông tin sách
 *  @access NhanVien
 */
export const updateSach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sach = await Sach.findOne({ maSach: req.params.id });
        if (!sach) {
            res.status(404);
            throw new Error("Không tìm thấy sách");
        }
        const coverUrl = req.file?.path;
        let updated = req.body
        if (coverUrl) {
            // xoá ảnh cũ trên cloud
            deleteImage(sach.coverUrl);
            updated = {...updated, coverUrl};
        }
        const updatedSach = await Sach.findOneAndUpdate({ maSach: req.params.id }, updated, { new: true });

        res.status(200).json({ message: "Cập nhật sách thành công", sach: updatedSach });
    } catch (error) {
                // Check for duplicate key error (E11000)
        // @ts-expect-error 
        if (error.code === 11000 || error.name === "MongoServerError" && error.code === 11000) {
            res.status(409); // Conflict status code
            return next(new Error(`Tên sách "${req.body.tenSach}" đã tồn tại`));
        }
        next(error);
    }
};

/**
 *  @route DELETE /api/sach/:id
 *  @desc Xóa sách
 *  @access NhanVien
 */
export const deleteSach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sach = await Sach.findOne({ maSach: req.params.id });
        if (!sach) {
            res.status(404);
            throw new Error("Không tìm thấy sách");
        }

        deleteImage(sach.coverUrl);

        const phieMuons = await TheoDoiMuonSach.find({ maSach: req.params.id});
        if (phieMuons.some((phieMuon: ITheoDoiMuonSach) => phieMuon.trangThai === "borrowing")) {
            res.status(400);
            throw new Error("Không thể xóa sách này vì sách này đang được mượn");
        } else {
            await TheoDoiMuonSach.deleteMany({ maSach: req.params.id });
        }

        await Sach.deleteOne({ maSach: req.params.id });
        res.status(200).json({ message: "Xóa sách thành công" });
    } catch (error) {
        next(error);
    }
};
