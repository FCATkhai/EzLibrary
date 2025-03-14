import mongoose, { Schema, Model } from 'mongoose';
import { ISach } from '../config/interface';

const SachSchema = new Schema<ISach>({
    maSach: { type: String, required: true, unique: true },
    tenSach: { type: String, required: true },
    donGia: { type: Number, required: true },
    soQuyen: { type: Number, required: true },
    namXuatBan: { type: Number, required: true },
    maNXB: { type: String, required: true, ref: "NhaXuatBan" },
    tacGia: { type: String, required: true },
});

const Sach: Model<ISach> = mongoose.model<ISach>('Sach', SachSchema);
export default Sach;