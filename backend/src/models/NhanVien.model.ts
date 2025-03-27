import mongoose, { Schema, Model } from 'mongoose';
import { INhanVien } from '~/shared/interface';
import bcrypt from 'bcryptjs';

const NhanVienSchema: Schema = new Schema<INhanVien>({
    maNV: { type: String, required: true, unique: true },
    hoTenNV: { type: String, required: true },
    soDienThoai: { type: String, required: true , unique: true},
    password: { type: String, required: true },
    chucVu: { type: String, required: true, enum: ["Quản lý", "Nhân viên"] },
    diaChi: { type: String, required: true },
});

/** Hash password before saving */
NhanVienSchema.pre<INhanVien>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/** Compare password */
NhanVienSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

const NhanVien: Model<INhanVien> = mongoose.model<INhanVien>('NhanVien', NhanVienSchema);
export default NhanVien;