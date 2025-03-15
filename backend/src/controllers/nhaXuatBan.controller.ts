import { Request, Response, NextFunction } from "express";
import NhaXuatBan from "../models/NhaXuatBan.model";
import { nanoid } from "nanoid";


/**
 *  Lấy danh sách nhà xuất bản
 *  @route GET /api/nxb
 *  @access Public
 */
export const getAllNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nhaXuatBanList = await NhaXuatBan.find();
        res.status(200).json(nhaXuatBanList);
    } catch (error) {
        next(error);
    }
};

/**
 *  Lấy một nhà xuất bản theo ID
 *  @route GET /api/nxb/:id
 *  @access Public
 */
export const getNhaXuatBanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nhaXuatBan = await NhaXuatBan.findById(req.params.id);
        if (!nhaXuatBan) {
            res.status(404);
            throw new Error("Không tìm thấy nhà xuất bản");
        }
        res.status(200).json(nhaXuatBan);
    } catch (error) {
        next(error);
    }
};

/**
 *  Tạo nhà xuất bản mới
 *  @route POST /api/nxb
 *  @access NhanVien
 */
export const createNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tenNXB, diaChi } = req.body;

        const nhaXuatBanExists = await NhaXuatBan.findOne({ tenNXB });
        if (nhaXuatBanExists) {
            res.status(400);
            throw new Error("Mã nhà xuất bản đã tồn tại");
        }
        
        const maNXB = "NXB-" + nanoid(6);


        const nhaXuatBan = await NhaXuatBan.create({ maNXB, tenNXB, diaChi });
        res.status(201).json(nhaXuatBan);
    } catch (error) {
        next(error);
    }
};

/**
 *  Cập nhật thông tin nhà xuất bản
 *  @route PUT /api/nxb/:id
 *  @access NhanVien
 */
export const updateNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nhaXuatBan = await NhaXuatBan.findById(req.params.id);
        if (!nhaXuatBan) {
            res.status(404);
            throw new Error("Không tìm thấy nhà xuất bản");
        }

        nhaXuatBan.maNXB = req.body.maNXB || nhaXuatBan.maNXB;
        nhaXuatBan.tenNXB = req.body.tenNXB || nhaXuatBan.tenNXB;
        nhaXuatBan.diaChi = req.body.diaChi || nhaXuatBan.diaChi;

        const updatedNhaXuatBan = await nhaXuatBan.save();
        res.status(200).json(updatedNhaXuatBan);
    } catch (error) {
        next(error);
    }
};

/**
 *  Xóa nhà xuất bản
 *  @route DELETE /api/nxb/:id
 *  @access NhanVien
 */
export const deleteNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nhaXuatBan = await NhaXuatBan.findById(req.params.id);
        if (!nhaXuatBan) {
            res.status(404);
            throw new Error("Không tìm thấy nhà xuất bản");
        }

        await nhaXuatBan.deleteOne();
        res.status(200).json({ message: "Nhà xuất bản đã được xóa" });
    } catch (error) {
        next(error);
    }
};
