import mongoose, { Schema, Model } from "mongoose";
import { ITheoDoiMuonSach } from "../config/interface";

const TheoDoiMuonSachSchema = new Schema<ITheoDoiMuonSach>({
    maPM: { type: String, required: true, unique: true },
    maDG: { type: String, required: true, ref: "DocGia" },
    maNV: { type: String, required: true, ref: "NhanVien" },
    maSach: { type: String, required: true, ref: "Sach" },
    ngayMuon: { type: Date, required: true },
    ngayHenTra: {type: Date},
    ngayTra: { type: Date },
    trangThai: { type: String, enum: ["pending", "borrowing", "returned", "rejected"], default: "pending"}
}, {timestamps: true}
);

const TheoDoiMuonSach: Model<ITheoDoiMuonSach> = mongoose.model<ITheoDoiMuonSach>('TheoDoiMuonSach', TheoDoiMuonSachSchema);
export default TheoDoiMuonSach;