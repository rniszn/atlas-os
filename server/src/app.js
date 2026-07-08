import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import taskRoutes from './routes/taskRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import trackRoutes from './routes/trackRoutes.js';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'ATLAS API' });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/tracks', trackRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.use((err, _req, res, _next) => {
  console.error('[ATLAS] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
