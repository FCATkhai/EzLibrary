// import { Request } from 'express';
import { INhanVien, IDocGia } from "./config/interface";
export { };
declare global {
    namespace Express {
        interface Request {
            user?: INhanVien | IDocGia;
        }
    }
}