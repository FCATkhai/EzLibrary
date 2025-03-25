import mongoose, { Schema, Model } from 'mongoose';
import { IDocGia } from '~/shared/interface';
import bcrypt from 'bcryptjs';

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

/** Hash password before saving */
DocGiaSchema.pre<IDocGia>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/** Compare password */
DocGiaSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

const DocGia: Model<IDocGia> = mongoose.model<IDocGia>('DocGia', DocGiaSchema);
export default DocGia;