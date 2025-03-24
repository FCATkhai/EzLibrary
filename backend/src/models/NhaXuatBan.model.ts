import mongoose, { Schema, Model } from 'mongoose';
import { INhaXuatBan } from '~/shared/interface';

const NhaXuatBanSchema = new Schema<INhaXuatBan>({
    maNXB: { type: String, required: true, unique: true },
    tenNXB: { type: String, required: true, unique: true },
    diaChi: { type: String, required: true },
});

const NhaXuatBan: Model<INhaXuatBan> = mongoose.model<INhaXuatBan>("NhaXuatBan", NhaXuatBanSchema);
export default NhaXuatBan;