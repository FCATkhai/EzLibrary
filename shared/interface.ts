// @ts-nocheck
import { Document } from "mongoose";
import { Request } from "./express";

export interface IUser extends Document {
    maNguoiDung: string;
    role: string;
}
//---------------------
export interface INhanVien extends IUser {
    maNV: string;
    hoTenNV: string;
    password: string;
    chucVu: string;
    diaChi: string;
    soDienThoai: string;
}
export interface IDocGia extends IUser {
    maDG: string;
    hoLot: string;
    ten: string;
    ngaySinh?: Date;
    phai?: string;
    diaChi?: string;
    soDienThoai: string;
    password: string;
}
export interface INhaXuatBan extends Document {
    maNXB: string;
    tenNXB: string;
    diaChi?: string;
}

export interface ISach extends Document {
    maSach: string;
    tenSach: string;
    moTa: string;
    soTrang: number;
    soQuyen: number;
    namXuatBan: number;
    maNXB: string;
    tacGia: string;
    coverUrl: string;
}


export interface ITheoDoiMuonSach extends Document {
    maPM: string;
    maDG: string;
    maNV?: string;
    maSach: string;
    ngayMuon: Date;
    ngayHenTra?: Date;
    ngayTra?: Date;
    trangThai: string;
}


export interface IUploadRequest extends Request {
    file?: Express.Multer.File;
}