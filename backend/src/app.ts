import express from 'express';
import cookiesParser from 'cookie-parser';
import dotenv from 'dotenv';
import nhanVienRoutes from './routes/nhanVien.routes';
import docGiaRoutes from './routes/docGia.routes';

import cors from 'cors';

import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookiesParser());

app.use('/api/nhan-vien', nhanVienRoutes);
app.use('/api/doc-gia', docGiaRoutes);





// Use Middleware
app.use(errorHandler);

export default app;