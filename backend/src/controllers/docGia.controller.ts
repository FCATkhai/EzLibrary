import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import DocGia from "../models/DocGia.model";
import { USER_ROLES } from "../config/constants";
import generateId from "../utils/generateId.util";
import { FilterQuery } from "mongoose";
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

        const maDG = "DG-" + generateId();

        const newDocGia = new DocGia({
            maDG,
            hoLot,
            ten,
            soDienThoai,
            password,
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

        const isMatch = await docGia.comparePassword(password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Số điện thoại hoặc mật khẩu không đúng");
        }

        // Tạo token JWT
        const token = jwt.sign(
            { maDG: docGia.maDG, role: USER_ROLES.DOCGIA },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: "7d", } as jwt.SignOptions);

        // Lưu token vào cookie
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({
            message: "Đăng nhập thành công",
            docGia: {
                maDG: docGia.maDG,
                hoLot: docGia.hoLot,
                ten: docGia.ten,
                soDienThoai: docGia.soDienThoai,
                role: USER_ROLES.DOCGIA
            }
        });
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
        // eslint-disable-next-line prefer-const
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);
        const query: FilterQuery<unknown> = {};

        // Thêm điều kiện tìm kiếm
        if (search) {
            query.$or = [
                { hoLot: { $regex: search, $options: "i" } }, // Tìm theo họ
                { ten: { $regex: search, $options: "i" } }, // Tìm theo tên
                { soDienThoai: { $regex: search, $options: "i" } } // Tìm theo số điện thoại
            ];
        }

        const total = await DocGia.countDocuments(query);
        const docGiaList = await DocGia.find(query)
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
            data: docGiaList 
        });
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
 *  Cập nhật thông tin độc giả (Chỉ chính độc giả) hoặc quản lý
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

        if (req.user?.maNguoiDung !== id && req.user?.role !== USER_ROLES.QUANLY) {
            res.status(403);
            throw new Error("Bạn không có quyền cập nhật thông tin cho người khác");
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
        // Check for duplicate key error (E11000)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error 
        if (error.code === 11000 || error.name === "MongoServerError" && error.code === 11000) {
            res.status(409); // Conflict status code
            return next(new Error(`Số điện thoại "${req.body.soDienThoai}" đã tồn tại`));
        }
        next(error);
    }
};

/**
 *  Thay đổi mật khẩu
 *  @route PATCH /api/doc-gia/:id/change-password
 *  @access All users (Only owner)
 */
export const changePasswordDocGia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        // Kiểm tra user tồn tại
        const docGia = await DocGia.findOne({ maDG: id });
        if (!docGia) {
            res.status(404);
            throw new Error("Không tìm thấy độc giả");
        }

        // Chỉ cho phép dộc giả đổi mật khẩu chính mình hoặc người dùng là nhân viên
        if (req.user?.maNguoiDung !== id || (req.user?.role !== USER_ROLES.QUANLY && req.user?.role !== USER_ROLES.NHANVIEN)) {
            res.status(403);
            throw new Error("Bạn không có quyền thay đổi mật khẩu cho người khác");
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await docGia.comparePassword(oldPassword);
        if (!isMatch) {
            res.status(400);
            throw new Error("Mật khẩu cũng không đúng");
        }

        // Cập nhật mật khẩu mới
        docGia.password = newPassword;
        await docGia.save();

        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        next(error);
    }
};

/**
 *  Reset mật khẩu độc giả
 *  @route PATCH /api/doc-gia/:id/reset-password
 *  @access NV_QL
 */
export const resetPasswordDocGia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        // Kiểm tra user tồn tại
        const docGia = await DocGia.findOne({ maDG: id });
        if (!docGia) {
            res.status(404);
            throw new Error("Không tìm thấy độc giả");
        }

        // Chỉ cho phép quản lý reset mật khẩu
        if (req.user?.role !== USER_ROLES.QUANLY) {
            res.status(403);
            throw new Error("Chỉ có quản lý mới có quyền reset mật khẩu");
        }

        // Cập nhật mật khẩu mới
        docGia.password = newPassword;
        await docGia.save();

        res.json({ success: true, message: "Reset mật khẩu thành công" });
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
