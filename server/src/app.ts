import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { projectRouter } from './routes/project.routes.js';
import { taskRouter } from './routes/task.routes.js';
import { commentRouter } from './routes/comment.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { featureRouter } from './routes/features.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'teamflow-server' } });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api', commentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/features', featureRouter);
app.use(notFoundHandler);
app.use(errorHandler);
