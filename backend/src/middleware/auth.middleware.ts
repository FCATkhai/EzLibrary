import { Request, Response, NextFunction } from "express";
import NhanVien from "../models/NhanVien.model"
import DocGia from "../models/DocGia.model";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
import { IUser } from "../../../shared/interface";
import { USER_ROLES } from "../config/constants";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

// Middleware xác thực cho độc giả
export const authenticateDG = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.access_token; // Nhận token từ cookie
        
        if (!token) {
            res.status(401);
            throw new Error("Không có token, không được phép truy cập");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {maDG: string};
        const docGia = await DocGia.findOne({ maDG: decoded.maDG }).select("-password");

        if (!docGia) {
            res.status(401);
            throw new Error("Token không hợp lệ");
        }

        req.user = docGia;
        next();
    } catch (error) {
        next(error);
    }
};

// Middleware xác thực & kiểm tra quyền hạn
// allowedRoles là mảng chứa những người dùng được truy cập, 
// nếu không pass giá trị gì thì nghĩa là toàn bộ user được quyền truy cập
export const authorize = (allowedRoles: string[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.access_token;
            if (!token) {
                res.status(401);
                throw new Error("Không có token, không được phép truy cập");
            }

            const decoded = jwt.verify(token, JWT_SECRET) as {maNV: string, maDG: string, role: string};
            
            let user = await NhanVien.findOne({ maNV: decoded.maNV }).select("-password") as IUser;

            if (!user) {
                user = await DocGia.findOne({ maDG: decoded.maDG }).select("-password");
            }

            if (!user) {
                res.status(401);
                throw new Error("Token không hợp lệ");
            }
            // Kiểm tra quyền hạn (Authorize)
            if (allowedRoles.length != 0 && !allowedRoles.includes(decoded.role)) {
                res.status(403);
                throw new Error("Forbidden - Bạn không có quyền thực hiện thao tác này");
            }
            if (decoded.role === USER_ROLES.DOCGIA) {
                req.user = { ...user.toObject(), role: decoded.role, maNguoiDung: decoded.maDG };
            } else {
                req.user = { ...user.toObject(), role: decoded.role, maNguoiDung: decoded.maNV };
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};







// export const authorize = (requireManager: boolean = false) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const token = req.cookies?.access_token;
//             if (!token) {
//                 res.status(401);
//                 throw new Error("Không có token, không được phép truy cập");
//             }

//             const decoded = jwt.verify(token, JWT_SECRET) as {maNV: string, maDG: string};
            
//             let user = await NhanVien.findOne({ maNV: decoded.maNV }).select("-password") as IUser;
//             let userType = "nhanvien";

//             if (!user) {
//                 user = await DocGia.findOne({ maDG: decoded.maDG }).select("-password");
//                 userType = "docgia";
//             }

//             if (!user) {
//                 res.status(401);
//                 throw new Error("Token không hợp lệ");
//             }

//             // Nếu yêu cầu quyền quản lý mà người dùng không phải là quản lý => từ chối
//             if (requireManager && (userType !== "nhanvien" || user.chucVu !== "Quản lý")) {
//                 res.status(403);
//                 throw new Error("Bạn không có quyền thực hiện thao tác này");
//             }

//             req.user = { ...user.toObject(), userType }; // Thêm userType để nhận diện loại người dùng
//             next();
//         } catch (error) {
//             next(error);
//         }
//     };
// };




// export const authorize = (requireManager: boolean = false) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const token = req.cookies?.access_token;
//             if (!token) {
//                 res.status(401);
//                 throw new Error("Không có token, không được phép truy cập");
//             }

//             const decoded = jwt.verify(token, JWT_SECRET) as {maNV: string};
//             const nhanVien = await NhanVien.findOne({ maNV: decoded.maNV }).select("-password");

//             if (!nhanVien) {
//                 res.status(401);
//                 throw new Error("Token không hợp lệ");
//             }

//             // Nếu yêu cầu quyền quản lý mà nhân viên không phải quản lý => từ chối
//             if (requireManager && nhanVien.chucVu !== "Quản lý") {
//                 res.status(403);
//                 throw new Error("Bạn không có quyền thực hiện thao tác này");
//             }

//             req.user = nhanVien;
//             next();
//         } catch (error) {
//             next(error);
//         }
//     };
// };

