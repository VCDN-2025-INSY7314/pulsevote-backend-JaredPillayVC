// server.js
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// --- SSL paths (relative to this file) ---
const sslDir = path.join(__dirname, 'ssl');
const keyPath = path.join(sslDir, 'key.pem');
const certPath = path.join(sslDir, 'cert.pem');

// Ensure SSL files exist (dev only, but fail fast if missing)
function mustExist(filePath, label) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
  } catch {
    console.error(
      `\n[SSL ERROR] Missing ${label} at:\n  ${filePath}\n` +
      'Generate with:\n' +
      '  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\\n' +
      '    -keyout ssl/key.pem -out ssl/cert.pem \\\n' +
      '    -config ssl/openssl.cnf -extensions v3_req\n'
    );
    process.exit(1);
  }
}
mustExist(keyPath, 'private key (key.pem)');
mustExist(certPath, 'certificate (cert.pem)');

// Create the HTTPS server now; we’ll .listen() only after Mongo connects
const server = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  },
  app
);

// --- Connect to Mongo, then start listening ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🔒 HTTPS server listening at https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown (Ctrl+C / platform stop)
const shutdown = async (signal) => {
  try {
    console.log(`\n${signal} received. Closing server...`);
    await mongoose.connection.close();
    server.close(() => {
      console.log('HTTP server closed. Bye!');
      process.exit(0);
    });
  } catch (e) {
    console.error('Error during shutdown:', e);
    process.exit(1);
  }
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Optional export for tests
module.exports = server;
