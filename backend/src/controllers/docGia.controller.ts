import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DocGia from "../models/DocGia.model";
import { nanoid } from "nanoid";
import { USER_ROLES } from "../config/constants";
/**
 *  Đăng ký độc giả mới
 *  @route POST /api/doc-gia/register
 *  @access Public
 */
export const registerDocGia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hoLot, ten, soDienThoai, password, ngaySinh, phai, diaChi } = req.body;

        const existingDocGia = await DocGia.findOne({ soDienThoai });
        if (existingDocGia) {
            res.status(400);
            throw new Error("Số điện thoại đã tồn tại");
        }

        const maDG = "DG-" + nanoid(6);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newDocGia = new DocGia({
            maDG,
            hoLot,
            ten,
            soDienThoai,
            password: hashedPassword,
            ngaySinh,
            phai,
            diaChi,
        });

        await newDocGia.save();
        res.status(201).json({ message: "Đăng ký độc giả mới thành công", docGia: newDocGia });
    } catch (error) {
        next(error);
    }
};

/**
 *  Đăng nhập độc giả
 *  @route POST /api/doc-gia/login
 *  @access Public
 */
export const loginDocGia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { soDienThoai, password } = req.body;

        const docGia = await DocGia.findOne({ soDienThoai });
        if (!docGia) {
            res.status(401);
            throw new Error("Số điện thoại hoặc mật khẩu không đúng");
        }

        const isMatch = await bcrypt.compare(password, docGia.password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Số điện thoại hoặc mật khẩu không đúng");
        }

        // Tạo token JWT
        const token = jwt.sign(
            { maDG: docGia.maDG, role: USER_ROLES.DOCGIA }, 
            process.env.JWT_SECRET as jwt.Secret,
            {expiresIn: "7d",} as jwt.SignOptions);

        // Lưu token vào cookie
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({ message: "Đăng nhập thành công", docGia });
    } catch (error) {
        next(error);
    }
};

/**
 *  Đăng xuất độc giả
 *  @route POST /api/doc-gia/logout
 *  @access Private
 */
export const logoutDocGia = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("access_token");
        res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
        next(error);
    }
};

/**
 *  Lấy danh sách độc giả (Chỉ Quản lý mới có quyền)
 *  @route GET /api/doc-gia
 *  @access Private (Quản lý)
 */
export const getAllDocGia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const docGias = await DocGia.find().select("-password");
        res.json(docGias);
    } catch (error) {
        next(error);
    }
};

/**
 *  Lấy thông tin chi tiết độc giả (Chỉ Quản lý hoặc chính độc giả)
 *  @route GET /api/doc-gia/:id
 *  @access Private
 */
export const getDocGiaById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const docGia = await DocGia.findOne({ maDG: id }).select("-password");

        if (!docGia) {
            res.status(404);
            throw new Error("Không tìm thấy độc giả");
        }

        res.json(docGia);
    } catch (error) {
        next(error);
    }
};

/**
 *  Cập nhật thông tin độc giả (Chỉ chính độc giả)
 *  @route PUT /api/doc-gia/:id
 *  @access Private
 */
export const updateDocGia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { hoLot, ten, soDienThoai, ngaySinh, phai, diaChi } = req.body;

        const docGia = await DocGia.findOne({ maDG: id });

        if (!docGia) {
            res.status(404);
            throw new Error("Không tìm thấy độc giả");
        }

        // Cập nhật thông tin
        docGia.hoLot = hoLot || docGia.hoLot;
        docGia.ten = ten || docGia.ten;
        docGia.soDienThoai = soDienThoai || docGia.soDienThoai;
        docGia.ngaySinh = ngaySinh || docGia.ngaySinh;
        docGia.phai = phai || docGia.phai;
        docGia.diaChi = diaChi || docGia.diaChi;

        await docGia.save();
        res.json({ message: "Cập nhật thông tin độc giả thành công", docGia });
    } catch (error) {
        next(error);
    }
};

/**
 *  Xóa độc giả (Chỉ Quản lý mới có quyền)
 *  @route DELETE /api/doc-gia/:id
 *  @access Private (Quản lý)
 */
export const deleteDocGia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const docGia = await DocGia.findOneAndDelete({ maDG: id });

        if (!docGia) {
            res.status(404);
            throw new Error("Không tìm thấy độc giả");
        }

        res.json({ message: "Xóa độc giả thành công" });
    } catch (error) {
        next(error);
    }
};
