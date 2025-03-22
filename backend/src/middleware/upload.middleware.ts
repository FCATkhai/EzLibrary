import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { NextFunction, Response, Request } from "express";
import { IUploadRequest } from "../../../shared/interface";
import multer from 'multer';
import fs from "fs";
import path from "path";
import Sach from "../models/Sach.model";
import NhaXuatBan from "../models/NhaXuatBan.model";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Temporary storage folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});
const upload = multer({ storage });


const cloudinaryUploadImage = async (filePath: string, folderName: string) => {
    return await cloudinary.uploader.upload(
        filePath,
        {
            folder: `EzLibrary/${folderName}`,
            resource_type: "auto",
            transformation: [{ width: 300, height: 450, crop: "limit" }],
        },
    )
};

// Middleware để upload bìa sách
// trước khi upload cần sử dụng upload.single('file') trong route
// ảnh sau khi upload được lưu trong req.file.path
const uploadBookCover = async (req: Request, res: Response, next: NextFunction) => {
    const uploadReq = req as IUploadRequest;
    
    try {
        const { tenSach, maNXB } = req.body;
        const SachExists = await Sach.findOne({ tenSach });
        if (SachExists) {
            res.status(409);
            throw new Error("Sách đã tồn tại");
        }
        const NXBExists = await NhaXuatBan.findOne({maNXB});
        if (!NXBExists) {
            res.status(404);
            throw new Error("Nhà xuất bản không tồn tại");
        }

        if (uploadReq.file) {
            const filePath = uploadReq.file.path;
            const folderName = "book-cover";
            const uploader = (path: string) => cloudinaryUploadImage(path, folderName);
            const uploadResult = await uploader(filePath);
            
            // xoá ảnh sau khi upload
            fs.unlinkSync(filePath);
            uploadReq.file.path = uploadResult.secure_url;
        }

        next();
    } catch (error) {
        next(error);
    }
};

const extractPublicId = (link: string) => {
    const dottedParts = link.split('/').pop()!.split('.');
    dottedParts.pop();
    return dottedParts.join('.');
};

const deleteImage = async (link: string = "") => {
    if (link != "") {
        const { result } = await cloudinary.uploader.destroy(extractPublicId(link));
        if (result !== "ok") {
            console.error("Error: Lỗi khi xoá ảnh");
        }
    } else {
        console.error("không có link khi xoá ảnh");
    }
    
}

export { upload, uploadBookCover, deleteImage };
