import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import healthRouter from './routes/health.routes';
import verificationRouter from './routes/verification.routes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin
  })
);
app.use(morgan('combined'));
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api', verificationRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
