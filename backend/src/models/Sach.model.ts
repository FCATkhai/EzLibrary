import mongoose, { Schema, Model } from 'mongoose';
import { ISach } from '../../../shared/interface';

const SachSchema = new Schema<ISach>({
    maSach: { type: String, required: true, unique: true },
    tenSach: { type: String, required: true, unique: true },
    moTa: { type: String, required: true },
    soTrang: { type: Number, required: true, default: 1 },
    soQuyen: { type: Number, required: true, default: 1 },
    namXuatBan: { type: Number, required: true },
    maNXB: { type: String, required: true, ref: "NhaXuatBan" },
    tacGia: { type: String, required: true },
    coverUrl: {type: String, required: true}
});

const Sach: Model<ISach> = mongoose.model<ISach>('Sach', SachSchema);
export default Sach;