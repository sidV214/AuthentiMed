console.log("🔥 THIS SERVER FILE IS RUNNING");
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import batchRoutes from './src/routes/batchRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import transferRoutes from './src/routes/transferRoutes.js';
import regulatorRoutes from './src/routes/regulatorRoutes.js';
import authMiddleware from './src/middleware/authMiddleware.js';
import authorizeRoles from './src/middleware/roleMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(">>> REQUEST RECEIVED:", req.method, req.url);
  next();
});

app.use('/api', transferRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/public', publicRoutes);
app.use('/api', regulatorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

app.get('/api/admin-only', authMiddleware, authorizeRoles('regulator'), (req, res) => {
  res.json({ message: 'Regulator access granted' });
});

app.get('/api/hospital-only', authMiddleware, authorizeRoles('pharmacist'), (req, res) => {
  res.json({ message: 'Pharmacist access granted' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
