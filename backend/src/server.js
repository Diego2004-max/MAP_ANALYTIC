/**
 * @file server.js
 * @description Main entry point for the Express backend server.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/report.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API versioning setup
app.use('/api/v1', reportRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Map Analytic Backend' });
});

app.listen(PORT, () => {
  console.log(`[MapAnalytic Server] Running on port ${PORT}`);
});