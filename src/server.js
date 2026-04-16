require('dotenv').config();

const express = require('express');
const cors = require('cors');
const scanRoutes = require('./routes/scanRoutes');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global middleware ────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(globalLimiter);

// ─── Health check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────
app.use('/api/scan', scanRoutes);

// ─── Error handler (must be last) ─────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Gatekeeper] Server running on http://localhost:${PORT}`);
});

module.exports = app;
