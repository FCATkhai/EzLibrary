import { Request, Response, NextFunction } from "express";
import Sach from "../models/Sach.model";
import { nanoid } from "nanoid";
import { deleteImage } from "../middleware/upload.middleware";
import { DEFAULT_COVER_URL } from "../config/constants";
/**
 *  @route GET /api/sach
 *  @desc Lấy danh sách tất cả sách
 *  @access Public
 */
export const getAllSach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sachList = await Sach.find();
        res.status(200).json(sachList);
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
        const sach = await Sach.findOne({ maSach: req.params.id });
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
        const { tenSach, soQuyen, namXuatBan, maNXB, tacGia } = req.body;
        
        const maSach = "S-" + nanoid(6);
        const coverUrl = req.file?.path || DEFAULT_COVER_URL;
        const newSach = new Sach({
            maSach,
            tenSach,
            soQuyen,
            namXuatBan,
            maNXB,
            tacGia,
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
        await Sach.deleteOne({ maSach: req.params.id });
        res.status(200).json({ message: "Xóa sách thành công" });
    } catch (error) {
        next(error);
    }
};
