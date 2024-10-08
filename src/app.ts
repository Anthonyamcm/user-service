import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import router from './routes/user.routes';
import health from './routes/health.routes';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', router);
app.use(health);

// Error Handling Middleware
app.use(errorHandler);

export default app;
