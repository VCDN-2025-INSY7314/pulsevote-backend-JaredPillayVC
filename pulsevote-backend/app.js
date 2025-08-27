const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Basic hardening
app.use(helmet());
app.use(cors({ origin: true })); // adjust to your frontend origin later
app.use(express.json());

// Simple per-IP rate limit (tune later)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Health/root
app.get('/', (req, res) => {
  res.send('PulseVote API running!');
});

// JSON test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Hello from PulseVote API', status: 'ok', ts: Date.now() });
});

module.exports = app;
