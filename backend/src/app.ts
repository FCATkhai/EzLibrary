import express from 'express';
import cookiesParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes/index.routes';

import cors from 'cors';

import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookiesParser());

app.use('/api', routes);

// Use Middleware
app.use(errorHandler);

export default app;