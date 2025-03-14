import { NextFunction, Request, Response } from "express";
import NhanVien from "../models/NhanVien.model";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt  from "jsonwebtoken";

import dotenv from 'dotenv';
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
        const maNV = "NV-"+nanoid(6);
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        const newNhanVien = new NhanVien({
            maNV,
            hoTenNV,
            password: hashedPassword,
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

        const isMatch = await bcrypt.compare(password, nhanVien.password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Số điện thoại hoặc mật khẩu không đúng");
        }

        // Tạo token JWT
        const token = jwt.sign(
            { maNV: nhanVien.maNV }, 
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
        const nhanViens = await NhanVien.find();
        res.json(nhanViens);
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
        const nhanVien = await NhanVien.findOne({ maNV: req.params.maNV });

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
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }

        const updatedNhanVien = await NhanVien.findOneAndUpdate(
            { maNV },
            updatedData,
            { new: true }
        );

        if (!updatedNhanVien) {
            res.status(404);
            throw new Error("Không tìm thấy nhân viên");
        }

        res.json(updatedNhanVien);
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