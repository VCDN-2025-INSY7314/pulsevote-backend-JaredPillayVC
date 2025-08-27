const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');

const app = express();
app.use(helmet());
app.use(express.json());

// adjust origin to your frontend dev URL
app.use(cors({ origin: 'https://localhost:5173', credentials: true }));

app.get('/', (_req, res) => res.send('PulseVote API running!'));

app.use('/api/auth', authRoutes);

app.get('/api/protected', protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}! You have accessed protected data.`,
    timestamp: new Date()
  });
});

module.exports = app;
