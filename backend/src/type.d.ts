// import { Request } from 'express';
import { INhanVien, IDocGia } from "../../shared/interface";
export { };
declare global {
    namespace Express {
        interface Request {
            user?: INhanVien | IDocGia;
        }
    }
}