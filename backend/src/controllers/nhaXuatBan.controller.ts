import { Request, Response, NextFunction } from "express";
import NhaXuatBan from "../models/NhaXuatBan.model";
import { FilterQuery } from "mongoose";
import Sach from "../models/Sach.model";
import generateId from "../utils/generateId.util";

/**
 *  Lấy danh sách nhà xuất bản
 *  @route GET /api/nxb
 *  @access Public
 */
export const getAllNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // eslint-disable-next-line prefer-const
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;
        const query: FilterQuery<unknown> = {};

        // Thêm điều kiện tìm kiếm
        if (search) {
            query.$or = [
                { tenNXB: { $regex: search, $options: "i" } }, // Tìm theo tên NXB
            ];
        }
        
        const total = await NhaXuatBan.countDocuments(query);
        const nhaXuatBanList = await NhaXuatBan.find(query)
        .skip(skip)
        .limit(limit);

        const hasMore = page * limit < total;
        res.status(200).json({ 
            total, 
            page, 
            limit, 
            totalPages: Math.ceil(total / limit), 
            hasMore, 
            data: nhaXuatBanList 
        });
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
        const nhaXuatBan = await NhaXuatBan.findOne({maNXB: req.params.id});
        if (!nhaXuatBan) {
            res.status(404);
            throw new Error("Không tìm thấy nhà xuất bản");
        }
        res.status(200).json({data: nhaXuatBan});
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
            throw new Error("Nhà xuất bản đã tồn tại");
        }
        
        const maNXB = "NXB-" + generateId();
        console.log(maNXB);

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
        const nhaXuatBan = await NhaXuatBan.findOne({maNXB: req.params.id});
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
        // Check for duplicate key error (E11000)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error 
        if (error.code === 11000 || error.name === "MongoServerError" && error.code === 11000) {
            res.status(409); // Conflict status code
            return next(new Error(`Tên nhà xuất bản "${req.body.tenNXB}" đã tồn tại`));
        }
        next(error);
    }
};

/**
 *  Xóa nhà xuất bản, khi xoá NXB sẽ luôn các sách thuộc NXB đó
 *  @route DELETE /api/nxb/:id
 *  @access NhanVien
 */
export const deleteNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nhaXuatBan = await NhaXuatBan.findOne({maNXB: req.params.id});
        if (!nhaXuatBan) {
            res.status(404);
            throw new Error("Không tìm thấy nhà xuất bản");
        }

        await Sach.deleteMany({maNXB: nhaXuatBan.maNXB});
        await nhaXuatBan.deleteOne();
        res.status(200).json({ message: "Nhà xuất bản đã được xóa" });
    } catch (error) {
        next(error);
    }
};
