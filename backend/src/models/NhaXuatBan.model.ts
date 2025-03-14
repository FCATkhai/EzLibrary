import mongoose, { Schema, Model } from 'mongoose';
import { INhaXuatBan } from '../config/interface';

const NhaXuatBanSchema = new Schema<INhaXuatBan>({
    maNXB: { type: String, required: true, unique: true },
    tenNXB: { type: String, required: true },
    diaChi: { type: String, required: true },
});

const NhaXuatBan: Model<INhaXuatBan> = mongoose.model<INhaXuatBan>("NhaXuatBan", NhaXuatBanSchema);
export default NhaXuatBan;