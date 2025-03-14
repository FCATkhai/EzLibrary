import mongoose, { Schema, Model } from 'mongoose';
import { INhanVien } from '../config/interface';

const NhanVienSchema: Schema = new Schema<INhanVien>({
    maNV: { type: String, required: true, unique: true },
    hoTenNV: { type: String, required: true },
    password: { type: String, required: true },
    chucVu: { type: String, required: true, enum: ["Quản lý", "Nhân viên"] },
    diaChi: { type: String, required: true },
    soDienThoai: { type: String, required: true , unique: true},
});

const NhanVien: Model<INhanVien> = mongoose.model<INhanVien>('NhanVien', NhanVienSchema);
export default NhanVien;