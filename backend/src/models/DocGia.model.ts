import mongoose, { Schema, Model } from 'mongoose';
import { IDocGia } from '../config/interface';

const DocGiaSchema: Schema = new Schema<IDocGia>({
    maDG: { type: String, required: true, unique: true },
    hoLot: { type: String, required: true },
    ten: { type: String, required: true },
    soDienThoai: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ngaySinh: { type: Date },
    phai: { type: String },
    diaChi: { type: String },
});

const DocGia: Model<IDocGia> = mongoose.model<IDocGia>('DocGia', DocGiaSchema);
export default DocGia;