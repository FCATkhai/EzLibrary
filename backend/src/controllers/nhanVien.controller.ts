import { NextFunction, Request, Response } from "express";
import NhanVien from "../models/NhanVien.model";
import generateId from "../utils/generateId.util";
import jwt  from "jsonwebtoken";

import dotenv from 'dotenv';
import { FilterQuery } from "mongoose";
import { USER_ROLES } from "../config/constants";
dotenv.config();


/**
 *  Thêm nhân viên mới
 *  @route POST /api/nhan-vien/register
 *  @access Public
 */
export const createNhanVien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hoTenNV, password, chucVu, diaChi, soDienThoai } = req.body;

        const existingNhanVien = await NhanVien.findOne({soDienThoai})
        if (existingNhanVien) {
            res.status(400);
            throw new Error("Số điện thoại đã tồn tại");
        }
        const maNV = "NV-" + generateId();

        const newNhanVien = new NhanVien({
            maNV,
            hoTenNV,
            password,
            chucVu,
            diaChi,
            soDienThoai,
        });

        await newNhanVien.save();
        res.status(201).json({message: "đăng ký nhân viên mới thành công.", NhanVien: newNhanVien});
    } catch (error) {
        next(error);
    }
};

/**
 *  Đăng nhập nhân viên
 *  @route POST /api/nhan-vien/login
 *  @access Public
 */
export const loginNhanVien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { soDienThoai, password } = req.body;

        const nhanVien = await NhanVien.findOne({ soDienThoai });
        if (!nhanVien) {
            res.status(401);
            throw new Error("Số điện thoại hoặc mật khẩu không đúng");
        }

        const isMatch = await nhanVien.comparePassword(password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Số điện thoại hoặc mật khẩu không đúng");
        }

        // Tạo token JWT
        const token = jwt.sign(
            { maNV: nhanVien.maNV, role: nhanVien.chucVu }, 
            process.env.JWT_SECRET as jwt.Secret, 
            {expiresIn: process.env.JWT_EXPIRES_IN,} as jwt.SignOptions);

        // Gửi token vào cookie
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        res.json({ 
            success: true,
            message: "Đăng nhập thành công", 
            nhanVien: {
                maNV: nhanVien.maNV,
                hoTenNV: nhanVien.hoTenNV,
                chucVu: nhanVien.chucVu,
                diaChi: nhanVien.diaChi,
                soDienThoai: nhanVien.soDienThoai
        } });
    } catch (error) {
        next(error);
    }
};

/**
 *  Đăng xuất nhân viên
 *  @route POST /api/nhan-vien/logout
 *  @access Private
 */
export const logoutNhanVien = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("access_token");
        res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
        next(error);
    }
};


/**
 *  Lấy danh sách tất cả nhân viên (Chỉ Quản lý)
 *  @route GET /api/nhan-vien
 *  @access Private (Chỉ Quản lý)
 */
export const getAllNhanVien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // eslint-disable-next-line prefer-const
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);
        const query: FilterQuery<unknown> = {};

        // Thêm điều kiện tìm kiếm
        if (search) {
            query.$or = [
                { hoTenNV: { $regex: search, $options: "i" } }, // Tìm theo họ tên
                { soDienThoai: { $regex: search, $options: "i" } } // Tìm theo số điện thoại
            ];
        }

        const total = await NhanVien.countDocuments(query);
        const nhanVienList = await NhanVien.find(query)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(limit);
        const hasMore = page * limit < total;
        res.status(200).json({ 
            total, 
            page,
            limit, 
            totalPages: Math.ceil(total / limit), 
            hasMore, 
            data: nhanVienList 
        });
    } catch (error) {
        next(error);
    }
};

/**
 *  Lấy thông tin nhân viên theo mã (Chỉ Quản lý)
 *  @route GET /api/nhan-vien/:maNV
 *  @access Private (Chỉ Quản lý)
 */
export const getNhanVienById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nhanVien = await NhanVien.findOne({ maNV: req.params.maNV }).select("-password");

        if (!nhanVien) {
            res.status(404);
            throw new Error("Không tìm thấy nhân viên");
        }

        res.json(nhanVien);
    } catch (error) {
        next(error);
    }
};

/**
 *  Cập nhật thông tin nhân viên (Chỉ Quản lý)
 *  @route PUT /api/nhan-vien/:maNV
 *  @access Private (Chỉ Quản lý)
 */
export const updateNhanVien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { maNV } = req.params;
        const updatedData = req.body;

        if (updatedData.password) {
            res.status(400);
            throw new Error("Phải cập nhật mật khẩu qua changePassword");
        }

        const nhanVien = await NhanVien.findOne({ maNV });

        if (!nhanVien) {
            res.status(404);
            throw new Error("Không tìm thấy nhân viên");
        }

        Object.assign(nhanVien, updatedData);
        await nhanVien.save();

        res.json({message: "Cập nhật thông tin nhân viên thành công", nhanVien});
    } catch (error) {
        next(error);
    }
};

/**
 *  Thay đổi mật khẩu nhân viên
 *  @route PATCH /api/nhan-vien/:id/change-password
 *  @access nhanVien (Only owner) or Quản lý
 */
export const changePasswordNhanVien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        // Kiểm tra user tồn tại
        const nhanVien = await NhanVien.findOne({ maDG: id });
        if (!nhanVien) {
            res.status(404);
            throw new Error("Không tìm thấy nhân viên");
        }

        // Chỉ cho phép nhân viên đổi mật khẩu chính mình hoặc người dùng là quản lý
        if (req.user?.maNguoiDung !== id && req.user?.role !== USER_ROLES.QUANLY) {
            res.status(403);
            throw new Error("Bạn không có quyền thay đổi mật khẩu cho người khác");
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await nhanVien.comparePassword(oldPassword);
        if (!isMatch) {
            res.status(400);
            throw new Error("Mật khẩu cũ không đúng");
        }

        // Cập nhật mật khẩu mới
        nhanVien.password = newPassword;
        await nhanVien.save();

        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        next(error);
    }
};

/**
 *  Reset mật khẩu nhân viên
 *  @route PATCH /api/nhan-vien/:id/reset-password
 *  @access Quản lý
 */
export const resetPasswordNhanVien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        // Kiểm tra user tồn tại
        const nhanVien = await NhanVien.findOne({ maDG: id });
        if (!nhanVien) {
            res.status(404);
            throw new Error("Không tìm thấy nhân viên");
        }

        // Chỉ cho phép quản lý reset mật khẩu
        if (req.user?.role !== USER_ROLES.QUANLY) {
            res.status(403);
            throw new Error("Chỉ có quản lý mới có quyền reset mật khẩu");
        }

        // Cập nhật mật khẩu mới
        nhanVien.password = newPassword;
        await nhanVien.save();

        res.json({ success: true, message: "Reset mật khẩu thành công" });
    } catch (error) {
        next(error);
    }
};

/**
 *  Xóa nhân viên (Chỉ Quản lý)
 *  @route DELETE /api/nhan-vien/:maNV
 *  @access Private (Chỉ Quản lý)
 */
export const deleteNhanVien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { maNV } = req.params;

        const deletedNhanVien = await NhanVien.findOneAndDelete({ maNV });

        if (!deletedNhanVien) {
            res.status(404);
            throw new Error("Không tìm thấy nhân viên");
        }

        res.json({ message: "Xóa nhân viên thành công" });
    } catch (error) {
        next(error);
    }
};